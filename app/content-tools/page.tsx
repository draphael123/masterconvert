import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Content Tools for Marketing Teams | FileForge',
  description: 'Free tools for content creators and organic marketing teams. Headline analyzer, meta tag generator, readability scorer, social media tools, and more.',
  keywords: 'content tools, marketing tools, headline analyzer, meta tags, seo tools, social media tools, hashtag generator, carousel maker',
};

const TOOL_CATEGORIES = [
  {
    name: 'Social Media',
    icon: '📱',
    color: 'from-pink-600 to-rose-600',
    description: 'Create and optimize content for all platforms',
    tools: [
      { name: 'Hook Generator', href: '/content-tools/hook-generator', icon: '🪝', desc: 'Scroll-stopping opening lines', isNew: true },
      { name: 'Character Counter', href: '/content-tools/character-counter', icon: '📏', desc: 'Multi-platform limit checker', isNew: true },
      { name: 'Carousel Creator', href: '/content-tools/carousel-creator', icon: '🎠', desc: 'Instagram/TikTok slides', isNew: true },
      { name: 'Post Preview', href: '/content-tools/post-preview', icon: '👁️', desc: 'See posts before publishing', isNew: true },
      { name: 'Hashtag Generator', href: '/content-tools/hashtag-generator', icon: '#', desc: 'Trending tags with tiers' },
      { name: 'Social Resizer', href: '/content-tools/social-resizer', icon: '📐', desc: 'Resize for all platforms' },
      { name: 'Thread Formatter', href: '/content-tools/thread-formatter', icon: '🧵', desc: 'Split text into tweets' },
      { name: 'Best Time to Post', href: '/content-tools/best-time-post', icon: '⏰', desc: 'Optimal posting times', isNew: true },
    ],
  },
  {
    name: 'Content Creation',
    icon: '✍️',
    color: 'from-violet-600 to-purple-600',
    description: 'Generate and repurpose content',
    tools: [
      { name: 'Content Repurposer', href: '/content-tools/content-repurpose', icon: '🔄', desc: 'Blog to social posts', isNew: true },
      { name: 'Caption Templates', href: '/content-tools/caption-templates', icon: '💬', desc: 'Instagram caption ideas' },
      { name: 'Bio Generator', href: '/content-tools/bio-generator', icon: '👤', desc: 'Social media bios' },
      { name: 'Bullet Point Generator', href: '/content-tools/bullet-points', icon: '•', desc: 'Convert text to bullets' },
      { name: 'Quote Image Maker', href: '/content-tools/quote-maker', icon: '💭', desc: 'Turn quotes into images' },
      { name: 'Meme Generator', href: '/content-tools/meme-generator', icon: '😂', desc: 'Add text to images', isNew: true },
    ],
  },
  {
    name: 'Visual Content',
    icon: '🎨',
    color: 'from-orange-600 to-amber-600',
    description: 'Create eye-catching graphics',
    tools: [
      { name: 'Testimonial Cards', href: '/content-tools/testimonial-maker', icon: '⭐', desc: 'Review graphics', isNew: true },
      { name: 'Screenshot Beautifier', href: '/content-tools/screenshot-beautifier', icon: '🖼️', desc: 'Add backgrounds & shadows' },
      { name: 'Thumbnail Generator', href: '/content-tools/thumbnail-generator', icon: '▶️', desc: 'YouTube thumbnail maker' },
      { name: 'Link in Bio', href: '/content-tools/link-in-bio', icon: '🔗', desc: 'Create bio link page', isNew: true },
      { name: 'Open Graph Preview', href: '/content-tools/og-preview', icon: '🔗', desc: 'Preview social share cards' },
    ],
  },
  {
    name: 'Analytics & Strategy',
    icon: '📊',
    color: 'from-emerald-600 to-green-600',
    description: 'Measure and optimize performance',
    tools: [
      { name: 'Engagement Calculator', href: '/content-tools/engagement-calculator', icon: '📈', desc: 'Rate calculator + benchmarks', isNew: true },
      { name: 'Headline Analyzer', href: '/content-tools/headline-analyzer', icon: '📰', desc: 'Score headlines for engagement' },
      { name: 'Readability Score', href: '/content-tools/readability', icon: '📖', desc: 'Calculate reading level' },
      { name: 'Keyword Density', href: '/content-tools/keyword-density', icon: '🔍', desc: 'Check keyword frequency' },
    ],
  },
  {
    name: 'SEO & Optimization',
    icon: '🔍',
    color: 'from-blue-600 to-cyan-600',
    description: 'Improve discoverability',
    tools: [
      { name: 'Meta Tag Generator', href: '/content-tools/meta-generator', icon: '🏷️', desc: 'Create SEO meta tags' },
      { name: 'Schema Generator', href: '/content-tools/schema-generator', icon: '📋', desc: 'Generate JSON-LD markup' },
      { name: 'Slug Generator', href: '/content-tools/slug-generator', icon: '🔗', desc: 'URL-friendly slugs' },
    ],
  },
  {
    name: 'Writing & Editing',
    icon: '📝',
    color: 'from-indigo-600 to-blue-600',
    description: 'Clean up and improve text',
    tools: [
      { name: 'Text Cleaner', href: '/content-tools/text-cleaner', icon: '🧹', desc: 'Remove formatting' },
      { name: 'Paraphraser', href: '/content-tools/paraphraser', icon: '🔄', desc: 'Rewrite text uniquely' },
      { name: 'HTML ↔ Text', href: '/content-tools/html-text', icon: '📄', desc: 'Convert HTML and text' },
      { name: 'Emoji Picker', href: '/content-tools/emoji-picker', icon: '😀', desc: 'Search and copy emojis' },
      { name: 'Grammar Check', href: '/content-tools/grammar-check', icon: '✓', desc: 'Find grammar errors' },
    ],
  },
];

export default function ContentToolsPage() {
  const newToolsCount = TOOL_CATEGORIES.reduce((acc, cat) => 
    acc + cat.tools.filter(t => t.isNew).length, 0
  );

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
            For Organic Content & Marketing Teams
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Content Tools
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything your organic content team needs. Create scroll-stopping hooks, 
            optimize for every platform, and measure what works — all free, no signup required.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
            <div className="text-3xl font-bold text-violet-400">
              {TOOL_CATEGORIES.reduce((acc, cat) => acc + cat.tools.length, 0)}+
            </div>
            <div className="text-sm text-gray-400">Content Tools</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
            <div className="text-3xl font-bold text-violet-400">{newToolsCount}</div>
            <div className="text-sm text-gray-400">New Tools</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
            <div className="text-3xl font-bold text-violet-400">100%</div>
            <div className="text-sm text-gray-400">Free Forever</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 text-center">
            <div className="text-3xl font-bold text-violet-400">🔒</div>
            <div className="text-sm text-gray-400">Privacy First</div>
          </div>
        </div>

        {/* Featured Tools */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            🔥 Most Popular for Social Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Hook Generator', href: '/content-tools/hook-generator', icon: '🪝', desc: 'Create scroll-stopping opening lines', color: 'from-rose-600 to-pink-600' },
              { name: 'Character Counter', href: '/content-tools/character-counter', icon: '📏', desc: 'Check limits for all platforms', color: 'from-emerald-600 to-green-600' },
              { name: 'Carousel Creator', href: '/content-tools/carousel-creator', icon: '🎠', desc: 'Design multi-slide posts', color: 'from-fuchsia-600 to-purple-600' },
              { name: 'Content Repurposer', href: '/content-tools/content-repurpose', icon: '🔄', desc: 'Turn blogs into social posts', color: 'from-cyan-600 to-blue-600' },
            ].map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 p-6 hover:border-violet-500/50 transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative">
                  <div className="text-4xl mb-3">{tool.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-1">{tool.name}</h3>
                  <p className="text-sm text-gray-400">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Tool Categories */}
        {TOOL_CATEGORIES.map((category) => (
          <div key={category.name} className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{category.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                <p className="text-sm text-gray-400">{category.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
              {category.tools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5 hover:bg-white/10 hover:border-violet-500/50 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors truncate">
                          {tool.name}
                        </h3>
                        {tool.isNew && (
                          <span className="px-2 py-0.5 bg-violet-500 text-white text-xs rounded-full flex-shrink-0">
                            NEW
                          </span>
                        )}
                      </div>
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
