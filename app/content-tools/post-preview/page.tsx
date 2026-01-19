'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function PostPreviewPage() {
  const [content, setContent] = useState('Just launched something big! 🚀\n\nAfter months of work, I\'m excited to share...\n\n#launch #startup #excited');
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState('yourhandle');
  const [displayName, setDisplayName] = useState('Your Name');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const formatContent = (text: string) => {
    return text.split(/(\s+)/).map((word, i) => {
      if (word.startsWith('#')) {
        return <span key={i} className="text-blue-400">{word}</span>;
      }
      if (word.startsWith('@')) {
        return <span key={i} className="text-blue-400">{word}</span>;
      }
      if (word.startsWith('http')) {
        return <span key={i} className="text-blue-400">{word}</span>;
      }
      return word;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-blue-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Post Preview Simulator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See exactly how your posts will look on each platform before publishing.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Your Content</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Post Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm resize-none"
                />
                <div className="text-xs text-gray-500 mt-1">{content.length} characters</div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
                />
                {image && (
                  <button
                    onClick={() => setImage(null)}
                    className="text-xs text-red-400 mt-2"
                  >
                    Remove image
                  </button>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">Dark mode previews</span>
              </label>
            </div>
          </div>

          {/* Previews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Twitter/X Preview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🐦</span>
                <h3 className="font-semibold text-white">Twitter/X</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${content.length > 280 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                  {content.length}/280
                </span>
              </div>
              <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {displayName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{displayName}</span>
                      <span className="text-gray-500">@{username} · now</span>
                    </div>
                    <p className={`mt-1 whitespace-pre-wrap ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {formatContent(content)}
                    </p>
                    {image && (
                      <img src={image} alt="" className="mt-3 rounded-xl max-h-64 object-cover" />
                    )}
                    <div className="flex justify-between mt-3 text-gray-500 max-w-xs">
                      <span>💬 0</span>
                      <span>🔁 0</span>
                      <span>❤️ 0</span>
                      <span>📊 0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram Preview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📷</span>
                <h3 className="font-semibold text-white">Instagram</h3>
              </div>
              <div className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
                <div className="flex items-center gap-3 p-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                    {displayName.charAt(0)}
                  </div>
                  <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>{username}</span>
                </div>
                {image ? (
                  <img src={image} alt="" className="w-full aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <span className="text-4xl">📷</span>
                  </div>
                )}
                <div className="p-3">
                  <div className="flex gap-4 mb-2">
                    <span>❤️</span>
                    <span>💬</span>
                    <span>📤</span>
                    <span className="ml-auto">🔖</span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    <span className="font-semibold">{username}</span>{' '}
                    {content.length > 125 ? (
                      <>
                        {formatContent(content.slice(0, 125))}
                        <span className="text-gray-500">... more</span>
                      </>
                    ) : (
                      formatContent(content)
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* LinkedIn Preview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💼</span>
                <h3 className="font-semibold text-white">LinkedIn</h3>
              </div>
              <div className={`rounded-xl p-4 ${isDarkMode ? 'bg-[#1b1f23]' : 'bg-white'}`}>
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold">
                    {displayName.charAt(0)}
                  </div>
                  <div>
                    <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{displayName}</div>
                    <div className="text-gray-500 text-sm">Your headline here</div>
                    <div className="text-gray-500 text-xs">Just now · 🌐</div>
                  </div>
                </div>
                <div className={`mt-3 whitespace-pre-wrap ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {content.length > 210 ? (
                    <>
                      {formatContent(content.slice(0, 210))}
                      <span className="text-blue-500 cursor-pointer">...see more</span>
                    </>
                  ) : (
                    formatContent(content)
                  )}
                </div>
                {image && (
                  <img src={image} alt="" className="mt-3 rounded-lg w-full max-h-80 object-cover" />
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700 text-gray-500 text-sm">
                  <span>👍 Like</span>
                  <span>💬 Comment</span>
                  <span>🔁 Repost</span>
                  <span>📤 Send</span>
                </div>
              </div>
            </div>

            {/* TikTok Preview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎵</span>
                <h3 className="font-semibold text-white">TikTok Caption</h3>
              </div>
              <div className="bg-black rounded-xl p-4 relative overflow-hidden">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-white font-semibold">@{username}</span>
                    </div>
                    <p className="text-white text-sm">
                      {content.length > 150 ? (
                        <>
                          {formatContent(content.slice(0, 150))}
                          <span className="text-gray-400">... more</span>
                        </>
                      ) : (
                        formatContent(content)
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-white text-sm">
                      <span>🎵</span>
                      <span className="text-gray-400">Original sound - {username}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4 text-white">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center font-bold">
                      {displayName.charAt(0)}
                    </div>
                    <div className="text-center">
                      <div>❤️</div>
                      <div className="text-xs">0</div>
                    </div>
                    <div className="text-center">
                      <div>💬</div>
                      <div className="text-xs">0</div>
                    </div>
                    <div className="text-center">
                      <div>🔖</div>
                      <div className="text-xs">0</div>
                    </div>
                    <div className="text-center">
                      <div>↗️</div>
                      <div className="text-xs">0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

