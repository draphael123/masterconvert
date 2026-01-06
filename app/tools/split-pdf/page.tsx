import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Split PDF Online - Extract Pages from PDF Free | FileForge',
  description: 'Split PDF files and extract specific pages online. Free PDF splitter with page range selection. Extract single pages or ranges.',
  keywords: 'split PDF, extract PDF pages, PDF splitter, separate PDF pages, extract pages from PDF',
};

export default function SplitPdfToolPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Split PDF Online
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Extract specific pages from your PDF documents
          </p>
          <Link
            href="/split"
            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start Splitting →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Extraction Modes
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <div className="text-3xl mb-2">📄</div>
              <div className="font-semibold text-gray-900 dark:text-white">Page Range</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">e.g., 1-5, 8, 10-15</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <div className="text-3xl mb-2">1️⃣</div>
              <div className="font-semibold text-gray-900 dark:text-white">Single Page</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Extract one page</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <div className="text-3xl mb-2">📚</div>
              <div className="font-semibold text-gray-900 dark:text-white">All Pages</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Separate files (ZIP)</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Select Options
          </h2>
          <ul className="text-gray-600 dark:text-gray-300 space-y-2">
            <li>• <strong>First page:</strong> Extract just the cover page</li>
            <li>• <strong>Last page:</strong> Get the final page</li>
            <li>• <strong>First/Second half:</strong> Split document in half</li>
            <li>• <strong>Odd/Even pages:</strong> Great for double-sided printing</li>
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/split"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Go to PDF Splitter →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

