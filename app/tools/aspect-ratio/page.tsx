'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const COMMON_RATIOS = [
  { name: '16:9', value: 16/9, desc: 'HD Video, YouTube' },
  { name: '4:3', value: 4/3, desc: 'Classic TV, Photos' },
  { name: '1:1', value: 1, desc: 'Instagram Square' },
  { name: '9:16', value: 9/16, desc: 'Stories, TikTok' },
  { name: '21:9', value: 21/9, desc: 'Ultrawide' },
  { name: '3:2', value: 3/2, desc: 'DSLR Photos' },
  { name: '2:3', value: 2/3, desc: 'Portrait Photo' },
  { name: '5:4', value: 5/4, desc: 'Large Format' },
  { name: '1.85:1', value: 1.85, desc: 'Cinema' },
  { name: '2.39:1', value: 2.39, desc: 'Anamorphic' },
];

export default function AspectRatioPage() {
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [locked, setLocked] = useState<'width' | 'height' | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateGCD = (a: number, b: number): number => {
    return b === 0 ? a : calculateGCD(b, a % b);
  };

  const getSimplifiedRatio = () => {
    if (!width || !height) return { w: 0, h: 0 };
    const gcd = calculateGCD(width, height);
    return { w: width / gcd, h: height / gcd };
  };

  const ratio = getSimplifiedRatio();
  const decimalRatio = width && height ? (width / height).toFixed(4) : '0';

  const updateWidth = (newWidth: number) => {
    setWidth(newWidth);
    if (locked === 'height' && height) {
      // Keep ratio, calculate new height
      const currentRatio = width / height;
      setHeight(Math.round(newWidth / currentRatio));
    }
  };

  const updateHeight = (newHeight: number) => {
    setHeight(newHeight);
    if (locked === 'width' && width) {
      // Keep ratio, calculate new width
      const currentRatio = width / height;
      setWidth(Math.round(newHeight * currentRatio));
    }
  };

  const applyRatio = (ratioValue: number) => {
    if (locked === 'width') {
      setHeight(Math.round(width / ratioValue));
    } else {
      setWidth(Math.round(height * ratioValue));
    }
  };

  const copyRatio = () => {
    navigator.clipboard.writeText(`${ratio.w}:${ratio.h}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-teal-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/resize" className="text-gray-300 hover:text-white transition-colors">Resize</Link>
              <Link href="/logo-resize" className="text-gray-300 hover:text-white transition-colors">Logo Resize</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full text-teal-300 text-sm mb-6">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
            Calculator Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Aspect Ratio Calculator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Calculate and convert aspect ratios for images and videos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Calculator */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Dimensions</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Width (px)</label>
                  <button
                    onClick={() => setLocked(locked === 'width' ? null : 'width')}
                    className={`text-xs px-2 py-1 rounded ${
                      locked === 'width' ? 'bg-teal-600 text-white' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {locked === 'width' ? '🔒 Locked' : '🔓 Lock'}
                  </button>
                </div>
                <input
                  type="number"
                  value={width || ''}
                  onChange={(e) => updateWidth(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">Height (px)</label>
                  <button
                    onClick={() => setLocked(locked === 'height' ? null : 'height')}
                    className={`text-xs px-2 py-1 rounded ${
                      locked === 'height' ? 'bg-teal-600 text-white' : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {locked === 'height' ? '🔒 Locked' : '🔓 Lock'}
                  </button>
                </div>
                <input
                  type="number"
                  value={height || ''}
                  onChange={(e) => updateHeight(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Result */}
            <div className="mt-6 p-4 bg-teal-600/20 border border-teal-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300 text-sm mb-1">Aspect Ratio</p>
                  <p className="text-3xl font-bold text-white">{ratio.w}:{ratio.h}</p>
                  <p className="text-sm text-gray-400 mt-1">Decimal: {decimalRatio}</p>
                </div>
                <button
                  onClick={copyRatio}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Preview</p>
              <div className="flex items-center justify-center bg-white/5 rounded-xl p-4 h-40">
                <div
                  className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-mono text-xs"
                  style={{
                    width: `${Math.min(120, 120 * (width / Math.max(width, height)))}px`,
                    height: `${Math.min(120, 120 * (height / Math.max(width, height)))}px`,
                  }}
                >
                  {width}×{height}
                </div>
              </div>
            </div>
          </div>

          {/* Common Ratios */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Common Ratios</h2>
            <p className="text-sm text-gray-400 mb-4">Click to apply (based on {locked || 'height'})</p>
            
            <div className="space-y-2">
              {COMMON_RATIOS.map((r) => (
                <button
                  key={r.name}
                  onClick={() => applyRatio(r.value)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-teal-500/30 rounded"
                      style={{
                        width: `${24 * Math.min(r.value, 1.5)}px`,
                        height: `${24 / Math.max(r.value, 0.67)}px`,
                      }}
                    />
                    <span className="font-mono text-white">{r.name}</span>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-teal-400 transition-colors">
                    {r.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Reference</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-teal-400 font-medium">1080p HD</div>
              <div className="text-gray-400">1920 × 1080</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-teal-400 font-medium">4K UHD</div>
              <div className="text-gray-400">3840 × 2160</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-teal-400 font-medium">Instagram Post</div>
              <div className="text-gray-400">1080 × 1080</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-teal-400 font-medium">Instagram Story</div>
              <div className="text-gray-400">1080 × 1920</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

