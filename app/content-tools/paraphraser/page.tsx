'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const SYNONYMS: Record<string, string[]> = {
  'good': ['excellent', 'great', 'wonderful', 'fantastic', 'superb', 'outstanding'],
  'bad': ['poor', 'terrible', 'awful', 'dreadful', 'horrible', 'subpar'],
  'big': ['large', 'huge', 'massive', 'enormous', 'substantial', 'significant'],
  'small': ['tiny', 'little', 'compact', 'minute', 'modest', 'slight'],
  'fast': ['quick', 'rapid', 'swift', 'speedy', 'brisk', 'prompt'],
  'slow': ['gradual', 'leisurely', 'unhurried', 'measured', 'steady'],
  'important': ['crucial', 'vital', 'essential', 'significant', 'key', 'critical'],
  'help': ['assist', 'aid', 'support', 'facilitate', 'enable'],
  'use': ['utilize', 'employ', 'apply', 'leverage', 'harness'],
  'make': ['create', 'produce', 'develop', 'build', 'construct', 'generate'],
  'get': ['obtain', 'acquire', 'secure', 'gain', 'receive'],
  'show': ['demonstrate', 'display', 'reveal', 'illustrate', 'present'],
  'think': ['believe', 'consider', 'feel', 'suppose', 'reckon'],
  'start': ['begin', 'commence', 'initiate', 'launch', 'kick off'],
  'end': ['finish', 'complete', 'conclude', 'terminate', 'wrap up'],
  'increase': ['grow', 'rise', 'expand', 'boost', 'enhance', 'elevate'],
  'decrease': ['reduce', 'lower', 'diminish', 'lessen', 'cut'],
  'change': ['alter', 'modify', 'transform', 'adjust', 'revise'],
  'improve': ['enhance', 'boost', 'upgrade', 'refine', 'optimize'],
  'provide': ['offer', 'supply', 'deliver', 'furnish', 'give'],
};

export default function ParaphraserPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'standard' | 'formal' | 'simple'>('standard');
  const [copied, setCopied] = useState(false);

  const paraphrase = () => {
    if (!input.trim()) return;

    let result = input;
    
    // Replace words with synonyms
    Object.entries(SYNONYMS).forEach(([word, synonyms]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, (match) => {
        const synonym = synonyms[Math.floor(Math.random() * synonyms.length)];
        // Preserve case
        if (match[0] === match[0].toUpperCase()) {
          return synonym.charAt(0).toUpperCase() + synonym.slice(1);
        }
        return synonym;
      });
    });

    // Mode-specific transformations
    if (mode === 'formal') {
      result = result
        .replace(/\bcan't\b/gi, 'cannot')
        .replace(/\bwon't\b/gi, 'will not')
        .replace(/\bdon't\b/gi, 'do not')
        .replace(/\bdoesn't\b/gi, 'does not')
        .replace(/\bisn't\b/gi, 'is not')
        .replace(/\baren't\b/gi, 'are not')
        .replace(/\bI'm\b/g, 'I am')
        .replace(/\bIt's\b/g, 'It is')
        .replace(/\bthat's\b/gi, 'that is');
    } else if (mode === 'simple') {
      result = result
        .replace(/\butilize\b/gi, 'use')
        .replace(/\bfacilitate\b/gi, 'help')
        .replace(/\bcommence\b/gi, 'start')
        .replace(/\bterminate\b/gi, 'end')
        .replace(/\bsubsequently\b/gi, 'then')
        .replace(/\bnevertheless\b/gi, 'but')
        .replace(/\bfurthermore\b/gi, 'also');
    }

    // Restructure some sentences
    result = result.replace(
      /(\w+) is (\w+) and (\w+)/gi,
      (_, s, a1, a2) => `${s} is both ${a1} and ${a2}`
    );

    setOutput(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-cyan-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-300 text-sm mb-6">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Writing Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Paraphraser
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Rewrite your text with different words while keeping the meaning.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/5 rounded-xl p-1 flex gap-1">
            {(['standard', 'formal', 'simple'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  mode === m ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Original Text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter the text you want to paraphrase..."
              rows={10}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />
            <div className="mt-2 text-xs text-gray-500">
              {input.split(/\s+/).filter(w => w).length} words
            </div>
            <button
              onClick={paraphrase}
              disabled={!input.trim()}
              className="mt-4 w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
            >
              Paraphrase
            </button>
          </div>

          {/* Output */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Paraphrased Text</label>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              rows={10}
              className="w-full px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-100 resize-none"
              placeholder="Paraphrased text will appear here..."
            />
            <div className="mt-2 text-xs text-gray-500">
              {output.split(/\s+/).filter(w => w).length} words
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-cyan-500/10 backdrop-blur-sm rounded-2xl border border-cyan-500/30 p-6">
          <h2 className="text-lg font-bold text-white mb-3">💡 Paraphrasing Modes</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="text-cyan-400 font-semibold mb-1">Standard</h3>
              <p className="text-gray-300">Balanced rewording with synonym replacement</p>
            </div>
            <div>
              <h3 className="text-cyan-400 font-semibold mb-1">Formal</h3>
              <p className="text-gray-300">Expands contractions and uses professional language</p>
            </div>
            <div>
              <h3 className="text-cyan-400 font-semibold mb-1">Simple</h3>
              <p className="text-gray-300">Simplifies complex words for easier reading</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

