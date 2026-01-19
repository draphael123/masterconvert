'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Footer from '@/components/Footer';

interface CompressFile {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  compressedSize?: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  downloadUrl?: string;
}

const MAX_FILE_SIZE_MB = 200;

export default function CompressPage() {
  const [files, setFiles] = useState<CompressFile[]>([]);
  const [compressionType, setCompressionType] = useState<'image' | 'pdf'>('image');
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      if (!isImage && !isPdf) {
        toast.error(`${file.name}: Not a supported file type`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name}: File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        continue;
      }

      const compressFile: CompressFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        file,
        name: file.name,
        originalSize: file.size,
        status: 'pending',
      };

      setFiles((prev) => [...prev, compressFile]);
      
      // Auto-detect compression type from first file
      if (isImage) {
        setCompressionType('image');
      } else if (isPdf) {
        setCompressionType('pdf');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'application/pdf': ['.pdf'],
    },
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const compressFiles = async () => {
    if (files.length === 0) {
      toast.error('Please add files to compress');
      return;
    }

    setIsProcessing(true);

    for (const compressFile of files) {
      if (compressFile.status === 'done') continue;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === compressFile.id ? { ...f, status: 'processing' } : f
        )
      );

      try {
        const formData = new FormData();
        formData.append('file', compressFile.file);
        formData.append('quality', String(quality));
        formData.append('type', compressionType);

        const response = await fetch('/api/compress', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Compression failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === compressFile.id
              ? {
                  ...f,
                  status: 'done',
                  compressedSize: blob.size,
                  downloadUrl: url,
                }
              : f
          )
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === compressFile.id ? { ...f, status: 'error' } : f
          )
        );
        toast.error(`Failed to compress ${compressFile.name}`);
      }
    }

    setIsProcessing(false);
    toast.success('Compression complete!');
  };

  const downloadFile = (file: CompressFile) => {
    if (!file.downloadUrl) return;
    const a = document.createElement('a');
    a.href = file.downloadUrl;
    a.download = `compressed-${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    files.filter(f => f.downloadUrl).forEach(downloadFile);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getCompressionPercent = (file: CompressFile): string => {
    if (!file.compressedSize) return '';
    const percent = ((file.originalSize - file.compressedSize) / file.originalSize) * 100;
    return percent.toFixed(1);
  };

  const totalOriginal = files.reduce((sum, f) => sum + f.originalSize, 0);
  const totalCompressed = files.reduce((sum, f) => sum + (f.compressedSize || f.originalSize), 0);
  const completedCount = files.filter(f => f.status === 'done').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              FileForge
            </Link>
            <nav className="flex gap-6">
              <Link href="/convert" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                Convert
              </Link>
              <Link href="/merge" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                Merge PDFs
              </Link>
              <Link href="/split" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                Split PDF
              </Link>
              <Link href="/compress" className="text-indigo-600 dark:text-indigo-400 font-semibold">
                Compress
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Compress Files
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Reduce file sizes while maintaining quality
          </p>
        </div>

        {/* Compression Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md inline-flex">
            <button
              onClick={() => setCompressionType('image')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                compressionType === 'image'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              🖼️ Images
            </button>
            <button
              onClick={() => setCompressionType('pdf')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                compressionType === 'pdf'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              📄 PDFs
            </button>
          </div>
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
          <div className="text-6xl mb-4">{compressionType === 'image' ? '🖼️' : '📄'}</div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            {isDragActive ? 'Drop files here...' : `Drag & drop ${compressionType === 'image' ? 'images' : 'PDFs'} here`}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            or click to select (max {MAX_FILE_SIZE_MB}MB per file)
          </p>
        </div>

        {/* Quality Slider */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Compression Quality: {quality}%
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>Smaller file</span>
            <span>Higher quality</span>
          </div>
          
          {/* Quality Presets */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setQuality(50)}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Low (50%)
            </button>
            <button
              onClick={() => setQuality(70)}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Medium (70%)
            </button>
            <button
              onClick={() => setQuality(85)}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              High (85%)
            </button>
            <button
              onClick={() => setQuality(95)}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Max (95%)
            </button>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Files ({files.length})
              </h2>
              <div className="flex gap-2">
                {completedCount > 0 && (
                  <button
                    onClick={downloadAll}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Download All
                  </button>
                )}
                <button
                  onClick={() => setFiles([])}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Summary */}
            {completedCount > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700 dark:text-green-300">
                    Original: {formatFileSize(totalOriginal)}
                  </span>
                  <span className="text-green-700 dark:text-green-300">
                    Compressed: {formatFileSize(totalCompressed)}
                  </span>
                  <span className="text-green-700 dark:text-green-300 font-semibold">
                    Saved: {formatFileSize(totalOriginal - totalCompressed)} ({((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-2xl">
                      {file.status === 'processing' ? '⏳' : file.status === 'done' ? '✅' : file.status === 'error' ? '❌' : '📄'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                        {file.name}
                      </p>
                      <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatFileSize(file.originalSize)}</span>
                        {file.compressedSize && (
                          <>
                            <span>→</span>
                            <span className="text-green-600 dark:text-green-400">
                              {formatFileSize(file.compressedSize)} (-{getCompressionPercent(file)}%)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.downloadUrl && (
                      <button
                        onClick={() => downloadFile(file)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                      >
                        Download
                      </button>
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={compressFiles}
                disabled={isProcessing || files.every(f => f.status === 'done')}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Compressing...
                  </>
                ) : (
                  <>
                    🗜️ Compress {files.filter(f => f.status !== 'done').length} Files
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Compression Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🖼️ Images</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• JPEG: Best for photos (lossy)</li>
                <li>• PNG: Best for graphics with transparency</li>
                <li>• WebP: Modern format, best compression</li>
                <li>• 70-85% quality is usually ideal</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">📄 PDFs</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Compresses embedded images</li>
                <li>• Removes unnecessary metadata</li>
                <li>• Great for email attachments</li>
                <li>• Preserves text quality</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



