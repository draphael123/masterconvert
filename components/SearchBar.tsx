'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Comprehensive tool index for search
const ALL_TOOLS = [
  // PDF Tools
  { name: 'Merge PDFs', href: '/merge', category: 'PDF', icon: '📎', keywords: ['combine', 'join', 'pdf'] },
  { name: 'Split PDF', href: '/split', category: 'PDF', icon: '✂️', keywords: ['extract', 'pages', 'separate'] },
  { name: 'Compress PDF', href: '/compress', category: 'PDF', icon: '🗜️', keywords: ['reduce', 'size', 'smaller'] },
  { name: 'Rotate PDF', href: '/rotate-pdf', category: 'PDF', icon: '🔄', keywords: ['turn', 'flip', 'orientation'] },
  { name: 'Watermark PDF', href: '/watermark', category: 'PDF', icon: '💧', keywords: ['overlay', 'stamp', 'text'] },
  { name: 'Protect PDF', href: '/protect', category: 'PDF', icon: '🔐', keywords: ['password', 'secure', 'encrypt'] },
  { name: 'Images to PDF', href: '/images-to-pdf', category: 'PDF', icon: '🖼️', keywords: ['convert', 'photos'] },
  { name: 'PDF to Images', href: '/pdf-to-images', category: 'PDF', icon: '📄', keywords: ['extract', 'export', 'jpg', 'png'] },

  // Image Tools
  { name: 'Resize Image', href: '/resize', category: 'Image', icon: '📐', keywords: ['dimensions', 'scale', 'size'] },
  { name: 'Crop Image', href: '/tools/image-crop', category: 'Image', icon: '✂️', keywords: ['trim', 'cut'] },
  { name: 'Remove Background', href: '/tools/background-remover', category: 'Image', icon: '🎭', keywords: ['transparent', 'cutout', 'bg'] },
  { name: 'Favicon Generator', href: '/tools/favicon-generator', category: 'Image', icon: '⭐', keywords: ['icon', 'website', 'ico'] },
  { name: 'Color Extractor', href: '/tools/color-extractor', category: 'Image', icon: '🎨', keywords: ['palette', 'colors', 'sample'] },
  { name: 'Metadata Stripper', href: '/tools/metadata-stripper', category: 'Image', icon: '🔒', keywords: ['exif', 'privacy', 'remove'] },
  { name: 'Image to Base64', href: '/tools/image-to-base64', category: 'Image', icon: '🔗', keywords: ['encode', 'data uri'] },
  { name: 'Placeholder Image', href: '/tools/placeholder-image', category: 'Image', icon: '🖼️', keywords: ['dummy', 'mockup'] },
  { name: 'Image Compare', href: '/tools/image-compare', category: 'Image', icon: '⚖️', keywords: ['diff', 'side by side'] },
  { name: 'Add Text to Image', href: '/tools/add-text-to-image', category: 'Image', icon: '✍️', keywords: ['overlay', 'caption'] },
  { name: 'HEIC Converter', href: '/heic', category: 'Image', icon: '📸', keywords: ['iphone', 'apple', 'convert'] },
  { name: 'Logo Resizer', href: '/logo-resize', category: 'Image', icon: '🎨', keywords: ['social', 'brand', 'sizes'] },
  { name: 'PNG to JPG', href: '/png-to-jpg', category: 'Image', icon: '🔄', keywords: ['convert', 'jpeg'] },
  { name: 'JPG to PNG', href: '/jpg-to-png', category: 'Image', icon: '🔄', keywords: ['convert', 'transparent'] },
  { name: 'Compress Image', href: '/tools/compress-image', category: 'Image', icon: '🗜️', keywords: ['reduce', 'optimize', 'smaller'] },
  { name: 'EXIF Viewer', href: '/tools/exif-viewer', category: 'Image', icon: '📷', keywords: ['metadata', 'info', 'camera'] },

  // Developer Tools
  { name: 'JSON Formatter', href: '/tools/json-formatter', category: 'Dev', icon: '{ }', keywords: ['prettify', 'validate', 'format'] },
  { name: 'JWT Decoder', href: '/tools/jwt-decoder', category: 'Dev', icon: '🔐', keywords: ['token', 'decode', 'auth'] },
  { name: 'Cron Builder', href: '/tools/cron-builder', category: 'Dev', icon: '⏱️', keywords: ['schedule', 'expression', 'job'] },
  { name: 'Color Converter', href: '/tools/color-converter', category: 'Dev', icon: '🎨', keywords: ['hex', 'rgb', 'hsl', 'tailwind'] },
  { name: 'Code Minifier', href: '/tools/minifier', category: 'Dev', icon: '🗜️', keywords: ['compress', 'js', 'css', 'html'] },
  { name: 'YAML ↔ JSON', href: '/tools/yaml-json', category: 'Dev', icon: '🔄', keywords: ['convert', 'yml'] },
  { name: 'Chmod Calculator', href: '/tools/chmod-calculator', category: 'Dev', icon: '🔢', keywords: ['permissions', 'unix', 'linux'] },
  { name: 'Escape/Unescape', href: '/tools/escape-unescape', category: 'Dev', icon: '🔣', keywords: ['encode', 'decode', 'string'] },
  { name: 'Code Screenshot', href: '/tools/code-screenshot', category: 'Dev', icon: '📸', keywords: ['snippet', 'image', 'share'] },
  { name: 'SQL Formatter', href: '/tools/sql-formatter', category: 'Dev', icon: '🗃️', keywords: ['query', 'prettify', 'database'] },
  { name: 'Gradient Generator', href: '/tools/gradient-generator', category: 'Dev', icon: '🌈', keywords: ['css', 'background', 'colors'] },
  { name: 'Box Shadow', href: '/tools/box-shadow', category: 'Dev', icon: '🔲', keywords: ['css', 'shadow', 'generator'] },
  { name: 'SVG Optimizer', href: '/tools/svg-optimizer', category: 'Dev', icon: '📐', keywords: ['compress', 'minify', 'vector'] },
  { name: '.gitignore Generator', href: '/tools/gitignore-generator', category: 'Dev', icon: '📝', keywords: ['git', 'ignore', 'files'] },
  { name: 'IP Lookup', href: '/tools/ip-lookup', category: 'Dev', icon: '🌍', keywords: ['geolocation', 'address', 'location'] },
  { name: 'Robots.txt Generator', href: '/tools/robots-txt', category: 'Dev', icon: '🤖', keywords: ['seo', 'crawler', 'sitemap'] },
  { name: 'Base64 Encoder', href: '/tools/base64', category: 'Dev', icon: '🔗', keywords: ['encode', 'decode', 'string'] },
  { name: 'URL Encoder', href: '/tools/url-encoder', category: 'Dev', icon: '🔗', keywords: ['encode', 'decode', 'uri'] },
  { name: 'UUID Generator', href: '/tools/uuid', category: 'Dev', icon: '🆔', keywords: ['guid', 'unique', 'id'] },
  { name: 'Hash Generator', href: '/tools/hash', category: 'Dev', icon: '🔏', keywords: ['md5', 'sha', 'checksum'] },
  { name: 'Regex Tester', href: '/tools/regex', category: 'Dev', icon: '🔍', keywords: ['pattern', 'match', 'regular expression'] },
  { name: 'Diff Checker', href: '/tools/diff', category: 'Dev', icon: '📊', keywords: ['compare', 'difference', 'text'] },
  { name: 'Timestamp Converter', href: '/tools/timestamp', category: 'Dev', icon: '🕐', keywords: ['unix', 'epoch', 'date'] },
  { name: 'Markdown Preview', href: '/tools/markdown-preview', category: 'Dev', icon: '📝', keywords: ['md', 'render', 'preview'] },
  { name: 'Color Picker', href: '/tools/color-picker', category: 'Dev', icon: '🎨', keywords: ['select', 'eyedropper'] },
  { name: 'Aspect Ratio', href: '/tools/aspect-ratio', category: 'Dev', icon: '📐', keywords: ['calculate', 'dimensions', 'resize'] },
  { name: 'JSON to CSV', href: '/tools/json-to-csv', category: 'Dev', icon: '📊', keywords: ['convert', 'spreadsheet', 'excel'] },
  { name: 'Lorem Ipsum', href: '/tools/lorem-ipsum', category: 'Dev', icon: '📝', keywords: ['placeholder', 'text', 'dummy'] },

  // Content & Marketing Tools
  { name: 'Hook Generator', href: '/content-tools/hook-generator', category: 'Content', icon: '🪝', keywords: ['social', 'opening', 'attention'] },
  { name: 'CTA Generator', href: '/content-tools/cta-generator', category: 'Content', icon: '🎯', keywords: ['call to action', 'button', 'convert'] },
  { name: 'Email Subject Tester', href: '/content-tools/email-subject-tester', category: 'Content', icon: '📧', keywords: ['score', 'newsletter', 'open rate'] },
  { name: 'Brand Name Generator', href: '/content-tools/brand-name-generator', category: 'Content', icon: '💡', keywords: ['business', 'startup', 'naming'] },
  { name: 'Email Signature', href: '/content-tools/email-signature', category: 'Content', icon: '✉️', keywords: ['professional', 'html'] },
  { name: 'Product Description', href: '/content-tools/product-description', category: 'Content', icon: '🛍️', keywords: ['ecommerce', 'copy', 'sell'] },
  { name: 'Hashtag Generator', href: '/content-tools/hashtag-generator', category: 'Content', icon: '#️⃣', keywords: ['instagram', 'twitter', 'trending'] },
  { name: 'Character Counter', href: '/content-tools/character-counter', category: 'Content', icon: '🔢', keywords: ['word count', 'twitter', 'limit'] },
  { name: 'Carousel Creator', href: '/content-tools/carousel-creator', category: 'Content', icon: '🎠', keywords: ['slides', 'instagram', 'linkedin'] },
  { name: 'Bio Generator', href: '/content-tools/bio-generator', category: 'Content', icon: '👤', keywords: ['profile', 'about', 'description'] },
  { name: 'Headline Analyzer', href: '/content-tools/headline-analyzer', category: 'Content', icon: '📰', keywords: ['title', 'score', 'blog'] },
  { name: 'Meta Tag Generator', href: '/content-tools/meta-generator', category: 'Content', icon: '🏷️', keywords: ['seo', 'description', 'og'] },
  { name: 'Readability Score', href: '/content-tools/readability', category: 'Content', icon: '📖', keywords: ['flesch', 'grade', 'level'] },
  { name: 'Caption Templates', href: '/content-tools/caption-templates', category: 'Content', icon: '💬', keywords: ['social', 'post', 'copy'] },
  { name: 'Paraphraser', href: '/content-tools/paraphraser', category: 'Content', icon: '🔄', keywords: ['rewrite', 'rephrase', 'synonym'] },
  { name: 'Text Cleaner', href: '/content-tools/text-cleaner', category: 'Content', icon: '🧹', keywords: ['format', 'whitespace', 'clean'] },
  { name: 'Thread Formatter', href: '/content-tools/thread-formatter', category: 'Content', icon: '🧵', keywords: ['twitter', 'x', 'split'] },
  { name: 'Quote Maker', href: '/content-tools/quote-maker', category: 'Content', icon: '💭', keywords: ['image', 'instagram', 'share'] },
  { name: 'Emoji Picker', href: '/content-tools/emoji-picker', category: 'Content', icon: '😀', keywords: ['emojis', 'copy', 'search'] },
  { name: 'Bullet Points', href: '/content-tools/bullet-points', category: 'Content', icon: '•', keywords: ['list', 'format', 'points'] },
  { name: 'Content Repurpose', href: '/content-tools/content-repurpose', category: 'Content', icon: '♻️', keywords: ['transform', 'adapt', 'reuse'] },
  { name: 'Best Time to Post', href: '/content-tools/best-time-post', category: 'Content', icon: '📅', keywords: ['schedule', 'social', 'engagement'] },
  { name: 'Engagement Calculator', href: '/content-tools/engagement-calculator', category: 'Content', icon: '📈', keywords: ['rate', 'metrics', 'analytics'] },
  { name: 'Schema Generator', href: '/content-tools/schema-generator', category: 'Content', icon: '🔖', keywords: ['structured data', 'json-ld', 'seo'] },
  { name: 'OG Preview', href: '/content-tools/og-preview', category: 'Content', icon: '👁️', keywords: ['open graph', 'social', 'preview'] },
  { name: 'Post Preview', href: '/content-tools/post-preview', category: 'Content', icon: '📱', keywords: ['social', 'mockup', 'preview'] },
  { name: 'Social Resizer', href: '/content-tools/social-resizer', category: 'Content', icon: '📐', keywords: ['image', 'dimensions', 'crop'] },
  { name: 'Thumbnail Generator', href: '/content-tools/thumbnail-generator', category: 'Content', icon: '🖼️', keywords: ['youtube', 'video', 'cover'] },
  { name: 'Meme Generator', href: '/content-tools/meme-generator', category: 'Content', icon: '😂', keywords: ['funny', 'image', 'text'] },
  { name: 'Screenshot Beautifier', href: '/content-tools/screenshot-beautifier', category: 'Content', icon: '🖼️', keywords: ['mockup', 'device', 'frame'] },
  { name: 'Testimonial Maker', href: '/content-tools/testimonial-maker', category: 'Content', icon: '⭐', keywords: ['review', 'quote', 'social proof'] },
  { name: 'Link in Bio', href: '/content-tools/link-in-bio', category: 'Content', icon: '🔗', keywords: ['linktree', 'instagram', 'profile'] },
  { name: 'Slug Generator', href: '/content-tools/slug-generator', category: 'Content', icon: '🔗', keywords: ['url', 'permalink', 'seo'] },
  { name: 'Grammar Check', href: '/content-tools/grammar-check', category: 'Content', icon: '✅', keywords: ['spelling', 'proofread', 'writing'] },
  { name: 'Keyword Density', href: '/content-tools/keyword-density', category: 'Content', icon: '🔑', keywords: ['seo', 'analysis', 'optimize'] },
  { name: 'HTML to Text', href: '/content-tools/html-text', category: 'Content', icon: '📄', keywords: ['strip', 'convert', 'plain'] },

  // Business & Productivity Tools
  { name: 'Invoice Generator', href: '/tools/invoice-generator', category: 'Business', icon: '🧾', keywords: ['bill', 'payment', 'client'] },
  { name: 'Resume Builder', href: '/tools/resume-builder', category: 'Business', icon: '📄', keywords: ['cv', 'job', 'career'] },
  { name: 'Contract Templates', href: '/tools/contract-templates', category: 'Business', icon: '📋', keywords: ['legal', 'agreement', 'document'] },
  { name: 'Business Card', href: '/tools/business-card', category: 'Business', icon: '🪪', keywords: ['design', 'contact', 'professional'] },
  { name: 'ROI Calculator', href: '/tools/roi-calculator', category: 'Business', icon: '📊', keywords: ['return', 'investment', 'profit'] },
  { name: 'Profit Margin', href: '/tools/profit-margin', category: 'Business', icon: '💰', keywords: ['markup', 'percentage', 'cost'] },
  { name: 'Salary Calculator', href: '/tools/salary-calculator', category: 'Business', icon: '💵', keywords: ['hourly', 'annual', 'wage'] },
  { name: 'Meeting Cost', href: '/tools/meeting-cost', category: 'Business', icon: '👥', keywords: ['time', 'expense', 'productivity'] },

  // Utility Tools
  { name: 'Password Generator', href: '/tools/password-generator', category: 'Utility', icon: '🔑', keywords: ['secure', 'random', 'strong'] },
  { name: 'Unit Converter', href: '/tools/unit-converter', category: 'Utility', icon: '📏', keywords: ['metric', 'imperial', 'convert'] },
  { name: 'Pomodoro Timer', href: '/tools/pomodoro', category: 'Utility', icon: '🍅', keywords: ['focus', 'productivity', 'time'] },
  { name: 'Fake Data Generator', href: '/tools/fake-data', category: 'Utility', icon: '🎲', keywords: ['test', 'mock', 'dummy'] },
  { name: 'Random Picker', href: '/tools/random-picker', category: 'Utility', icon: '🎰', keywords: ['wheel', 'decide', 'spin'] },
  { name: 'Countdown Timer', href: '/tools/countdown-timer', category: 'Utility', icon: '⏳', keywords: ['event', 'date', 'countdown'] },
  { name: 'Habit Tracker', href: '/tools/habit-tracker', category: 'Utility', icon: '✅', keywords: ['daily', 'streak', 'goals'] },
  { name: 'Color Palette', href: '/tools/color-palette', category: 'Utility', icon: '🎨', keywords: ['scheme', 'generate', 'design'] },
  { name: 'Text Encryption', href: '/tools/text-encryption', category: 'Utility', icon: '🔐', keywords: ['encrypt', 'decrypt', 'secure'] },
  { name: 'QR Code Generator', href: '/qr-code', category: 'Utility', icon: '📱', keywords: ['barcode', 'scan', 'link'] },
  { name: 'File Converter', href: '/convert', category: 'Utility', icon: '🔄', keywords: ['format', 'change', 'transform'] },
  { name: 'Word Counter', href: '/tools/word-counter', category: 'Utility', icon: '📊', keywords: ['count', 'characters', 'text'] },
  { name: 'Case Converter', href: '/tools/case-converter', category: 'Utility', icon: '🔤', keywords: ['uppercase', 'lowercase', 'title'] },

  // Video & Audio Tools (NEW)
  { name: 'Video Compressor', href: '/tools/video-compressor', category: 'Video', icon: '🎬', keywords: ['compress', 'reduce', 'size', 'mp4'] },
  { name: 'GIF Maker', href: '/tools/gif-maker', category: 'Video', icon: '🎞️', keywords: ['animated', 'images', 'video to gif'] },
  { name: 'Audio Converter', href: '/tools/audio-converter', category: 'Audio', icon: '🎵', keywords: ['mp3', 'wav', 'flac', 'convert'] },
  { name: 'Video to Audio', href: '/tools/video-to-audio', category: 'Audio', icon: '🔊', keywords: ['extract', 'mp3', 'soundtrack'] },

  // Design Tools (NEW)
  { name: 'Mockup Generator', href: '/tools/mockup-generator', category: 'Design', icon: '📱', keywords: ['device', 'frame', 'screenshot', 'iphone'] },
  { name: 'Before/After Slider', href: '/tools/before-after-slider', category: 'Design', icon: '⚡', keywords: ['compare', 'image', 'transformation'] },
  { name: 'Glassmorphism Generator', href: '/tools/glassmorphism-generator', category: 'Design', icon: '🔮', keywords: ['css', 'frosted', 'glass', 'blur'] },
  { name: 'Pattern Generator', href: '/tools/pattern-generator', category: 'Design', icon: '🔳', keywords: ['svg', 'background', 'texture', 'seamless'] },

  // SEO & Marketing Tools (NEW)
  { name: 'SERP Preview', href: '/tools/serp-preview', category: 'SEO', icon: '🔍', keywords: ['google', 'search', 'meta', 'title'] },
  { name: 'UTM Builder', href: '/tools/utm-builder', category: 'SEO', icon: '🔗', keywords: ['campaign', 'tracking', 'analytics', 'link'] },
  { name: 'Link Shortener', href: '/tools/link-shortener', category: 'SEO', icon: '✂️', keywords: ['short url', 'bitly', 'share'] },
  { name: 'Broken Link Checker', href: '/tools/broken-link-checker', category: 'SEO', icon: '🔗', keywords: ['404', 'dead', 'scan', 'website'] },

  // Accessibility Tools (NEW)
  { name: 'Color Contrast Checker', href: '/tools/color-contrast-checker', category: 'Accessibility', icon: '👁️', keywords: ['wcag', 'aa', 'aaa', 'readable'] },

  // Fun/Viral Tools (NEW)
  { name: 'Bingo Generator', href: '/tools/bingo-generator', category: 'Fun', icon: '🎯', keywords: ['game', 'card', 'meeting', 'party'] },
  { name: 'Poll Creator', href: '/tools/poll-creator', category: 'Fun', icon: '📊', keywords: ['vote', 'survey', 'question', 'feedback'] },

  // AI Tools (NEW)
  { name: 'AI Image Upscaler', href: '/tools/ai-image-upscaler', category: 'AI', icon: '✨', keywords: ['enhance', 'resolution', '2x', '4x', 'enlarge'] },
];

const CATEGORY_COLORS: Record<string, string> = {
  PDF: 'bg-red-500/20 text-red-400',
  Image: 'bg-blue-500/20 text-blue-400',
  Dev: 'bg-emerald-500/20 text-emerald-400',
  Content: 'bg-purple-500/20 text-purple-400',
  Business: 'bg-amber-500/20 text-amber-400',
  Utility: 'bg-cyan-500/20 text-cyan-400',
  Video: 'bg-violet-500/20 text-violet-400',
  Audio: 'bg-teal-500/20 text-teal-400',
  Design: 'bg-pink-500/20 text-pink-400',
  SEO: 'bg-green-500/20 text-green-400',
  Accessibility: 'bg-indigo-500/20 text-indigo-400',
  Fun: 'bg-fuchsia-500/20 text-fuchsia-400',
  AI: 'bg-orange-500/20 text-orange-400',
};

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Filter tools based on query
  const filteredTools = query.trim()
    ? ALL_TOOLS.filter((tool) => {
        const searchLower = query.toLowerCase();
        return (
          tool.name.toLowerCase().includes(searchLower) ||
          tool.category.toLowerCase().includes(searchLower) ||
          tool.keywords.some((k) => k.toLowerCase().includes(searchLower))
        );
      }).slice(0, 8)
    : ALL_TOOLS.slice(0, 6); // Show popular tools when no query

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i < filteredTools.length - 1 ? i + 1 : i));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i > 0 ? i - 1 : i));
      } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
        e.preventDefault();
        navigateToTool(filteredTools[selectedIndex].href);
      }
    },
    [filteredTools, selectedIndex]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selected = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const navigateToTool = (href: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700 rounded-lg transition-colors text-ink-500 dark:text-ink-400 text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search tools...</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 bg-ink-200 dark:bg-ink-700 rounded text-xs font-mono">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
            }}
          />

          {/* Modal */}
          <div className="relative max-w-xl mx-auto mt-[15vh] px-4">
            <div className="bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-ink-200 dark:border-ink-700 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 border-b border-ink-200 dark:border-ink-800">
                <svg className="w-5 h-5 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search 90+ tools..."
                  className="flex-1 py-4 bg-transparent text-ink-900 dark:text-ink-100 placeholder-ink-400 focus:outline-none text-lg"
                />
                <kbd className="px-2 py-1 bg-ink-100 dark:bg-ink-800 rounded text-xs text-ink-500 font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={resultsRef} className="max-h-[400px] overflow-y-auto p-2">
                {!query && (
                  <div className="px-3 py-2 text-xs font-medium text-ink-400 uppercase tracking-wider">
                    Popular Tools
                  </div>
                )}
                {query && filteredTools.length === 0 && (
                  <div className="px-4 py-8 text-center text-ink-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <p>No tools found for &quot;{query}&quot;</p>
                    <p className="text-sm mt-1">Try a different search term</p>
                  </div>
                )}
                {filteredTools.map((tool, index) => (
                  <button
                    key={tool.href}
                    onClick={() => navigateToTool(tool.href)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                      selectedIndex === index
                        ? 'bg-accent-500/10 dark:bg-accent-500/20'
                        : 'hover:bg-ink-100 dark:hover:bg-ink-800'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center text-xl">
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${selectedIndex === index ? 'text-accent-600 dark:text-accent-400' : 'text-ink-900 dark:text-ink-100'}`}>
                        {tool.name}
                      </div>
                      <div className="text-sm text-ink-500 truncate">
                        {tool.keywords.slice(0, 3).join(' • ')}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${CATEGORY_COLORS[tool.category]}`}>
                      {tool.category}
                    </span>
                    {selectedIndex === index && (
                      <kbd className="px-2 py-1 bg-ink-200 dark:bg-ink-700 rounded text-xs text-ink-500">
                        ↵
                      </kbd>
                    )}
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-ink-200 dark:border-ink-800 flex items-center justify-between text-xs text-ink-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-ink-100 dark:bg-ink-800 rounded">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-ink-100 dark:bg-ink-800 rounded">↓</kbd>
                    to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-ink-100 dark:bg-ink-800 rounded">↵</kbd>
                    to select
                  </span>
                </div>
                <span>{ALL_TOOLS.length} tools available</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

