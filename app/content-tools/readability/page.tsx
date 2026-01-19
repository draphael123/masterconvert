'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface ReadabilityResult {
  fleschKincaid: number;
  fleschReading: number;
  gunningFog: number;
  smog: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTime: number;
  gradeLevel: string;
}

export default function ReadabilityPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ReadabilityResult | null>(null);

  const countSyllables = (word: string): number => {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  };

  const analyze = () => {
    if (!text.trim()) return;

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.match(/[a-zA-Z]/));
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

    const sentenceCount = sentences.length || 1;
    const wordCount = words.length;
    const paragraphCount = paragraphs.length || 1;

    let totalSyllables = 0;
    let complexWords = 0;

    words.forEach(word => {
      const syllables = countSyllables(word);
      totalSyllables += syllables;
      if (syllables >= 3) complexWords++;
    });

    const avgWordsPerSentence = wordCount / sentenceCount;
    const avgSyllablesPerWord = totalSyllables / wordCount;

    // Flesch-Kincaid Grade Level
    const fleschKincaid = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;

    // Flesch Reading Ease
    const fleschReading = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

    // Gunning Fog Index
    const gunningFog = 0.4 * (avgWordsPerSentence + 100 * (complexWords / wordCount));

    // SMOG Index
    const smog = 1.043 * Math.sqrt(complexWords * (30 / sentenceCount)) + 3.1291;

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);

    // Grade level interpretation
    let gradeLevel = '';
    const fk = Math.round(fleschKincaid);
    if (fk <= 5) gradeLevel = 'Elementary (Grade 5 or below)';
    else if (fk <= 8) gradeLevel = 'Middle School (Grades 6-8)';
    else if (fk <= 12) gradeLevel = 'High School (Grades 9-12)';
    else if (fk <= 16) gradeLevel = 'College Level';
    else gradeLevel = 'Graduate Level';

    setResult({
      fleschKincaid: Math.max(0, fleschKincaid),
      fleschReading: Math.max(0, Math.min(100, fleschReading)),
      gunningFog: Math.max(0, gunningFog),
      smog: Math.max(0, smog),
      avgWordsPerSentence,
      avgSyllablesPerWord,
      wordCount,
      sentenceCount,
      paragraphCount,
      readingTime,
      gradeLevel,
    });
  };

  const getReadingEaseLabel = (score: number) => {
    if (score >= 90) return { label: 'Very Easy', color: 'text-green-400', desc: '5th grade' };
    if (score >= 80) return { label: 'Easy', color: 'text-green-400', desc: '6th grade' };
    if (score >= 70) return { label: 'Fairly Easy', color: 'text-lime-400', desc: '7th grade' };
    if (score >= 60) return { label: 'Standard', color: 'text-yellow-400', desc: '8th-9th grade' };
    if (score >= 50) return { label: 'Fairly Difficult', color: 'text-orange-400', desc: '10th-12th grade' };
    if (score >= 30) return { label: 'Difficult', color: 'text-red-400', desc: 'College' };
    return { label: 'Very Difficult', color: 'text-red-500', desc: 'Graduate' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-purple-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm mb-6">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            Writing Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Readability Scorer
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Analyze your content&apos;s readability with Flesch-Kincaid, Gunning Fog, and SMOG scores.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Paste your content
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your article, blog post, or any text content here to analyze its readability..."
              rows={15}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            <button
              onClick={analyze}
              disabled={!text.trim()}
              className="mt-4 w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
            >
              Analyze Readability
            </button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Main Score */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Flesch Reading Ease</h2>
                      <p className={`text-sm ${getReadingEaseLabel(result.fleschReading).color}`}>
                        {getReadingEaseLabel(result.fleschReading).label} - {getReadingEaseLabel(result.fleschReading).desc}
                      </p>
                    </div>
                    <div className={`text-5xl font-bold ${getReadingEaseLabel(result.fleschReading).color}`}>
                      {result.fleschReading.toFixed(1)}
                    </div>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                      style={{ width: `${result.fleschReading}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Difficult</span>
                    <span>Easy</span>
                  </div>
                </div>

                {/* Grade Level */}
                <div className="bg-purple-500/20 backdrop-blur-sm rounded-xl border border-purple-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">Grade Level</span>
                    <span className="text-white font-semibold">{result.gradeLevel}</span>
                  </div>
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">{result.fleschKincaid.toFixed(1)}</div>
                    <div className="text-sm text-gray-400">Flesch-Kincaid Grade</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">{result.gunningFog.toFixed(1)}</div>
                    <div className="text-sm text-gray-400">Gunning Fog Index</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">{result.smog.toFixed(1)}</div>
                    <div className="text-sm text-gray-400">SMOG Index</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-2xl font-bold text-white">{result.readingTime} min</div>
                    <div className="text-sm text-gray-400">Reading Time</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                  <h3 className="font-semibold text-white mb-3">Text Statistics</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-purple-400">{result.wordCount}</div>
                      <div className="text-xs text-gray-400">Words</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-400">{result.sentenceCount}</div>
                      <div className="text-xs text-gray-400">Sentences</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-400">{result.paragraphCount}</div>
                      <div className="text-xs text-gray-400">Paragraphs</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{result.avgWordsPerSentence.toFixed(1)}</div>
                      <div className="text-xs text-gray-400">Avg words/sentence</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{result.avgSyllablesPerWord.toFixed(2)}</div>
                      <div className="text-xs text-gray-400">Avg syllables/word</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-12 text-center">
                <div className="text-6xl mb-4">📖</div>
                <p className="text-gray-400">Paste your content and click analyze to see readability scores</p>
              </div>
            )}
          </div>
        </div>

        {/* Guide */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Readability Score Guide</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 text-gray-400">Score</th>
                  <th className="text-left py-2 text-gray-400">Level</th>
                  <th className="text-left py-2 text-gray-400">Audience</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-2 text-green-400">90-100</td>
                  <td>Very Easy</td>
                  <td>5th grade, easily understood by 11-year-olds</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 text-lime-400">70-80</td>
                  <td>Fairly Easy</td>
                  <td>7th grade, conversational English</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 text-yellow-400">60-70</td>
                  <td>Standard</td>
                  <td>8th-9th grade, ideal for most web content</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 text-orange-400">50-60</td>
                  <td>Fairly Difficult</td>
                  <td>10th-12th grade, high school level</td>
                </tr>
                <tr>
                  <td className="py-2 text-red-400">0-30</td>
                  <td>Very Difficult</td>
                  <td>College graduate, academic writing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

