'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function TextCleanerPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Options
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [removeLineBreaks, setRemoveLineBreaks] = useState(false);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [removeHtml, setRemoveHtml] = useState(false);
  const [removeUrls, setRemoveUrls] = useState(false);
  const [removeEmails, setRemoveEmails] = useState(false);
  const [removeNumbers, setRemoveNumbers] = useState(false);
  const [removePunctuation, setRemovePunctuation] = useState(false);
  const [removeSpecialChars, setRemoveSpecialChars] = useState(false);

  const cleanText = () => {
    let result = input;

    if (removeHtml) {
      result = result.replace(/<[^>]*>/g, '');
    }

    if (removeUrls) {
      result = result.replace(/https?:\/\/[^\s]+/g, '');
    }

    if (removeEmails) {
      result = result.replace(/[\w.-]+@[\w.-]+\.\w+/g, '');
    }

    if (removeNumbers) {
      result = result.replace(/\d+/g, '');
    }

    if (removePunctuation) {
      result = result.replace(/[.,!?;:'"()\[\]{}]/g, '');
    }

    if (removeSpecialChars) {
      result = result.replace(/[^a-zA-Z0-9\s\n]/g, '');
    }

    if (trimLines) {
      result = result.split('\n').map(line => line.trim()).join('\n');
    }

    if (removeEmptyLines) {
      result = result.split('\n').filter(line => line.trim().length > 0).join('\n');
    }

    if (removeLineBreaks) {
      result = result.replace(/\n+/g, ' ');
    }

    if (removeExtraSpaces) {
      result = result.replace(/  +/g, ' ');
    }

    setOutput(result.trim());
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const options = [
    { label: 'Remove extra spaces', state: removeExtraSpaces, setter: setRemoveExtraSpaces },
    { label: 'Remove line breaks', state: removeLineBreaks, setter: setRemoveLineBreaks },
    { label: 'Remove empty lines', state: removeEmptyLines, setter: setRemoveEmptyLines },
    { label: 'Trim each line', state: trimLines, setter: setTrimLines },
    { label: 'Remove HTML tags', state: removeHtml, setter: setRemoveHtml },
    { label: 'Remove URLs', state: removeUrls, setter: setRemoveUrls },
    { label: 'Remove emails', state: removeEmails, setter: setRemoveEmails },
    { label: 'Remove numbers', state: removeNumbers, setter: setRemoveNumbers },
    { label: 'Remove punctuation', state: removePunctuation, setter: setRemovePunctuation },
    { label: 'Remove special chars', state: removeSpecialChars, setter: setRemoveSpecialChars },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-teal-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full text-teal-300 text-sm mb-6">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
            Text Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Text Cleaner
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Remove formatting, extra spaces, and unwanted characters from text.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Paste your text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste text with extra    spaces,

empty lines, <html>tags</html>, or other formatting issues..."
              rows={12}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none font-mono text-sm"
            />
            <div className="mt-2 text-xs text-gray-400">
              {input.length} characters, {input.split(/\s+/).filter(w => w).length} words
            </div>
          </div>

          {/* Output */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Cleaned text</label>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-teal-400 hover:text-teal-300"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              rows={12}
              className="w-full px-4 py-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-100 resize-none font-mono text-sm"
              placeholder="Cleaned text will appear here..."
            />
            <div className="mt-2 text-xs text-gray-400">
              {output.length} characters, {output.split(/\s+/).filter(w => w).length} words
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Cleaning Options</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {options.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opt.state}
                  onChange={(e) => opt.setter(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-300">{opt.label}</span>
              </label>
            ))}
          </div>
          
          <button
            onClick={cleanText}
            disabled={!input}
            className="mt-6 w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
          >
            Clean Text
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

