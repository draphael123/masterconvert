'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Base64Page() {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const encodeText = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      toast.success('Text encoded!');
    } catch (e) {
      toast.error('Failed to encode');
    }
  };

  const decodeText = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      toast.success('Text decoded!');
    } catch (e) {
      toast.error('Invalid Base64 string');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      setOutput(dataUrl);
      toast.success('Image converted to Base64!');
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const decodeImage = () => {
    if (!input.startsWith('data:image')) {
      // Try to create a data URL
      const dataUrl = `data:image/png;base64,${input}`;
      setImagePreview(dataUrl);
    } else {
      setImagePreview(input);
    }
    toast.success('Base64 decoded to image!');
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Base64 Encoder/Decoder
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Encode and decode text or images to Base64
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md inline-flex">
            <button
              onClick={() => { setMode('text'); setInput(''); setOutput(''); setImagePreview(''); }}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                mode === 'text'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Text
            </button>
            <button
              onClick={() => { setMode('image'); setInput(''); setOutput(''); setImagePreview(''); }}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                mode === 'image'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Image
            </button>
          </div>
        </div>

        {mode === 'text' ? (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Input</h2>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to encode or Base64 string to decode..."
                className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={encodeText}
                  disabled={!input.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  Encode →
                </button>
                <button
                  onClick={decodeText}
                  disabled={!input.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
                >
                  ← Decode
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">Output</h2>
                {output && (
                  <button onClick={copyOutput} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    📋 Copy
                  </button>
                )}
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="Result will appear here..."
                className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Encode */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Image to Base64</h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                  ${isDragActive
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-gray-600 dark:text-gray-300">
                  Drop an image here or click to select
                </p>
              </div>
            </div>

            {/* Base64 to Image */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Base64 to Image</h2>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste Base64 string here..."
                className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-xs resize-none"
              />
              <button
                onClick={decodeImage}
                disabled={!input.trim()}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                Decode to Image
              </button>
            </div>

            {/* Output */}
            {(output || imagePreview) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Result</h2>
                  {output && (
                    <button onClick={copyOutput} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                      📋 Copy Base64
                    </button>
                  )}
                </div>
                {imagePreview && (
                  <div className="mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex justify-center">
                    <img src={imagePreview} alt="Preview" className="max-w-full max-h-64" />
                  </div>
                )}
                {output && (
                  <textarea
                    value={output}
                    readOnly
                    className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-xs resize-none"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

