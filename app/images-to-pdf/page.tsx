'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ImageFile {
  id: string;
  file: File;
  name: string;
  preview: string;
}

const MAX_FILE_SIZE_MB = 50;
const MAX_FILES = 50;

export default function ImagesToPdfPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const imagesRef = useRef<ImageFile[]>([]);
  
  // Keep ref in sync with state
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const currentImageCount = imagesRef.current.length;
    const remainingSlots = MAX_FILES - currentImageCount;
    
    if (remainingSlots <= 0) {
      toast.error(`Maximum of ${MAX_FILES} files allowed. Please remove some files first.`);
      return;
    }
    
    if (acceptedFiles.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more file(s). Maximum of ${MAX_FILES} files allowed.`);
    }

    const filesToProcess = acceptedFiles.slice(0, remainingSlots);
    const newImageFiles: ImageFile[] = [];

    for (const file of filesToProcess) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name}: Not an image file`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name}: File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        continue;
      }

      const imageFile: ImageFile = {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        file,
        name: file.name,
        preview: URL.createObjectURL(file),
      };

      newImageFiles.push(imageFile);
    }

    // Add all valid files at once
    if (newImageFiles.length > 0) {
      setImages((prev) => {
        const totalAfterAdd = prev.length + newImageFiles.length;
        if (totalAfterAdd > MAX_FILES) {
          const allowed = MAX_FILES - prev.length;
          toast.error(`Only ${allowed} file(s) were added. Maximum of ${MAX_FILES} files reached.`);
          return [...prev, ...newImageFiles.slice(0, allowed)];
        }
        return [...prev, ...newImageFiles];
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'],
    },
    multiple: true,
    maxFiles: MAX_FILES,
  });

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, removed);
      return updated;
    });
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      moveImage(draggedIndex, index);
      setDraggedIndex(index);
    }
  };
  const handleDragEnd = () => setDraggedIndex(null);

  const createPdf = async () => {
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      images.forEach((img) => formData.append('images', img.file));
      formData.append('pageSize', pageSize);

      const response = await fetch('/api/images-to-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'images.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('PDF created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Images to PDF
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Combine multiple images into a single PDF document
          </p>
        </div>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors mb-8
            ${isDragActive
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
            }`}
        >
          <input {...getInputProps()} />
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            {isDragActive ? 'Drop images here...' : 'Drag & drop images here'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            PNG, JPG, WebP, GIF, BMP (max {MAX_FILE_SIZE_MB}MB each, up to {MAX_FILES} files)
          </p>
        </div>

        {/* Page Size Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Page Size
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPageSize('a4')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                pageSize === 'a4'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">A4</div>
              <div className="text-xs text-gray-500">210 × 297 mm</div>
            </button>
            <button
              onClick={() => setPageSize('letter')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                pageSize === 'letter'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">Letter</div>
              <div className="text-xs text-gray-500">8.5 × 11 in</div>
            </button>
            <button
              onClick={() => setPageSize('fit')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                pageSize === 'fit'
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">Fit to Image</div>
              <div className="text-xs text-gray-500">Original size</div>
            </button>
          </div>
        </div>

        {/* Image List */}
        {images.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Images ({images.length})
              </h2>
              <button
                onClick={() => {
                  images.forEach((img) => URL.revokeObjectURL(img.preview));
                  setImages([]);
                }}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
              >
                Clear All
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              💡 Drag to reorder images
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group cursor-move ${
                    draggedIndex === index ? 'opacity-50' : ''
                  }`}
                >
                  <div className="absolute top-2 left-2 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10">
                    {index + 1}
                  </div>
                  <img
                    src={img.preview}
                    alt={img.name}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                  />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {img.name}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={createPdf}
                disabled={isProcessing}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating PDF...
                  </>
                ) : (
                  <>📄 Create PDF ({images.length} images)</>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}



