'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface AnalysisResult {
  score: number;
  wordCount: number;
  characterCount: number;
  powerWords: string[];
  emotionalWords: string[];
  uncommonWords: string[];
  commonWords: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  headlineType: string;
  suggestions: string[];
}

const POWER_WORDS = [
  'amazing', 'proven', 'secret', 'ultimate', 'exclusive', 'free', 'new', 'best',
  'guaranteed', 'discover', 'breakthrough', 'revolutionary', 'powerful', 'instant',
  'easy', 'quick', 'simple', 'essential', 'complete', 'massive', 'incredible',
  'shocking', 'surprising', 'remarkable', 'extraordinary', 'transform', 'boost',
  'skyrocket', 'explode', 'unleash', 'master', 'dominate', 'crush', 'hack',
];

const EMOTIONAL_WORDS = [
  'love', 'hate', 'fear', 'joy', 'angry', 'happy', 'sad', 'excited', 'worried',
  'frustrated', 'delighted', 'thrilled', 'terrified', 'anxious', 'confident',
  'inspire', 'motivate', 'empower', 'heartbreak', 'passion', 'obsess',
];

const COMMON_WORDS = [
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'or', 'and',
];

export default function HeadlineAnalyzerPage() {
  const [headline, setHeadline] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeHeadline = () => {
    if (!headline.trim()) return;

    const words = headline.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const characterCount = headline.length;

    // Find power words
    const foundPowerWords = words.filter(w => POWER_WORDS.includes(w.replace(/[^a-z]/g, '')));
    
    // Find emotional words
    const foundEmotionalWords = words.filter(w => EMOTIONAL_WORDS.includes(w.replace(/[^a-z]/g, '')));
    
    // Find common vs uncommon words
    const foundCommonWords = words.filter(w => COMMON_WORDS.includes(w.replace(/[^a-z]/g, '')));
    const foundUncommonWords = words.filter(w => 
      !COMMON_WORDS.includes(w.replace(/[^a-z]/g, '')) && w.length > 2
    );

    // Detect headline type
    let headlineType = 'Statement';
    if (headline.includes('?')) headlineType = 'Question';
    else if (headline.match(/^\d+|how to|ways to|tips|reasons|steps/i)) headlineType = 'List/How-To';
    else if (headline.match(/^why|what|when|where|who/i)) headlineType = 'Curiosity';

    // Calculate sentiment
    const positiveWords = ['best', 'amazing', 'great', 'love', 'perfect', 'excellent', 'success'];
    const negativeWords = ['worst', 'bad', 'hate', 'fail', 'never', 'stop', 'avoid', 'mistake'];
    const posCount = words.filter(w => positiveWords.some(p => w.includes(p))).length;
    const negCount = words.filter(w => negativeWords.some(n => w.includes(n))).length;
    const sentiment = posCount > negCount ? 'positive' : negCount > posCount ? 'negative' : 'neutral';

    // Calculate score
    let score = 50; // Base score

    // Word count scoring (ideal: 6-12 words)
    if (wordCount >= 6 && wordCount <= 12) score += 15;
    else if (wordCount >= 4 && wordCount <= 14) score += 10;
    else if (wordCount < 4) score -= 10;
    else score -= 5;

    // Character count scoring (ideal: 50-60 characters)
    if (characterCount >= 50 && characterCount <= 60) score += 10;
    else if (characterCount >= 40 && characterCount <= 70) score += 5;

    // Power words
    score += Math.min(foundPowerWords.length * 5, 15);

    // Emotional words
    score += Math.min(foundEmotionalWords.length * 5, 10);

    // Numbers in headline
    if (headline.match(/\d+/)) score += 5;

    // Starts with number
    if (headline.match(/^\d+/)) score += 5;

    // Has brackets or parentheses
    if (headline.match(/[\[\(]/)) score += 3;

    // Uncommon words ratio
    const uncommonRatio = foundUncommonWords.length / wordCount;
    if (uncommonRatio >= 0.3 && uncommonRatio <= 0.5) score += 5;

    // Generate suggestions
    const suggestions: string[] = [];
    if (foundPowerWords.length === 0) suggestions.push('Add a power word like "proven", "essential", or "ultimate"');
    if (foundEmotionalWords.length === 0) suggestions.push('Consider adding emotional appeal');
    if (wordCount < 6) suggestions.push('Headline might be too short - aim for 6-12 words');
    if (wordCount > 12) suggestions.push('Headline might be too long - aim for 6-12 words');
    if (characterCount > 70) suggestions.push('Consider shortening for better SEO display');
    if (!headline.match(/\d+/)) suggestions.push('Adding a number can increase click-through rates');
    if (headlineType === 'Statement') suggestions.push('Questions and lists often perform better');

    setResult({
      score: Math.max(0, Math.min(100, score)),
      wordCount,
      characterCount,
      powerWords: foundPowerWords,
      emotionalWords: foundEmotionalWords,
      uncommonWords: foundUncommonWords,
      commonWords: foundCommonWords,
      sentiment,
      headlineType,
      suggestions,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';
    if (score >= 30) return 'Needs Work';
    return 'Poor';
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            SEO Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Headline Analyzer
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Score your headlines for emotional impact, word balance, and click potential.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter your headline
          </label>
          <textarea
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="10 Proven Ways to Boost Your Content Marketing Strategy"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), analyzeHeadline())}
          />
          <button
            onClick={analyzeHeadline}
            disabled={!headline.trim()}
            className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
          >
            Analyze Headline
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Overall Score</h2>
                  <p className={`text-sm ${getScoreColor(result.score)}`}>{getScoreLabel(result.score)}</p>
                </div>
                <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                </div>
              </div>
              
              {/* Score Bar */}
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    result.score >= 70 ? 'bg-green-500' :
                    result.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{result.wordCount}</div>
                <div className="text-sm text-gray-400">Words</div>
                <div className={`text-xs mt-1 ${result.wordCount >= 6 && result.wordCount <= 12 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {result.wordCount >= 6 && result.wordCount <= 12 ? 'Ideal' : result.wordCount < 6 ? 'Too short' : 'Too long'}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{result.characterCount}</div>
                <div className="text-sm text-gray-400">Characters</div>
                <div className={`text-xs mt-1 ${result.characterCount >= 50 && result.characterCount <= 60 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {result.characterCount >= 50 && result.characterCount <= 60 ? 'Ideal' : result.characterCount < 50 ? 'Add more' : 'Consider shorter'}
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{result.headlineType}</div>
                <div className="text-sm text-gray-400">Type</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white capitalize">{result.sentiment}</div>
                <div className="text-sm text-gray-400">Sentiment</div>
              </div>
            </div>

            {/* Word Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-green-400">⚡</span> Power Words ({result.powerWords.length})
                </h3>
                {result.powerWords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.powerWords.map((word, i) => (
                      <span key={i} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                        {word}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No power words found</p>
                )}
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-pink-400">💖</span> Emotional Words ({result.emotionalWords.length})
                </h3>
                {result.emotionalWords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.emotionalWords.map((word, i) => (
                      <span key={i} className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-sm">
                        {word}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No emotional words found</p>
                )}
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="bg-yellow-500/10 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-4">
                <h3 className="font-semibold text-yellow-300 mb-3">💡 Suggestions to Improve</h3>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Headline Writing Tips</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-blue-400">1.</span>
              <p>Use numbers - headlines with numbers get 36% more clicks</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400">2.</span>
              <p>Include power words that trigger emotional responses</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400">3.</span>
              <p>Keep it between 6-12 words for optimal engagement</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400">4.</span>
              <p>Use brackets [like this] to add context</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400">5.</span>
              <p>Questions create curiosity and engagement</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400">6.</span>
              <p>Keep under 60 characters for SEO display</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

