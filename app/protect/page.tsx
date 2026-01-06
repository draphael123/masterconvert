'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Footer from '@/components/Footer';

const MAX_FILE_SIZE_MB = 200;

export default function ProtectPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const protectPdf = async () => {
    if (!pdfFile) {
      toast.error('Please upload a PDF file');
      return;
    }

    if (!password) {
      toast.error('Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      formData.append('password', password);

      const response = await fetch('/api/protect-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to protect PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `protected-${pdfFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('PDF protected successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to protect PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getPasswordStrength = (pass: string): { label: string; color: string; width: string } => {
    if (pass.length === 0) return { label: '', color: '', width: '0%' };
    if (pass.length < 4) return { label: 'Too short', color: 'bg-red-500', width: '20%' };
    if (pass.length < 8) return { label: 'Weak', color: 'bg-orange-500', width: '40%' };
    if (pass.length < 12 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return { label: 'Medium', color: 'bg-yellow-500', width: '60%' };
    }
    if (pass.length >= 12 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) {
      return { label: 'Strong', color: 'bg-green-500', width: '100%' };
    }
    return { label: 'Medium', color: 'bg-yellow-500', width: '60%' };
  };

  const strength = getPasswordStrength(password);

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
              <Link href="/watermark" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">
                Watermark
              </Link>
              <Link href="/protect" className="text-indigo-600 dark:text-indigo-400 font-semibold">
                Protect
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Password Protect PDF
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Encrypt your PDF with a password for secure sharing
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
          <div className="text-6xl mb-4">🔐</div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            {isDragActive ? 'Drop PDF here...' : 'Drag & drop a PDF file here'}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            or click to select (max {MAX_FILE_SIZE_MB}MB)
          </p>
        </div>

        {/* File Info & Password */}
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
                onClick={() => {
                  setPdfFile(null);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            {/* Password Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={protectPdf}
                disabled={isProcessing || !password || password !== confirmPassword || password.length < 4}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Encrypting...
                  </>
                ) : (
                  <>
                    🔒 Protect PDF
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            About PDF Encryption
          </h2>
          <div className="text-gray-600 dark:text-gray-400 space-y-3">
            <p>
              Password protection encrypts your PDF so only people with the password can open it.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                ⚠️ Important
              </h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                <li>• Remember your password - we cannot recover it</li>
                <li>• Use a strong password with letters, numbers, and symbols</li>
                <li>• The recipient will need the password to open the file</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

