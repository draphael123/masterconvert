'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function BulletPointsPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [bulletStyle, setBulletStyle] = useState('•');
  const [outputFormat, setOutputFormat] = useState<'text' | 'html' | 'markdown'>('text');
  const [copied, setCopied] = useState(false);

  const BULLET_STYLES = [
    { symbol: '•', name: 'Bullet' },
    { symbol: '→', name: 'Arrow' },
    { symbol: '✓', name: 'Check' },
    { symbol: '★', name: 'Star' },
    { symbol: '◆', name: 'Diamond' },
    { symbol: '▸', name: 'Triangle' },
    { symbol: '○', name: 'Circle' },
    { symbol: '■', name: 'Square' },
    { symbol: '–', name: 'Dash' },
    { symbol: '❯', name: 'Chevron' },
  ];

  const convert = () => {
    // Split by line breaks, periods, or semicolons
    let items = input
      .split(/[\n.;]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);

    // If no good split, try splitting by commas
    if (items.length <= 1) {
      items = input
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }

    let result = '';

    switch (outputFormat) {
      case 'text':
        result = items.map(item => `${bulletStyle} ${item}`).join('\n');
        break;
      case 'html':
        result = '<ul>\n' + items.map(item => `  <li>${item}</li>`).join('\n') + '\n</ul>';
        break;
      case 'markdown':
        result = items.map(item => `- ${item}`).join('\n');
        break;
    }

    setOutput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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
            Bullet Point Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Convert paragraphs and sentences into organized bullet points.
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
              placeholder="Paste a paragraph, comma-separated list, or sentences. Each sentence, period, or line break will become a bullet point."
              rows={8}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />

            {/* Options */}
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Bullet Style</label>
                <div className="flex flex-wrap gap-2">
                  {BULLET_STYLES.map(style => (
                    <button
                      key={style.symbol}
                      onClick={() => setBulletStyle(style.symbol)}
                      className={`w-10 h-10 rounded-lg text-lg transition-colors flex items-center justify-center ${
                        bulletStyle === style.symbol
                          ? 'bg-teal-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                      title={style.name}
                    >
                      {style.symbol}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-2">Output Format</label>
                <div className="flex gap-2">
                  {(['text', 'html', 'markdown'] as const).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setOutputFormat(fmt)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                        outputFormat === fmt
                          ? 'bg-teal-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={convert}
              disabled={!input.trim()}
              className="mt-4 w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
            >
              Convert to Bullets
            </button>
          </div>

          {/* Output */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Bullet Points</label>
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
              placeholder="Your bullet points will appear here..."
            />
          </div>
        </div>

        {/* Example */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Example</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400 mb-2">Input:</p>
              <p className="text-white">
                Our product is fast, reliable, and easy to use. It saves you time and increases productivity.
              </p>
            </div>
            <div className="p-3 bg-teal-500/10 rounded-lg">
              <p className="text-gray-400 mb-2">Output:</p>
              <p className="text-teal-300 whitespace-pre-line">
                • Our product is fast, reliable, and easy to use{'\n'}• It saves you time and increases productivity
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

