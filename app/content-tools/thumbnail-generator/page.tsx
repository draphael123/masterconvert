'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const TEMPLATES = [
  { name: 'Bold Text', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', textColor: '#fff' },
  { name: 'Fire', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', textColor: '#fff' },
  { name: 'Ocean', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', textColor: '#000' },
  { name: 'Dark', bg: 'linear-gradient(135deg, #0c0c0c 0%, #2c2c2c 100%)', textColor: '#fff' },
  { name: 'Sunset', bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', textColor: '#000' },
  { name: 'Forest', bg: 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)', textColor: '#fff' },
];

export default function ThumbnailGeneratorPage() {
  const [title, setTitle] = useState('YOUR VIDEO TITLE HERE');
  const [subtitle, setSubtitle] = useState('Click to watch now!');
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [fontSize, setFontSize] = useState(72);
  const [showSubtitle, setShowSubtitle] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    canvas.width = 1280;
    canvas.height = 720;

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const colors = selectedTemplate.bg.match(/#[a-fA-F0-9]{6}/g) || ['#667eea', '#764ba2'];
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1] || colors[0]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add overlay effect
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = selectedTemplate.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw title with text wrapping
    ctx.font = `bold ${fontSize}px Arial`;
    const maxWidth = canvas.width * 0.85;
    const words = title.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight + (showSubtitle ? 50 : 0);
    let y = (canvas.height - totalHeight) / 2 + lineHeight / 2;

    // Draw shadow
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;

    lines.forEach(line => {
      ctx.fillText(line, canvas.width / 2, y);
      y += lineHeight;
    });

    // Draw subtitle
    if (showSubtitle && subtitle) {
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = selectedTemplate.textColor + 'cc';
      ctx.fillText(subtitle, canvas.width / 2, y + 30);
    }

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  useEffect(() => {
    renderThumbnail();
  }, [title, subtitle, selectedTemplate, fontSize, showSubtitle]);

  const downloadThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'youtube-thumbnail.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-red-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full text-red-300 text-sm mb-6">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
            Visual Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Thumbnail Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create eye-catching YouTube thumbnails in seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Text</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white uppercase"
                    placeholder="YOUR TITLE"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-gray-400">Subtitle</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showSubtitle}
                        onChange={(e) => setShowSubtitle(e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-xs text-gray-400">Show</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    disabled={!showSubtitle}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50"
                    placeholder="Subtitle"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Font Size</span>
                    <span className="text-red-400">{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="48"
                    max="96"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Template</h2>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map(template => (
                  <button
                    key={template.name}
                    onClick={() => setSelectedTemplate(template)}
                    className={`h-16 rounded-lg transition-all ${
                      selectedTemplate.name === template.name ? 'ring-2 ring-white scale-105' : ''
                    }`}
                    style={{ background: template.bg }}
                    title={template.name}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={downloadThumbnail}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold text-lg transition-colors"
            >
              Download Thumbnail
            </button>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
            <div className="flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full rounded-xl shadow-2xl"
                style={{ aspectRatio: '16/9' }}
              />
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
              1280 × 720 px (YouTube recommended)
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Thumbnail Best Practices</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-red-400">✓</span>
              <p>Use large, bold text that&apos;s readable at small sizes</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400">✓</span>
              <p>High contrast colors grab attention</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400">✓</span>
              <p>Keep text to 3-5 words maximum</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

