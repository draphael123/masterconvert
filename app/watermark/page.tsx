'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MAX_FILE_SIZE_MB = 200;
const MAX_FILES = 50;

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
  status?: 'pending' | 'processing' | 'done' | 'error';
  downloadUrl?: string;
}

export default function WatermarkPage() {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(30);
  const [rotation, setRotation] = useState(-45);
  const [position, setPosition] = useState<'center' | 'diagonal' | 'footer'>('diagonal');
  const [isProcessing, setIsProcessing] = useState(false);
  const pdfFilesRef = useRef<PdfFile[]>([]);
  
  // Keep ref in sync with state
  useEffect(() => {
    pdfFilesRef.current = pdfFiles;
  }, [pdfFiles]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const currentFileCount = pdfFilesRef.current.length;
    const remainingSlots = MAX_FILES - currentFileCount;
    
    if (remainingSlots <= 0) {
      toast.error(`Maximum of ${MAX_FILES} files allowed. Please remove some files first.`);
      return;
    }
    
    if (acceptedFiles.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more file(s). Maximum of ${MAX_FILES} files allowed.`);
    }

    const filesToProcess = acceptedFiles.slice(0, remainingSlots);
    const newPdfFiles: PdfFile[] = [];

    for (const file of filesToProcess) {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        toast.error(`${file.name}: Not a PDF file`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name}: File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        continue;
      }

      const pdfFile: PdfFile = {
        id: `pdf-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        file,
        name: file.name,
        size: file.size,
        status: 'pending',
      };

      newPdfFiles.push(pdfFile);
    }

    // Add all valid files at once
    if (newPdfFiles.length > 0) {
      setPdfFiles((prev) => {
        const totalAfterAdd = prev.length + newPdfFiles.length;
        if (totalAfterAdd > MAX_FILES) {
          const allowed = MAX_FILES - prev.length;
          toast.error(`Only ${allowed} file(s) were added. Maximum of ${MAX_FILES} files reached.`);
          return [...prev, ...newPdfFiles.slice(0, allowed)];
        }
        return [...prev, ...newPdfFiles];
      });
      
      toast.success(`Added ${newPdfFiles.length} file(s)`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    maxFiles: MAX_FILES,
  });

  const addWatermark = async () => {
    if (pdfFiles.length === 0 || !watermarkText.trim()) {
      toast.error('Please provide at least one PDF and watermark text');
      return;
    }

    setIsProcessing(true);

    for (const pdfFile of pdfFiles) {
      if (pdfFile.status === 'done') continue;

      setPdfFiles((prev) =>
        prev.map((f) =>
          f.id === pdfFile.id ? { ...f, status: 'processing' } : f
        )
      );

      try {
        const formData = new FormData();
        formData.append('pdf', pdfFile.file);
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

        setPdfFiles((prev) =>
          prev.map((f) =>
            f.id === pdfFile.id
              ? {
                  ...f,
                  status: 'done',
                  downloadUrl: url,
                }
              : f
          )
        );
      } catch (error: any) {
        setPdfFiles((prev) =>
          prev.map((f) =>
            f.id === pdfFile.id ? { ...f, status: 'error' } : f
          )
        );
        toast.error(`Failed to watermark ${pdfFile.name}`);
      }
    }

    setIsProcessing(false);
    toast.success('Watermark processing complete!');
  };

  const downloadFile = (pdfFile: PdfFile) => {
    if (!pdfFile.downloadUrl) return;
    const a = document.createElement('a');
    a.href = pdfFile.downloadUrl;
    a.download = `watermarked-${pdfFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = () => {
    pdfFiles.filter(f => f.downloadUrl).forEach(downloadFile);
  };

  const removeFile = (id: string) => {
    setPdfFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.downloadUrl) {
        URL.revokeObjectURL(file.downloadUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
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
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <Header />

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
            {isDragActive ? 'Drop PDFs here...' : 'Drag & drop PDF files here'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            or click to select files (max {MAX_FILE_SIZE_MB}MB per file, up to {MAX_FILES} files)
          </p>
        </div>

        {/* File List */}
        {pdfFiles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                PDF Files ({pdfFiles.length})
              </h2>
              <div className="flex gap-2">
                {pdfFiles.filter(f => f.downloadUrl).length > 0 && (
                  <button
                    onClick={downloadAll}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Download All
                  </button>
                )}
                <button
                  onClick={() => {
                    pdfFiles.forEach(f => {
                      if (f.downloadUrl) URL.revokeObjectURL(f.downloadUrl);
                    });
                    setPdfFiles([]);
                  }}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
              {pdfFiles.map((pdfFile) => (
                <div
                  key={pdfFile.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-xl">
                      {pdfFile.status === 'processing' ? '⏳' : pdfFile.status === 'done' ? '✅' : pdfFile.status === 'error' ? '❌' : '📄'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                        {pdfFile.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(pdfFile.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pdfFile.downloadUrl && (
                      <button
                        onClick={() => downloadFile(pdfFile)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                      >
                        Download
                      </button>
                    )}
                    <button
                      onClick={() => removeFile(pdfFile.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Watermark Options */}
        {pdfFiles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">

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
                disabled={isProcessing || !watermarkText.trim() || pdfFiles.every(f => f.status === 'done')}
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
                    💧 Add Watermark to {pdfFiles.filter(f => f.status !== 'done').length} PDF{pdfFiles.filter(f => f.status !== 'done').length !== 1 ? 's' : ''}
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



