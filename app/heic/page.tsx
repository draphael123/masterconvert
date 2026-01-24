'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ConvertedFile {
  name: string;
  url: string;
  size: number;
}

const MAX_FILES = 50;

export default function HeicConverterPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState<'jpg' | 'png'>('jpg');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const filesRef = useRef<File[]>([]);
  
  // Keep ref in sync with state
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const currentFileCount = filesRef.current.length;
    const remainingSlots = MAX_FILES - currentFileCount;
    
    if (remainingSlots <= 0) {
      toast.error(`Maximum of ${MAX_FILES} files allowed. Please remove some files first.`);
      return;
    }
    
    const heicFiles = acceptedFiles.filter(
      file => file.name.toLowerCase().endsWith('.heic') || 
              file.name.toLowerCase().endsWith('.heif')
    );
    
    if (heicFiles.length === 0) {
      toast.error('No HEIC/HEIF files found');
      return;
    }
    
    if (heicFiles.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more file(s). Maximum of ${MAX_FILES} files allowed.`);
    }
    
    const filesToAdd = heicFiles.slice(0, remainingSlots);
    setFiles(prev => {
      const totalAfterAdd = prev.length + filesToAdd.length;
      if (totalAfterAdd > MAX_FILES) {
        const allowed = MAX_FILES - prev.length;
        toast.error(`Only ${allowed} file(s) were added. Maximum of ${MAX_FILES} files reached.`);
        return [...prev, ...filesToAdd.slice(0, allowed)];
      }
      return [...prev, ...filesToAdd];
    });
    setError(null);
    setConvertedFiles([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
    },
    multiple: true,
    maxFiles: MAX_FILES,
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const convertFiles = async () => {
    if (files.length === 0) return;

    setConverting(true);
    setProgress(0);
    setError(null);
    const converted: ConvertedFile[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(((i + 0.5) / files.length) * 100);

        // Upload file
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadRes.ok) throw new Error(`Failed to upload ${file.name}`);
        const { fileId } = await uploadRes.json();

        // Start conversion
        const conversionType = outputFormat === 'jpg' ? 'heic-to-jpg' : 'heic-to-png';
        const convertRes = await fetch('/api/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileId,
            fileName: file.name,
            conversionType,
          }),
        });

        if (!convertRes.ok) throw new Error(`Failed to start conversion for ${file.name}`);
        const { jobId } = await convertRes.json();

        // Poll for completion
        let completed = false;
        let resultFile = '';
        while (!completed) {
          await new Promise(resolve => setTimeout(resolve, 500));
          const statusRes = await fetch(`/api/status?jobId=${jobId}`);
          const status = await statusRes.json();

          if (status.status === 'completed') {
            completed = true;
            resultFile = status.resultFiles[0];
          } else if (status.status === 'failed') {
            throw new Error(status.error || `Conversion failed for ${file.name}`);
          }
        }

        // Download the converted file
        const downloadRes = await fetch(`/api/download?file=${encodeURIComponent(resultFile)}`);
        if (!downloadRes.ok) throw new Error(`Failed to download converted ${file.name}`);
        
        const blob = await downloadRes.blob();
        const url = URL.createObjectURL(blob);
        const newName = file.name.replace(/\.(heic|heif)$/i, `.${outputFormat}`);
        
        converted.push({
          name: newName,
          url,
          size: blob.size,
        });

        setProgress(((i + 1) / files.length) * 100);
      }

      setConvertedFiles(converted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setConverting(false);
    }
  };

  const downloadAll = () => {
    convertedFiles.forEach(file => {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name;
      a.click();
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm mb-6">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            iPhone Photo Converter
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            HEIC to JPG/PNG Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Convert iPhone HEIC photos to universal JPG or PNG format instantly. 
            Free, secure, and works entirely in your browser.
          </p>
        </div>

        {/* Converter Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          {/* Output Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Output Format
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setOutputFormat('jpg')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  outputFormat === 'jpg'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                JPG (Smaller Size)
              </button>
              <button
                onClick={() => setOutputFormat('png')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  outputFormat === 'png'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                PNG (Lossless)
              </button>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-white/20 hover:border-blue-400/50 hover:bg-white/5'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-6xl mb-4">📸</div>
            {isDragActive ? (
              <p className="text-xl text-blue-300">Drop your HEIC files here...</p>
            ) : (
              <>
                <p className="text-xl text-white mb-2">
                  Drag & drop HEIC/HEIF files here
                </p>
                <p className="text-gray-400">or click to select files (up to {MAX_FILES} files)</p>
              </>
            )}
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-white">
                  Files to Convert ({files.length})
                </h3>
                <button
                  onClick={() => setFiles([])}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🖼️</span>
                      <div>
                        <p className="text-white font-medium truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {converting && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Converting...</span>
                <span className="text-sm text-gray-300">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
              {error}
            </div>
          )}

          {/* Convert Button */}
          {files.length > 0 && convertedFiles.length === 0 && (
            <button
              onClick={convertFiles}
              disabled={converting}
              className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-all ${
                converting
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400'
              }`}
            >
              {converting ? 'Converting...' : `Convert ${files.length} File${files.length > 1 ? 's' : ''} to ${outputFormat.toUpperCase()}`}
            </button>
          )}

          {/* Converted Files */}
          {convertedFiles.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-white">
                  Converted Files ✓
                </h3>
                {convertedFiles.length > 1 && (
                  <button
                    onClick={downloadAll}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Download All
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {convertedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={file.url}
                      download={file.name}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setFiles([]);
                  setConvertedFiles([]);
                }}
                className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
              >
                Convert More Files
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-white mb-2">Private & Secure</h3>
            <p className="text-gray-400 text-sm">
              Your files are processed securely and automatically deleted after conversion.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-400 text-sm">
              Convert multiple HEIC photos in seconds with our optimized converter.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">💯</div>
            <h3 className="text-lg font-semibold text-white mb-2">100% Free</h3>
            <p className="text-gray-400 text-sm">
              No limits, no watermarks, no registration required. Just convert.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">What is HEIC format?</h3>
              <p className="text-gray-400">
                HEIC (High Efficiency Image Container) is Apple&apos;s image format used on iPhones 
                and iPads. It offers better compression than JPG while maintaining quality, but 
                isn&apos;t universally supported.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Why convert HEIC to JPG?</h3>
              <p className="text-gray-400">
                JPG is universally supported across all devices, browsers, and applications. 
                Converting HEIC to JPG ensures your photos can be viewed and shared anywhere.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">JPG vs PNG - which should I choose?</h3>
              <p className="text-gray-400">
                Choose JPG for smaller file sizes (best for sharing). Choose PNG for lossless 
                quality with transparency support (best for editing or archiving).
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}



