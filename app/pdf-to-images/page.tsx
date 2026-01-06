'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MAX_FILE_SIZE_MB = 100;

export default function PdfToImagesPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'png' | 'jpg'>('png');
  const [quality, setQuality] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      return;
    }

    setPdfFile(file);
    toast.success('PDF loaded successfully');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const convertToImages = async () => {
    if (!pdfFile) {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('format', format);
      formData.append('quality', String(quality));

      const response = await fetch('/api/pdf-to-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to convert PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfFile.name.replace('.pdf', '')}-images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('PDF converted to images!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to convert PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            PDF to Images
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Convert each PDF page to a high-quality image
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
          <div className="text-6xl mb-4">📄</div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            {isDragActive ? 'Drop PDF here...' : 'Drag & drop a PDF file here'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            or click to select (max {MAX_FILE_SIZE_MB}MB)
          </p>
        </div>

        {pdfFile && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {pdfFile.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {formatFileSize(pdfFile.size)}
                </p>
              </div>
              <button
                onClick={() => setPdfFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            {/* Format Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Output Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFormat('png')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    format === 'png'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">PNG</div>
                  <div className="text-xs text-gray-500">Lossless, best quality</div>
                </button>
                <button
                  onClick={() => setFormat('jpg')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    format === 'jpg'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">JPG</div>
                  <div className="text-xs text-gray-500">Smaller file size</div>
                </button>
              </div>
            </div>

            {/* Quality Slider (for JPG) */}
            {format === 'jpg' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={convertToImages}
                disabled={isProcessing}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Converting...
                  </>
                ) : (
                  <>🖼️ Convert to Images</>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
            ⚠️ Note
          </h3>
          <p className="text-yellow-700 dark:text-yellow-400 text-sm">
            PDF to image conversion requires PDF rendering capabilities. For best results, 
            use PDFs with standard fonts and formatting. Complex PDFs may have varied results.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

