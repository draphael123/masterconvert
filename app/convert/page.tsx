'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import FileCard from '@/components/FileCard';
import ProgressCard from '@/components/ProgressCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileInfo, ConversionType, JobStatus, AdvancedOptions, ConversionHistoryItem } from '@/lib/types';
import { validateFile } from '@/lib/validation';

const MAX_FILE_SIZE_MB = 200;
const MAX_FILES = 50;

export default function ConvertPage() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [fileObjects, setFileObjects] = useState<Map<string, File>>(new Map());
  const [jobs, setJobs] = useState<Map<string, JobStatus>>(new Map());
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);
  const filesRef = useRef<FileInfo[]>([]);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
  // Keep ref in sync with state
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('fileforge-history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (item: ConversionHistoryItem) => {
    const newHistory = [item, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem('fileforge-history', JSON.stringify(newHistory));
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const currentFileCount = filesRef.current.length;
    const remainingSlots = MAX_FILES - currentFileCount;
    
    if (remainingSlots <= 0) {
      toast.error(`Maximum of ${MAX_FILES} files allowed. Please remove some files first.`);
      return;
    }
    
    if (acceptedFiles.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more file(s). Maximum of ${MAX_FILES} files allowed.`);
    }

    const filesToProcess = acceptedFiles.slice(0, remainingSlots);
    const newFileInfos: FileInfo[] = [];
    const newFileObjects = new Map<string, File>();

    for (const file of filesToProcess) {
      const validation = await validateFile(file, MAX_FILE_SIZE_MB);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
        continue;
      }

      const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const fileInfo: FileInfo = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      newFileInfos.push(fileInfo);
      newFileObjects.set(fileId, file);
    }

    // Add all valid files at once
    if (newFileInfos.length > 0) {
      setFiles((prev) => {
        const totalAfterAdd = prev.length + newFileInfos.length;
        if (totalAfterAdd > MAX_FILES) {
          const allowed = MAX_FILES - prev.length;
          toast.error(`Only ${allowed} file(s) were added. Maximum of ${MAX_FILES} files reached.`);
          return [...prev, ...newFileInfos.slice(0, allowed)];
        }
        return [...prev, ...newFileInfos];
      });

      setFileObjects((prev) => {
        const newMap = new Map(prev);
        newFileObjects.forEach((file, fileId) => {
          newMap.set(fileId, file);
        });
        return newMap;
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    multiple: true,
    maxFiles: MAX_FILES,
  });

  const handleFolderUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process all files from the folder (they'll be validated by onDrop)
    onDrop(Array.from(files));
    
    // Reset the input so the same folder can be selected again
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  }, [onDrop]);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setFileObjects((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  const updatePreset = (id: string, preset: ConversionType) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, preset } : f))
    );
  };

  const updateAdvancedOptions = (id: string, options: AdvancedOptions) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, advancedOptions: options } : f))
    );
  };

  const startConversion = async () => {
    const filesToConvert = files.filter((f) => f.preset);
    
    if (filesToConvert.length === 0) {
      toast.error('Please select conversion formats for at least one file');
      return;
    }

    for (const file of filesToConvert) {
      try {
        // Upload file
        const fileObject = fileObjects.get(file.id);
        if (!fileObject) {
          toast.error(`File ${file.name} not found`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', fileObject);
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          toast.error(`Upload failed for ${file.name}: ${error.error}`);
          continue;
        }

        const uploadData = await uploadResponse.json();

        // Start conversion
        const convertResponse = await fetch('/api/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileId: uploadData.fileId,
            fileName: file.name,
            conversionType: file.preset,
            advancedOptions: file.advancedOptions,
          }),
        });

        if (!convertResponse.ok) {
          const error = await convertResponse.json();
          toast.error(`Conversion failed for ${file.name}: ${error.error || error.message}`);
          continue;
        }

        const { jobId } = await convertResponse.json();

        // Initialize job status
        setJobs((prev) => {
          const newJobs = new Map(prev);
          newJobs.set(jobId, {
            jobId,
            status: 'pending',
            progress: 0,
            message: 'Starting conversion...',
          });
          return newJobs;
        });

        // Store file name for job
        setJobs((prev) => {
          const newJobs = new Map(prev);
          const job = newJobs.get(jobId);
          if (job) {
            (job as any).fileName = file.name;
          }
          return newJobs;
        });

        // Poll for status
        pollJobStatus(jobId, file.name, file.preset!);
      } catch (error: any) {
        toast.error(`Error converting ${file.name}: ${error.message}`);
      }
    }
  };

  const pollJobStatus = async (
    jobId: string,
    fileName: string,
    conversionType: ConversionType
  ) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/status?jobId=${jobId}`);
        if (!response.ok) {
          clearInterval(interval);
          return;
        }

        const status: JobStatus = await response.json();
        setJobs((prev) => {
          const newJobs = new Map(prev);
          newJobs.set(jobId, status);
          return newJobs;
        });

        if (status.status === 'completed') {
          clearInterval(interval);
          toast.success(`Conversion complete: ${fileName}`);
          
          // Save to history
          saveToHistory({
            id: jobId,
            fileName,
            fromType: conversionType.split('-to-')[0],
            toType: conversionType.split('-to-')[1],
            timestamp: Date.now(),
            status: 'success',
          });
        } else if (status.status === 'failed') {
          clearInterval(interval);
          toast.error(`Conversion failed: ${fileName}`);
          
          // Save to history
          saveToHistory({
            id: jobId,
            fileName,
            fromType: conversionType.split('-to-')[0],
            toType: conversionType.split('-to-')[1],
            timestamp: Date.now(),
            status: 'failed',
          });
        }
      } catch (error) {
        console.error('Error polling status:', error);
        clearInterval(interval);
      }
    }, 1000); // Poll every second
  };

  const downloadFile = (jobId: string, fileIndex: number = 0) => {
    window.open(`/api/download?jobId=${jobId}&fileIndex=${fileIndex}`, '_blank');
  };

  const downloadZip = (jobId: string) => {
    window.open(`/api/download-zip?jobId=${jobId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Convert Files
        </h1>

        {/* Quick Convert Section */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Convert
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Popular conversions at a glance:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 text-center">
              PNG → JPG
            </span>
            <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 text-center">
              PDF → TXT
            </span>
            <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 text-center">
              CSV → XLSX
            </span>
            <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 text-center">
              JSON → CSV
            </span>
            <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 text-center">
              MD → PDF
            </span>
            <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 text-center">
              HTML → PDF
            </span>
          </div>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="text-6xl">📁</div>
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Upload a folder to process all supported files within it
              </p>
            </div>
          </div>
        </div>

        {/* File Cards */}
        {files.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Files ({files.length})
              </h2>
              <div className="flex gap-3">
                {files.length > 0 && (
                  <button
                    onClick={() => {
                      setFiles([]);
                      setFileObjects(new Map());
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={startConversion}
                  disabled={files.filter((f) => f.preset).length === 0}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Start Conversion
                </button>
              </div>
            </div>

            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onRemove={removeFile}
                onPresetChange={updatePreset}
                onAdvancedOptionsChange={updateAdvancedOptions}
              />
            ))}
          </div>
        )}

        {/* Progress Cards */}
        {jobs.size > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Conversions
            </h2>
            <div className="space-y-4">
              {Array.from(jobs.values()).map((job) => {
                const fileName = (job as any).fileName || 'File';
                return (
                  <ProgressCard
                    key={job.jobId}
                    job={job}
                    fileName={fileName}
                    onDownload={downloadFile}
                    onDownloadZip={downloadZip}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Conversions
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Conversion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {history.slice(0, 10).map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {item.fileName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.fromType} → {item.toType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            item.status === 'success'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            🔒 <strong>Privacy:</strong> Your files are processed securely and automatically
            deleted after 15 minutes. We do not store your files permanently.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

