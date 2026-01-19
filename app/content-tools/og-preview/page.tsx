'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface MetaData {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
  type: string;
}

export default function OGPreviewPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Manual input mode
  const [manualMode, setManualMode] = useState(true);
  const [meta, setMeta] = useState<MetaData>({
    title: '',
    description: '',
    image: '',
    url: '',
    siteName: '',
    type: 'website',
  });

  const updateMeta = (key: keyof MetaData, value: string) => {
    setMeta(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-indigo-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm mb-6">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Open Graph Preview
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Preview how your links will appear when shared on social media.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Enter Open Graph Data</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={meta.title}
                onChange={(e) => updateMeta('title', e.target.value)}
                placeholder="Your Page Title"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Site Name</label>
              <input
                type="text"
                value={meta.siteName}
                onChange={(e) => updateMeta('siteName', e.target.value)}
                placeholder="Your Brand"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                value={meta.description}
                onChange={(e) => updateMeta('description', e.target.value)}
                placeholder="A brief description of your page..."
                rows={2}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">URL</label>
              <input
                type="text"
                value={meta.url}
                onChange={(e) => updateMeta('url', e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Image URL</label>
              <input
                type="text"
                value={meta.image}
                onChange={(e) => updateMeta('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Previews Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Facebook Preview */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">📘</span> Facebook
            </h3>
            <div className="bg-[#18191A] rounded-lg overflow-hidden border border-gray-700">
              <div className="h-48 bg-gray-800 flex items-center justify-center">
                {meta.image ? (
                  <img src={meta.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                ) : (
                  <span className="text-gray-500 text-4xl">🖼️</span>
                )}
              </div>
              <div className="p-3 bg-[#242526]">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {meta.url ? new URL(meta.url || 'https://example.com').hostname : 'example.com'}
                </div>
                <div className="text-white font-semibold line-clamp-2">
                  {meta.title || 'Your Page Title'}
                </div>
                <div className="text-gray-400 text-sm line-clamp-2 mt-1">
                  {meta.description || 'Your page description will appear here...'}
                </div>
              </div>
            </div>
          </div>

          {/* Twitter Preview */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🐦</span> Twitter/X
            </h3>
            <div className="bg-black rounded-2xl overflow-hidden border border-gray-800">
              <div className="h-48 bg-gray-900 flex items-center justify-center relative">
                {meta.image ? (
                  <img src={meta.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                ) : (
                  <span className="text-gray-600 text-4xl">🖼️</span>
                )}
              </div>
              <div className="p-3">
                <div className="text-white font-medium line-clamp-1">
                  {meta.title || 'Your Page Title'}
                </div>
                <div className="text-gray-500 text-sm line-clamp-2 mt-0.5">
                  {meta.description || 'Your page description will appear here...'}
                </div>
                <div className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                  <span>🔗</span>
                  {meta.url ? new URL(meta.url || 'https://example.com').hostname : 'example.com'}
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn Preview */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">💼</span> LinkedIn
            </h3>
            <div className="bg-white rounded-lg overflow-hidden border">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {meta.image ? (
                  <img src={meta.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                ) : (
                  <span className="text-gray-400 text-4xl">🖼️</span>
                )}
              </div>
              <div className="p-3">
                <div className="text-black font-semibold line-clamp-2">
                  {meta.title || 'Your Page Title'}
                </div>
                <div className="text-gray-600 text-xs mt-0.5">
                  {meta.url ? new URL(meta.url || 'https://example.com').hostname : 'example.com'}
                </div>
              </div>
            </div>
          </div>

          {/* Slack Preview */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">💬</span> Slack
            </h3>
            <div className="bg-white rounded-lg overflow-hidden border">
              <div className="flex">
                <div className="w-1 bg-gray-400"></div>
                <div className="p-3 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{meta.siteName || 'Website'}</span>
                  </div>
                  <div className="text-blue-600 font-medium hover:underline line-clamp-1">
                    {meta.title || 'Your Page Title'}
                  </div>
                  <div className="text-gray-600 text-sm line-clamp-2">
                    {meta.description || 'Your page description will appear here...'}
                  </div>
                  {meta.image && (
                    <div className="mt-2 max-w-xs">
                      <img src={meta.image} alt="" className="rounded max-h-24 object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Required Tags */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Recommended Image Sizes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-indigo-400 font-semibold">Facebook</div>
              <div className="text-gray-300">1200 × 630 px</div>
              <div className="text-gray-500 text-xs">Ratio: 1.91:1</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-indigo-400 font-semibold">Twitter</div>
              <div className="text-gray-300">1200 × 675 px</div>
              <div className="text-gray-500 text-xs">Ratio: 16:9</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-indigo-400 font-semibold">LinkedIn</div>
              <div className="text-gray-300">1200 × 627 px</div>
              <div className="text-gray-500 text-xs">Ratio: 1.91:1</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-indigo-400 font-semibold">Pinterest</div>
              <div className="text-gray-300">1000 × 1500 px</div>
              <div className="text-gray-500 text-xs">Ratio: 2:3</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

