'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import Footer from '@/components/Footer';

const GRADIENTS = [
  { name: 'Purple Dream', colors: ['#667eea', '#764ba2'] },
  { name: 'Ocean Blue', colors: ['#4facfe', '#00f2fe'] },
  { name: 'Sunset', colors: ['#fa709a', '#fee140'] },
  { name: 'Forest', colors: ['#38ef7d', '#11998e'] },
  { name: 'Pink', colors: ['#f093fb', '#f5576c'] },
  { name: 'Dark', colors: ['#434343', '#000000'] },
  { name: 'Light', colors: ['#e0e0e0', '#f5f5f5'] },
  { name: 'Peach', colors: ['#ffecd2', '#fcb69f'] },
];

const SOLID_COLORS = [
  '#1e1e1e', '#2d2d2d', '#ffffff', '#f5f5f5',
  '#3b82f6', '#8b5cf6', '#ec4899', '#10b981',
];

export default function ScreenshotBeautifierPage() {
  const [image, setImage] = useState<string | null>(null);
  const [background, setBackground] = useState<{ type: 'gradient' | 'solid'; value: string[] | string }>({ 
    type: 'gradient', 
    value: GRADIENTS[0].colors 
  });
  const [padding, setPadding] = useState(60);
  const [borderRadius, setBorderRadius] = useState(16);
  const [shadow, setShadow] = useState(true);
  const [shadowIntensity, setShadowIntensity] = useState(50);
  const [scale, setScale] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => setImageEl(img);
        img.src = e.target?.result as string;
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: false,
  });

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageEl) return;

    const ctx = canvas.getContext('2d')!;
    
    // Calculate dimensions
    const scaledWidth = imageEl.width * (scale / 100);
    const scaledHeight = imageEl.height * (scale / 100);
    const canvasWidth = scaledWidth + padding * 2;
    const canvasHeight = scaledHeight + padding * 2;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Draw background
    if (background.type === 'gradient') {
      const colors = background.value as string[];
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = background.value as string;
    }
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw shadow
    if (shadow) {
      ctx.shadowColor = `rgba(0, 0, 0, ${shadowIntensity / 100})`;
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;
    }

    // Draw rounded rect for clipping
    ctx.beginPath();
    ctx.roundRect(padding, padding, scaledWidth, scaledHeight, borderRadius);
    ctx.closePath();

    // Fill with white (for shadow to show on)
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Reset shadow for image
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Clip and draw image
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(padding, padding, scaledWidth, scaledHeight, borderRadius);
    ctx.clip();
    ctx.drawImage(imageEl, padding, padding, scaledWidth, scaledHeight);
    ctx.restore();
  }, [imageEl, background, padding, borderRadius, shadow, shadowIntensity, scale]);

  useEffect(() => {
    if (imageEl) {
      renderCanvas();
    }
  }, [imageEl, background, padding, borderRadius, shadow, shadowIntensity, scale, renderCanvas]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'beautified-screenshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
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
            Visual Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Screenshot Beautifier
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Add beautiful backgrounds, shadows, and rounded corners to your screenshots.
          </p>
        </div>

        {!image ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-violet-400 bg-violet-500/10'
                  : 'border-white/20 hover:border-violet-400/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-6xl mb-4">📸</div>
              <p className="text-xl text-white mb-2">Drop your screenshot here</p>
              <p className="text-gray-400">PNG, JPG, or WebP</p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                <h3 className="font-semibold text-white mb-3">Background</h3>
                
                <p className="text-xs text-gray-400 mb-2">Gradients</p>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {GRADIENTS.map(g => (
                    <button
                      key={g.name}
                      onClick={() => setBackground({ type: 'gradient', value: g.colors })}
                      className={`h-8 rounded-lg transition-all ${
                        background.type === 'gradient' && 
                        JSON.stringify(background.value) === JSON.stringify(g.colors)
                          ? 'ring-2 ring-white scale-105' : ''
                      }`}
                      style={{ background: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})` }}
                      title={g.name}
                    />
                  ))}
                </div>

                <p className="text-xs text-gray-400 mb-2">Solid Colors</p>
                <div className="grid grid-cols-4 gap-2">
                  {SOLID_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setBackground({ type: 'solid', value: color })}
                      className={`h-8 rounded-lg transition-all border border-white/10 ${
                        background.type === 'solid' && background.value === color
                          ? 'ring-2 ring-white scale-105' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
                <h3 className="font-semibold text-white mb-3">Styling</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Padding</span>
                      <span className="text-violet-400">{padding}px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      value={padding}
                      onChange={(e) => setPadding(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Border Radius</span>
                      <span className="text-violet-400">{borderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={borderRadius}
                      onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Scale</span>
                      <span className="text-violet-400">{scale}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={scale}
                      onChange={(e) => setScale(parseInt(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shadow}
                        onChange={(e) => setShadow(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-600"
                      />
                      <span className="text-sm text-gray-300">Shadow</span>
                    </label>
                    {shadow && (
                      <input
                        type="range"
                        min="20"
                        max="80"
                        value={shadowIntensity}
                        onChange={(e) => setShadowIntensity(parseInt(e.target.value))}
                        className="w-24 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                      />
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setImage(null); setImageEl(null); }}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                Change Image
              </button>

              <button
                onClick={downloadImage}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-colors"
              >
                Download Image
              </button>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="font-semibold text-white mb-4">Preview</h3>
              <div className="flex items-center justify-center overflow-auto max-h-[600px]">
                <canvas
                  ref={canvasRef}
                  className="max-w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

