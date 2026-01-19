'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface ColorFormat {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export default function ColorPickerPage() {
  const [color, setColor] = useState<ColorFormat>({
    hex: '#6366f1',
    rgb: { r: 99, g: 102, b: 241 },
    hsl: { h: 239, s: 84, l: 67 },
    hsv: { h: 239, s: 59, v: 95 },
    cmyk: { c: 59, m: 58, y: 0, k: 5 },
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [inputHex, setInputHex] = useState('#6366f1');

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;

    if (max !== min) {
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    return {
      c: Math.round(((1 - r - k) / (1 - k)) * 100),
      m: Math.round(((1 - g - k) / (1 - k)) * 100),
      y: Math.round(((1 - b - k) / (1 - k)) * 100),
      k: Math.round(k * 100),
    };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    const hex = rgbToHex(r, g, b);
    setColor({
      hex,
      rgb: { r, g, b },
      hsl: rgbToHsl(r, g, b),
      hsv: rgbToHsv(r, g, b),
      cmyk: rgbToCmyk(r, g, b),
    });
    setInputHex(hex);
  };

  const updateFromHex = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      updateFromRgb(rgb.r, rgb.g, rgb.b);
    }
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l);
    updateFromRgb(rgb.r, rgb.g, rgb.b);
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 1500);
  };

  const colorFormats = [
    { name: 'HEX', value: color.hex.toUpperCase(), format: 'hex' },
    { name: 'RGB', value: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, format: 'rgb' },
    { name: 'HSL', value: `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`, format: 'hsl' },
    { name: 'HSV', value: `hsv(${color.hsv.h}, ${color.hsv.s}%, ${color.hsv.v}%)`, format: 'hsv' },
    { name: 'CMYK', value: `cmyk(${color.cmyk.c}%, ${color.cmyk.m}%, ${color.cmyk.y}%, ${color.cmyk.k}%)`, format: 'cmyk' },
  ];

  // Generate color variations
  const generateShades = () => {
    const shades = [];
    for (let i = 10; i <= 90; i += 10) {
      const rgb = hslToRgb(color.hsl.h, color.hsl.s, i);
      shades.push({ lightness: i, hex: rgbToHex(rgb.r, rgb.g, rgb.b) });
    }
    return shades;
  };

  const generateHues = () => {
    const hues = [];
    for (let i = 0; i < 360; i += 30) {
      const rgb = hslToRgb(i, color.hsl.s, color.hsl.l);
      hues.push({ hue: i, hex: rgbToHex(rgb.r, rgb.g, rgb.b) });
    }
    return hues;
  };

  const complementary = () => {
    const rgb = hslToRgb((color.hsl.h + 180) % 360, color.hsl.s, color.hsl.l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-pink-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/tools/background-remover" className="text-gray-300 hover:text-white transition-colors">Remove BG</Link>
              <Link href="/tools/image-crop" className="text-gray-300 hover:text-white transition-colors">Crop</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-full text-pink-300 text-sm mb-6">
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
            Developer Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Color Picker & Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Convert colors between HEX, RGB, HSL, HSV, and CMYK. Generate palettes and variations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Color Preview & Picker */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div
                className="w-full h-48 rounded-xl mb-6 shadow-2xl"
                style={{ backgroundColor: color.hex }}
              />
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    HEX Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => updateFromHex(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={inputHex}
                      onChange={(e) => {
                        setInputHex(e.target.value);
                        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                          updateFromHex(e.target.value);
                        }
                      }}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* RGB Sliders */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">RGB</label>
                  {['r', 'g', 'b'].map((channel) => (
                    <div key={channel} className="flex items-center gap-3">
                      <span className="w-4 text-xs text-gray-400 uppercase">{channel}</span>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={color.rgb[channel as keyof typeof color.rgb]}
                        onChange={(e) => {
                          const newRgb = { ...color.rgb, [channel]: parseInt(e.target.value) };
                          updateFromRgb(newRgb.r, newRgb.g, newRgb.b);
                        }}
                        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: channel === 'r' 
                            ? `linear-gradient(to right, rgb(0,${color.rgb.g},${color.rgb.b}), rgb(255,${color.rgb.g},${color.rgb.b}))`
                            : channel === 'g'
                            ? `linear-gradient(to right, rgb(${color.rgb.r},0,${color.rgb.b}), rgb(${color.rgb.r},255,${color.rgb.b}))`
                            : `linear-gradient(to right, rgb(${color.rgb.r},${color.rgb.g},0), rgb(${color.rgb.r},${color.rgb.g},255))`,
                        }}
                      />
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={color.rgb[channel as keyof typeof color.rgb]}
                        onChange={(e) => {
                          const newRgb = { ...color.rgb, [channel]: parseInt(e.target.value) || 0 };
                          updateFromRgb(newRgb.r, newRgb.g, newRgb.b);
                        }}
                        className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm text-center"
                      />
                    </div>
                  ))}
                </div>

                {/* HSL Sliders */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">HSL</label>
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-xs text-gray-400">H</span>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={color.hsl.h}
                      onChange={(e) => updateFromHsl(parseInt(e.target.value), color.hsl.s, color.hsl.l)}
                      className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                      }}
                    />
                    <span className="w-12 text-sm text-gray-400 text-right">{color.hsl.h}°</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-xs text-gray-400">S</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={color.hsl.s}
                      onChange={(e) => updateFromHsl(color.hsl.h, parseInt(e.target.value), color.hsl.l)}
                      className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-gray-400 to-pink-500"
                    />
                    <span className="w-12 text-sm text-gray-400 text-right">{color.hsl.s}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-xs text-gray-400">L</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={color.hsl.l}
                      onChange={(e) => updateFromHsl(color.hsl.h, color.hsl.s, parseInt(e.target.value))}
                      className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-black via-gray-500 to-white"
                    />
                    <span className="w-12 text-sm text-gray-400 text-right">{color.hsl.l}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Color Values & Palettes */}
          <div className="space-y-6">
            {/* Color Formats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Color Values</h2>
              <div className="space-y-2">
                {colorFormats.map((format) => (
                  <button
                    key={format.format}
                    onClick={() => copyToClipboard(format.value, format.format)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                  >
                    <span className="text-sm text-gray-400">{format.name}</span>
                    <span className="font-mono text-white">{format.value}</span>
                    <span className="text-xs text-gray-500 group-hover:text-pink-400 transition-colors">
                      {copied === format.format ? '✓ Copied!' : 'Click to copy'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shades */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Shades</h2>
              <div className="flex gap-1">
                {generateShades().map((shade) => (
                  <button
                    key={shade.lightness}
                    onClick={() => updateFromHex(shade.hex)}
                    className="flex-1 h-12 rounded-lg transition-transform hover:scale-110 hover:z-10"
                    style={{ backgroundColor: shade.hex }}
                    title={shade.hex}
                  />
                ))}
              </div>
            </div>

            {/* Hue Variations */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Hue Variations</h2>
              <div className="flex gap-1">
                {generateHues().map((hue) => (
                  <button
                    key={hue.hue}
                    onClick={() => updateFromHex(hue.hex)}
                    className="flex-1 h-12 rounded-lg transition-transform hover:scale-110 hover:z-10"
                    style={{ backgroundColor: hue.hex }}
                    title={hue.hex}
                  />
                ))}
              </div>
            </div>

            {/* Complementary */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Complementary</h2>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div
                    className="h-20 rounded-lg mb-2"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-center text-sm text-gray-400 font-mono">{color.hex}</p>
                </div>
                <div className="flex-1">
                  <button
                    onClick={() => updateFromHex(complementary())}
                    className="w-full h-20 rounded-lg mb-2 transition-transform hover:scale-105"
                    style={{ backgroundColor: complementary() }}
                  />
                  <p className="text-center text-sm text-gray-400 font-mono">{complementary()}</p>
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

