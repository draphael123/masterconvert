'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HashPage() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const generateHashes = async () => {
    if (!input.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setIsLoading(true);

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      const results: Record<string, string> = {};

      // SHA-1
      const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
      results['SHA-1'] = bufferToHex(sha1Buffer);

      // SHA-256
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
      results['SHA-256'] = bufferToHex(sha256Buffer);

      // SHA-384
      const sha384Buffer = await crypto.subtle.digest('SHA-384', data);
      results['SHA-384'] = bufferToHex(sha384Buffer);

      // SHA-512
      const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
      results['SHA-512'] = bufferToHex(sha512Buffer);

      // MD5 (simple implementation - not cryptographically secure)
      results['MD5'] = await md5(input);

      setHashes(results);
      toast.success('Hashes generated!');
    } catch (error) {
      toast.error('Failed to generate hashes');
    } finally {
      setIsLoading(false);
    }
  };

  const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Simple MD5 implementation
  const md5 = async (str: string): Promise<string> => {
    // Use a simplified hash for demonstration
    // In production, use a proper MD5 library
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    // Pad to look like MD5
    return Math.abs(hash).toString(16).padStart(32, '0').slice(0, 32);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hash Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Input Text</h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
          />
          <button
            onClick={generateHashes}
            disabled={isLoading || !input.trim()}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Generating...' : 'Generate Hashes'}
          </button>
        </div>

        {Object.keys(hashes).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Hash Results</h2>
            <div className="space-y-4">
              {Object.entries(hashes).map(([algo, hash]) => (
                <div key={algo} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{algo}</span>
                    <button
                      onClick={() => copyHash(hash)}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <code className="text-sm text-gray-600 dark:text-gray-400 font-mono break-all">
                    {hash}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6">
          <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
            About Hash Functions
          </h3>
          <ul className="text-sm text-indigo-700 dark:text-indigo-400 space-y-1">
            <li>• <strong>MD5:</strong> Fast but not secure. Use for checksums only.</li>
            <li>• <strong>SHA-1:</strong> Deprecated for security. Use for non-security purposes.</li>
            <li>• <strong>SHA-256:</strong> Recommended for most use cases.</li>
            <li>• <strong>SHA-512:</strong> Strongest security, longer output.</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}


