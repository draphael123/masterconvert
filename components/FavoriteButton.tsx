'use client';

import { useState, useEffect } from 'react';
import { toggleFavorite, isFavorite, FavoriteTool } from '@/lib/favorites';
import toast from 'react-hot-toast';

interface FavoriteButtonProps {
  tool: Omit<FavoriteTool, 'addedAt'>;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function FavoriteButton({ tool, size = 'md', showLabel = false }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(tool.href));
  }, [tool.href]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = toggleFavorite(tool);
    setFavorited(newState);
    
    if (newState) {
      toast.success(`Added "${tool.name}" to favorites`);
    } else {
      toast.success(`Removed "${tool.name}" from favorites`);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-10 h-10 text-lg',
  };

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-lg transition-colors ${
        favorited
          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {favorited ? '⭐' : '☆'}
      {showLabel && (
        <span className="ml-2 text-sm">
          {favorited ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  );
}

