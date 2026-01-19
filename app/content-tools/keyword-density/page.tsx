'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface KeywordData {
  word: string;
  count: number;
  density: number;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
  'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
  'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'what', 'which', 'who', 'whom',
  'as', 'if', 'then', 'than', 'so', 'just', 'only', 'also', 'very', 'too', 'no', 'not',
  'all', 'any', 'some', 'many', 'much', 'more', 'most', 'other', 'each', 'every', 'both',
]);

export default function KeywordDensityPage() {
  const [text, setText] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [minWordLength, setMinWordLength] = useState(3);
  const [excludeStopWords, setExcludeStopWords] = useState(true);

  const analysis = useMemo(() => {
    if (!text.trim()) return null;

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= minWordLength);

    const totalWords = words.length;
    const wordCount: Record<string, number> = {};

    words.forEach(word => {
      if (excludeStopWords && STOP_WORDS.has(word)) return;
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const keywords: KeywordData[] = Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / totalWords) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    // Target keyword analysis
    let targetData = null;
    if (targetKeyword.trim()) {
      const target = targetKeyword.toLowerCase().trim();
      const targetCount = words.filter(w => w === target).length;
      targetData = {
        word: target,
        count: targetCount,
        density: (targetCount / totalWords) * 100,
      };
    }

    // 2-word phrases
    const phrases: Record<string, number> = {};
    for (let i = 0; i < words.length - 1; i++) {
      if (excludeStopWords && (STOP_WORDS.has(words[i]) || STOP_WORDS.has(words[i + 1]))) continue;
      const phrase = `${words[i]} ${words[i + 1]}`;
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }

    const topPhrases = Object.entries(phrases)
      .filter(([, count]) => count > 1)
      .map(([phrase, count]) => ({
        word: phrase,
        count,
        density: (count / totalWords) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalWords,
      uniqueWords: Object.keys(wordCount).length,
      keywords: keywords.slice(0, 20),
      topPhrases,
      targetData,
    };
  }, [text, targetKeyword, minWordLength, excludeStopWords]);

  const getDensityColor = (density: number) => {
    if (density >= 3) return 'text-red-400';
    if (density >= 1.5) return 'text-green-400';
    if (density >= 0.5) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getDensityStatus = (density: number) => {
    if (density >= 3) return 'Too high (may be keyword stuffing)';
    if (density >= 1.5) return 'Optimal range';
    if (density >= 0.5) return 'Could be higher';
    return 'Low density';
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
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            SEO Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Keyword Density Checker
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Analyze keyword frequency and density in your content.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paste your content
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your blog post, article, or page content here..."
                rows={12}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <h3 className="font-semibold text-white mb-3">Target Keyword (optional)</h3>
              <input
                type="text"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                placeholder="Enter your target keyword"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="mt-4 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excludeStopWords}
                    onChange={(e) => setExcludeStopWords(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-600"
                  />
                  <span className="text-sm text-gray-300">Exclude stop words</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Min length:</span>
                  <select
                    value={minWordLength}
                    onChange={(e) => setMinWordLength(parseInt(e.target.value))}
                    className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                  >
                    <option value="2" className="bg-slate-800">2</option>
                    <option value="3" className="bg-slate-800">3</option>
                    <option value="4" className="bg-slate-800">4</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {analysis ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-400">{analysis.totalWords}</div>
                    <div className="text-sm text-gray-400">Total Words</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-400">{analysis.uniqueWords}</div>
                    <div className="text-sm text-gray-400">Unique Words</div>
                  </div>
                </div>

                {/* Target Keyword */}
                {analysis.targetData && (
                  <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4">
                    <h3 className="font-semibold text-white mb-2">Target Keyword: &quot;{analysis.targetData.word}&quot;</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-white">{analysis.targetData.count}</div>
                        <div className="text-sm text-gray-400">Occurrences</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold ${getDensityColor(analysis.targetData.density)}`}>
                          {analysis.targetData.density.toFixed(2)}%
                        </div>
                        <div className={`text-sm ${getDensityColor(analysis.targetData.density)}`}>
                          {getDensityStatus(analysis.targetData.density)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Keywords */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                  <h3 className="font-semibold text-white mb-3">Top Keywords</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {analysis.keywords.map((kw, i) => (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-white/5">
                        <span className="text-white">{kw.word}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-sm">{kw.count}x</span>
                          <span className={`text-sm font-mono ${getDensityColor(kw.density)}`}>
                            {kw.density.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Phrases */}
                {analysis.topPhrases.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                    <h3 className="font-semibold text-white mb-3">Top 2-Word Phrases</h3>
                    <div className="space-y-2">
                      {analysis.topPhrases.map((phrase, i) => (
                        <div key={i} className="flex items-center justify-between py-1 border-b border-white/5">
                          <span className="text-white">{phrase.word}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm">{phrase.count}x</span>
                            <span className="text-sm font-mono text-purple-400">
                              {phrase.density.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-400">Paste your content to analyze keyword density</p>
              </div>
            )}
          </div>
        </div>

        {/* Guide */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Keyword Density Guide</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="text-green-400 font-semibold mb-1">Optimal: 1.5% - 2.5%</div>
              <p className="text-gray-300">Natural keyword usage that signals relevance without over-optimization</p>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <div className="text-yellow-400 font-semibold mb-1">Low: 0.5% - 1.5%</div>
              <p className="text-gray-300">Consider adding more keyword mentions naturally throughout content</p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30">
              <div className="text-red-400 font-semibold mb-1">Too High: 3%+</div>
              <p className="text-gray-300">May be flagged as keyword stuffing - reduce occurrences</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

