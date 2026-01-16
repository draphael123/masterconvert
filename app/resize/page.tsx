'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ImageFile {
  id: string;
  file: File;
  name: string;
  preview: string;
  originalWidth?: number;
  originalHeight?: number;
}

const MAX_FILE_SIZE_MB = 50;

const PRESETS = {
  social: [
    { name: 'Instagram Post', width: 1080, height: 1080 },
    { name: 'Instagram Story', width: 1080, height: 1920 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Twitter Post', width: 1200, height: 675 },
    { name: 'LinkedIn Post', width: 1200, height: 627 },
    { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  ],
  common: [
    { name: 'HD (720p)', width: 1280, height: 720 },
    { name: 'Full HD (1080p)', width: 1920, height: 1080 },
    { name: '4K', width: 3840, height: 2160 },
    { name: 'Passport Photo', width: 600, height: 600 },
    { name: 'Favicon', width: 32, height: 32 },
    { name: 'App Icon', width: 512, height: 512 },
  ],
};

export default function ResizePage() {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [quality, setQuality] = useState(90);
  const [format, setFormat] = useState<'jpg' | 'png' | 'webp'>('jpg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      return;
    }

    const preview = URL.createObjectURL(file);
    
    // Get original dimensions
    const img = new Image();
    img.onload = () => {
      setImage({
        id: `img-${Date.now()}`,
        file,
        name: file.name,
        preview,
        originalWidth: img.width,
        originalHeight: img.height,
      });
      setWidth(img.width);
      setHeight(img.height);
      setAspectRatio(img.width / img.height);
    };
    img.src = preview;
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'] },
    maxFiles: 1,
  });

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspect) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspect) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const applyPreset = (presetWidth: number, presetHeight: number) => {
    setWidth(presetWidth);
    setHeight(presetHeight);
    setMaintainAspect(false);
  };

  const resizeImage = async () => {
    if (!image) {
      toast.error('Please upload an image');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('image', image.file);
      formData.append('width', String(width));
      formData.append('height', String(height));
      formData.append('quality', String(quality));
      formData.append('format', format);

      const response = await fetch('/api/resize-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to resize image');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resized-${width}x${height}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Image resized successfully!');
    } catch (error) {
      toast.error('Failed to resize image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Resize Image
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Resize images to exact dimensions or use social media presets
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload & Preview */}
          <div>
            {!image ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
                  ${isDragActive
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="text-6xl mb-4">🖼️</div>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Drag & drop an image here
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  PNG, JPG, WebP, GIF (max {MAX_FILE_SIZE_MB}MB)
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Preview</h2>
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(image.preview);
                      setImage(null);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center">
                  <img
                    src={image.preview}
                    alt="Preview"
                    className="max-w-full max-h-64 object-contain"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Original: {image.originalWidth} × {image.originalHeight}px
                </p>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-6">
            {/* Presets */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                Social Media Presets
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.social.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.width, preset.height)}
                    className="p-2 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-left"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{preset.name}</div>
                    <div className="text-xs text-gray-500">{preset.width}×{preset.height}</div>
                  </button>
                ))}
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mt-4 mb-3">
                Common Sizes
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.common.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.width, preset.height)}
                    className="p-2 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-left"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{preset.name}</div>
                    <div className="text-xs text-gray-500">{preset.width}×{preset.height}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Size */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                Custom Size
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={maintainAspect}
                  onChange={(e) => setMaintainAspect(e.target.checked)}
                  className="rounded"
                />
                Maintain aspect ratio
              </label>
            </div>

            {/* Format & Quality */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as 'jpg' | 'png' | 'webp')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              <button
                onClick={resizeImage}
                disabled={!image || isProcessing}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Resizing...' : `Resize to ${width}×${height}`}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


