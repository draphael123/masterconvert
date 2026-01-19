'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function HtmlTextPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'html-to-text' | 'text-to-html'>('html-to-text');
  const [copied, setCopied] = useState(false);
  
  // Options
  const [preserveLineBreaks, setPreserveLineBreaks] = useState(true);
  const [preserveLinks, setPreserveLinks] = useState(false);

  const convert = () => {
    if (mode === 'html-to-text') {
      let result = input;
      
      // Remove script and style tags with content
      result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
      result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
      
      // Preserve links if option enabled
      if (preserveLinks) {
        result = result.replace(/<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi, '$2 ($1)');
      }
      
      // Convert block elements to line breaks
      result = result.replace(/<\/?(div|p|br|h[1-6]|ul|ol|li|table|tr)[^>]*>/gi, '\n');
      
      // Remove remaining HTML tags
      result = result.replace(/<[^>]+>/g, '');
      
      // Decode HTML entities
      result = result.replace(/&nbsp;/g, ' ');
      result = result.replace(/&amp;/g, '&');
      result = result.replace(/&lt;/g, '<');
      result = result.replace(/&gt;/g, '>');
      result = result.replace(/&quot;/g, '"');
      result = result.replace(/&#39;/g, "'");
      
      // Clean up whitespace
      result = result.replace(/  +/g, ' ');
      result = result.replace(/\n\s*\n/g, '\n\n');
      
      setOutput(result.trim());
    } else {
      let result = input;
      
      // Escape HTML entities
      result = result.replace(/&/g, '&amp;');
      result = result.replace(/</g, '&lt;');
      result = result.replace(/>/g, '&gt;');
      result = result.replace(/"/g, '&quot;');
      
      if (preserveLineBreaks) {
        // Convert paragraphs (double line breaks)
        result = result.split(/\n\n+/).map(para => `<p>${para}</p>`).join('\n');
        // Convert single line breaks within paragraphs
        result = result.replace(/([^>])\n([^<])/g, '$1<br>\n$2');
      } else {
        result = `<p>${result}</p>`;
      }
      
      setOutput(result);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-orange-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-300 text-sm mb-6">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
            Text Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            HTML ↔ Text Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Convert between HTML and plain text.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/5 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => { setMode('html-to-text'); setInput(''); setOutput(''); }}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'html-to-text' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              HTML → Text
            </button>
            <button
              onClick={() => { setMode('text-to-html'); setInput(''); setOutput(''); }}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'text-to-html' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              Text → HTML
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {mode === 'html-to-text' ? 'Paste HTML' : 'Paste Plain Text'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'html-to-text' 
                ? '<p>Your HTML content here...</p>\n<div class="container">\n  <h1>Title</h1>\n</div>'
                : 'Your plain text here.\n\nNew paragraph starts after blank line.'
              }
              rows={12}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
            />
            
            {/* Options */}
            <div className="mt-4 flex flex-wrap gap-4">
              {mode === 'html-to-text' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preserveLinks}
                    onChange={(e) => setPreserveLinks(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-600"
                  />
                  <span className="text-sm text-gray-300">Preserve link URLs</span>
                </label>
              )}
              {mode === 'text-to-html' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preserveLineBreaks}
                    onChange={(e) => setPreserveLineBreaks(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-orange-600"
                  />
                  <span className="text-sm text-gray-300">Convert line breaks to &lt;br&gt;/&lt;p&gt;</span>
                </label>
              )}
            </div>

            <button
              onClick={convert}
              disabled={!input.trim()}
              className="mt-4 w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
            >
              Convert
            </button>
          </div>

          {/* Output */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                {mode === 'html-to-text' ? 'Plain Text' : 'HTML'}
              </label>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-orange-400 hover:text-orange-300"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              rows={12}
              className="w-full px-4 py-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-100 resize-none font-mono text-sm"
              placeholder="Converted output will appear here..."
            />
            <div className="mt-2 text-xs text-gray-500">
              {output.length} characters
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

