'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CaseConverterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const conversions = [
    {
      name: 'UPPERCASE',
      icon: 'ABC',
      convert: (s: string) => s.toUpperCase(),
    },
    {
      name: 'lowercase',
      icon: 'abc',
      convert: (s: string) => s.toLowerCase(),
    },
    {
      name: 'Title Case',
      icon: 'Abc',
      convert: (s: string) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
    },
    {
      name: 'Sentence case',
      icon: 'Abc.',
      convert: (s: string) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
    },
    {
      name: 'camelCase',
      icon: 'aB',
      convert: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    },
    {
      name: 'PascalCase',
      icon: 'AB',
      convert: (s: string) => s.replace(/(?:^\w|[A-Z]|\b\w)/g, (w) => w.toUpperCase()).replace(/\s+/g, ''),
    },
    {
      name: 'snake_case',
      icon: 'a_b',
      convert: (s: string) => s.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
    },
    {
      name: 'kebab-case',
      icon: 'a-b',
      convert: (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    },
    {
      name: 'CONSTANT_CASE',
      icon: 'A_B',
      convert: (s: string) => s.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, ''),
    },
    {
      name: 'dot.case',
      icon: 'a.b',
      convert: (s: string) => s.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, ''),
    },
    {
      name: 'aLtErNaTiNg',
      icon: 'aBc',
      convert: (s: string) => s.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''),
    },
    {
      name: 'InVeRsE',
      icon: 'iNV',
      convert: (s: string) => s.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
    },
  ];

  const applyConversion = (convertFn: (s: string) => string, name: string) => {
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }
    setOutput(convertFn(input));
    toast.success(`Converted to ${name}`);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Case Converter
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Convert text between different cases and formats
          </p>
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Input Text</h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
        </div>

        {/* Conversion Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Convert To</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {conversions.map((conv) => (
              <button
                key={conv.name}
                onClick={() => applyConversion(conv.convert, conv.name)}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-500 border-2 border-transparent transition-colors text-left"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{conv.icon}</div>
                <div className="font-medium text-gray-900 dark:text-white">{conv.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Result</h2>
            {output && (
              <button
                onClick={copyOutput}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                📋 Copy
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Converted text will appear here..."
            className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}


