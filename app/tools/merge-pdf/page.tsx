import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Merge PDF Files Online - Combine PDFs Free | FileForge',
  description: 'Combine multiple PDF files into one document. Free online PDF merger with drag-and-drop reordering. No registration required.',
  keywords: 'merge PDF, combine PDF, PDF merger, join PDF files, merge PDF online free',
};

export default function MergePdfToolPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Merge PDF Files Online
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Combine multiple PDFs into a single document
          </p>
          <Link
            href="/merge"
            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start Merging →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            How to Merge PDFs
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
            <li>Upload two or more PDF files</li>
            <li>Drag to reorder the pages as needed</li>
            <li>Click merge to combine into one PDF</li>
            <li>Download your merged document</li>
          </ol>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">📎</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Easy Reordering
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Drag and drop to arrange PDFs in any order before merging.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Fast Processing
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Merge multiple PDFs in seconds, even large files.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Files are deleted automatically after processing.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/merge"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Go to PDF Merger →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}



