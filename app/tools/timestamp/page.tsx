'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const [timestampUnit, setTimestampUnit] = useState<'seconds' | 'milliseconds'>('seconds');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timestampToDate = (ts: string) => {
    if (!ts) return null;
    let num = parseInt(ts);
    if (isNaN(num)) return null;
    
    // Auto-detect milliseconds vs seconds
    if (num > 9999999999) {
      num = Math.floor(num / 1000);
    }
    
    return new Date(num * 1000);
  };

  const dateToTimestamp = () => {
    if (!dateInput) return null;
    const datetime = new Date(`${dateInput}T${timeInput || '00:00'}`);
    if (isNaN(datetime.getTime())) return null;
    return Math.floor(datetime.getTime() / 1000);
  };

  const parsedDate = timestampToDate(timestamp);
  const calculatedTimestamp = dateToTimestamp();

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const setNow = () => {
    const now = new Date();
    setTimestamp(Math.floor(now.getTime() / 1000).toString());
    setDateInput(now.toISOString().split('T')[0]);
    setTimeInput(now.toTimeString().slice(0, 5));
  };

  const formatDate = (date: Date, format: string) => {
    const options: Record<string, Intl.DateTimeFormatOptions> = {
      iso: { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false },
      local: { dateStyle: 'full', timeStyle: 'long' },
      short: { dateStyle: 'short', timeStyle: 'short' },
      relative: {},
    };

    if (format === 'iso') {
      return date.toISOString();
    }
    if (format === 'relative') {
      const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
      if (seconds < 60) return `${seconds} seconds ago`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
      return `${Math.floor(seconds / 86400)} days ago`;
    }
    
    return date.toLocaleString('en-US', options[format]);
  };

  const presets = [
    { name: '1 hour ago', value: currentTimestamp - 3600 },
    { name: '24 hours ago', value: currentTimestamp - 86400 },
    { name: '1 week ago', value: currentTimestamp - 604800 },
    { name: '30 days ago', value: currentTimestamp - 2592000 },
    { name: 'Year 2000', value: 946684800 },
    { name: 'Year 2020', value: 1577836800 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-amber-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/tools/uuid" className="text-gray-300 hover:text-white transition-colors">UUID</Link>
              <Link href="/tools/hash" className="text-gray-300 hover:text-white transition-colors">Hash</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-amber-300 text-sm mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            Developer Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Unix Timestamp Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Convert between Unix timestamps and human-readable dates.
          </p>
        </div>

        {/* Current Time */}
        <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl border border-amber-500/30 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-300 text-sm mb-1">Current Unix Timestamp</p>
              <p className="text-4xl font-mono text-white">{currentTimestamp}</p>
            </div>
            <button
              onClick={setNow}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
            >
              Use Current Time
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Timestamp to Date */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Timestamp → Date</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Unix Timestamp
              </label>
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="1704067200"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {parsedDate && (
              <div className="space-y-3">
                {[
                  { label: 'ISO 8601', value: formatDate(parsedDate, 'iso'), id: 'iso' },
                  { label: 'Local', value: formatDate(parsedDate, 'local'), id: 'local' },
                  { label: 'Short', value: formatDate(parsedDate, 'short'), id: 'short' },
                  { label: 'Relative', value: formatDate(parsedDate, 'relative'), id: 'relative' },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => copyToClipboard(format.value, format.id)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                  >
                    <span className="text-xs text-gray-400">{format.label}</span>
                    <span className="text-sm text-white truncate ml-2 flex-1 text-right font-mono">
                      {format.value}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {copied === format.id ? '✓' : ''}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date to Timestamp */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Date → Timestamp</h2>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Time (optional)</label>
                <input
                  type="time"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {calculatedTimestamp && (
              <div className="space-y-3">
                <button
                  onClick={() => copyToClipboard(calculatedTimestamp.toString(), 'ts-sec')}
                  className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <span className="text-xs text-gray-400">Seconds</span>
                  <span className="text-lg text-white font-mono">{calculatedTimestamp}</span>
                  <span className="text-xs text-gray-500">{copied === 'ts-sec' ? '✓' : ''}</span>
                </button>
                <button
                  onClick={() => copyToClipboard((calculatedTimestamp * 1000).toString(), 'ts-ms')}
                  className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <span className="text-xs text-gray-400">Milliseconds</span>
                  <span className="text-lg text-white font-mono">{calculatedTimestamp * 1000}</span>
                  <span className="text-xs text-gray-500">{copied === 'ts-ms' ? '✓' : ''}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Presets */}
        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Presets</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setTimestamp(preset.value.toString())}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

