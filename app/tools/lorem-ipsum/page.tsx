'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi',
  'nesciunt', 'neque', 'porro', 'quisquam', 'nihil', 'numquam', 'eius', 'modi',
];

export default function LoremIpsumPage() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');

  const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

  const generateSentence = (minWords = 8, maxWords = 15): string => {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = Array.from({ length: wordCount }, getRandomWord);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ') + '.';
  };

  const generateParagraph = (minSentences = 4, maxSentences = 8): string => {
    const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
  };

  const generate = () => {
    let result = '';

    switch (type) {
      case 'words':
        const words = Array.from({ length: count }, getRandomWord);
        if (startWithLorem && count >= 2) {
          words[0] = 'lorem';
          words[1] = 'ipsum';
        }
        result = words.join(' ');
        break;

      case 'sentences':
        const sentences = Array.from({ length: count }, () => generateSentence());
        if (startWithLorem) {
          sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        }
        result = sentences.join(' ');
        break;

      case 'paragraphs':
      default:
        const paragraphs = Array.from({ length: count }, () => generateParagraph());
        if (startWithLorem) {
          paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + 
            'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
        }
        result = paragraphs.join('\n\n');
        break;
    }

    setOutput(result);
    toast.success('Lorem ipsum generated!');
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
            Lorem Ipsum Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Generate placeholder text for your designs
          </p>
        </div>

        {/* Options */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Generate
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>

            {/* Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount: {count}
              </label>
              <input
                type="range"
                min="1"
                max={type === 'words' ? 100 : type === 'sentences' ? 20 : 10}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Start with Lorem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Options
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="rounded"
                />
                Start with &quot;Lorem ipsum...&quot;
              </label>
            </div>
          </div>

          <button
            onClick={generate}
            className="mt-6 w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
          >
            Generate Lorem Ipsum
          </button>
        </div>

        {/* Output */}
        {output && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Generated Text</h2>
              <button
                onClick={copyOutput}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                📋 Copy
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-96 overflow-auto">
              {output}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {output.split(/\s+/).length} words • {output.length} characters
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}



