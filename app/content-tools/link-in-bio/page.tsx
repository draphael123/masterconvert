'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface BioLink {
  id: string;
  title: string;
  url: string;
  icon: string;
}

const THEMES = {
  minimal: { name: 'Minimal', bg: '#ffffff', text: '#1a1a2e', accent: '#6366f1', buttonBg: '#f3f4f6' },
  dark: { name: 'Dark', bg: '#0f0f0f', text: '#ffffff', accent: '#a855f7', buttonBg: '#1f1f1f' },
  gradient: { name: 'Gradient', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff', accent: '#fbbf24', buttonBg: 'rgba(255,255,255,0.2)' },
  neon: { name: 'Neon', bg: '#0a0a0a', text: '#00ff88', accent: '#00ff88', buttonBg: 'transparent' },
  pastel: { name: 'Pastel', bg: '#fdf2f8', text: '#831843', accent: '#ec4899', buttonBg: '#fce7f3' },
  ocean: { name: 'Ocean', bg: '#0c4a6e', text: '#ffffff', accent: '#38bdf8', buttonBg: 'rgba(255,255,255,0.1)' },
};

const ICONS = ['🔗', '🌐', '📧', '🛒', '📱', '💼', '🎵', '📺', '📸', '🐦', '💬', '📝', '🎨', '🎬', '☕', '❤️'];

export default function LinkInBioPage() {
  const [name, setName] = useState('Your Name');
  const [bio, setBio] = useState('Creator • Designer • Coffee lover ☕');
  const [avatar, setAvatar] = useState('');
  const [theme, setTheme] = useState<keyof typeof THEMES>('dark');
  const [links, setLinks] = useState<BioLink[]>([
    { id: '1', title: 'My Website', url: 'https://example.com', icon: '🌐' },
    { id: '2', title: 'Latest Project', url: 'https://example.com/project', icon: '🚀' },
    { id: '3', title: 'Follow on Twitter', url: 'https://twitter.com', icon: '🐦' },
  ]);

  const currentTheme = THEMES[theme];

  const addLink = () => {
    setLinks([...links, {
      id: Date.now().toString(),
      title: 'New Link',
      url: 'https://',
      icon: '🔗',
    }]);
  };

  const updateLink = (id: string, updates: Partial<BioLink>) => {
    setLinks(links.map(link => link.id === id ? { ...link, ...updates } : link));
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= links.length) return;
    const newLinks = [...links];
    [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
    setLinks(newLinks);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateHTML = () => {
    const css = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        padding: 2rem;
        background: ${currentTheme.bg};
        color: ${currentTheme.text};
      }
      .container { max-width: 400px; width: 100%; text-align: center; }
      .avatar { width: 96px; height: 96px; border-radius: 50%; margin: 0 auto 1rem; object-fit: cover; }
      .avatar-placeholder { width: 96px; height: 96px; border-radius: 50%; margin: 0 auto 1rem; background: ${currentTheme.accent}; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
      h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
      .bio { opacity: 0.8; margin-bottom: 2rem; }
      .links { display: flex; flex-direction: column; gap: 0.75rem; }
      .link { 
        display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        padding: 1rem 1.5rem; border-radius: 0.75rem; text-decoration: none;
        background: ${currentTheme.buttonBg}; color: ${currentTheme.text};
        border: ${theme === 'neon' ? `2px solid ${currentTheme.accent}` : 'none'};
        transition: transform 0.2s, opacity 0.2s;
      }
      .link:hover { transform: scale(1.02); opacity: 0.9; }
    `;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Links</title>
  <style>${css}</style>
</head>
<body>
  <div class="container">
    ${avatar 
      ? `<img src="${avatar}" alt="${name}" class="avatar" />`
      : `<div class="avatar-placeholder">${name.charAt(0)}</div>`
    }
    <h1>${name}</h1>
    <p class="bio">${bio}</p>
    <div class="links">
      ${links.map(link => `
      <a href="${link.url}" class="link" target="_blank" rel="noopener">
        <span>${link.icon}</span>
        <span>${link.title}</span>
      </a>`).join('')}
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'link-in-bio.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-violet-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 rounded-full text-violet-300 text-sm mb-6">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Link in Bio Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create a beautiful link-in-bio page for your social profiles.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Profile</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {avatar ? (
                      <img src={avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-2xl text-white">
                        {name.charAt(0)}
                      </div>
                    )}
                    <label className="absolute inset-0 cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white mb-2"
                      placeholder="Your Name"
                    />
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                      placeholder="Short bio..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Theme</h2>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(THEMES).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key as keyof typeof THEMES)}
                    className={`p-3 rounded-xl text-sm transition-all ${
                      theme === key ? 'ring-2 ring-violet-400' : ''
                    }`}
                    style={{ 
                      background: t.bg,
                      color: t.text,
                    }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Links</h2>
                <button
                  onClick={addLink}
                  className="text-sm px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg"
                >
                  + Add Link
                </button>
              </div>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {links.map((link, index) => (
                  <div key={link.id} className="p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <select
                        value={link.icon}
                        onChange={(e) => updateLink(link.id, { icon: e.target.value })}
                        className="w-12 bg-white/10 border border-white/10 rounded text-center"
                      >
                        {ICONS.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => updateLink(link.id, { title: e.target.value })}
                        className="flex-1 px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                        placeholder="Link title"
                      />
                      <div className="flex gap-1">
                        <button onClick={() => moveLink(index, 'up')} className="text-gray-400 hover:text-white">↑</button>
                        <button onClick={() => moveLink(index, 'down')} className="text-gray-400 hover:text-white">↓</button>
                        <button onClick={() => removeLink(link.id)} className="text-red-400 hover:text-red-300">×</button>
                      </div>
                    </div>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, { url: e.target.value })}
                      className="w-full px-3 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                      placeholder="https://..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
            
            <div 
              className="rounded-2xl p-8 min-h-[500px]"
              style={{ background: currentTheme.bg }}
            >
              <div className="max-w-sm mx-auto text-center">
                {avatar ? (
                  <img src={avatar} alt="" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                ) : (
                  <div 
                    className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
                    style={{ backgroundColor: currentTheme.accent, color: currentTheme.bg }}
                  >
                    {name.charAt(0)}
                  </div>
                )}
                
                <h1 
                  className="text-xl font-bold mb-1"
                  style={{ color: currentTheme.text }}
                >
                  {name}
                </h1>
                <p 
                  className="mb-6 opacity-80"
                  style={{ color: currentTheme.text }}
                >
                  {bio}
                </p>

                <div className="space-y-3">
                  {links.map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-transform hover:scale-[1.02]"
                      style={{ 
                        backgroundColor: currentTheme.buttonBg,
                        color: currentTheme.text,
                        border: theme === 'neon' ? `2px solid ${currentTheme.accent}` : 'none',
                      }}
                    >
                      <span>{link.icon}</span>
                      <span>{link.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={generateHTML}
              className="w-full mt-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold"
            >
              📥 Download as HTML
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

