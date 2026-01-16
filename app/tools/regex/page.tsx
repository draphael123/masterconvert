'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Match {
  text: string;
  index: number;
  groups?: Record<string, string>;
}

export default function RegexPage() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [highlightedText, setHighlightedText] = useState<React.ReactNode>('');

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testString]);

  const testRegex = () => {
    setError('');
    setMatches([]);

    if (!pattern || !testString) {
      setHighlightedText(testString);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const foundMatches: Match[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            text: match[0],
            index: match.index,
            groups: match.groups,
          });
          // Prevent infinite loops for zero-length matches
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            text: match[0],
            index: match.index,
            groups: match.groups,
          });
        }
      }

      setMatches(foundMatches);

      // Create highlighted text
      if (foundMatches.length > 0) {
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        foundMatches.forEach((m, i) => {
          if (m.index > lastIndex) {
            parts.push(testString.slice(lastIndex, m.index));
          }
          parts.push(
            <mark key={i} className="bg-yellow-300 dark:bg-yellow-600 px-0.5 rounded">
              {m.text}
            </mark>
          );
          lastIndex = m.index + m.text.length;
        });

        if (lastIndex < testString.length) {
          parts.push(testString.slice(lastIndex));
        }

        setHighlightedText(parts);
      } else {
        setHighlightedText(testString);
      }
    } catch (e: any) {
      setError(e.message);
      setHighlightedText(testString);
    }
  };

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''));
    } else {
      setFlags(flags + flag);
    }
  };

  const commonPatterns = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: 'URL', pattern: 'https?://[\\w.-]+(?:/[\\w.-]*)*' },
    { name: 'Phone', pattern: '\\+?\\d{1,3}[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
    { name: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
    { name: 'Hex Color', pattern: '#[0-9A-Fa-f]{6}\\b' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Regex Tester
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Test and debug regular expressions in real-time
          </p>
        </div>

        {/* Pattern Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Regular Expression
              </label>
              <div className="flex">
                <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-lg text-gray-500">/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter regex pattern..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                />
                <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg text-gray-500">/{flags}</span>
              </div>
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Flags:</span>
            {[
              { flag: 'g', label: 'Global', desc: 'Find all matches' },
              { flag: 'i', label: 'Case Insensitive', desc: 'Ignore case' },
              { flag: 'm', label: 'Multiline', desc: '^ and $ match line boundaries' },
              { flag: 's', label: 'Dotall', desc: '. matches newlines' },
            ].map(({ flag, label }) => (
              <button
                key={flag}
                onClick={() => toggleFlag(flag)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  flags.includes(flag)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {flag} - {label}
              </button>
            ))}
          </div>

          {/* Common Patterns */}
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Common patterns:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonPatterns.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setPattern(p.pattern)}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">❌ {error}</p>
            </div>
          )}
        </div>

        {/* Test String */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Test String
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against..."
            className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
        </div>

        {/* Results */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Highlighted Matches ({matches.length})
            </h2>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg font-mono text-sm whitespace-pre-wrap break-all">
              {highlightedText || <span className="text-gray-400">No text to display</span>}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Match Details
            </h2>
            {matches.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-auto">
                {matches.map((match, i) => (
                  <div key={i} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Match {i + 1}</span>
                      <span className="text-gray-500">Index: {match.index}</span>
                    </div>
                    <code className="text-indigo-600 dark:text-indigo-400 font-mono">
                      {match.text}
                    </code>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                {pattern ? 'No matches found' : 'Enter a pattern to see matches'}
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


