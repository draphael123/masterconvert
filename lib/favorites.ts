// Favorites/bookmarks system using localStorage
// Privacy-first: All data stored locally in browser

export interface FavoriteTool {
  id: string;
  name: string;
  href: string;
  icon?: string;
  category?: string;
  addedAt: number;
}

const FAVORITES_KEY = 'fileforge-favorites';
const MAX_FAVORITES = 50;

export function getFavorites(): FavoriteTool[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load favorites:', e);
  }
  return [];
}

export function saveFavorites(favorites: FavoriteTool[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Limit to max favorites
    const limited = favorites.slice(0, MAX_FAVORITES);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(limited));
  } catch (e) {
    console.error('Failed to save favorites:', e);
    // Handle quota exceeded error
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('Storage limit reached. Please remove some favorites.');
    }
  }
}

export function addFavorite(tool: Omit<FavoriteTool, 'addedAt'>): boolean {
  const favorites = getFavorites();
  
  // Check if already favorited
  if (favorites.some(f => f.href === tool.href)) {
    return false;
  }
  
  const newFavorite: FavoriteTool = {
    ...tool,
    addedAt: Date.now(),
  };
  
  saveFavorites([newFavorite, ...favorites]);
  return true;
}

export function removeFavorite(href: string): void {
  const favorites = getFavorites();
  saveFavorites(favorites.filter(f => f.href !== href));
}

export function isFavorite(href: string): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.href === href);
}

export function toggleFavorite(tool: Omit<FavoriteTool, 'addedAt'>): boolean {
  if (isFavorite(tool.href)) {
    removeFavorite(tool.href);
    return false;
  } else {
    addFavorite(tool);
    return true;
  }
}

// Export favorites as JSON
export function exportFavorites(): string {
  const favorites = getFavorites();
  return JSON.stringify(favorites, null, 2);
}

// Import favorites from JSON
export function importFavorites(json: string): { success: boolean; count: number; error?: string } {
  try {
    const favorites = JSON.parse(json) as FavoriteTool[];
    
    // Validate structure
    if (!Array.isArray(favorites)) {
      return { success: false, count: 0, error: 'Invalid format: expected array' };
    }
    
    // Validate each favorite
    const validFavorites = favorites.filter(f => 
      f.href && f.name && typeof f.addedAt === 'number'
    );
    
    if (validFavorites.length === 0) {
      return { success: false, count: 0, error: 'No valid favorites found' };
    }
    
    // Merge with existing (avoid duplicates)
    const existing = getFavorites();
    const existingHrefs = new Set(existing.map(f => f.href));
    const newFavorites = validFavorites.filter(f => !existingHrefs.has(f.href));
    
    saveFavorites([...newFavorites, ...existing]);
    
    return { success: true, count: newFavorites.length };
  } catch (e) {
    return { success: false, count: 0, error: e instanceof Error ? e.message : 'Invalid JSON' };
  }
}

// Clear all favorites
export function clearFavorites(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FAVORITES_KEY);
}

