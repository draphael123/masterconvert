'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const HASHTAG_DATABASE: Record<string, string[]> = {
  marketing: ['#marketing', '#digitalmarketing', '#socialmedia', '#contentmarketing', '#marketingstrategy', '#marketingtips', '#business', '#branding', '#entrepreneur', '#smallbusiness', '#onlinemarketing', '#marketingdigital', '#socialmediamarketing', '#growthhacking', '#startup'],
  tech: ['#technology', '#tech', '#innovation', '#ai', '#machinelearning', '#coding', '#programming', '#developer', '#software', '#digital', '#artificialintelligence', '#datascience', '#cybersecurity', '#blockchain', '#iot'],
  photography: ['#photography', '#photooftheday', '#photographer', '#photo', '#naturephotography', '#travelphotography', '#portrait', '#streetphotography', '#landscape', '#photographylovers', '#canon', '#nikon', '#picoftheday', '#instaphoto', '#shotoniphone'],
  travel: ['#travel', '#traveling', '#travelphotography', '#travelgram', '#travelblogger', '#wanderlust', '#adventure', '#explore', '#vacation', '#tourism', '#traveler', '#instatravel', '#trip', '#holiday', '#traveltheworld'],
  food: ['#food', '#foodie', '#foodporn', '#instafood', '#foodphotography', '#foodstagram', '#yummy', '#delicious', '#foodblogger', '#cooking', '#homemade', '#healthyfood', '#dinner', '#lunch', '#breakfast'],
  fitness: ['#fitness', '#workout', '#gym', '#fit', '#fitnessmotivation', '#health', '#training', '#motivation', '#bodybuilding', '#fitfam', '#healthy', '#lifestyle', '#exercise', '#muscle', '#fitnessjourney'],
  fashion: ['#fashion', '#style', '#ootd', '#fashionblogger', '#instafashion', '#fashionista', '#streetstyle', '#outfit', '#fashionstyle', '#model', '#beauty', '#love', '#shopping', '#dress', '#fashionable'],
  business: ['#business', '#entrepreneur', '#success', '#motivation', '#money', '#smallbusiness', '#startup', '#entrepreneurship', '#businessowner', '#marketing', '#mindset', '#goals', '#hustle', '#leadership', '#wealth'],
  lifestyle: ['#lifestyle', '#life', '#love', '#happy', '#instagood', '#photooftheday', '#beautiful', '#motivation', '#inspiration', '#live', '#goodvibes', '#positivity', '#wellness', '#mindfulness', '#selfcare'],
  art: ['#art', '#artist', '#artwork', '#drawing', '#painting', '#illustration', '#design', '#creative', '#sketch', '#artistsoninstagram', '#digitalart', '#contemporaryart', '#artoftheday', '#instaart', '#artgallery'],
};

const CATEGORIES = Object.keys(HASHTAG_DATABASE);

export default function HashtagGeneratorPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [hashtagCount, setHashtagCount] = useState(15);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const generateHashtags = () => {
    const hashtags = new Set<string>();

    // Add keyword-based hashtags
    if (keyword.trim()) {
      const words = keyword.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) {
          hashtags.add(`#${word}`);
          hashtags.add(`#${word}s`);
        }
      });
      // Combined keyword
      if (words.length > 1) {
        hashtags.add(`#${words.join('')}`);
      }
    }

    // Add from selected categories
    selectedCategories.forEach(cat => {
      HASHTAG_DATABASE[cat]?.forEach(tag => hashtags.add(tag));
    });

    // If no categories selected but keyword exists, try to match
    if (selectedCategories.size === 0 && keyword.trim()) {
      const keywordLower = keyword.toLowerCase();
      CATEGORIES.forEach(cat => {
        if (keywordLower.includes(cat) || cat.includes(keywordLower)) {
          HASHTAG_DATABASE[cat]?.slice(0, 5).forEach(tag => hashtags.add(tag));
        }
      });
    }

    // Limit and shuffle
    const result = Array.from(hashtags)
      .sort(() => Math.random() - 0.5)
      .slice(0, hashtagCount);

    setGeneratedHashtags(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHashtags.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const removeHashtag = (tag: string) => {
    setGeneratedHashtags(prev => prev.filter(t => t !== tag));
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
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-full text-pink-300 text-sm mb-6">
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hashtag Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate relevant hashtags for your social media posts.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
          {/* Keyword Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter topic or keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., digital marketing, travel photography"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select categories (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                    selectedCategories.has(cat)
                      ? 'bg-pink-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Count Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Number of hashtags</label>
              <span className="text-pink-400">{hashtagCount}</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={hashtagCount}
              onChange={(e) => setHashtagCount(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generateHashtags}
            className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-semibold transition-colors"
          >
            Generate Hashtags
          </button>
        </div>

        {/* Results */}
        {generatedHashtags.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Generated Hashtags ({generatedHashtags.length})
              </h2>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy All'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {generatedHashtags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-pink-500/20 text-pink-300 rounded-lg group"
                >
                  {tag}
                  <button
                    onClick={() => removeHashtag(tag)}
                    className="opacity-0 group-hover:opacity-100 text-pink-400 hover:text-white transition-opacity"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Copy Preview */}
            <div className="p-4 bg-slate-900 rounded-xl">
              <p className="text-xs text-gray-400 mb-2">Copy-ready format:</p>
              <p className="text-gray-300 text-sm break-all">{generatedHashtags.join(' ')}</p>
            </div>

            {/* Character Count */}
            <div className="mt-4 flex justify-between text-xs text-gray-400">
              <span>{generatedHashtags.join(' ').length} characters</span>
              <span className={generatedHashtags.join(' ').length > 2200 ? 'text-red-400' : ''}>
                Instagram limit: 2,200 chars
              </span>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Hashtag Tips</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-pink-400">•</span>
              <p>Use 5-15 hashtags on Instagram for best engagement</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-400">•</span>
              <p>Mix popular and niche hashtags</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-400">•</span>
              <p>1-2 hashtags work best on Twitter/X</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-400">•</span>
              <p>Research which hashtags your audience follows</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

