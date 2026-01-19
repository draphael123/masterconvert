'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function ThreadFormatterPage() {
  const [input, setInput] = useState('');
  const [threads, setThreads] = useState<string[]>([]);
  const [maxLength, setMaxLength] = useState(280);
  const [addNumbers, setAddNumbers] = useState(true);
  const [copied, setCopied] = useState<number | null>(null);

  const formatThread = () => {
    if (!input.trim()) return;

    const words = input.split(/\s+/);
    const tweets: string[] = [];
    let currentTweet = '';
    const prefix = addNumbers ? (i: number, total: number) => `${i + 1}/${total} ` : () => '';

    // First pass: rough split
    words.forEach(word => {
      const testTweet = currentTweet ? `${currentTweet} ${word}` : word;
      
      // Account for numbering in length calculation
      const estimatedPrefix = prefix(tweets.length, Math.ceil(input.length / (maxLength - 10)));
      const adjustedMaxLength = maxLength - estimatedPrefix.length;
      
      if (testTweet.length <= adjustedMaxLength) {
        currentTweet = testTweet;
      } else {
        if (currentTweet) tweets.push(currentTweet);
        currentTweet = word;
      }
    });
    
    if (currentTweet) tweets.push(currentTweet);

    // Second pass: add numbering
    if (addNumbers) {
      const total = tweets.length;
      setThreads(tweets.map((tweet, i) => `${i + 1}/${total} ${tweet}`));
    } else {
      setThreads(tweets);
    }
  };

  const copyTweet = (index: number) => {
    navigator.clipboard.writeText(threads[index]);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(threads.join('\n\n---\n\n'));
    setCopied(-1);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-sky-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 rounded-full text-sky-300 text-sm mb-6">
            <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Twitter Thread Formatter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Split long text into tweet-sized chunks for Twitter/X threads.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Paste your long-form content
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your blog post, article, or any long text that you want to convert into a Twitter thread..."
              rows={12}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
            
            {/* Options */}
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Max chars:</label>
                <select
                  value={maxLength}
                  onChange={(e) => setMaxLength(parseInt(e.target.value))}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                >
                  <option value="280" className="bg-slate-800">280 (Twitter)</option>
                  <option value="500" className="bg-slate-800">500 (Mastodon)</option>
                  <option value="300" className="bg-slate-800">300 (Threads)</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addNumbers}
                  onChange={(e) => setAddNumbers(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-sky-600"
                />
                <span className="text-sm text-gray-300">Add numbering (1/5, 2/5...)</span>
              </label>
            </div>

            <button
              onClick={formatThread}
              disabled={!input.trim()}
              className="mt-4 w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
            >
              Split into Thread
            </button>
          </div>

          {/* Output */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Thread Preview ({threads.length} tweets)
              </h2>
              {threads.length > 0 && (
                <button
                  onClick={copyAll}
                  className="text-sm text-sky-400 hover:text-sky-300"
                >
                  {copied === -1 ? '✓ Copied!' : 'Copy All'}
                </button>
              )}
            </div>

            {threads.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {threads.map((tweet, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-sky-500/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white whitespace-pre-wrap">{tweet}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`text-xs ${tweet.length > maxLength ? 'text-red-400' : 'text-gray-500'}`}>
                            {tweet.length}/{maxLength}
                          </span>
                          <button
                            onClick={() => copyTweet(i)}
                            className="text-xs text-sky-400 hover:text-sky-300"
                          >
                            {copied === i ? '✓ Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🧵</div>
                <p>Your thread will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-4">Thread Tips</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-sky-400">🎯</span>
              <p>Start with a strong hook to capture attention</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sky-400">📊</span>
              <p>Use numbers and lists for better readability</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sky-400">💡</span>
              <p>End with a call-to-action or summary</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sky-400">🔄</span>
              <p>Post during peak engagement hours</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

