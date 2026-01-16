'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Stats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: string;
  speakingTime: string;
}

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<Stats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: '0 sec',
    speakingTime: '0 sec',
  });

  useEffect(() => {
    calculateStats(text);
  }, [text]);

  const calculateStats = (input: string) => {
    const characters = input.length;
    const charactersNoSpaces = input.replace(/\s/g, '').length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const sentences = input.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = input.split(/\n\n+/).filter(p => p.trim()).length;
    const lines = input.split('\n').length;
    
    // Average reading speed: 200-250 words per minute
    const readingMinutes = words / 225;
    const readingTime = formatTime(readingMinutes);
    
    // Average speaking speed: 125-150 words per minute
    const speakingMinutes = words / 137;
    const speakingTime = formatTime(speakingMinutes);

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
    });
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)} sec`;
    } else if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours} hr ${mins} min`;
    }
  };

  const statCards = [
    { label: 'Characters', value: stats.characters.toLocaleString(), icon: '📝' },
    { label: 'Characters (no spaces)', value: stats.charactersNoSpaces.toLocaleString(), icon: '✏️' },
    { label: 'Words', value: stats.words.toLocaleString(), icon: '📖' },
    { label: 'Sentences', value: stats.sentences.toLocaleString(), icon: '💬' },
    { label: 'Paragraphs', value: stats.paragraphs.toLocaleString(), icon: '📄' },
    { label: 'Lines', value: stats.lines.toLocaleString(), icon: '📑' },
    { label: 'Reading Time', value: stats.readingTime, icon: '⏱️' },
    { label: 'Speaking Time', value: stats.speakingTime, icon: '🎤' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Word Counter
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Count words, characters, sentences, and estimate reading time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Text Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Your Text</h2>
            <button
              onClick={() => setText('')}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Tips */}
        <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6">
          <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
            💡 Did You Know?
          </h3>
          <ul className="text-sm text-indigo-700 dark:text-indigo-400 space-y-1">
            <li>• A typical blog post is 1,500-2,500 words (7-12 min read)</li>
            <li>• Twitter/X posts are limited to 280 characters</li>
            <li>• Average reading speed is 200-250 words per minute</li>
            <li>• Average speaking speed is 125-150 words per minute</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}


