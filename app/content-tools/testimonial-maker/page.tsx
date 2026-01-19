'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface TestimonialData {
  quote: string;
  author: string;
  title: string;
  company: string;
  rating: number;
  avatar: string;
}

const TEMPLATES = {
  minimal: { name: 'Minimal', bg: '#ffffff', text: '#1a1a2e', accent: '#6366f1' },
  dark: { name: 'Dark', bg: '#1a1a2e', text: '#ffffff', accent: '#818cf8' },
  gradient: { name: 'Gradient', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff', accent: '#fbbf24' },
  warm: { name: 'Warm', bg: '#fef3c7', text: '#78350f', accent: '#f59e0b' },
  ocean: { name: 'Ocean', bg: '#0c4a6e', text: '#ffffff', accent: '#38bdf8' },
  forest: { name: 'Forest', bg: '#14532d', text: '#ffffff', accent: '#4ade80' },
  coral: { name: 'Coral', bg: '#fff1f2', text: '#9f1239', accent: '#fb7185' },
  slate: { name: 'Slate', bg: '#1e293b', text: '#f1f5f9', accent: '#94a3b8' },
};

const LAYOUTS = ['card', 'quote', 'modern', 'simple'] as const;

export default function TestimonialMakerPage() {
  const [testimonial, setTestimonial] = useState<TestimonialData>({
    quote: 'This product completely transformed how we work. Our team productivity increased by 40% in just two weeks!',
    author: 'Sarah Johnson',
    title: 'Marketing Director',
    company: 'TechCorp Inc.',
    rating: 5,
    avatar: '',
  });
  const [template, setTemplate] = useState<keyof typeof TEMPLATES>('minimal');
  const [layout, setLayout] = useState<typeof LAYOUTS[number]>('card');
  const [showRating, setShowRating] = useState(true);
  const [showAvatar, setShowAvatar] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentTemplate = TEMPLATES[template];

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTestimonial(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = 1080;
    canvas.height = 1080;

    // Background
    if (currentTemplate.bg.includes('gradient')) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = currentTemplate.bg;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Quote marks
    ctx.fillStyle = currentTemplate.accent + '30';
    ctx.font = 'bold 200px Georgia, serif';
    ctx.fillText('"', 60, 200);

    // Quote text
    ctx.fillStyle = currentTemplate.text;
    ctx.font = 'bold 42px -apple-system, BlinkMacSystemFont, sans-serif';
    
    const words = testimonial.quote.split(' ');
    let lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width < 900) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);

    lines.forEach((line, i) => {
      ctx.fillText(line, 80, 320 + i * 60);
    });

    // Rating
    if (showRating) {
      ctx.font = '40px sans-serif';
      ctx.fillText('★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating), 80, 280);
    }

    // Author info
    const authorY = 320 + lines.length * 60 + 80;
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(testimonial.author, 80, authorY);
    
    ctx.font = '24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = currentTemplate.text + '99';
    ctx.fillText(`${testimonial.title}${testimonial.company ? ` at ${testimonial.company}` : ''}`, 80, authorY + 40);

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testimonial-card.png';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-amber-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-amber-300 text-sm mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Testimonial Card Maker
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Turn customer reviews into beautiful shareable graphics.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Testimonial Content</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Quote</label>
                  <textarea
                    value={testimonial.quote}
                    onChange={(e) => setTestimonial(prev => ({ ...prev, quote: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white resize-none"
                    placeholder="Enter the testimonial quote..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={testimonial.author}
                      onChange={(e) => setTestimonial(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Title/Role</label>
                    <input
                      type="text"
                      value={testimonial.title}
                      onChange={(e) => setTestimonial(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="CEO"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Company (optional)</label>
                  <input
                    type="text"
                    value={testimonial.company}
                    onChange={(e) => setTestimonial(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="Acme Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setTestimonial(prev => ({ ...prev, rating: star }))}
                        className={`text-3xl ${star <= testimonial.rating ? 'text-amber-400' : 'text-gray-600'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Avatar (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white file:cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Style</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Theme</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(TEMPLATES).map(([key, t]) => (
                      <button
                        key={key}
                        onClick={() => setTemplate(key as keyof typeof TEMPLATES)}
                        className={`p-2 rounded-lg text-xs font-medium transition-all ${
                          template === key ? 'ring-2 ring-amber-400' : ''
                        }`}
                        style={{ 
                          background: t.bg.includes('gradient') ? t.bg : t.bg,
                          color: t.text 
                        }}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showRating}
                      onChange={(e) => setShowRating(e.target.checked)}
                      className="rounded border-white/20"
                    />
                    <span className="text-sm text-gray-300">Show rating</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showAvatar}
                      onChange={(e) => setShowAvatar(e.target.checked)}
                      className="rounded border-white/20"
                    />
                    <span className="text-sm text-gray-300">Show avatar</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
              
              <div className="flex justify-center">
                <div
                  ref={cardRef}
                  className="w-full max-w-md aspect-square rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden"
                  style={{ 
                    background: currentTemplate.bg,
                    color: currentTemplate.text,
                  }}
                >
                  {/* Decorative quote mark */}
                  <div 
                    className="absolute top-4 left-6 text-8xl font-serif opacity-20"
                    style={{ color: currentTemplate.accent }}
                  >
                    &quot;
                  </div>

                  {/* Rating */}
                  {showRating && (
                    <div className="mb-4 text-2xl" style={{ color: currentTemplate.accent }}>
                      {'★'.repeat(testimonial.rating)}
                      <span className="opacity-30">{'★'.repeat(5 - testimonial.rating)}</span>
                    </div>
                  )}

                  {/* Quote */}
                  <blockquote className="text-xl font-medium leading-relaxed mb-6 relative z-10">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {showAvatar && (
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                        style={{ 
                          backgroundColor: currentTemplate.accent + '30',
                          color: currentTemplate.accent,
                        }}
                      >
                        {testimonial.avatar ? (
                          <img src={testimonial.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          testimonial.author.charAt(0)
                        )}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm opacity-70">
                        {testimonial.title}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={downloadCard}
                className="w-full mt-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold transition-colors"
              >
                📥 Download as PNG (1080×1080)
              </button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-amber-300 mb-2">💡 Tips</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Keep quotes concise and impactful (under 200 characters)</li>
                <li>• Include specific results when possible (numbers, percentages)</li>
                <li>• Use real names and titles for authenticity</li>
                <li>• Perfect for Instagram posts, stories, and LinkedIn</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

