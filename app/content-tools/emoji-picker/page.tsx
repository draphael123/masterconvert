'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const EMOJI_DATA: Record<string, { emoji: string; name: string }[]> = {
  'Smileys': [
    { emoji: '😀', name: 'grinning' }, { emoji: '😃', name: 'smiley' }, { emoji: '😄', name: 'smile' },
    { emoji: '😁', name: 'grin' }, { emoji: '😅', name: 'sweat smile' }, { emoji: '😂', name: 'joy' },
    { emoji: '🤣', name: 'rofl' }, { emoji: '😊', name: 'blush' }, { emoji: '😇', name: 'innocent' },
    { emoji: '🙂', name: 'slight smile' }, { emoji: '😉', name: 'wink' }, { emoji: '😍', name: 'heart eyes' },
    { emoji: '🥰', name: 'smiling hearts' }, { emoji: '😘', name: 'kissing heart' }, { emoji: '😋', name: 'yum' },
    { emoji: '😎', name: 'sunglasses' }, { emoji: '🤩', name: 'star struck' }, { emoji: '🥳', name: 'partying' },
    { emoji: '😏', name: 'smirk' }, { emoji: '😒', name: 'unamused' }, { emoji: '😔', name: 'pensive' },
    { emoji: '😢', name: 'cry' }, { emoji: '😭', name: 'sob' }, { emoji: '😤', name: 'triumph' },
    { emoji: '😡', name: 'rage' }, { emoji: '🤯', name: 'exploding head' }, { emoji: '😱', name: 'scream' },
    { emoji: '🤔', name: 'thinking' }, { emoji: '🤫', name: 'shushing' }, { emoji: '🤭', name: 'hand over mouth' },
  ],
  'Gestures': [
    { emoji: '👍', name: 'thumbs up' }, { emoji: '👎', name: 'thumbs down' }, { emoji: '👌', name: 'ok' },
    { emoji: '✌️', name: 'peace' }, { emoji: '🤞', name: 'crossed fingers' }, { emoji: '🤟', name: 'love you' },
    { emoji: '🤘', name: 'rock' }, { emoji: '👋', name: 'wave' }, { emoji: '🙌', name: 'raised hands' },
    { emoji: '👏', name: 'clap' }, { emoji: '🤝', name: 'handshake' }, { emoji: '🙏', name: 'pray' },
    { emoji: '💪', name: 'muscle' }, { emoji: '🖐️', name: 'hand' }, { emoji: '☝️', name: 'point up' },
    { emoji: '👆', name: 'pointing up' }, { emoji: '👇', name: 'pointing down' }, { emoji: '👈', name: 'pointing left' },
    { emoji: '👉', name: 'pointing right' }, { emoji: '✊', name: 'fist' }, { emoji: '👊', name: 'punch' },
  ],
  'Hearts': [
    { emoji: '❤️', name: 'red heart' }, { emoji: '🧡', name: 'orange heart' }, { emoji: '💛', name: 'yellow heart' },
    { emoji: '💚', name: 'green heart' }, { emoji: '💙', name: 'blue heart' }, { emoji: '💜', name: 'purple heart' },
    { emoji: '🖤', name: 'black heart' }, { emoji: '🤍', name: 'white heart' }, { emoji: '💔', name: 'broken heart' },
    { emoji: '💕', name: 'two hearts' }, { emoji: '💖', name: 'sparkling heart' }, { emoji: '💗', name: 'growing heart' },
    { emoji: '💝', name: 'gift heart' }, { emoji: '💘', name: 'cupid' }, { emoji: '💞', name: 'revolving hearts' },
  ],
  'Objects': [
    { emoji: '📱', name: 'phone' }, { emoji: '💻', name: 'laptop' }, { emoji: '🖥️', name: 'desktop' },
    { emoji: '📷', name: 'camera' }, { emoji: '🎥', name: 'video camera' }, { emoji: '📺', name: 'tv' },
    { emoji: '🔊', name: 'speaker' }, { emoji: '🎵', name: 'music note' }, { emoji: '🎶', name: 'music notes' },
    { emoji: '📚', name: 'books' }, { emoji: '📝', name: 'memo' }, { emoji: '✏️', name: 'pencil' },
    { emoji: '📧', name: 'email' }, { emoji: '📩', name: 'envelope' }, { emoji: '💡', name: 'lightbulb' },
    { emoji: '🔑', name: 'key' }, { emoji: '🔒', name: 'lock' }, { emoji: '💰', name: 'money bag' },
  ],
  'Symbols': [
    { emoji: '✅', name: 'check mark' }, { emoji: '❌', name: 'cross mark' }, { emoji: '⭐', name: 'star' },
    { emoji: '🌟', name: 'glowing star' }, { emoji: '💥', name: 'boom' }, { emoji: '💫', name: 'dizzy' },
    { emoji: '🔥', name: 'fire' }, { emoji: '✨', name: 'sparkles' }, { emoji: '💯', name: '100' },
    { emoji: '❗', name: 'exclamation' }, { emoji: '❓', name: 'question' }, { emoji: '💬', name: 'speech bubble' },
    { emoji: '🔔', name: 'bell' }, { emoji: '🎯', name: 'target' }, { emoji: '🏆', name: 'trophy' },
    { emoji: '🎉', name: 'party' }, { emoji: '🎊', name: 'confetti' }, { emoji: '🎁', name: 'gift' },
  ],
  'Arrows': [
    { emoji: '➡️', name: 'right arrow' }, { emoji: '⬅️', name: 'left arrow' }, { emoji: '⬆️', name: 'up arrow' },
    { emoji: '⬇️', name: 'down arrow' }, { emoji: '↗️', name: 'up-right' }, { emoji: '↘️', name: 'down-right' },
    { emoji: '↙️', name: 'down-left' }, { emoji: '↖️', name: 'up-left' }, { emoji: '🔄', name: 'refresh' },
    { emoji: '🔃', name: 'clockwise' }, { emoji: '🔙', name: 'back' }, { emoji: '🔚', name: 'end' },
  ],
  'Nature': [
    { emoji: '☀️', name: 'sun' }, { emoji: '🌙', name: 'moon' }, { emoji: '⭐', name: 'star' },
    { emoji: '🌈', name: 'rainbow' }, { emoji: '🌸', name: 'cherry blossom' }, { emoji: '🌺', name: 'hibiscus' },
    { emoji: '🌻', name: 'sunflower' }, { emoji: '🍀', name: 'four leaf clover' }, { emoji: '🌿', name: 'herb' },
    { emoji: '🌴', name: 'palm tree' }, { emoji: '🌲', name: 'evergreen' }, { emoji: '🏔️', name: 'mountain' },
  ],
};

const CATEGORIES = Object.keys(EMOJI_DATA);

export default function EmojiPickerPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Smileys');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const filteredEmojis = useMemo(() => {
    if (search.trim()) {
      const query = search.toLowerCase();
      const results: { emoji: string; name: string }[] = [];
      Object.values(EMOJI_DATA).forEach(emojis => {
        emojis.forEach(e => {
          if (e.name.includes(query)) results.push(e);
        });
      });
      return results;
    }
    return EMOJI_DATA[selectedCategory] || [];
  }, [search, selectedCategory]);

  const copyEmoji = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setCopied(emoji);
    setTimeout(() => setCopied(null), 1000);
    
    // Add to recent
    setRecentEmojis(prev => {
      const next = [emoji, ...prev.filter(e => e !== emoji)].slice(0, 12);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-yellow-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-yellow-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/content-tools" className="text-gray-300 hover:text-white transition-colors">← Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full text-yellow-300 text-sm mb-6">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            Content Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Emoji Picker
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Search and copy emojis for your content. Click any emoji to copy.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emojis... (e.g., smile, heart, fire)"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Recent */}
          {recentEmojis.length > 0 && !search && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Recently Used</h3>
              <div className="flex flex-wrap gap-2">
                {recentEmojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => copyEmoji(emoji)}
                    className="w-10 h-10 text-2xl bg-white/5 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {!search && (
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat
                      ? 'bg-yellow-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Emoji Grid */}
          <div className="grid grid-cols-8 md:grid-cols-12 gap-2">
            {filteredEmojis.map((item, i) => (
              <button
                key={i}
                onClick={() => copyEmoji(item.emoji)}
                className={`w-10 h-10 text-2xl rounded-lg transition-all hover:scale-110 ${
                  copied === item.emoji ? 'bg-green-500/30' : 'bg-white/5 hover:bg-white/20'
                }`}
                title={item.name}
              >
                {item.emoji}
              </button>
            ))}
          </div>

          {filteredEmojis.length === 0 && (
            <p className="text-center text-gray-500 py-8">No emojis found for &quot;{search}&quot;</p>
          )}

          {/* Copy Notification */}
          {copied && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg animate-fade-in">
              Copied {copied}!
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

