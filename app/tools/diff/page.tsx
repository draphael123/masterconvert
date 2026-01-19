'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber: number;
}

export default function DiffPage() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [stats, setStats] = useState({ added: 0, removed: 0, unchanged: 0 });

  const computeDiff = () => {
    if (!text1.trim() && !text2.trim()) {
      toast.error('Please enter text in both fields');
      return;
    }

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    // Simple line-by-line diff
    const result: DiffLine[] = [];
    let added = 0, removed = 0, unchanged = 0;
    
    const maxLen = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];
      
      if (line1 === undefined) {
        result.push({ type: 'added', content: line2, lineNumber: i + 1 });
        added++;
      } else if (line2 === undefined) {
        result.push({ type: 'removed', content: line1, lineNumber: i + 1 });
        removed++;
      } else if (line1 === line2) {
        result.push({ type: 'unchanged', content: line1, lineNumber: i + 1 });
        unchanged++;
      } else {
        result.push({ type: 'removed', content: line1, lineNumber: i + 1 });
        result.push({ type: 'added', content: line2, lineNumber: i + 1 });
        added++;
        removed++;
      }
    }
    
    setDiff(result);
    setStats({ added, removed, unchanged });
    toast.success('Diff computed!');
  };

  const clearAll = () => {
    setText1('');
    setText2('');
    setDiff([]);
    setStats({ added: 0, removed: 0, unchanged: 0 });
  };

  const swapTexts = () => {
    const temp = text1;
    setText1(text2);
    setText2(temp);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Text Diff Checker
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Compare two texts and highlight the differences
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Original Text</h2>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Enter original text..."
              className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Modified Text</h2>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Enter modified text..."
              className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={computeDiff}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Compare
          </button>
          <button
            onClick={swapTexts}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            ⇄ Swap
          </button>
          <button
            onClick={clearAll}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Clear
          </button>
        </div>

        {diff.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Diff Result</h2>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600 dark:text-green-400">+{stats.added} added</span>
                <span className="text-red-600 dark:text-red-400">-{stats.removed} removed</span>
                <span className="text-gray-500">{stats.unchanged} unchanged</span>
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-auto">
                {diff.map((line, index) => (
                  <div
                    key={index}
                    className={`flex font-mono text-sm ${
                      line.type === 'added'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                        : line.type === 'removed'
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="w-12 px-2 py-1 text-right text-gray-400 border-r border-gray-200 dark:border-gray-700 select-none">
                      {line.lineNumber}
                    </span>
                    <span className="w-6 px-1 py-1 text-center border-r border-gray-200 dark:border-gray-700 select-none">
                      {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                    </span>
                    <span className="flex-1 px-3 py-1 whitespace-pre">
                      {line.content || ' '}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}



