'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function UrlEncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setOutput('Error: Invalid input for decoding');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(value));
      } else {
        setOutput(decodeURIComponent(value));
      }
    } catch {
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swapValues = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-cyan-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/tools/base64" className="text-gray-300 hover:text-white transition-colors">Base64</Link>
              <Link href="/tools/hash" className="text-gray-300 hover:text-white transition-colors">Hash</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-300 text-sm mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Developer Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            URL Encoder/Decoder
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Encode or decode URLs and query strings. Essential for web development.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode('encode'); setOutput(encodeURIComponent(input)); }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                mode === 'encode'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => { setMode('decode'); try { setOutput(decodeURIComponent(input)); } catch { setOutput(''); } }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                mode === 'decode'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              Decode
            </button>
          </div>

          {/* Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {mode === 'encode' ? 'Text to Encode' : 'URL to Decode'}
            </label>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={mode === 'encode' ? 'Hello World! How are you?' : 'Hello%20World%21%20How%20are%20you%3F'}
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={swapValues}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
              title="Swap input and output"
            >
              ⇅
            </button>
          </div>

          {/* Output */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                {mode === 'encode' ? 'Encoded URL' : 'Decoded Text'}
              </label>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-32 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white font-mono text-sm resize-none"
            />
          </div>

          {/* Character Count */}
          <div className="flex justify-between text-sm text-gray-400">
            <span>Input: {input.length} characters</span>
            <span>Output: {output.length} characters</span>
          </div>
        </div>

        {/* Common Examples */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Common Encodings</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-gray-400">Space</div>
              <div className="text-white font-mono">%20</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-gray-400">! (exclamation)</div>
              <div className="text-white font-mono">%21</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-gray-400">& (ampersand)</div>
              <div className="text-white font-mono">%26</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-gray-400">= (equals)</div>
              <div className="text-white font-mono">%3D</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-gray-400">? (question)</div>
              <div className="text-white font-mono">%3F</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-gray-400">/ (slash)</div>
              <div className="text-white font-mono">%2F</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-gray-400"># (hash)</div>
              <div className="text-white font-mono">%23</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-gray-400">@ (at)</div>
              <div className="text-white font-mono">%40</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

