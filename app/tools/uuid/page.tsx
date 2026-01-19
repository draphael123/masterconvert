'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState<'standard' | 'uppercase' | 'no-dashes'>('standard');
  const [copied, setCopied] = useState<string | null>(null);

  const generateUUID = (): string => {
    // UUID v4 implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const formatUUID = (uuid: string): string => {
    switch (format) {
      case 'uppercase':
        return uuid.toUpperCase();
      case 'no-dashes':
        return uuid.replace(/-/g, '');
      default:
        return uuid;
    }
  };

  const generateUUIDs = () => {
    const newUuids = Array.from({ length: count }, () => generateUUID());
    setUuids(newUuids);
  };

  useEffect(() => {
    generateUUIDs();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAllToClipboard = () => {
    const all = uuids.map(formatUUID).join('\n');
    navigator.clipboard.writeText(all);
    setCopied('all');
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-blue-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/tools/hash" className="text-gray-300 hover:text-white transition-colors">Hash</Link>
              <Link href="/tools/timestamp" className="text-gray-300 hover:text-white transition-colors">Timestamp</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Developer Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            UUID Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate unique identifiers (UUID v4) instantly. Perfect for databases and APIs.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Count
              </label>
              <select
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 5, 10, 25, 50, 100].map((n) => (
                  <option key={n} value={n} className="bg-slate-800">
                    {n} UUID{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as typeof format)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard" className="bg-slate-800">Standard (lowercase)</option>
                <option value="uppercase" className="bg-slate-800">UPPERCASE</option>
                <option value="no-dashes" className="bg-slate-800">No dashes</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={generateUUIDs}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
              >
                Generate
              </button>
              <button
                onClick={copyAllToClipboard}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
              >
                {copied === 'all' ? '✓ Copied!' : 'Copy All'}
              </button>
            </div>
          </div>

          {/* UUID List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {uuids.map((uuid, index) => {
              const formatted = formatUUID(uuid);
              return (
                <button
                  key={index}
                  onClick={() => copyToClipboard(formatted, uuid)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                >
                  <span className="text-sm text-gray-400 w-8">{index + 1}.</span>
                  <span className="font-mono text-white flex-1 text-left">{formatted}</span>
                  <span className="text-xs text-gray-500 group-hover:text-blue-400 transition-colors">
                    {copied === uuid ? '✓ Copied!' : 'Click to copy'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">About UUID v4</h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• 128-bit identifier</li>
              <li>• 122 random bits, 6 version/variant bits</li>
              <li>• 2^122 possible values (5.3 × 10^36)</li>
              <li>• Collision probability: virtually zero</li>
              <li>• No central authority needed</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">UUID Structure</h2>
            <div className="font-mono text-sm">
              <div className="text-gray-400 mb-2">xxxxxxxx-xxxx-<span className="text-blue-400">4</span>xxx-<span className="text-green-400">y</span>xxx-xxxxxxxxxxxx</div>
              <div className="text-xs space-y-1">
                <div><span className="text-blue-400">4</span> = version (UUID v4)</div>
                <div><span className="text-green-400">y</span> = variant (8, 9, a, or b)</div>
                <div>x = random hexadecimal</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

