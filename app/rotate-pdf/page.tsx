'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MAX_FILE_SIZE_MB = 200;

export default function RotatePdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotation, setRotation] = useState(90);
  const [rotateAll, setRotateAll] = useState(true);
  const [selectedPages, setSelectedPages] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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

    // Get page count
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('action', 'count');

    try {
      const response = await fetch('/api/rotate-pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPageCount(data.pageCount);
        setSelectedPages(`1-${data.pageCount}`);
        toast.success(`PDF loaded: ${data.pageCount} pages`);
      }
    } catch (error) {
      toast.error('Failed to read PDF');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const rotatePdf = async () => {
    if (!pdfFile) {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('action', 'rotate');
      formData.append('rotation', String(rotation));
      formData.append('rotateAll', String(rotateAll));
      formData.append('pages', selectedPages);

      const response = await fetch('/api/rotate-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to rotate PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rotated-${pdfFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('PDF rotated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to rotate PDF');
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
            Rotate PDF Pages
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Rotate all or specific pages in your PDF
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
          <div className="text-6xl mb-4">🔄</div>
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
                  {formatFileSize(pdfFile.size)} • {pageCount} pages
                </p>
              </div>
              <button
                onClick={() => {
                  setPdfFile(null);
                  setPageCount(0);
                }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            {/* Rotation Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Rotation
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[90, 180, 270, -90].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setRotation(deg)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      rotation === deg
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">
                      {deg === 90 ? '↻' : deg === -90 ? '↺' : deg === 180 ? '↕' : '↻'}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {deg === -90 ? '90° Left' : deg === 90 ? '90° Right' : `${deg}°`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Page Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Pages to Rotate
              </label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={() => setRotateAll(true)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    rotateAll
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">All Pages</div>
                </button>
                <button
                  onClick={() => setRotateAll(false)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    !rotateAll
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">Specific Pages</div>
                </button>
              </div>

              {!rotateAll && (
                <input
                  type="text"
                  value={selectedPages}
                  onChange={(e) => setSelectedPages(e.target.value)}
                  placeholder="e.g., 1, 3-5, 8"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              )}
            </div>

            <div className="flex justify-center">
              <button
                onClick={rotatePdf}
                disabled={isProcessing}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Rotating...
                  </>
                ) : (
                  <>🔄 Rotate PDF</>
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



