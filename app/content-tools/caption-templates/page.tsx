'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CATEGORIES = {
  motivational: {
    emoji: '💪',
    templates: [
      'Chase the vision, not the money. The money will end up following you. 💰\n\n#motivation #success #mindset',
      'Your only limit is you. Break free. 🔓\n\n{hashtags}',
      'The harder you work for something, the greater you&apos;ll feel when you achieve it. ✨\n\n{hashtags}',
      'Success is not final, failure is not fatal. It&apos;s the courage to continue that counts. 🎯\n\n{hashtags}',
      'Dream big. Start small. Act now. 🚀\n\nDouble tap if you agree! 👇\n\n{hashtags}',
    ],
  },
  business: {
    emoji: '💼',
    templates: [
      'Behind every successful business is someone who made a courageous decision. 💼\n\nWhat&apos;s your next big move?\n\n{hashtags}',
      'Don&apos;t watch the clock; do what it does. Keep going. ⏰\n\n{hashtags}',
      'Building something great takes time. Stay patient. Stay persistent. 🏗️\n\n{hashtags}',
      'Your network is your net worth. Connect. Grow. Succeed. 🤝\n\n{hashtags}',
      'The best time to start was yesterday. The next best time is NOW. ⚡\n\n{hashtags}',
    ],
  },
  lifestyle: {
    emoji: '✨',
    templates: [
      'Living my best life, one day at a time. ☀️\n\n{hashtags}',
      'Good vibes only. ✨\n\nTag someone who needs to see this!\n\n{hashtags}',
      'Life is short. Make every moment count. 🌟\n\n{hashtags}',
      'Find joy in the ordinary. 🌸\n\n{hashtags}',
      'Self-care isn&apos;t selfish. It&apos;s necessary. 💫\n\n{hashtags}',
    ],
  },
  travel: {
    emoji: '✈️',
    templates: [
      'Adventure awaits. 🌍\n\nWhere should I go next? Comment below! 👇\n\n{hashtags}',
      'Collect moments, not things. 📸\n\n{hashtags}',
      'Wanderlust: a strong desire to travel and explore the world. 🗺️\n\n{hashtags}',
      'The world is a book, and those who don&apos;t travel read only one page. 📖\n\n{hashtags}',
      'Take only pictures. Leave only footprints. 🏔️\n\n{hashtags}',
    ],
  },
  food: {
    emoji: '🍕',
    templates: [
      'Good food = Good mood 😋\n\nWould you try this?\n\n{hashtags}',
      'Life is too short for bad food. 🍽️\n\n{hashtags}',
      'Eating my feelings and they taste delicious. 🤤\n\n{hashtags}',
      'Made with love ❤️ Recipe in bio!\n\n{hashtags}',
      'This deserves a chef&apos;s kiss. 👨‍🍳💋\n\n{hashtags}',
    ],
  },
  engagement: {
    emoji: '💬',
    templates: [
      'Double tap if you agree! ❤️\n\n{hashtags}',
      'Tag someone who needs to see this! 👇\n\n{hashtags}',
      'What do you think? Comment below! 💭\n\n{hashtags}',
      'Save this for later! 📌\n\n{hashtags}',
      'Share this with someone who&apos;ll appreciate it! 💝\n\n{hashtags}',
    ],
  },
};

const DEFAULT_HASHTAGS = '#instagram #instagood #photooftheday #love #beautiful #happy #picoftheday #instadaily';

export default function CaptionTemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof CATEGORIES>('motivational');
  const [customHashtags, setCustomHashtags] = useState(DEFAULT_HASHTAGS);
  const [copied, setCopied] = useState<number | null>(null);

  const copyCaption = (index: number) => {
    const caption = CATEGORIES[selectedCategory].templates[index].replace('{hashtags}', customHashtags);
    navigator.clipboard.writeText(caption);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-full text-pink-300 text-sm mb-6">
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Caption Templates
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready-to-use Instagram caption templates for every occasion.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
          {/* Category Selection */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-400 mb-3">Choose a category</h2>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors flex items-center gap-2 ${
                    selectedCategory === cat
                      ? 'bg-pink-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <span>{CATEGORIES[cat].emoji}</span>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Hashtags */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-400 mb-2 block">Your hashtags (optional)</label>
            <textarea
              value={customHashtags}
              onChange={(e) => setCustomHashtags(e.target.value)}
              placeholder="#your #hashtags #here"
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-sm"
            />
          </div>
        </div>

        {/* Templates */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {CATEGORIES[selectedCategory].emoji} {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Captions
          </h2>
          
          {CATEGORIES[selectedCategory].templates.map((template, i) => {
            const caption = template.replace('{hashtags}', customHashtags);
            return (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 group">
                <pre className="text-white whitespace-pre-wrap font-sans text-sm mb-3">{caption}</pre>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${caption.length > 2200 ? 'text-red-400' : 'text-gray-500'}`}>
                    {caption.length}/2,200 characters
                  </span>
                  <button
                    onClick={() => copyCaption(i)}
                    className="px-4 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {copied === i ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Caption Tips</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-pink-400">📝</span>
              <p>Put the most important info in the first 125 characters (visible before &quot;more&quot;)</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-400">📌</span>
              <p>Use 3-5 hashtags in the caption, more in the first comment</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-400">💬</span>
              <p>Always include a call-to-action to boost engagement</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-pink-400">😀</span>
              <p>Use emojis to break up text and add personality</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

