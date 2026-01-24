'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import { getFavorites } from '@/lib/favorites';

const toolCategories = {
  pdf: {
    label: 'PDF Tools',
    href: '/pdf-tools',
    items: [
      { href: '/merge', label: 'Merge PDFs', icon: '📎', desc: 'Combine multiple PDFs' },
      { href: '/split', label: 'Split PDF', icon: '✂️', desc: 'Extract pages' },
      { href: '/compress', label: 'Compress PDF', icon: '🗜️', desc: 'Reduce file size' },
      { href: '/rotate-pdf', label: 'Rotate PDF', icon: '🔄', desc: 'Rotate pages' },
      { href: '/watermark', label: 'Watermark', icon: '💧', desc: 'Add text overlay' },
      { href: '/protect', label: 'Protect PDF', icon: '🔐', desc: 'Password protect' },
      { href: '/images-to-pdf', label: 'Images to PDF', icon: '🖼️', desc: 'Combine images' },
      { href: '/pdf-to-images', label: 'PDF to Images', icon: '📄', desc: 'Extract as images' },
    ],
  },
  image: {
    label: 'Image Tools',
    href: '/image-tools',
    items: [
      { href: '/resize', label: 'Resize Image', icon: '📐', desc: 'Change dimensions' },
      { href: '/tools/background-remover', label: 'Remove BG', icon: '🎭', desc: 'Transparent background' },
      { href: '/tools/favicon-generator', label: 'Favicon', icon: '⭐', desc: 'All icon sizes' },
      { href: '/tools/color-extractor', label: 'Color Palette', icon: '🎨', desc: 'Extract colors' },
      { href: '/tools/metadata-stripper', label: 'Strip Metadata', icon: '🔒', desc: 'Privacy tool' },
      { href: '/heic', label: 'HEIC Convert', icon: '📸', desc: 'iPhone photos' },
      { href: '/tools/image-crop', label: 'Crop Image', icon: '✂️', desc: 'Trim images' },
      { href: '/logo-resize', label: 'Logo Resizer', icon: '🎨', desc: 'All social sizes' },
    ],
  },
  dev: {
    label: 'Dev Tools',
    href: '/dev-tools',
    items: [
      { href: '/tools/json-formatter', label: 'JSON Formatter', icon: '{ }', desc: 'Format & validate' },
      { href: '/tools/jwt-decoder', label: 'JWT Decoder', icon: '🔐', desc: 'Decode tokens' },
      { href: '/tools/cron-builder', label: 'Cron Builder', icon: '⏱️', desc: 'Visual cron editor' },
      { href: '/tools/color-converter', label: 'Color Converter', icon: '🎨', desc: 'HEX, RGB, HSL' },
      { href: '/tools/minifier', label: 'Code Minifier', icon: '🗜️', desc: 'JS, CSS, HTML' },
      { href: '/tools/password-generator', label: 'Password Gen', icon: '🔑', desc: 'Secure passwords' },
      { href: '/tools/fake-data', label: 'Fake Data', icon: '🎲', desc: 'Test data' },
      { href: '/tools/regex', label: 'Regex Tester', icon: '🔍', desc: 'Test patterns' },
    ],
  },
};

const mainNavItems = [
  { href: '/', label: 'Home', desc: 'Back to home' },
  { href: '/convert', label: 'Convert', desc: '50+ format conversions' },
  { href: '/content-tools', label: 'Content', desc: 'Marketing & social', highlight: true },
  { href: '/all-tools', label: 'All Tools', desc: '80+ tools' },
];

function DropdownMenu({ category, isOpen, onClose }: { 
  category: typeof toolCategories.pdf; 
  isOpen: boolean;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 shadow-xl p-2 z-50"
    >
      <div className="grid gap-1">
        {category.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors group"
          >
            <span className="text-lg w-8 text-center">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-ink-900 dark:text-ink-100 text-sm group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                {item.label}
              </div>
              <div className="text-xs text-ink-500 dark:text-ink-400">{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="border-t border-ink-200 dark:border-ink-800 mt-2 pt-2">
        <Link
          href={category.href}
          onClick={onClose}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-950/50 transition-colors"
        >
          View all {category.label} →
        </Link>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Load favorites count
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFavoritesCount(getFavorites().length);
      // Listen for storage changes (when favorites are updated in other tabs)
      const handleStorageChange = () => {
        setFavoritesCount(getFavorites().length);
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const isActiveCategory = (category: typeof toolCategories.pdf) => {
    return category.items.some(item => pathname === item.href || pathname?.startsWith(item.href + '/'));
  };

  return (
    <header className="bg-white/80 dark:bg-ink-950/80 border-b border-ink-200/50 dark:border-ink-800/50 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-tight text-ink-900 dark:text-ink-50">
              File<span className="text-accent-500">Forge</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Dropdown Categories */}
            {Object.entries(toolCategories).map(([key, category]) => (
              <div key={key} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    isActiveCategory(category)
                      ? 'bg-accent-500 text-white shadow-sm'
                      : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-100'
                  }`}
                >
                  {category.label}
                  <svg className={`w-4 h-4 transition-transform ${openDropdown === key ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <DropdownMenu 
                  category={category} 
                  isOpen={openDropdown === key}
                  onClose={() => setOpenDropdown(null)}
                />
              </div>
            ))}

            {/* Direct Links */}
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-500 text-white shadow-sm'
                      : (item as { highlight?: boolean }).highlight
                      ? 'text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-950/50'
                      : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            <div className="ml-3 pl-3 border-l border-ink-200 dark:border-ink-700 flex items-center gap-3">
              <Link
                href="/favorites"
                className="relative px-3 py-2 rounded-lg text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-ink-900 dark:hover:text-ink-100 transition-colors"
                title="My Favorites"
              >
                ⭐ Favorites
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              <SearchBar />
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <SearchBar />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-ink-200/50 dark:border-ink-800/50 pt-4 mt-2 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Categories */}
              {Object.entries(toolCategories).map(([key, category]) => (
                <div key={key}>
                  <div className="px-3 py-2 text-xs font-semibold text-ink-500 uppercase tracking-wider">
                    {category.label}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {category.items.slice(0, 4).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={category.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm text-accent-600 dark:text-accent-400 font-medium"
                  >
                    View all →
                  </Link>
                </div>
              ))}

              <div className="border-t border-ink-200 dark:border-ink-800 pt-4">
                <Link
                  href="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-3 rounded-lg text-ink-900 dark:text-ink-100 font-medium hover:bg-ink-100 dark:hover:bg-ink-800"
                >
                  <span>⭐ Favorites</span>
                  {favoritesCount > 0 && (
                    <span className="text-xs bg-accent-500 text-white px-2 py-0.5 rounded-full">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-3 rounded-lg text-ink-900 dark:text-ink-100 font-medium hover:bg-ink-100 dark:hover:bg-ink-800"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-ink-500">{item.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
