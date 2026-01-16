'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Footer from '@/components/Footer';

const MAX_FILE_SIZE_MB = 200;

export default function WatermarkPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(30);
  const [rotation, setRotation] = useState(-45);
  const [position, setPosition] = useState<'center' | 'diagonal' | 'footer'>('diagonal');
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
    toast.success('PDF loaded successfully');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const addWatermark = async () => {
    if (!pdfFile || !watermarkText.trim()) {
      toast.error('Please provide a PDF and watermark text');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('text', watermarkText);
      formData.append('fontSize', String(fontSize));
      formData.append('opacity', String(opacity));
      formData.append('rotation', String(rotation));
      formData.append('position', position);

      const response = await fetch('/api/watermark-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add watermark');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked-${pdfFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Watermark added successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add watermark');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const presets = [
    { label: 'CONFIDENTIAL', text: 'CONFIDENTIAL' },
    { label: 'DRAFT', text: 'DRAFT' },
    { label: 'SAMPLE', text: 'SAMPLE' },
    { label: 'DO NOT COPY', text: 'DO NOT COPY' },
    { label: 'INTERNAL USE', text: 'INTERNAL USE ONLY' },
  ];

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
                Merge
              </Link>
              <Link href="/watermark" className="text-indigo-600 dark:text-indigo-400 font-semibold">
                Watermark
              </Link>
              <Link href="/protect" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                Protect
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Add Watermark to PDF
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Add text watermarks to protect your documents
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
          <div className="text-6xl mb-4">💧</div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            {isDragActive ? 'Drop PDF here...' : 'Drag & drop a PDF file here'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            or click to select (max {MAX_FILE_SIZE_MB}MB)
          </p>
        </div>

        {/* File Info & Options */}
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

            {/* Watermark Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Enter watermark text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setWatermarkText(preset.text)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Position */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Position
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => { setPosition('center'); setRotation(0); }}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    position === 'center'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">⬛</div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">Center</div>
                </button>
                <button
                  onClick={() => { setPosition('diagonal'); setRotation(-45); }}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    position === 'diagonal'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">⬔</div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">Diagonal</div>
                </button>
                <button
                  onClick={() => { setPosition('footer'); setRotation(0); }}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    position === 'footer'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">▬</div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">Footer</div>
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opacity: {opacity}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={opacity}
                  onChange={(e) => setOpacity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mb-6 p-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div
                style={{
                  fontSize: `${fontSize / 2}px`,
                  opacity: opacity / 100,
                  transform: `rotate(${rotation}deg)`,
                  color: '#6366f1',
                  fontWeight: 'bold',
                }}
              >
                {watermarkText || 'Preview'}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={addWatermark}
                disabled={isProcessing || !watermarkText.trim()}
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
                    💧 Add Watermark
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            About Watermarks
          </h2>
          <div className="text-gray-600 dark:text-gray-400 space-y-3">
            <p>
              Watermarks help protect your documents by indicating ownership, confidentiality status,
              or document state (like DRAFT).
            </p>
            <p>
              The watermark will be added to every page of your PDF document.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


