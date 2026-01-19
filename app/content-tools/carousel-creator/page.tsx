'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface Slide {
  id: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  fontSize: 'small' | 'medium' | 'large';
  alignment: 'left' | 'center' | 'right';
}

const PRESET_THEMES = [
  { name: 'Dark', bg: '#1a1a2e', text: '#ffffff' },
  { name: 'Light', bg: '#ffffff', text: '#1a1a2e' },
  { name: 'Ocean', bg: '#0f3460', text: '#e94560' },
  { name: 'Sunset', bg: '#ff6b6b', text: '#ffffff' },
  { name: 'Forest', bg: '#2d5a27', text: '#f0f7da' },
  { name: 'Purple', bg: '#6c5ce7', text: '#ffffff' },
  { name: 'Coral', bg: '#ff7f50', text: '#1a1a2e' },
  { name: 'Mint', bg: '#00b894', text: '#ffffff' },
];

const FONT_SIZES = {
  small: 'text-lg',
  medium: 'text-2xl',
  large: 'text-4xl',
};

export default function CarouselCreatorPage() {
  const [slides, setSlides] = useState<Slide[]>([
    { id: '1', content: 'Slide 1: Your Hook\n\nGrab attention here!', backgroundColor: '#1a1a2e', textColor: '#ffffff', fontSize: 'large', alignment: 'center' },
    { id: '2', content: 'Slide 2: Main Point\n\nExplain your value', backgroundColor: '#1a1a2e', textColor: '#ffffff', fontSize: 'medium', alignment: 'center' },
    { id: '3', content: 'Slide 3: Call to Action\n\nFollow for more!', backgroundColor: '#1a1a2e', textColor: '#ffffff', fontSize: 'large', alignment: 'center' },
  ]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [format, setFormat] = useState<'square' | 'portrait'>('portrait');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentSlide = slides[activeSlide];

  const updateSlide = (updates: Partial<Slide>) => {
    setSlides(prev => prev.map((slide, i) => 
      i === activeSlide ? { ...slide, ...updates } : slide
    ));
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      content: `Slide ${slides.length + 1}`,
      backgroundColor: currentSlide.backgroundColor,
      textColor: currentSlide.textColor,
      fontSize: 'medium',
      alignment: 'center',
    };
    setSlides([...slides, newSlide]);
    setActiveSlide(slides.length);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, i) => i !== index));
    if (activeSlide >= index && activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };

  const moveSlide = (from: number, direction: 'up' | 'down') => {
    const to = direction === 'up' ? from - 1 : from + 1;
    if (to < 0 || to >= slides.length) return;
    
    const newSlides = [...slides];
    [newSlides[from], newSlides[to]] = [newSlides[to], newSlides[from]];
    setSlides(newSlides);
    setActiveSlide(to);
  };

  const applyThemeToAll = (bg: string, text: string) => {
    setSlides(prev => prev.map(slide => ({
      ...slide,
      backgroundColor: bg,
      textColor: text,
    })));
  };

  const downloadSlide = async (index: number) => {
    const slide = slides[index];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    const width = format === 'square' ? 1080 : 1080;
    const height = format === 'square' ? 1080 : 1350;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = slide.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Text
    ctx.fillStyle = slide.textColor;
    const fontSize = slide.fontSize === 'small' ? 36 : slide.fontSize === 'medium' ? 48 : 72;
    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = slide.alignment;
    ctx.textBaseline = 'middle';

    const lines = slide.content.split('\n');
    const lineHeight = fontSize * 1.4;
    const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
    const x = slide.alignment === 'left' ? 80 : slide.alignment === 'right' ? width - 80 : width / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, x, startY + i * lineHeight, width - 160);
    });

    // Slide number
    ctx.fillStyle = slide.textColor + '60';
    ctx.font = '24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${index + 1}/${slides.length}`, width - 40, height - 40);

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `carousel-slide-${index + 1}.png`;
    a.click();
  };

  const downloadAll = async () => {
    for (let i = 0; i < slides.length; i++) {
      await downloadSlide(i);
      await new Promise(r => setTimeout(r, 300));
    }
  };

  const dimensions = format === 'square' ? { w: 300, h: 300 } : { w: 300, h: 375 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-fuchsia-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-fuchsia-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-fuchsia-500/20 rounded-full text-fuchsia-300 text-sm mb-4">
            <span className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Carousel Creator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Create multi-slide carousels for Instagram and TikTok.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Slide List */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Slides ({slides.length})</h2>
              <button
                onClick={addSlide}
                className="text-sm px-3 py-1 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg"
              >
                + Add
              </button>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  onClick={() => setActiveSlide(index)}
                  className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${
                    activeSlide === index
                      ? 'bg-fuchsia-600/30 border border-fuchsia-500/50'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div
                    className="w-10 h-12 rounded flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: slide.backgroundColor, color: slide.textColor }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{slide.content.split('\n')[0]}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); moveSlide(index, 'up'); }}
                      className="text-xs text-gray-400 hover:text-white"
                      disabled={index === 0}
                    >↑</button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); moveSlide(index, 'down'); }}
                      className="text-xs text-gray-400 hover:text-white"
                      disabled={index === slides.length - 1}
                    >↓</button>
                  </div>
                  {slides.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSlide(index); }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >×</button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <label className="block text-sm text-gray-400 mb-2">Format</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFormat('square')}
                  className={`flex-1 py-2 rounded-lg text-sm ${format === 'square' ? 'bg-fuchsia-600 text-white' : 'bg-white/10 text-gray-300'}`}
                >
                  Square (1:1)
                </button>
                <button
                  onClick={() => setFormat('portrait')}
                  className={`flex-1 py-2 rounded-lg text-sm ${format === 'portrait' ? 'bg-fuchsia-600 text-white' : 'bg-white/10 text-gray-300'}`}
                >
                  Portrait (4:5)
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <h2 className="font-semibold text-white mb-4 text-center">Preview</h2>
            
            <div className="flex justify-center">
              <div
                className="rounded-xl overflow-hidden flex items-center justify-center p-8"
                style={{
                  width: dimensions.w,
                  height: dimensions.h,
                  backgroundColor: currentSlide.backgroundColor,
                }}
              >
                <p
                  className={`whitespace-pre-wrap ${FONT_SIZES[currentSlide.fontSize]} font-bold leading-tight`}
                  style={{
                    color: currentSlide.textColor,
                    textAlign: currentSlide.alignment,
                  }}
                >
                  {currentSlide.content}
                </p>
              </div>
            </div>

            {/* Slide Navigation */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                disabled={activeSlide === 0}
                className="p-2 bg-white/10 rounded-lg disabled:opacity-50"
              >
                ←
              </button>
              <div className="flex gap-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`w-2 h-2 rounded-full ${activeSlide === i ? 'bg-fuchsia-400' : 'bg-white/30'}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}
                disabled={activeSlide === slides.length - 1}
                className="p-2 bg-white/10 rounded-lg disabled:opacity-50"
              >
                →
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => downloadSlide(activeSlide)}
                className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
              >
                Download This
              </button>
              <button
                onClick={downloadAll}
                className="flex-1 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg text-sm"
              >
                Download All
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
            <h2 className="font-semibold text-white mb-4">Edit Slide {activeSlide + 1}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Content</label>
                <textarea
                  value={currentSlide.content}
                  onChange={(e) => updateSlide({ content: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm resize-none"
                  placeholder="Enter slide content..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Theme Presets</label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_THEMES.map(theme => (
                    <button
                      key={theme.name}
                      onClick={() => updateSlide({ backgroundColor: theme.bg, textColor: theme.text })}
                      className="h-8 rounded text-xs font-medium"
                      style={{ backgroundColor: theme.bg, color: theme.text }}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => applyThemeToAll(currentSlide.backgroundColor, currentSlide.textColor)}
                  className="w-full mt-2 py-1 text-xs text-fuchsia-400 hover:text-fuchsia-300"
                >
                  Apply to all slides
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Background</label>
                  <input
                    type="color"
                    value={currentSlide.backgroundColor}
                    onChange={(e) => updateSlide({ backgroundColor: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Text Color</label>
                  <input
                    type="color"
                    value={currentSlide.textColor}
                    onChange={(e) => updateSlide({ textColor: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Font Size</label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => updateSlide({ fontSize: size })}
                      className={`flex-1 py-2 rounded-lg text-sm capitalize ${
                        currentSlide.fontSize === size ? 'bg-fuchsia-600 text-white' : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Alignment</label>
                <div className="flex gap-2">
                  {(['left', 'center', 'right'] as const).map(align => (
                    <button
                      key={align}
                      onClick={() => updateSlide({ alignment: align })}
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        currentSlide.alignment === align ? 'bg-fuchsia-600 text-white' : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {align === 'left' ? '⬅' : align === 'right' ? '➡' : '⬌'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </main>

      <Footer />
    </div>
  );
}

