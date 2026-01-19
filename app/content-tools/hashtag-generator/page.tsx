'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface HashtagData {
  tag: string;
  tier: 'high' | 'medium' | 'niche';
  posts: string;
}

const HASHTAG_DATABASE: Record<string, HashtagData[]> = {
  marketing: [
    { tag: '#marketing', posts: '85M', tier: 'high' },
    { tag: '#digitalmarketing', posts: '52M', tier: 'high' },
    { tag: '#socialmedia', posts: '48M', tier: 'high' },
    { tag: '#contentmarketing', posts: '12M', tier: 'medium' },
    { tag: '#marketingstrategy', posts: '5M', tier: 'medium' },
    { tag: '#marketingtips', posts: '3M', tier: 'medium' },
    { tag: '#socialmediamarketing', posts: '18M', tier: 'high' },
    { tag: '#growthhacking', posts: '2M', tier: 'medium' },
    { tag: '#contentcreator', posts: '28M', tier: 'high' },
    { tag: '#digitalmarketingtips', posts: '800K', tier: 'niche' },
    { tag: '#marketingdigital', posts: '15M', tier: 'high' },
    { tag: '#onlinemarketing', posts: '6M', tier: 'medium' },
    { tag: '#b2bmarketing', posts: '450K', tier: 'niche' },
    { tag: '#contentmarketingtips', posts: '320K', tier: 'niche' },
    { tag: '#organicmarketing', posts: '180K', tier: 'niche' },
  ],
  tech: [
    { tag: '#technology', posts: '92M', tier: 'high' },
    { tag: '#tech', posts: '78M', tier: 'high' },
    { tag: '#innovation', posts: '35M', tier: 'high' },
    { tag: '#ai', posts: '25M', tier: 'high' },
    { tag: '#artificialintelligence', posts: '12M', tier: 'medium' },
    { tag: '#machinelearning', posts: '8M', tier: 'medium' },
    { tag: '#coding', posts: '22M', tier: 'high' },
    { tag: '#programming', posts: '18M', tier: 'high' },
    { tag: '#developer', posts: '15M', tier: 'high' },
    { tag: '#software', posts: '12M', tier: 'medium' },
    { tag: '#webdeveloper', posts: '3M', tier: 'medium' },
    { tag: '#datascience', posts: '5M', tier: 'medium' },
    { tag: '#techstartup', posts: '800K', tier: 'niche' },
    { tag: '#devlife', posts: '600K', tier: 'niche' },
    { tag: '#codenewbie', posts: '450K', tier: 'niche' },
  ],
  photography: [
    { tag: '#photography', posts: '250M', tier: 'high' },
    { tag: '#photooftheday', posts: '180M', tier: 'high' },
    { tag: '#photographer', posts: '85M', tier: 'high' },
    { tag: '#photo', posts: '150M', tier: 'high' },
    { tag: '#naturephotography', posts: '28M', tier: 'high' },
    { tag: '#travelphotography', posts: '35M', tier: 'high' },
    { tag: '#portrait', posts: '55M', tier: 'high' },
    { tag: '#streetphotography', posts: '18M', tier: 'high' },
    { tag: '#landscapephotography', posts: '12M', tier: 'medium' },
    { tag: '#mobilephotography', posts: '3M', tier: 'medium' },
    { tag: '#photographytips', posts: '1.2M', tier: 'niche' },
    { tag: '#beginnerphotographer', posts: '450K', tier: 'niche' },
    { tag: '#lightroommobile', posts: '380K', tier: 'niche' },
    { tag: '#photographyislife', posts: '2.5M', tier: 'medium' },
    { tag: '#shotoniphone', posts: '22M', tier: 'high' },
  ],
  fitness: [
    { tag: '#fitness', posts: '180M', tier: 'high' },
    { tag: '#workout', posts: '95M', tier: 'high' },
    { tag: '#gym', posts: '85M', tier: 'high' },
    { tag: '#fitnessmotivation', posts: '52M', tier: 'high' },
    { tag: '#health', posts: '75M', tier: 'high' },
    { tag: '#training', posts: '35M', tier: 'high' },
    { tag: '#bodybuilding', posts: '28M', tier: 'high' },
    { tag: '#fitfam', posts: '45M', tier: 'high' },
    { tag: '#homeworkout', posts: '8M', tier: 'medium' },
    { tag: '#fitnesstips', posts: '3M', tier: 'medium' },
    { tag: '#strengthtraining', posts: '5M', tier: 'medium' },
    { tag: '#fitnessjourney', posts: '18M', tier: 'high' },
    { tag: '#workoutmotivation', posts: '2.5M', tier: 'medium' },
    { tag: '#fitnessgirl', posts: '12M', tier: 'medium' },
    { tag: '#personaltrainer', posts: '6M', tier: 'medium' },
  ],
  food: [
    { tag: '#food', posts: '450M', tier: 'high' },
    { tag: '#foodie', posts: '180M', tier: 'high' },
    { tag: '#foodporn', posts: '280M', tier: 'high' },
    { tag: '#instafood', posts: '195M', tier: 'high' },
    { tag: '#foodphotography', posts: '52M', tier: 'high' },
    { tag: '#yummy', posts: '85M', tier: 'high' },
    { tag: '#delicious', posts: '78M', tier: 'high' },
    { tag: '#cooking', posts: '45M', tier: 'high' },
    { tag: '#homemade', posts: '55M', tier: 'high' },
    { tag: '#healthyfood', posts: '62M', tier: 'high' },
    { tag: '#foodblogger', posts: '28M', tier: 'high' },
    { tag: '#recipeshare', posts: '2M', tier: 'medium' },
    { tag: '#easyrecipes', posts: '3.5M', tier: 'medium' },
    { tag: '#foodlover', posts: '18M', tier: 'high' },
    { tag: '#homecooking', posts: '8M', tier: 'medium' },
  ],
  travel: [
    { tag: '#travel', posts: '620M', tier: 'high' },
    { tag: '#traveling', posts: '85M', tier: 'high' },
    { tag: '#travelphotography', posts: '35M', tier: 'high' },
    { tag: '#travelgram', posts: '145M', tier: 'high' },
    { tag: '#wanderlust', posts: '135M', tier: 'high' },
    { tag: '#adventure', posts: '125M', tier: 'high' },
    { tag: '#explore', posts: '165M', tier: 'high' },
    { tag: '#vacation', posts: '65M', tier: 'high' },
    { tag: '#travelblogger', posts: '32M', tier: 'high' },
    { tag: '#instatravel', posts: '95M', tier: 'high' },
    { tag: '#traveltheworld', posts: '28M', tier: 'high' },
    { tag: '#traveltips', posts: '5M', tier: 'medium' },
    { tag: '#solotravel', posts: '12M', tier: 'medium' },
    { tag: '#budgettravel', posts: '3M', tier: 'medium' },
    { tag: '#digitalnomad', posts: '8M', tier: 'medium' },
  ],
  business: [
    { tag: '#business', posts: '95M', tier: 'high' },
    { tag: '#entrepreneur', posts: '75M', tier: 'high' },
    { tag: '#success', posts: '85M', tier: 'high' },
    { tag: '#motivation', posts: '180M', tier: 'high' },
    { tag: '#smallbusiness', posts: '48M', tier: 'high' },
    { tag: '#startup', posts: '25M', tier: 'high' },
    { tag: '#entrepreneurship', posts: '32M', tier: 'high' },
    { tag: '#businessowner', posts: '18M', tier: 'high' },
    { tag: '#mindset', posts: '45M', tier: 'high' },
    { tag: '#goals', posts: '55M', tier: 'high' },
    { tag: '#leadership', posts: '12M', tier: 'medium' },
    { tag: '#ceo', posts: '5M', tier: 'medium' },
    { tag: '#entrepreneurlife', posts: '8M', tier: 'medium' },
    { tag: '#startuplife', posts: '3M', tier: 'medium' },
    { tag: '#businesstips', posts: '2.5M', tier: 'medium' },
  ],
  lifestyle: [
    { tag: '#lifestyle', posts: '165M', tier: 'high' },
    { tag: '#life', posts: '185M', tier: 'high' },
    { tag: '#love', posts: '2B', tier: 'high' },
    { tag: '#happy', posts: '650M', tier: 'high' },
    { tag: '#instagood', posts: '1.5B', tier: 'high' },
    { tag: '#beautiful', posts: '750M', tier: 'high' },
    { tag: '#inspiration', posts: '125M', tier: 'high' },
    { tag: '#goodvibes', posts: '78M', tier: 'high' },
    { tag: '#positivity', posts: '35M', tier: 'high' },
    { tag: '#wellness', posts: '55M', tier: 'high' },
    { tag: '#selfcare', posts: '48M', tier: 'high' },
    { tag: '#mindfulness', posts: '28M', tier: 'high' },
    { tag: '#dailyinspiration', posts: '3M', tier: 'medium' },
    { tag: '#lifestyleblogger', posts: '12M', tier: 'medium' },
    { tag: '#slowliving', posts: '5M', tier: 'medium' },
  ],
};

// Hashtags that are shadowbanned or problematic on Instagram
const BANNED_HASHTAGS = [
  '#adulting', '#alone', '#always', '#armparty', '#asia', '#attractive',
  '#beautyblogger', '#besties', '#bikinibody', '#books', '#brain',
  '#costumes', '#curvygirls', '#date', '#dating', '#desk', '#direct',
  '#dm', '#dogsofinstagram', '#easter', '#edm', '#elevator', '#fishnets',
  '#fitnessgirls', '#girlsonly', '#gloves', '#goddess', '#graffiti',
  '#happythanksgiving', '#hardworkpaysoff', '#hawks', '#humpday',
  '#hustler', '#ig', '#iphoneography', '#italiano', '#kansas', '#kickoff',
  '#killer', '#killingit', '#kissing', '#l4l', '#lean', '#leaves',
  '#like', '#likeback', '#likeforlike', '#loseweight', '#losing',
  '#master', '#mileycyrus', '#milf', '#mirrorphoto', '#models',
  '#mustfollow', '#nasty', '#newyears', '#newyearsday', '#nudity',
  '#obsessed', '#overnight', '#parties', '#photography', '#popular',
  '#pornfood', '#prettygirl', '#publicrelations', '#pushups', '#rate',
  '#ravens', '#saltwater', '#selfharm', '#shower', '#single', '#singlelife',
  '#skateboarding', '#snap', '#snapchat', '#snowstorm', '#sopretty',
  '#stranger', '#streetphoto', '#stud', '#sunbathing', '#swole', '#tag4like',
  '#tagsforlikes', '#tbt', '#thought', '#todayimwearing', '#tongue',
  '#treasures', '#twerking', '#underage', '#valentinesday', '#weed',
  '#workflow', '#wtf', '#young',
];

const CATEGORIES = Object.keys(HASHTAG_DATABASE);

interface SavedSet {
  name: string;
  hashtags: string[];
}

export default function HashtagGeneratorPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [generatedHashtags, setGeneratedHashtags] = useState<HashtagData[]>([]);
  const [copied, setCopied] = useState(false);
  const [hashtagCount, setHashtagCount] = useState(15);
  const [showTiers, setShowTiers] = useState(true);
  const [filterTier, setFilterTier] = useState<'all' | 'high' | 'medium' | 'niche'>('all');
  const [savedSets, setSavedSets] = useState<SavedSet[]>([]);
  const [setName, setSetName] = useState('');

  // Load saved sets from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('fileforge-hashtag-sets');
    if (stored) {
      try {
        setSavedSets(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load saved sets:', e);
      }
    }
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const generateHashtags = () => {
    const hashtags = new Map<string, HashtagData>();

    // Add keyword-based hashtags
    if (keyword.trim()) {
      const words = keyword.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) {
          hashtags.set(`#${word}`, { tag: `#${word}`, tier: 'niche', posts: 'Custom' });
          hashtags.set(`#${word}s`, { tag: `#${word}s`, tier: 'niche', posts: 'Custom' });
        }
      });
      if (words.length > 1) {
        hashtags.set(`#${words.join('')}`, { tag: `#${words.join('')}`, tier: 'niche', posts: 'Custom' });
      }
    }

    // Add from selected categories
    selectedCategories.forEach(cat => {
      HASHTAG_DATABASE[cat]?.forEach(h => {
        if (filterTier === 'all' || h.tier === filterTier) {
          hashtags.set(h.tag, h);
        }
      });
    });

    // If no categories selected but keyword exists, try to match
    if (selectedCategories.size === 0 && keyword.trim()) {
      const keywordLower = keyword.toLowerCase();
      CATEGORIES.forEach(cat => {
        if (keywordLower.includes(cat) || cat.includes(keywordLower)) {
          HASHTAG_DATABASE[cat]?.forEach(h => {
            if (filterTier === 'all' || h.tier === filterTier) {
              hashtags.set(h.tag, h);
            }
          });
        }
      });
    }

    // Remove banned hashtags
    BANNED_HASHTAGS.forEach(banned => {
      hashtags.delete(banned.toLowerCase());
    });

    // Shuffle and limit
    const result = Array.from(hashtags.values())
      .sort(() => Math.random() - 0.5)
      .slice(0, hashtagCount);

    setGeneratedHashtags(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHashtags.map(h => h.tag).join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const removeHashtag = (tag: string) => {
    setGeneratedHashtags(prev => prev.filter(h => h.tag !== tag));
  };

  const isBanned = (tag: string) => {
    return BANNED_HASHTAGS.includes(tag.toLowerCase());
  };

  const saveSet = () => {
    if (!setName.trim() || generatedHashtags.length === 0) return;
    
    const newSet: SavedSet = {
      name: setName,
      hashtags: generatedHashtags.map(h => h.tag),
    };
    
    const newSets = [...savedSets, newSet];
    setSavedSets(newSets);
    localStorage.setItem('fileforge-hashtag-sets', JSON.stringify(newSets));
    setSetName('');
  };

  const loadSet = (set: SavedSet) => {
    setGeneratedHashtags(set.hashtags.map(tag => ({
      tag,
      tier: 'medium' as const,
      posts: 'Saved',
    })));
  };

  const deleteSet = (index: number) => {
    const newSets = savedSets.filter((_, i) => i !== index);
    setSavedSets(newSets);
    localStorage.setItem('fileforge-hashtag-sets', JSON.stringify(newSets));
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'niche': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 rounded-full text-pink-300 text-sm mb-6">
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hashtag Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate relevant hashtags with popularity tiers and banned tag detection.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Topic or keyword
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., digital marketing, travel photography"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Categories
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

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
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

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Filter by tier</label>
                <div className="flex gap-2">
                  {['all', 'high', 'medium', 'niche'].map(tier => (
                    <button
                      key={tier}
                      onClick={() => setFilterTier(tier as any)}
                      className={`flex-1 py-1.5 rounded-lg text-xs capitalize ${
                        filterTier === tier ? 'bg-pink-600 text-white' : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={generateHashtags}
              className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-semibold transition-colors"
            >
              Generate Hashtags
            </button>

            {/* Saved Sets */}
            {savedSets.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Saved Sets</h3>
                <div className="space-y-2">
                  {savedSets.map((set, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        onClick={() => loadSet(set)}
                        className="flex-1 text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white"
                      >
                        {set.name} ({set.hashtags.length})
                      </button>
                      <button
                        onClick={() => deleteSet(i)}
                        className="text-red-400 hover:text-red-300 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Generated Hashtags ({generatedHashtags.length})
              </h2>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTiers}
                    onChange={(e) => setShowTiers(e.target.checked)}
                    className="rounded"
                  />
                  Show tiers
                </label>
                {generatedHashtags.length > 0 && (
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {copied ? '✓ Copied!' : 'Copy All'}
                  </button>
                )}
              </div>
            </div>

            {generatedHashtags.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {generatedHashtags.map((h, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg group border ${getTierColor(h.tier)}`}
                    >
                      <span>{h.tag}</span>
                      {showTiers && (
                        <span className="text-xs opacity-60">({h.posts})</span>
                      )}
                      <button
                        onClick={() => removeHashtag(h.tag)}
                        className="opacity-0 group-hover:opacity-100 ml-1 text-current hover:text-white transition-opacity"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Tier Legend */}
                <div className="flex flex-wrap gap-4 mb-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500/50"></div>
                    <span className="text-gray-400">High competition (1M+ posts)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-amber-500/50"></div>
                    <span className="text-gray-400">Medium (100K-1M posts)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500/50"></div>
                    <span className="text-gray-400">Niche (&lt;100K posts)</span>
                  </div>
                </div>

                {/* Save Set */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={setName}
                    onChange={(e) => setSetName(e.target.value)}
                    placeholder="Set name..."
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  />
                  <button
                    onClick={saveSet}
                    disabled={!setName.trim()}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg text-sm"
                  >
                    Save Set
                  </button>
                </div>

                {/* Copy Preview */}
                <div className="p-4 bg-slate-900 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2">Copy-ready format:</p>
                  <p className="text-gray-300 text-sm break-all">{generatedHashtags.map(h => h.tag).join(' ')}</p>
                </div>

                <div className="mt-4 flex justify-between text-xs text-gray-400">
                  <span>{generatedHashtags.map(h => h.tag).join(' ').length} characters</span>
                  <span className={generatedHashtags.map(h => h.tag).join(' ').length > 2200 ? 'text-red-400' : ''}>
                    Instagram limit: 2,200 chars
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <div className="text-6xl mb-4">#</div>
                <p className="text-lg">Generate hashtags to get started</p>
                <p className="text-sm mt-2">Select categories or enter a topic</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips & Banned Tags Warning */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4">💡 Hashtag Strategy Tips</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-pink-400">•</span>
                <p><strong>Mix tiers:</strong> Use 30% high, 40% medium, 30% niche hashtags</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-pink-400">•</span>
                <p><strong>Instagram:</strong> 5-15 hashtags in caption, rest in first comment</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-pink-400">•</span>
                <p><strong>TikTok:</strong> 3-5 highly relevant hashtags work best</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-pink-400">•</span>
                <p><strong>LinkedIn:</strong> 3-5 hashtags max, niche tags perform better</p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-red-300 mb-4">⚠️ Banned/Shadowbanned Tags</h2>
            <p className="text-sm text-gray-300 mb-3">
              Some hashtags are restricted by Instagram and can hurt your reach. 
              This tool automatically filters them out, including:
            </p>
            <div className="flex flex-wrap gap-2">
              {BANNED_HASHTAGS.slice(0, 15).map(tag => (
                <span key={tag} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                  {tag}
                </span>
              ))}
              <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                +{BANNED_HASHTAGS.length - 15} more
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
