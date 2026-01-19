'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Footer from '@/components/Footer';

const MAX_FILE_SIZE_MB = 200;

export default function SplitPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageRange, setPageRange] = useState<string>('');
  const [extractMode, setExtractMode] = useState<'range' | 'single' | 'all'>('range');
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
      const response = await fetch('/api/split-pdf', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setPageCount(data.pageCount);
        setPageRange(`1-${data.pageCount}`);
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

  const splitPdf = async () => {
    if (!pdfFile || !pageRange) {
      toast.error('Please select a PDF and specify pages');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('action', 'split');
      formData.append('pageRange', pageRange);
      formData.append('mode', extractMode);

      const response = await fetch('/api/split-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to split PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `split-${pdfFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('PDF split successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to split PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const extractAllPages = async () => {
    if (!pdfFile) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('action', 'extractAll');

      const response = await fetch('/api/split-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to extract pages');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pages-${pdfFile.name.replace('.pdf', '')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('All pages extracted!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to extract pages');
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
              <Link href="/split" className="text-indigo-600 dark:text-indigo-400 font-semibold">
                Split PDF
              </Link>
              <Link href="/compress" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                Compress
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Split PDF
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Extract specific pages or split your PDF into separate files
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
          <div className="text-6xl mb-4">✂️</div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            {isDragActive ? 'Drop PDF here...' : 'Drag & drop a PDF file here'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            or click to select (max {MAX_FILE_SIZE_MB}MB)
          </p>
        </div>

        {/* PDF Info & Options */}
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
                  setPageRange('');
                }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Extraction Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setExtractMode('range')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    extractMode === 'range'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">📄</div>
                  <div className="font-medium text-gray-900 dark:text-white">Page Range</div>
                  <div className="text-xs text-gray-500">e.g., 1-5, 8, 10-15</div>
                </button>
                <button
                  onClick={() => setExtractMode('single')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    extractMode === 'single'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">1️⃣</div>
                  <div className="font-medium text-gray-900 dark:text-white">Single Page</div>
                  <div className="text-xs text-gray-500">Extract one page</div>
                </button>
                <button
                  onClick={() => setExtractMode('all')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    extractMode === 'all'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">📚</div>
                  <div className="font-medium text-gray-900 dark:text-white">All Pages</div>
                  <div className="text-xs text-gray-500">Separate files (ZIP)</div>
                </button>
              </div>
            </div>

            {/* Page Range Input */}
            {extractMode !== 'all' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {extractMode === 'single' ? 'Page Number' : 'Page Range'}
                </label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder={extractMode === 'single' ? 'e.g., 5' : 'e.g., 1-5, 8, 10-15'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Available pages: 1 to {pageCount}
                </p>
              </div>
            )}

            {/* Quick Select Buttons */}
            {extractMode === 'range' && pageCount > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quick Select
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setPageRange('1')}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    First page
                  </button>
                  <button
                    onClick={() => setPageRange(String(pageCount))}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Last page
                  </button>
                  <button
                    onClick={() => setPageRange(`1-${Math.ceil(pageCount / 2)}`)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    First half
                  </button>
                  <button
                    onClick={() => setPageRange(`${Math.ceil(pageCount / 2) + 1}-${pageCount}`)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Second half
                  </button>
                  <button
                    onClick={() => {
                      const odds = Array.from({ length: pageCount }, (_, i) => i + 1)
                        .filter(n => n % 2 === 1)
                        .join(', ');
                      setPageRange(odds);
                    }}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Odd pages
                  </button>
                  <button
                    onClick={() => {
                      const evens = Array.from({ length: pageCount }, (_, i) => i + 1)
                        .filter(n => n % 2 === 0)
                        .join(', ');
                      setPageRange(evens);
                    }}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Even pages
                  </button>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={extractMode === 'all' ? extractAllPages : splitPdf}
                disabled={isProcessing || (extractMode !== 'all' && !pageRange)}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    ✂️ {extractMode === 'all' ? 'Extract All Pages' : 'Extract Pages'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            How to Split a PDF
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
            <li><strong>Upload:</strong> Drag and drop or click to select your PDF file</li>
            <li><strong>Choose Mode:</strong> Select page range, single page, or extract all</li>
            <li><strong>Specify Pages:</strong> Enter the pages you want to extract</li>
            <li><strong>Download:</strong> Get your extracted pages as a new PDF</li>
          </ol>

          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
              💡 Page Range Format
            </h3>
            <ul className="text-sm text-indigo-700 dark:text-indigo-400 space-y-1">
              <li>• Single pages: <code className="bg-indigo-100 dark:bg-indigo-800 px-1 rounded">1, 5, 8</code></li>
              <li>• Page ranges: <code className="bg-indigo-100 dark:bg-indigo-800 px-1 rounded">1-5, 10-15</code></li>
              <li>• Mixed: <code className="bg-indigo-100 dark:bg-indigo-800 px-1 rounded">1-3, 5, 7-10</code></li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



