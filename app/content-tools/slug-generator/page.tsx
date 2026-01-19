'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function SlugGeneratorPage() {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [maxLength, setMaxLength] = useState(60);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [copied, setCopied] = useState(false);

  const STOP_WORDS = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'];

  useEffect(() => {
    generateSlug();
  }, [input, separator, lowercase, maxLength, removeStopWords]);

  const generateSlug = () => {
    let result = input
      // Remove special characters except spaces and alphanumeric
      .replace(/[^\w\s-]/g, '')
      // Replace multiple spaces with single space
      .replace(/\s+/g, ' ')
      .trim();

    if (removeStopWords) {
      result = result
        .split(' ')
        .filter(word => !STOP_WORDS.includes(word.toLowerCase()))
        .join(' ');
    }

    // Replace spaces with separator
    result = result.replace(/\s+/g, separator);

    // Apply case
    if (lowercase) {
      result = result.toLowerCase();
    }

    // Truncate if needed
    if (result.length > maxLength) {
      result = result.substring(0, maxLength);
      // Don't end with separator
      if (result.endsWith(separator)) {
        result = result.slice(0, -1);
      }
    }

    setSlug(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-300 text-sm mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            SEO Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            URL Slug Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Convert titles and text into SEO-friendly URL slugs.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter your title or text
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How to Create SEO-Friendly URLs for Your Blog Posts"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Separator</label>
              <select
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="-" className="bg-slate-800">Hyphen (-)</option>
                <option value="_" className="bg-slate-800">Underscore (_)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Max Length</label>
              <input
                type="number"
                value={maxLength}
                onChange={(e) => setMaxLength(parseInt(e.target.value) || 60)}
                min={10}
                max={200}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lowercase}
                  onChange={(e) => setLowercase(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">Lowercase</span>
              </label>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeStopWords}
                  onChange={(e) => setRemoveStopWords(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-300">Remove stop words</span>
              </label>
            </div>
          </div>

          {/* Output */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Generated Slug</label>
              <span className="text-xs text-gray-400">{slug.length} characters</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={slug}
                readOnly
                className="flex-1 px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-300 font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors"
              >
                {copied ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">URL Preview</p>
            <p className="text-white font-mono text-sm break-all">
              https://example.com/<span className="text-cyan-400">{slug || 'your-slug-here'}</span>
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-4">URL Slug Best Practices</h2>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span>Keep slugs short and descriptive (under 60 characters)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span>Use hyphens instead of underscores (Google recommends this)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span>Remove stop words (a, the, and, etc.) for cleaner URLs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span>Use lowercase letters only</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span>Include your target keyword in the slug</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400">✓</span>
              <span>Avoid special characters and numbers (unless meaningful)</span>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}

