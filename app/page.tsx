import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/10 dark:bg-accent-500/5 rounded-full blur-3xl" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 dark:bg-accent-900/30 rounded-full text-accent-700 dark:text-accent-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            Free &amp; Privacy-First
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-ink-900 dark:text-ink-50 mb-6 tracking-tight">
            File<span className="text-accent-500">Forge</span>
          </h1>
          <p className="text-xl md:text-2xl text-ink-600 dark:text-ink-400 mb-10 max-w-2xl mx-auto font-light">
            Convert, merge, split, compress, and protect files with ease
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/convert"
              className="px-8 py-4 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition-all duration-200 shadow-lg shadow-accent-500/25 hover:shadow-xl hover:shadow-accent-500/30 hover:-translate-y-0.5"
            >
              Start Converting
            </Link>
            <Link
              href="/pdf-tools"
              className="px-8 py-4 bg-ink-900 dark:bg-ink-100 text-ink-50 dark:text-ink-900 rounded-xl font-semibold hover:bg-ink-800 dark:hover:bg-ink-200 transition-all duration-200"
            >
              PDF Tools
            </Link>
          </div>
        </div>

        {/* Tool Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            {
              href: '/pdf-tools',
              icon: '📄',
              name: 'PDF Tools',
              desc: 'Merge, split, compress, rotate, watermark, and protect PDFs',
              color: 'bg-blue-500',
              count: '8 tools',
            },
            {
              href: '/image-tools',
              icon: '🖼️',
              name: 'Image Tools',
              desc: 'Resize, compress, crop, convert, and remove backgrounds',
              color: 'bg-emerald-500',
              count: '8 tools',
            },
            {
              href: '/dev-tools',
              icon: '⚡',
              name: 'Dev Tools',
              desc: 'JSON formatter, Base64, UUID, hash generator, regex tester',
              color: 'bg-violet-500',
              count: '12 tools',
            },
            {
              href: '/content-tools',
              icon: '✍️',
              name: 'Content Tools',
              desc: 'Social media, SEO, writing tools for marketing teams',
              color: 'bg-accent-500',
              count: '30+ tools',
            },
          ].map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group bg-white dark:bg-ink-900 p-6 rounded-2xl border border-ink-200 dark:border-ink-800 hover:border-accent-300 dark:hover:border-accent-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center text-3xl text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                {category.icon}
              </div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-ink-900 dark:text-ink-100 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                  {category.name}
                </h2>
                <span className="text-xs text-ink-500 dark:text-ink-400 bg-ink-100 dark:bg-ink-800 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </div>
              <p className="text-ink-600 dark:text-ink-400 text-sm leading-relaxed">
                {category.desc}
              </p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
            <h2 className="text-lg font-semibold text-ink-600 dark:text-ink-400 uppercase tracking-wider">Popular Tools</h2>
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { href: '/convert', icon: '🔄', name: 'Convert Files' },
              { href: '/merge', icon: '📎', name: 'Merge PDFs' },
              { href: '/compress', icon: '🗜️', name: 'Compress' },
              { href: '/resize', icon: '📐', name: 'Resize Image' },
              { href: '/qr-code', icon: '📱', name: 'QR Code' },
              { href: '/heic', icon: '📸', name: 'HEIC Convert' },
              { href: '/tools/json-formatter', icon: '{ }', name: 'JSON Format' },
              { href: '/tools/background-remover', icon: '🎭', name: 'Remove BG' },
              { href: '/content-tools/hashtag-generator', icon: '#', name: 'Hashtags' },
              { href: '/split', icon: '✂️', name: 'Split PDF' },
              { href: '/watermark', icon: '💧', name: 'Watermark' },
              { href: '/protect', icon: '🔐', name: 'Protect PDF' },
            ].map((tool) => (
              <Link 
                key={tool.href}
                href={tool.href} 
                className="group bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200 dark:border-ink-800 text-center hover:border-accent-300 dark:hover:border-accent-700 transition-all duration-200 hover:shadow-md"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">{tool.icon}</div>
                <div className="font-medium text-ink-700 dark:text-ink-300 text-sm group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">{tool.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { value: '50+', label: 'Conversion Formats' },
            { value: '60+', label: 'Free Tools' },
            { value: '200MB', label: 'Max File Size' },
            { value: '100%', label: 'Private & Secure' },
          ].map((stat) => (
            <div key={stat.label} className="bg-ink-900 dark:bg-ink-100 p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-accent-400 dark:text-accent-600 mb-1 font-mono">{stat.value}</div>
              <div className="text-sm text-ink-400 dark:text-ink-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 p-8 md:p-12 rounded-3xl mb-20">
          <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-100 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Upload', desc: 'Drag & drop or select files' },
              { step: '02', title: 'Process', desc: 'Choose your operation' },
              { step: '03', title: 'Download', desc: 'Get your converted files' },
              { step: '04', title: 'Auto-Delete', desc: 'Files removed in 15 min' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-bold text-accent-500 font-mono mb-3">{item.step}</div>
                <h3 className="font-semibold text-ink-900 dark:text-ink-100 mb-1">{item.title}</h3>
                <p className="text-ink-600 dark:text-ink-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-ink-900 dark:text-ink-100 text-center mb-12">
            Why Choose FileForge?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔒', title: 'Privacy First', desc: 'Files are automatically deleted after 15 minutes. We never store your data permanently.' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized processing pipeline. Most conversions complete in seconds.' },
              { icon: '🌐', title: 'No Installation', desc: 'Works entirely in your browser. No software downloads or plugins needed.' },
              { icon: '📦', title: 'Batch Processing', desc: 'Convert multiple files at once. Download individually or as a ZIP archive.' },
              { icon: '🎯', title: '60+ Tools', desc: 'Comprehensive toolkit for files, images, PDFs, and content creation.' },
              { icon: '💯', title: 'Completely Free', desc: 'No registration, no credit card, no hidden fees. All tools are free.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white dark:bg-ink-900 p-6 rounded-2xl border border-ink-200 dark:border-ink-800">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-ink-900 dark:text-ink-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-ink-600 dark:text-ink-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-20">
          <Link
            href="/convert"
            className="inline-block px-10 py-5 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition-all duration-200 text-lg shadow-lg shadow-accent-500/25 hover:shadow-xl hover:shadow-accent-500/30 hover:-translate-y-0.5"
          >
            Start Converting Now →
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-ink-900 p-8 md:p-12 rounded-3xl border border-ink-200 dark:border-ink-800">
          <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-100 text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto">
            {[
              { q: 'Is FileForge free?', a: 'Yes! All tools are 100% free with no registration required.' },
              { q: 'How secure is my data?', a: 'Files are deleted after 15 minutes. We never store data permanently.' },
              { q: 'What\'s the file size limit?', a: 'Maximum 200MB per file to ensure fast processing.' },
              { q: 'Can I batch convert?', a: 'Yes! Upload multiple files and download as ZIP.' },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-ink-900 dark:text-ink-100 mb-1">
                  {faq.q}
                </h3>
                <p className="text-ink-600 dark:text-ink-400 text-sm">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
