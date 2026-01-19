'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const PLATFORMS = [
  { 
    id: 'twitter',
    name: 'Twitter/X', 
    icon: '🐦', 
    limits: [
      { name: 'Tweet', limit: 280 },
      { name: 'Bio', limit: 160 },
      { name: 'Name', limit: 50 },
      { name: 'Username', limit: 15 },
    ]
  },
  { 
    id: 'instagram',
    name: 'Instagram', 
    icon: '📷', 
    limits: [
      { name: 'Caption', limit: 2200 },
      { name: 'Bio', limit: 150 },
      { name: 'Username', limit: 30 },
      { name: 'Hashtags', limit: 30, note: 'max count' },
    ]
  },
  { 
    id: 'tiktok',
    name: 'TikTok', 
    icon: '🎵', 
    limits: [
      { name: 'Caption', limit: 2200 },
      { name: 'Bio', limit: 80 },
      { name: 'Username', limit: 24 },
    ]
  },
  { 
    id: 'linkedin',
    name: 'LinkedIn', 
    icon: '💼', 
    limits: [
      { name: 'Post', limit: 3000 },
      { name: 'Article', limit: 125000 },
      { name: 'Headline', limit: 220 },
      { name: 'About', limit: 2600 },
      { name: 'Company Update', limit: 700 },
    ]
  },
  { 
    id: 'youtube',
    name: 'YouTube', 
    icon: '▶️', 
    limits: [
      { name: 'Title', limit: 100 },
      { name: 'Description', limit: 5000 },
      { name: 'Comment', limit: 10000 },
      { name: 'Playlist Title', limit: 150 },
    ]
  },
  { 
    id: 'facebook',
    name: 'Facebook', 
    icon: '📘', 
    limits: [
      { name: 'Post', limit: 63206 },
      { name: 'Comment', limit: 8000 },
      { name: 'Bio', limit: 101 },
      { name: 'Page Description', limit: 255 },
    ]
  },
  { 
    id: 'pinterest',
    name: 'Pinterest', 
    icon: '📌', 
    limits: [
      { name: 'Pin Title', limit: 100 },
      { name: 'Pin Description', limit: 500 },
      { name: 'Board Name', limit: 50 },
      { name: 'Bio', limit: 160 },
    ]
  },
  { 
    id: 'threads',
    name: 'Threads', 
    icon: '🧵', 
    limits: [
      { name: 'Post', limit: 500 },
      { name: 'Bio', limit: 150 },
    ]
  },
];

export default function CharacterCounterPage() {
  const [text, setText] = useState('');
  const [showAll, setShowAll] = useState(true);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text ? text.split('\n').length : 0;
  const hashtagCount = (text.match(/#\w+/g) || []).length;
  const mentionCount = (text.match(/@\w+/g) || []).length;
  const emojiCount = (text.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;

  const getStatus = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 100) return { color: 'text-red-400 bg-red-500/20', status: '❌ Over' };
    if (percentage >= 90) return { color: 'text-amber-400 bg-amber-500/20', status: '⚠️ Close' };
    if (percentage >= 70) return { color: 'text-yellow-400 bg-yellow-500/20', status: '📝 Good' };
    return { color: 'text-green-400 bg-green-500/20', status: '✅ OK' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
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

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-300 text-sm mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Character Counter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Check your content against all social media platform limits in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paste your content
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your social media content here..."
                rows={12}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400">{charCount}</div>
                <div className="text-xs text-gray-400">Characters</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400">{wordCount}</div>
                <div className="text-xs text-gray-400">Words</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400">{lineCount}</div>
                <div className="text-xs text-gray-400">Lines</div>
              </div>
            </div>

            {/* Extra Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">#</span>
                  <span className="text-white">{hashtagCount} hashtags</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">@</span>
                  <span className="text-white">{mentionCount} mentions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">😀</span>
                  <span className="text-white">{emojiCount} emojis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">⏱️</span>
                  <span className="text-white">~{Math.ceil(wordCount / 200)} min read</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Limits */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Platform Limits</h2>
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                {showAll ? 'Show Relevant Only' : 'Show All'}
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {PLATFORMS.map(platform => {
                const relevantLimits = showAll 
                  ? platform.limits 
                  : platform.limits.filter(l => charCount > 0 && charCount <= l.limit * 1.5);
                
                if (!showAll && relevantLimits.length === 0 && charCount > 0) return null;

                return (
                  <div key={platform.id} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{platform.icon}</span>
                      <h3 className="font-semibold text-white">{platform.name}</h3>
                    </div>
                    <div className="space-y-2">
                      {platform.limits.map(item => {
                        const { color, status } = getStatus(charCount, item.limit);
                        const percentage = Math.min((charCount / item.limit) * 100, 100);
                        
                        return (
                          <div key={item.name} className="flex items-center gap-3">
                            <div className="w-24 text-sm text-gray-400">{item.name}</div>
                            <div className="flex-1">
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all ${
                                    percentage >= 100 ? 'bg-red-500' : 
                                    percentage >= 90 ? 'bg-amber-500' : 
                                    percentage >= 70 ? 'bg-yellow-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                            <div className="w-24 text-right">
                              <span className={`text-sm ${charCount > item.limit ? 'text-red-400' : 'text-gray-400'}`}>
                                {charCount}/{item.limit}
                              </span>
                            </div>
                            <div className={`w-16 text-xs px-2 py-0.5 rounded text-center ${color}`}>
                              {status.split(' ')[0]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-4">📋 Quick Reference: Optimal Lengths</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
            <div className="p-3 bg-white/5 rounded-lg text-center">
              <div className="text-emerald-400 font-bold">280</div>
              <div className="text-gray-400">Twitter Tweet</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg text-center">
              <div className="text-emerald-400 font-bold">125</div>
              <div className="text-gray-400">IG Caption Preview</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg text-center">
              <div className="text-emerald-400 font-bold">150</div>
              <div className="text-gray-400">IG/Threads Bio</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg text-center">
              <div className="text-emerald-400 font-bold">80</div>
              <div className="text-gray-400">TikTok Bio</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg text-center">
              <div className="text-emerald-400 font-bold">60</div>
              <div className="text-gray-400">YouTube Title (Optimal)</div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg text-center">
              <div className="text-emerald-400 font-bold">1300</div>
              <div className="text-gray-400">LinkedIn (Optimal)</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

