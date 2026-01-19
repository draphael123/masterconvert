'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function MetaGeneratorPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('https://example.com/page');
  const [siteName, setSiteName] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const titleLength = title.length;
  const descLength = description.length;

  const getTitleStatus = () => {
    if (titleLength === 0) return { color: 'text-gray-400', text: 'Enter a title' };
    if (titleLength < 30) return { color: 'text-yellow-400', text: 'Too short - aim for 50-60 chars' };
    if (titleLength <= 60) return { color: 'text-green-400', text: 'Perfect length!' };
    return { color: 'text-red-400', text: 'Too long - may be truncated' };
  };

  const getDescStatus = () => {
    if (descLength === 0) return { color: 'text-gray-400', text: 'Enter a description' };
    if (descLength < 120) return { color: 'text-yellow-400', text: 'Too short - aim for 150-160 chars' };
    if (descLength <= 160) return { color: 'text-green-400', text: 'Perfect length!' };
    return { color: 'text-red-400', text: 'Too long - will be truncated' };
  };

  const generateMetaTags = () => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
${siteName ? `<meta property="og:site_name" content="${siteName}">` : ''}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const titleStatus = getTitleStatus();
  const descStatus = getDescStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-emerald-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-300 text-sm mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            SEO Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meta Tag Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create SEO-optimized meta tags with live Google SERP preview.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Meta Information</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Page Title</label>
                    <span className={`text-xs ${titleStatus.color}`}>
                      {titleLength}/60 - {titleStatus.text}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Your Page Title | Brand Name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        titleLength <= 60 ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (titleLength / 60) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Meta Description</label>
                    <span className={`text-xs ${descStatus.color}`}>
                      {descLength}/160 - {descStatus.text}
                    </span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A compelling description of your page that will appear in search results..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                  <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        descLength <= 160 ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (descLength / 160) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Page URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/your-page"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Site Name (optional)</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Your Brand Name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Output */}
          <div className="space-y-6">
            {/* Google SERP Preview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Google Search Preview</h2>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-green-700 truncate">{url || 'https://example.com'}</div>
                <div className="text-xl text-blue-800 hover:underline cursor-pointer truncate">
                  {title || 'Your Page Title Will Appear Here'}
                </div>
                <div className="text-sm text-gray-600 line-clamp-2">
                  {description || 'Your meta description will appear here. Make it compelling to improve click-through rates from search results.'}
                </div>
              </div>
            </div>

            {/* Social Preview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Social Share Preview</h2>
              <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-gray-400">
                  <span className="text-4xl">🖼️</span>
                </div>
                <div className="p-3">
                  <div className="text-xs text-gray-500 uppercase">{siteName || new URL(url || 'https://example.com').hostname}</div>
                  <div className="text-white font-medium truncate">{title || 'Page Title'}</div>
                  <div className="text-gray-400 text-sm line-clamp-2">{description || 'Description...'}</div>
                </div>
              </div>
            </div>

            {/* Generated Code */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Generated Meta Tags</h2>
                <button
                  onClick={() => copyToClipboard(generateMetaTags(), 'meta')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {copied === 'meta' ? '✓ Copied!' : 'Copy All'}
                </button>
              </div>
              <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 font-mono">
                {generateMetaTags()}
              </pre>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Meta Tag Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400">✓</span>
              <p><strong>Title:</strong> 50-60 characters, include primary keyword near the beginning</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400">✓</span>
              <p><strong>Description:</strong> 150-160 characters, include a call-to-action</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400">✓</span>
              <p><strong>Unique:</strong> Each page should have unique meta tags</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400">✓</span>
              <p><strong>Compelling:</strong> Write for humans, not just search engines</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

