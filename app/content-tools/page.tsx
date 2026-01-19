import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Content Tools for Marketing Teams | FileForge',
  description: 'Free tools for content creators and organic marketing teams. Headline analyzer, meta tag generator, readability scorer, social media tools, and more.',
  keywords: 'content tools, marketing tools, headline analyzer, meta tags, seo tools, social media tools',
};

const TOOL_CATEGORIES = [
  {
    name: 'SEO & Optimization',
    icon: '🔍',
    color: 'from-blue-600 to-cyan-600',
    tools: [
      { name: 'Headline Analyzer', href: '/content-tools/headline-analyzer', icon: '📰', desc: 'Score headlines for engagement' },
      { name: 'Meta Tag Generator', href: '/content-tools/meta-generator', icon: '🏷️', desc: 'Create SEO meta tags with preview' },
      { name: 'Keyword Density', href: '/content-tools/keyword-density', icon: '📊', desc: 'Check keyword frequency' },
      { name: 'Readability Score', href: '/content-tools/readability', icon: '📖', desc: 'Calculate reading level' },
      { name: 'Schema Generator', href: '/content-tools/schema-generator', icon: '📋', desc: 'Generate JSON-LD markup' },
      { name: 'Slug Generator', href: '/content-tools/slug-generator', icon: '🔗', desc: 'Create URL-friendly slugs' },
    ],
  },
  {
    name: 'Writing & Editing',
    icon: '✍️',
    color: 'from-purple-600 to-pink-600',
    tools: [
      { name: 'Text Cleaner', href: '/content-tools/text-cleaner', icon: '🧹', desc: 'Remove formatting & extra spaces' },
      { name: 'Paraphraser', href: '/content-tools/paraphraser', icon: '🔄', desc: 'Rewrite text uniquely' },
      { name: 'Bullet Point Generator', href: '/content-tools/bullet-points', icon: '•', desc: 'Convert text to bullets' },
      { name: 'HTML ↔ Text', href: '/content-tools/html-text', icon: '📄', desc: 'Convert between HTML and text' },
      { name: 'Emoji Picker', href: '/content-tools/emoji-picker', icon: '😀', desc: 'Search and copy emojis' },
      { name: 'Grammar Check', href: '/content-tools/grammar-check', icon: '✓', desc: 'Find grammar errors' },
      { name: 'Paraphraser', href: '/content-tools/paraphraser', icon: '🔄', desc: 'Rewrite text uniquely' },
    ],
  },
  {
    name: 'Social Media',
    icon: '📱',
    color: 'from-orange-600 to-red-600',
    tools: [
      { name: 'Social Image Resizer', href: '/content-tools/social-resizer', icon: '📐', desc: 'Resize for all platforms' },
      { name: 'Open Graph Preview', href: '/content-tools/og-preview', icon: '🔗', desc: 'Preview social share cards' },
      { name: 'Hashtag Generator', href: '/content-tools/hashtag-generator', icon: '#', desc: 'Generate relevant hashtags' },
      { name: 'Thread Formatter', href: '/content-tools/thread-formatter', icon: '🧵', desc: 'Split text into tweets' },
      { name: 'Bio Generator', href: '/content-tools/bio-generator', icon: '👤', desc: 'Create social media bios' },
      { name: 'Caption Templates', href: '/content-tools/caption-templates', icon: '💬', desc: 'Instagram caption ideas' },
    ],
  },
  {
    name: 'Visual Content',
    icon: '🎨',
    color: 'from-green-600 to-teal-600',
    tools: [
      { name: 'Quote Image Maker', href: '/content-tools/quote-maker', icon: '💭', desc: 'Turn quotes into images' },
      { name: 'Screenshot Beautifier', href: '/content-tools/screenshot-beautifier', icon: '🖼️', desc: 'Add backgrounds & shadows' },
      { name: 'Thumbnail Generator', href: '/content-tools/thumbnail-generator', icon: '▶️', desc: 'YouTube thumbnail maker' },
      { name: 'Meme Generator', href: '/content-tools/meme-generator', icon: '😂', desc: 'Add text to images' },
      { name: 'GIF Maker', href: '/content-tools/gif-maker', icon: '🎬', desc: 'Create animated GIFs' },
      { name: 'Thumbnail Generator', href: '/content-tools/thumbnail-generator', icon: '▶️', desc: 'YouTube thumbnails' },
    ],
  },
];

export default function ContentToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-violet-400">Forge</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link href="/convert" className="text-gray-300 hover:text-white transition-colors">Convert</Link>
              <Link href="/content-tools" className="text-violet-400 font-medium">Content Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 rounded-full text-violet-300 text-sm mb-6">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
            For Content & Marketing Teams
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Content Tools
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything your organic content team needs. Analyze headlines, optimize for SEO, 
            create social media content, and more — all free, no signup required.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
            <div className="text-3xl font-bold text-violet-400">24+</div>
            <div className="text-sm text-gray-400">Content Tools</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
            <div className="text-3xl font-bold text-violet-400">100%</div>
            <div className="text-sm text-gray-400">Free Forever</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
            <div className="text-3xl font-bold text-violet-400">0</div>
            <div className="text-sm text-gray-400">Signup Required</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
            <div className="text-3xl font-bold text-violet-400">🔒</div>
            <div className="text-sm text-gray-400">Privacy First</div>
          </div>
        </div>

        {/* Tool Categories */}
        {TOOL_CATEGORIES.map((category) => (
          <div key={category.name} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{category.icon}</span>
              <h2 className="text-2xl font-bold text-white">{category.name}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.tools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5 hover:bg-white/10 hover:border-violet-500/50 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl`}>
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{tool.desc}</p>
                    </div>
                    <span className="text-gray-500 group-hover:text-violet-400 transition-colors">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl border border-violet-500/30 p-8 text-center mt-16">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need File Conversions Too?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            FileForge also offers 50+ file conversion types, PDF tools, image editing, and developer utilities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/convert"
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-colors"
            >
              File Converter
            </Link>
            <Link
              href="/merge"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
            >
              PDF Tools
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
            >
              All Tools
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

