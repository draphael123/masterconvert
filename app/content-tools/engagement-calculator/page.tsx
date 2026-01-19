'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const BENCHMARKS = {
  instagram: {
    excellent: 6,
    good: 3,
    average: 1,
    icon: '📷',
    name: 'Instagram',
    tips: [
      'Post Reels consistently - they get 2x more engagement',
      'Use 3-5 hashtags in caption, rest in comments',
      'Post when your audience is most active',
      'Respond to comments within 1 hour',
    ],
  },
  tiktok: {
    excellent: 10,
    good: 6,
    average: 3,
    icon: '🎵',
    name: 'TikTok',
    tips: [
      'Hook viewers in the first 1-3 seconds',
      'Post 1-4 times per day for best results',
      'Use trending sounds and hashtags',
      'Engage with comments to boost algorithm',
    ],
  },
  twitter: {
    excellent: 2,
    good: 0.5,
    average: 0.2,
    icon: '🐦',
    name: 'Twitter/X',
    tips: [
      'Tweet 3-5 times per day',
      'Use threads for long-form content',
      'Engage in conversations, quote tweet',
      'Post during high-activity hours',
    ],
  },
  linkedin: {
    excellent: 5,
    good: 2,
    average: 1,
    icon: '💼',
    name: 'LinkedIn',
    tips: [
      'Post native documents/carousels for higher reach',
      'Write long-form posts (1300+ characters)',
      'Comment on others\' posts to increase visibility',
      'Post Tuesday-Thursday for best engagement',
    ],
  },
  youtube: {
    excellent: 8,
    good: 4,
    average: 2,
    icon: '▶️',
    name: 'YouTube',
    tips: [
      'Optimize thumbnails and titles for CTR',
      'Ask viewers to like and comment',
      'Respond to comments within 24 hours',
      'Use end screens and cards',
    ],
  },
  facebook: {
    excellent: 3,
    good: 1,
    average: 0.5,
    icon: '📘',
    name: 'Facebook',
    tips: [
      'Video content gets 59% more engagement',
      'Post during off-work hours',
      'Use Facebook Groups for community',
      'Go Live regularly for algorithm boost',
    ],
  },
};

type Platform = keyof typeof BENCHMARKS;

export default function EngagementCalculatorPage() {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [followers, setFollowers] = useState('10000');
  const [likes, setLikes] = useState('500');
  const [comments, setComments] = useState('25');
  const [shares, setShares] = useState('10');
  const [saves, setSaves] = useState('50');
  const [views, setViews] = useState('');

  const parseNum = (val: string) => parseInt(val.replace(/,/g, '')) || 0;

  const calculateEngagement = () => {
    const f = parseNum(followers);
    const l = parseNum(likes);
    const c = parseNum(comments);
    const sh = parseNum(shares);
    const sa = parseNum(saves);
    const v = parseNum(views);

    if (f === 0) return { rate: 0, rating: 'N/A', color: 'gray' };

    let totalEngagement = l + c + sh;
    
    // Platform-specific calculations
    if (platform === 'instagram') {
      totalEngagement = l + c + sa + sh;
    } else if (platform === 'tiktok' || platform === 'youtube') {
      totalEngagement = l + c + sh;
      if (v > 0) {
        // Use views instead of followers for video platforms
        const viewRate = (totalEngagement / v) * 100;
        return getResult(viewRate);
      }
    }

    const rate = (totalEngagement / f) * 100;
    return getResult(rate);
  };

  const getResult = (rate: number) => {
    const benchmark = BENCHMARKS[platform];
    
    if (rate >= benchmark.excellent) {
      return { rate, rating: 'Excellent 🔥', color: 'emerald' };
    } else if (rate >= benchmark.good) {
      return { rate, rating: 'Good 👍', color: 'green' };
    } else if (rate >= benchmark.average) {
      return { rate, rating: 'Average 📊', color: 'yellow' };
    } else {
      return { rate, rating: 'Below Average 📉', color: 'red' };
    }
  };

  const result = calculateEngagement();
  const benchmark = BENCHMARKS[platform];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-green-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full text-green-300 text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Analytics Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Engagement Rate Calculator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Calculate your engagement rate and compare it to industry benchmarks.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Platform</h2>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(BENCHMARKS).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => setPlatform(key as Platform)}
                    className={`p-3 rounded-xl text-sm flex flex-col items-center gap-1 transition-colors ${
                      platform === key
                        ? 'bg-green-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-xl">{p.icon}</span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Metrics</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Followers/Subscribers</label>
                  <input
                    type="text"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                    placeholder="10,000"
                  />
                </div>

                {(platform === 'tiktok' || platform === 'youtube') && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Views (optional - more accurate)</label>
                    <input
                      type="text"
                      value={views}
                      onChange={(e) => setViews(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="50,000"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Likes</label>
                    <input
                      type="text"
                      value={likes}
                      onChange={(e) => setLikes(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Comments</label>
                    <input
                      type="text"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Shares/Retweets</label>
                    <input
                      type="text"
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      placeholder="10"
                    />
                  </div>
                  {platform === 'instagram' && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Saves</label>
                      <input
                        type="text"
                        value={saves}
                        onChange={(e) => setSaves(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                        placeholder="50"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Your Engagement Rate</h2>
              
              <div className="text-center py-8">
                <div className={`text-6xl font-bold text-${result.color}-400`}>
                  {result.rate.toFixed(2)}%
                </div>
                <div className={`text-xl mt-2 text-${result.color}-400`}>
                  {result.rating}
                </div>
              </div>

              {/* Benchmark comparison */}
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-gray-400">{benchmark.name} Benchmarks</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-400">Excellent</div>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min((result.rate / benchmark.excellent) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-emerald-400 text-right">{benchmark.excellent}%+</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-400">Good</div>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${Math.min((result.rate / benchmark.good) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-green-400 text-right">{benchmark.good}%+</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-400">Average</div>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${Math.min((result.rate / benchmark.average) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-yellow-400 text-right">{benchmark.average}%+</div>
                  </div>
                </div>
              </div>

              {/* Formula */}
              <div className="mt-6 p-4 bg-white/5 rounded-xl">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Formula Used</h3>
                <code className="text-green-400 text-sm">
                  {platform === 'instagram' 
                    ? '(Likes + Comments + Saves + Shares) / Followers × 100'
                    : (platform === 'tiktok' || platform === 'youtube') && views
                    ? '(Likes + Comments + Shares) / Views × 100'
                    : '(Likes + Comments + Shares) / Followers × 100'
                  }
                </code>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-4">
                💡 Tips to Improve Your {benchmark.name} Engagement
              </h3>
              <ul className="space-y-2">
                {benchmark.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

