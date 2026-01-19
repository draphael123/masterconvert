'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HOOK_FORMULAS = {
  curiosity: {
    name: 'Curiosity Gap',
    icon: '🤔',
    templates: [
      "The thing nobody tells you about {topic}...",
      "I wish I knew this about {topic} sooner",
      "Why {topic} isn't what you think it is",
      "The hidden truth about {topic}",
      "What experts won't tell you about {topic}",
      "{topic} is broken. Here's why.",
      "Everyone's doing {topic} wrong",
      "The {topic} secret that changed everything",
    ],
  },
  controversial: {
    name: 'Hot Take',
    icon: '🔥',
    templates: [
      "Unpopular opinion: {topic} is overrated",
      "Hot take: Most {topic} advice is wrong",
      "I'm going to get hate for this but... {topic}",
      "Stop gatekeeping {topic}",
      "{topic} is a scam. Here's proof.",
      "The {topic} industry doesn't want you to know this",
      "Why I quit {topic} (and what I do instead)",
      "Controversial {topic} opinion incoming 👇",
    ],
  },
  story: {
    name: 'Story Hook',
    icon: '📖',
    templates: [
      "3 years ago I knew nothing about {topic}. Now...",
      "I spent $10K learning {topic} so you don't have to",
      "How I went from zero to {topic} expert in 6 months",
      "The day I almost quit {topic}",
      "What happened when I tried {topic} for 30 days",
      "My {topic} journey (the unfiltered version)",
      "The mistake that taught me everything about {topic}",
      "I was today years old when I learned this about {topic}",
    ],
  },
  pov: {
    name: 'POV/Relatable',
    icon: '👀',
    templates: [
      "POV: You finally understand {topic}",
      "POV: You're struggling with {topic}",
      "Me explaining {topic} to myself for the 100th time",
      "When someone says {topic} is easy 💀",
      "Tell me you're into {topic} without telling me",
      "That moment when {topic} finally clicks",
      "Nobody: ... Me: *obsessing over {topic}*",
      "{topic} people will understand 😂",
    ],
  },
  value: {
    name: 'Value Promise',
    icon: '💎',
    templates: [
      "5 {topic} tips that actually work",
      "The only {topic} guide you'll ever need",
      "Master {topic} in 60 seconds",
      "Free {topic} cheat sheet 👇",
      "{topic} 101: Everything you need to know",
      "Save this {topic} post for later",
      "Bookmark this {topic} breakdown",
      "The {topic} framework that 10x'd my results",
    ],
  },
  question: {
    name: 'Question Hook',
    icon: '❓',
    templates: [
      "Why isn't anyone talking about {topic}?",
      "Am I the only one who thinks {topic}...?",
      "What's your biggest {topic} struggle?",
      "Can we talk about {topic} for a second?",
      "Is {topic} worth it? Let's break it down.",
      "What would you do if {topic}...?",
      "How are people still getting {topic} wrong in 2024?",
      "Who else is obsessed with {topic}?",
    ],
  },
  authority: {
    name: 'Authority/Results',
    icon: '🏆',
    templates: [
      "After 10 years in {topic}, here's what I know",
      "I've helped 500+ people with {topic}. Here's what works.",
      "The {topic} strategy that generated $100K",
      "Why top performers do {topic} differently",
      "{topic} advice from someone who's actually done it",
      "What I learned from the best in {topic}",
      "The {topic} playbook used by industry leaders",
      "How the top 1% approach {topic}",
    ],
  },
  urgency: {
    name: 'Urgency/FOMO',
    icon: '⚡',
    templates: [
      "Stop scrolling. This {topic} tip is important.",
      "You're losing money by ignoring {topic}",
      "The {topic} opportunity everyone's missing",
      "If you're not doing {topic}, you're behind",
      "This {topic} hack expires soon",
      "Don't make these {topic} mistakes in 2024",
      "The {topic} trend you need to know NOW",
      "Last chance to fix your {topic} strategy",
    ],
  },
};

const PLATFORMS = {
  instagram: { name: 'Instagram', icon: '📷', maxLength: 2200, hookMaxLength: 125 },
  tiktok: { name: 'TikTok', icon: '🎵', maxLength: 2200, hookMaxLength: 150 },
  twitter: { name: 'Twitter/X', icon: '🐦', maxLength: 280, hookMaxLength: 100 },
  linkedin: { name: 'LinkedIn', icon: '💼', maxLength: 3000, hookMaxLength: 210 },
  youtube: { name: 'YouTube', icon: '▶️', maxLength: 5000, hookMaxLength: 60 },
};

export default function HookGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [selectedFormulas, setSelectedFormulas] = useState<Set<string>>(new Set(['curiosity', 'value', 'story']));
  const [platform, setPlatform] = useState<keyof typeof PLATFORMS>('instagram');
  const [generatedHooks, setGeneratedHooks] = useState<{ hook: string; formula: string }[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [savedHooks, setSavedHooks] = useState<string[]>([]);

  const toggleFormula = (formula: string) => {
    setSelectedFormulas(prev => {
      const next = new Set(prev);
      if (next.has(formula)) {
        if (next.size > 1) next.delete(formula);
      } else {
        next.add(formula);
      }
      return next;
    });
  };

  const generateHooks = () => {
    if (!topic.trim()) return;

    const hooks: { hook: string; formula: string }[] = [];
    
    selectedFormulas.forEach(formulaKey => {
      const formula = HOOK_FORMULAS[formulaKey as keyof typeof HOOK_FORMULAS];
      formula.templates.forEach(template => {
        const hook = template.replace(/{topic}/g, topic.trim());
        hooks.push({ hook, formula: formula.name });
      });
    });

    // Shuffle and limit
    const shuffled = hooks.sort(() => Math.random() - 0.5);
    setGeneratedHooks(shuffled);
  };

  const copyHook = (index: number) => {
    navigator.clipboard.writeText(generatedHooks[index].hook);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  const saveHook = (hook: string) => {
    if (!savedHooks.includes(hook)) {
      const newSaved = [...savedHooks, hook];
      setSavedHooks(newSaved);
      localStorage.setItem('fileforge-saved-hooks', JSON.stringify(newSaved));
    }
  };

  const platformInfo = PLATFORMS[platform];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-900 to-slate-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 rounded-full text-rose-300 text-sm mb-6">
            <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hook Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate scroll-stopping hooks that capture attention in the first line.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What&apos;s your topic or niche?
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., content marketing, fitness, cooking..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Platform
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PLATFORMS).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => setPlatform(key as keyof typeof PLATFORMS)}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                      platform === key
                        ? 'bg-rose-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <span>{p.icon}</span>
                    {p.name}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                First {platformInfo.hookMaxLength} chars visible before &quot;more&quot;
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Hook Formulas
              </label>
              <div className="space-y-2">
                {Object.entries(HOOK_FORMULAS).map(([key, formula]) => (
                  <button
                    key={key}
                    onClick={() => toggleFormula(key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm text-left flex items-center gap-2 transition-colors ${
                      selectedFormulas.has(key)
                        ? 'bg-rose-600/30 border border-rose-500/50 text-white'
                        : 'bg-white/5 border border-transparent text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{formula.icon}</span>
                    <span className="flex-1">{formula.name}</span>
                    {selectedFormulas.has(key) && <span className="text-rose-400">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateHooks}
              disabled={!topic.trim()}
              className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors text-lg"
            >
              🪝 Generate Hooks
            </button>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Generated Hooks ({generatedHooks.length})
                </h2>
                {generatedHooks.length > 0 && (
                  <button
                    onClick={generateHooks}
                    className="text-sm text-rose-400 hover:text-rose-300"
                  >
                    🔄 Regenerate
                  </button>
                )}
              </div>

              {generatedHooks.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {generatedHooks.map((item, i) => {
                    const isLong = item.hook.length > platformInfo.hookMaxLength;
                    return (
                      <div
                        key={i}
                        className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-rose-500/50 transition-colors group"
                      >
                        <p className="text-white mb-2">{item.hook}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-gray-400">
                              {item.formula}
                            </span>
                            <span className={`text-xs ${isLong ? 'text-amber-400' : 'text-gray-500'}`}>
                              {item.hook.length} chars {isLong && '(may be truncated)'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => saveHook(item.hook)}
                              className="text-xs text-gray-400 hover:text-rose-400"
                              title="Save hook"
                            >
                              ♡
                            </button>
                            <button
                              onClick={() => copyHook(i)}
                              className="text-xs text-rose-400 hover:text-rose-300"
                            >
                              {copied === i ? '✓ Copied!' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <div className="text-6xl mb-4">🪝</div>
                  <p className="text-lg">Enter your topic and generate hooks</p>
                  <p className="text-sm mt-2">Select different formulas for variety</p>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">🎯 Hook Best Practices</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  <p><strong>Front-load value</strong> — First 5 words must grab attention</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  <p><strong>Create curiosity</strong> — Make them NEED to read more</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  <p><strong>Be specific</strong> — Numbers and details outperform vague claims</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-400">•</span>
                  <p><strong>Test variations</strong> — A/B test hooks on the same content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

