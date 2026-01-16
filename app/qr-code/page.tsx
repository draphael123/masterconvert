'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function QrCodePage() {
  const [text, setText] = useState('https://');
  const [size, setSize] = useState(256);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');

  const generateQrCode = async () => {
    if (!text.trim()) {
      toast.error('Please enter text or URL');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/qr-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          size,
          errorCorrection,
          darkColor,
          lightColor,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const data = await response.json();
      setQrDataUrl(data.dataUrl);
      toast.success('QR code generated!');
    } catch (error) {
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQrCode = (format: 'png' | 'svg') => {
    if (!qrDataUrl) return;

    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyToClipboard = async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const presets = [
    { label: 'URL', prefix: 'https://' },
    { label: 'Email', prefix: 'mailto:' },
    { label: 'Phone', prefix: 'tel:' },
    { label: 'SMS', prefix: 'sms:' },
    { label: 'WiFi', prefix: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            QR Code Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Create QR codes for URLs, text, contacts, and more
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Content
            </h2>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-4">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setText(preset.prefix)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL, text, or data..."
              className="w-full h-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />

            {/* Size */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Size: {size}px
              </label>
              <input
                type="range"
                min="128"
                max="512"
                step="64"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Error Correction */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Error Correction
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setErrorCorrection(level)}
                    className={`p-2 rounded border-2 text-sm ${
                      errorCorrection === level
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {level} ({level === 'L' ? '7%' : level === 'M' ? '15%' : level === 'Q' ? '25%' : '30%'})
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dark Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Light Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={generateQrCode}
              disabled={isGenerating || !text.trim()}
              className="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Generate QR Code'}
            </button>
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preview
            </h2>

            <div className="flex items-center justify-center min-h-[300px] bg-gray-100 dark:bg-gray-700 rounded-lg">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Generated QR Code"
                  className="max-w-full"
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-6xl mb-2">📱</div>
                  <p>QR code will appear here</p>
                </div>
              )}
            </div>

            {qrDataUrl && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => downloadQrCode('png')}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Download PNG
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  📋 Copy
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            QR Code Types
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">URLs</h3>
              <p>Start with https:// for website links</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
              <p>mailto:email@example.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Phone</h3>
              <p>tel:+1234567890</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">SMS</h3>
              <p>sms:+1234567890?body=Hello</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">WiFi</h3>
              <p>WIFI:T:WPA;S:Name;P:Pass;;</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Plain Text</h3>
              <p>Any text content</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


