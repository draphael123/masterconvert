'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFavorites, exportFavorites, importFavorites, clearFavorites, FavoriteTool } from '@/lib/favorites';
import toast from 'react-hot-toast';

export default function FavoritesManager() {
  const [favorites, setFavorites] = useState<FavoriteTool[]>([]);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleExport = () => {
    const json = exportFavorites();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fileforge-favorites-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Favorites exported!');
  };

  const handleImport = () => {
    const result = importFavorites(importText);
    if (result.success) {
      setFavorites(getFavorites());
      setShowImport(false);
      setImportText('');
      toast.success(`Imported ${result.count} favorite(s)!`);
    } else {
      toast.error(result.error || 'Failed to import favorites');
    }
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
      clearFavorites();
      setFavorites([]);
      toast.success('Favorites cleared');
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
        <div className="text-4xl mb-4">⭐</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Favorites Yet
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click the star icon on any tool to add it to your favorites
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          My Favorites ({favorites.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
          >
            📥 Export
          </button>
          <button
            onClick={() => setShowImport(!showImport)}
            className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800"
          >
            📤 Import
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {showImport && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paste JSON export:
          </label>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            rows={4}
            placeholder='[{"id":"...","name":"...","href":"..."}]'
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Import
            </button>
            <button
              onClick={() => {
                setShowImport(false);
                setImportText('');
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {favorites.map((favorite) => (
          <Link
            key={favorite.id}
            href={favorite.href}
            className="group p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{favorite.icon || '🔧'}</span>
              <span className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {favorite.name}
              </span>
            </div>
            {favorite.category && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {favorite.category}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          💡 <strong>Tip:</strong> Export your favorites to back them up or import them on another device. 
          All data is stored locally in your browser.
        </p>
      </div>
    </div>
  );
}

