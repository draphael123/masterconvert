'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
}

const MAX_FILE_SIZE_MB = 200;
const MAX_FILES = 50;

export default function MergePage() {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const pdfFilesRef = useRef<PdfFile[]>([]);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
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
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        toast.error(`${file.name}: Not a PDF file`);
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name}: File exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        continue;
      }

      const pdfFile: PdfFile = {
        id: `pdf-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        file,
        name: file.name,
        size: file.size,
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
      
      newPdfFiles.forEach((pdf) => {
        toast.success(`Added: ${pdf.name}`);
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: true,
    maxFiles: MAX_FILES,
  });

  const handleFolderUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Filter for PDFs only
    const pdfFiles = Array.from(files).filter(
      file => file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf'
    );

    if (pdfFiles.length === 0) {
      toast.error('No PDF files found in the selected folder');
      return;
    }

    // Process the PDFs through the same logic as onDrop
    onDrop(pdfFiles);
    
    // Reset the input so the same folder can be selected again
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  }, [onDrop]);

  const removeFile = (id: string) => {
    setPdfFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    setPdfFiles((prev) => {
      const updated = [...prev];
      const [removed] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, removed);
      return updated;
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      moveFile(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const mergePdfs = async () => {
    if (pdfFiles.length < 2) {
      toast.error('Please add at least 2 PDF files to merge');
      return;
    }

    setIsMerging(true);

    try {
      const formData = new FormData();
      pdfFiles.forEach((pdf) => {
        formData.append('pdfs', pdf.file);
      });

      const response = await fetch('/api/merge-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to merge PDFs');
      }

      // Download the merged PDF
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('PDFs merged successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to merge PDFs');
    } finally {
      setIsMerging(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const totalSize = pdfFiles.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Merge PDF Files
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Combine multiple PDF files into one. Drag to reorder.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors mb-8
            ${isDragActive
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
            }`}
        >
          <input {...getInputProps()} />
          <div className="text-6xl mb-4">📄</div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            {isDragActive ? 'Drop PDFs here...' : 'Drag & drop PDF files here'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            or click to select files (max {MAX_FILE_SIZE_MB}MB per file, up to {MAX_FILES} files)
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                folderInputRef.current?.click();
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              📁 Upload Folder
            </button>
            <input
              type="file"
              ref={folderInputRef}
              onChange={handleFolderUpload}
              {...({ webkitdirectory: '', directory: '', multiple: true } as any)}
              accept=".pdf,application/pdf"
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Folder upload will automatically detect all PDFs in the selected folder
          </p>
        </div>

        {/* File List */}
        {pdfFiles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                PDF Files ({pdfFiles.length})
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total: {formatFileSize(totalSize)}
                </span>
                <button
                  onClick={() => setPdfFiles([])}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Clear All
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              💡 Drag files to reorder. Files will be merged in the order shown below.
            </p>

            <div className="space-y-2">
              {pdfFiles.map((pdf, index) => (
                <div
                  key={pdf.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 transition-all cursor-move
                    ${draggedIndex === index
                      ? 'border-indigo-500 opacity-50'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="text-2xl">📄</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white truncate max-w-md">
                        {pdf.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(pdf.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveFile(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveFile(index, Math.min(pdfFiles.length - 1, index + 1))}
                      disabled={index === pdfFiles.length - 1}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeFile(pdf.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={mergePdfs}
                disabled={pdfFiles.length < 2 || isMerging}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isMerging ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Merging...
                  </>
                ) : (
                  <>
                    🔗 Merge {pdfFiles.length} PDFs
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            How to Merge PDFs
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
            <li>
              <strong>Upload PDFs:</strong> Drag and drop or click to select multiple PDF files
            </li>
            <li>
              <strong>Arrange Order:</strong> Drag files to reorder them, or use the arrow buttons
            </li>
            <li>
              <strong>Merge:</strong> Click the merge button to combine all PDFs into one
            </li>
            <li>
              <strong>Download:</strong> Your merged PDF will download automatically
            </li>
          </ol>

          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
              🔒 Privacy First
            </h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-400">
              Your files are processed securely and deleted immediately after merging.
              We never store your documents.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



