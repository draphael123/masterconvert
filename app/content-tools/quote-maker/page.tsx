'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const BACKGROUNDS = [
  { name: 'Sunset', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Ocean', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Forest', gradient: 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)' },
  { name: 'Night', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Fire', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { name: 'Midnight', gradient: 'linear-gradient(135deg, #0c0c0c 0%, #2c2c2c 100%)' },
  { name: 'Sky', gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { name: 'Warm', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
];

const FONTS = [
  'Georgia, serif',
  'Palatino Linotype, serif',
  'Times New Roman, serif',
  'Arial, sans-serif',
  'Verdana, sans-serif',
  'Impact, sans-serif',
  'Comic Sans MS, cursive',
  'Courier New, monospace',
];

export default function QuoteMakerPage() {
  const [quote, setQuote] = useState('"The only way to do great work is to love what you do."');
  const [author, setAuthor] = useState('Steve Jobs');
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[3]);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState('#ffffff');
  const [showAuthor, setShowAuthor] = useState(true);
  const [format, setFormat] = useState<'square' | 'story' | 'wide'>('square');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dimensions = {
    square: { width: 1080, height: 1080 },
    story: { width: 1080, height: 1920 },
    wide: { width: 1200, height: 630 },
  };

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = dimensions[format];
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d')!;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const colors = selectedBg.gradient.match(/#[a-fA-F0-9]{6}/g) || ['#667eea', '#764ba2'];
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1] || colors[0]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Setup text
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw quote
    const scaledFontSize = fontSize * (width / 1080);
    ctx.font = `${scaledFontSize}px ${selectedFont}`;

    // Word wrap
    const maxWidth = width * 0.8;
    const words = quote.split(' ');
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

    // Calculate vertical position
    const lineHeight = scaledFontSize * 1.4;
    const totalTextHeight = lines.length * lineHeight + (showAuthor ? lineHeight : 0);
    let y = (height - totalTextHeight) / 2 + lineHeight / 2;

    // Draw each line
    lines.forEach(line => {
      ctx.fillText(line, width / 2, y);
      y += lineHeight;
    });

    // Draw author
    if (showAuthor && author) {
      ctx.font = `${scaledFontSize * 0.6}px ${selectedFont}`;
      ctx.fillStyle = textColor + 'cc';
      ctx.fillText(`— ${author}`, width / 2, y + lineHeight * 0.5);
    }
  };

  const downloadImage = () => {
    generateImage();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `quote-${format}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    generateImage();
  }, [quote, author, selectedBg, selectedFont, fontSize, textColor, showAuthor, format]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-rose-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 rounded-full text-rose-300 text-sm mb-6">
            <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
            Visual Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Quote Image Maker
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create beautiful shareable quote images for social media.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Quote</h2>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Enter your quote..."
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              />
              <div className="mt-3 flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAuthor}
                    onChange={(e) => setShowAuthor(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-rose-600"
                  />
                  <span className="text-sm text-gray-300">Show author</span>
                </label>
              </div>
              {showAuthor && (
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  className="mt-3 w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Style</h2>
              
              {/* Format */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Format</label>
                <div className="flex gap-2">
                  {(['square', 'story', 'wide'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                        format === f ? 'bg-rose-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Backgrounds */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Background</label>
                <div className="grid grid-cols-4 gap-2">
                  {BACKGROUNDS.map(bg => (
                    <button
                      key={bg.name}
                      onClick={() => setSelectedBg(bg)}
                      className={`h-12 rounded-lg transition-all ${
                        selectedBg.name === bg.name ? 'ring-2 ring-white scale-105' : ''
                      }`}
                      style={{ background: bg.gradient }}
                      title={bg.name}
                    />
                  ))}
                </div>
              </div>

              {/* Font */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Font</label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  style={{ fontFamily: selectedFont }}
                >
                  {FONTS.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }} className="bg-slate-800">
                      {font.split(',')[0]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400">Font Size</label>
                  <span className="text-sm text-rose-400">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Text Color</label>
                <div className="flex gap-2">
                  {['#ffffff', '#000000', '#f5f5f5', '#1a1a1a', '#ffd700'].map(color => (
                    <button
                      key={color}
                      onClick={() => setTextColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        textColor === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={downloadImage}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold text-lg transition-colors"
            >
              Download Image
            </button>
          </div>

          {/* Preview */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
            <div className="flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[500px] rounded-xl shadow-2xl"
                style={{ aspectRatio: `${dimensions[format].width}/${dimensions[format].height}` }}
              />
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
              {dimensions[format].width} × {dimensions[format].height} px
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

