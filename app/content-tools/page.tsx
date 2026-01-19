import Link from 'next/link';
import Header from '@/components/Header';
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
    color: 'bg-accent-500',
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
    color: 'bg-warm-500',
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
    color: 'bg-emerald-500',
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
    color: 'bg-cyan-500',
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
    color: 'bg-blue-500',
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
    color: 'bg-violet-500',
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
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-500/10 dark:bg-accent-500/5 rounded-full blur-3xl" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 dark:bg-accent-900/30 rounded-full text-accent-700 dark:text-accent-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            For Organic Content &amp; Marketing Teams
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-ink-900 dark:text-ink-50 mb-6 tracking-tight">
            Content Tools
          </h1>
          <p className="text-xl text-ink-600 dark:text-ink-400 max-w-3xl mx-auto font-light">
            Everything your organic content team needs. Create scroll-stopping hooks, 
            optimize for every platform, and measure what works — all free, no signup required.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: `${TOOL_CATEGORIES.reduce((acc, cat) => acc + cat.tools.length, 0)}+`, label: 'Content Tools' },
            { value: newToolsCount.toString(), label: 'New Tools' },
            { value: '100%', label: 'Free Forever' },
            { value: '🔒', label: 'Privacy First' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-4 text-center">
              <div className="text-3xl font-bold text-accent-500 font-mono">{stat.value}</div>
              <div className="text-sm text-ink-500 dark:text-ink-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Tools */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
            <h2 className="text-lg font-semibold text-ink-600 dark:text-ink-400 uppercase tracking-wider flex items-center gap-2">
              🔥 Most Popular for Social Teams
            </h2>
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Hook Generator', href: '/content-tools/hook-generator', icon: '🪝', desc: 'Create scroll-stopping opening lines' },
              { name: 'Character Counter', href: '/content-tools/character-counter', icon: '📏', desc: 'Check limits for all platforms' },
              { name: 'Carousel Creator', href: '/content-tools/carousel-creator', icon: '🎠', desc: 'Design multi-slide posts' },
              { name: 'Content Repurposer', href: '/content-tools/content-repurpose', icon: '🔄', desc: 'Turn blogs into social posts' },
            ].map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group bg-ink-900 dark:bg-ink-100 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{tool.icon}</div>
                <h3 className="text-lg font-semibold text-ink-50 dark:text-ink-900 mb-1">{tool.name}</h3>
                <p className="text-sm text-ink-400 dark:text-ink-600">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Tool Categories */}
        {TOOL_CATEGORIES.map((category) => (
          <div key={category.name} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{category.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-100">{category.name}</h2>
                <p className="text-sm text-ink-500 dark:text-ink-400">{category.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.tools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-5 hover:border-accent-300 dark:hover:border-accent-700 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center text-2xl flex-shrink-0 text-white`}>
                      {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-ink-900 dark:text-ink-100 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors truncate">
                          {tool.name}
                        </h3>
                        {tool.isNew && (
                          <span className="px-2 py-0.5 bg-accent-500 text-white text-xs rounded-full flex-shrink-0 font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{tool.desc}</p>
                    </div>
                    <span className="text-ink-400 group-hover:text-accent-500 transition-colors">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* CTA Section */}
        <div className="bg-ink-900 dark:bg-ink-100 rounded-3xl p-8 md:p-12 text-center mt-16">
          <h2 className="text-2xl font-bold text-ink-50 dark:text-ink-900 mb-4">
            Need File Conversions Too?
          </h2>
          <p className="text-ink-400 dark:text-ink-600 mb-8 max-w-2xl mx-auto">
            FileForge also offers 50+ file conversion types, PDF tools, image editing, and developer utilities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/convert"
              className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-colors"
            >
              File Converter
            </Link>
            <Link
              href="/merge"
              className="px-6 py-3 bg-ink-800 dark:bg-ink-200 hover:bg-ink-700 dark:hover:bg-ink-300 text-ink-100 dark:text-ink-800 rounded-xl font-semibold transition-colors"
            >
              PDF Tools
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-ink-800 dark:bg-ink-200 hover:bg-ink-700 dark:hover:bg-ink-300 text-ink-100 dark:text-ink-800 rounded-xl font-semibold transition-colors"
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
