import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Developer Tools - JSON, Base64, UUID & More | FileForge',
  description: 'Free online developer tools. JSON formatter, Base64 encoder, UUID generator, hash generator, regex tester, and more.',
  keywords: 'developer tools, json formatter, base64 encoder, uuid generator, hash generator, regex tester, diff checker, timestamp converter',
};

const DEV_TOOLS = [
  {
    href: '/tools/json-formatter',
    icon: '{ }',
    name: 'JSON Formatter',
    desc: 'Format, validate, and minify JSON. Syntax highlighting and error detection.',
    color: 'bg-amber-500',
  },
  {
    href: '/tools/base64',
    icon: '🔤',
    name: 'Base64 Encoder',
    desc: 'Encode and decode Base64 strings. Support for text and file encoding.',
    color: 'bg-blue-500',
  },
  {
    href: '/tools/url-encoder',
    icon: '🔗',
    name: 'URL Encoder',
    desc: 'Encode and decode URL strings. Handle special characters properly.',
    color: 'bg-emerald-500',
  },
  {
    href: '/tools/uuid',
    icon: '🆔',
    name: 'UUID Generator',
    desc: 'Generate UUIDs in v1, v4, and v7 formats. Bulk generation supported.',
    color: 'bg-violet-500',
  },
  {
    href: '/tools/hash',
    icon: '#️⃣',
    name: 'Hash Generator',
    desc: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text.',
    color: 'bg-red-500',
  },
  {
    href: '/tools/regex',
    icon: '🔍',
    name: 'Regex Tester',
    desc: 'Test regular expressions with real-time matching and capture groups.',
    color: 'bg-pink-500',
  },
  {
    href: '/tools/diff',
    icon: '📊',
    name: 'Diff Checker',
    desc: 'Compare two texts side by side. Highlights additions and deletions.',
    color: 'bg-cyan-500',
  },
  {
    href: '/tools/timestamp',
    icon: '⏰',
    name: 'Timestamp Converter',
    desc: 'Convert Unix timestamps to human-readable dates and vice versa.',
    color: 'bg-orange-500',
  },
  {
    href: '/tools/markdown-preview',
    icon: '📑',
    name: 'Markdown Preview',
    desc: 'Write and preview Markdown in real-time. Export as HTML.',
    color: 'bg-indigo-500',
  },
  {
    href: '/tools/word-counter',
    icon: '📝',
    name: 'Word Counter',
    desc: 'Count words, characters, sentences, and paragraphs in text.',
    color: 'bg-teal-500',
  },
  {
    href: '/tools/color-picker',
    icon: '🎨',
    name: 'Color Picker',
    desc: 'Pick colors and convert between HEX, RGB, HSL formats.',
    color: 'bg-fuchsia-500',
  },
  {
    href: '/tools/aspect-ratio',
    icon: '📐',
    name: 'Aspect Ratio Calculator',
    desc: 'Calculate dimensions while maintaining aspect ratio.',
    color: 'bg-lime-500',
  },
];

export default function DevToolsPage() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 rounded-full text-violet-700 dark:text-violet-300 text-sm font-medium mb-6">
            <span className="text-lg">⚡</span>
            Built for Developers
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink-900 dark:text-ink-50 mb-6 tracking-tight">
            Developer Tools
          </h1>
          <p className="text-xl text-ink-600 dark:text-ink-400 max-w-2xl mx-auto">
            Essential utilities for developers. Format, encode, generate, and validate — all in your browser.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
          {DEV_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white dark:bg-ink-900 p-6 rounded-2xl border border-ink-200 dark:border-ink-800 hover:border-accent-300 dark:hover:border-accent-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${tool.color} rounded-xl flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform duration-200 font-mono`}>
                {tool.icon}
              </div>
              <h2 className="text-lg font-semibold text-ink-900 dark:text-ink-100 mb-2 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                {tool.name}
              </h2>
              <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* Features */}
        <div className="bg-ink-900 dark:bg-ink-100 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-bold text-ink-50 dark:text-ink-900 mb-8 text-center">
            Why Developers Love Our Tools
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '🚀', title: 'No Setup', desc: 'Works instantly in your browser' },
              { icon: '🔒', title: 'Private', desc: 'All processing happens locally' },
              { icon: '⚡', title: 'Fast', desc: 'Optimized for speed' },
              { icon: '🎯', title: 'Focused', desc: 'One tool, one job, done well' },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-ink-50 dark:text-ink-900 mb-1">{feature.title}</h3>
                <p className="text-ink-400 dark:text-ink-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-ink-600 dark:text-ink-400 mb-4">Need to convert files?</p>
          <Link
            href="/convert"
            className="inline-block px-8 py-4 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition-all duration-200"
          >
            Try File Converter →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

