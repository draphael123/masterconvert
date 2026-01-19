'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface Issue {
  type: 'grammar' | 'spelling' | 'style' | 'punctuation';
  original: string;
  suggestion: string;
  message: string;
  position: number;
}

const COMMON_ERRORS: { pattern: RegExp; suggestion: string; message: string; type: Issue['type'] }[] = [
  // Grammar errors
  { pattern: /\bi\b(?!\s*[''])/g, suggestion: 'I', message: 'Capitalize "I" when referring to yourself', type: 'grammar' },
  { pattern: /\btheir\s+(?=is|are|was|were)\b/gi, suggestion: 'there', message: 'Use "there" with forms of "to be"', type: 'grammar' },
  { pattern: /\byour\s+(?=welcome|the\s+best)\b/gi, suggestion: "you're", message: 'Use "you\'re" (you are)', type: 'grammar' },
  { pattern: /\bits\s+(?=a|an|the|going|been)\b/gi, suggestion: "it's", message: 'Use "it\'s" (it is)', type: 'grammar' },
  { pattern: /\bcould\s+of\b/gi, suggestion: 'could have', message: 'Use "could have" not "could of"', type: 'grammar' },
  { pattern: /\bwould\s+of\b/gi, suggestion: 'would have', message: 'Use "would have" not "would of"', type: 'grammar' },
  { pattern: /\bshould\s+of\b/gi, suggestion: 'should have', message: 'Use "should have" not "should of"', type: 'grammar' },
  { pattern: /\balot\b/gi, suggestion: 'a lot', message: '"A lot" is two words', type: 'spelling' },
  { pattern: /\binfact\b/gi, suggestion: 'in fact', message: '"In fact" is two words', type: 'spelling' },
  { pattern: /\bnevertheless\b/gi, suggestion: 'nevertheless', message: 'Consider simpler alternatives like "however"', type: 'style' },
  // Double words
  { pattern: /\b(\w+)\s+\1\b/gi, suggestion: '$1', message: 'Remove duplicate word', type: 'grammar' },
  // Punctuation
  { pattern: /\s+,/g, suggestion: ',', message: 'Remove space before comma', type: 'punctuation' },
  { pattern: /\s+\./g, suggestion: '.', message: 'Remove space before period', type: 'punctuation' },
  { pattern: /,(?!\s)/g, suggestion: ', ', message: 'Add space after comma', type: 'punctuation' },
  // Style suggestions
  { pattern: /\bvery\s+unique\b/gi, suggestion: 'unique', message: '"Unique" doesn\'t need "very"', type: 'style' },
  { pattern: /\bvery\s+perfect\b/gi, suggestion: 'perfect', message: '"Perfect" doesn\'t need "very"', type: 'style' },
];

export default function GrammarCheckPage() {
  const [input, setInput] = useState('');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [checked, setChecked] = useState(false);

  const checkGrammar = () => {
    if (!input.trim()) return;

    const foundIssues: Issue[] = [];

    COMMON_ERRORS.forEach(error => {
      let match;
      const regex = new RegExp(error.pattern.source, error.pattern.flags);
      while ((match = regex.exec(input)) !== null) {
        foundIssues.push({
          type: error.type,
          original: match[0],
          suggestion: error.suggestion.replace('$1', match[1] || ''),
          message: error.message,
          position: match.index,
        });
      }
    });

    // Check for sentences starting with lowercase
    const sentences = input.split(/[.!?]\s+/);
    sentences.forEach((sentence, i) => {
      if (sentence.length > 0 && /^[a-z]/.test(sentence)) {
        foundIssues.push({
          type: 'grammar',
          original: sentence.charAt(0),
          suggestion: sentence.charAt(0).toUpperCase(),
          message: 'Capitalize the first letter of a sentence',
          position: input.indexOf(sentence),
        });
      }
    });

    // Sort by position
    foundIssues.sort((a, b) => a.position - b.position);

    setIssues(foundIssues);
    setChecked(true);
  };

  const applyFix = (issue: Issue) => {
    const before = input.slice(0, issue.position);
    const after = input.slice(issue.position + issue.original.length);
    setInput(before + issue.suggestion + after);
    setIssues(issues.filter(i => i !== issue));
  };

  const applyAllFixes = () => {
    let result = input;
    // Apply fixes from end to start to preserve positions
    [...issues].reverse().forEach(issue => {
      result = result.slice(0, issue.position) + issue.suggestion + result.slice(issue.position + issue.original.length);
    });
    setInput(result);
    setIssues([]);
  };

  const getTypeColor = (type: Issue['type']) => {
    switch (type) {
      case 'grammar': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'spelling': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'style': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'punctuation': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
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
            Writing Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Grammar Checker
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Check your writing for common grammar, spelling, and style issues.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Text
            </label>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setChecked(false); }}
              placeholder="Enter or paste your text here to check for grammar and spelling errors..."
              rows={15}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={checkGrammar}
                disabled={!input.trim()}
                className="flex-1 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
              >
                Check Grammar
              </button>
              {issues.length > 0 && (
                <button
                  onClick={applyAllFixes}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
                >
                  Fix All ({issues.length})
                </button>
              )}
            </div>
          </div>

          {/* Issues Panel */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Issues {checked && `(${issues.length})`}
            </h2>

            {!checked ? (
              <p className="text-gray-500 text-center py-8">
                Click &quot;Check Grammar&quot; to analyze your text
              </p>
            ) : issues.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-green-400">No issues found!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {issues.map((issue, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${getTypeColor(issue.type)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs uppercase font-semibold">{issue.type}</span>
                      <button
                        onClick={() => applyFix(issue)}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                      >
                        Fix
                      </button>
                    </div>
                    <p className="text-sm text-white mb-1">
                      <s className="text-gray-500">{issue.original}</s> → <span className="text-green-400">{issue.suggestion}</span>
                    </p>
                    <p className="text-xs text-gray-400">{issue.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 mb-2">Issue Types:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="text-red-400">● Grammar</span>
                <span className="text-orange-400">● Spelling</span>
                <span className="text-blue-400">● Style</span>
                <span className="text-purple-400">● Punctuation</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

