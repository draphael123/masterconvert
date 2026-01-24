'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FavoritesManager from '@/components/FavoritesManager';

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Quick access to your most-used tools
          </p>
        </div>

        <FavoritesManager />

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            How to Use Favorites
          </h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-400">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Add to Favorites:</strong>
                <p className="text-sm">Click the star icon (☆) on any tool page to add it to your favorites.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📥</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Export:</strong>
                <p className="text-sm">Export your favorites as JSON to back them up or share with others.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📤</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Import:</strong>
                <p className="text-sm">Import favorites from another device by pasting a JSON export.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔒</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Privacy:</strong>
                <p className="text-sm">All favorites are stored locally in your browser. We never see your data.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

