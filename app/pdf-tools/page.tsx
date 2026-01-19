import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'PDF Tools - Merge, Split, Compress & More | FileForge',
  description: 'Free online PDF tools. Merge, split, compress, rotate, watermark, and protect your PDFs. No registration required.',
  keywords: 'pdf tools, merge pdf, split pdf, compress pdf, rotate pdf, watermark pdf, protect pdf, pdf converter',
};

const PDF_TOOLS = [
  {
    href: '/merge',
    icon: '📎',
    name: 'Merge PDFs',
    desc: 'Combine multiple PDF files into one document. Drag and drop to reorder pages.',
    color: 'bg-blue-500',
  },
  {
    href: '/split',
    icon: '✂️',
    name: 'Split PDF',
    desc: 'Extract specific pages or split a PDF into multiple documents.',
    color: 'bg-emerald-500',
  },
  {
    href: '/compress',
    icon: '🗜️',
    name: 'Compress PDF',
    desc: 'Reduce PDF file size while maintaining quality. Perfect for email attachments.',
    color: 'bg-amber-500',
  },
  {
    href: '/rotate-pdf',
    icon: '🔄',
    name: 'Rotate PDF',
    desc: 'Rotate PDF pages 90°, 180°, or 270°. Fix scanned documents orientation.',
    color: 'bg-violet-500',
  },
  {
    href: '/watermark',
    icon: '💧',
    name: 'Watermark PDF',
    desc: 'Add text or image watermarks to your PDFs. Customize position and opacity.',
    color: 'bg-cyan-500',
  },
  {
    href: '/protect',
    icon: '🔐',
    name: 'Protect PDF',
    desc: 'Password protect your PDF files. Set permissions for printing and copying.',
    color: 'bg-red-500',
  },
  {
    href: '/images-to-pdf',
    icon: '🖼️',
    name: 'Images to PDF',
    desc: 'Convert images (JPG, PNG, WebP) into a single PDF document.',
    color: 'bg-pink-500',
  },
  {
    href: '/pdf-to-images',
    icon: '📄',
    name: 'PDF to Images',
    desc: 'Extract pages from PDF as high-quality JPG or PNG images.',
    color: 'bg-orange-500',
  },
];

export default function PDFToolsPage() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <span className="text-lg">📄</span>
            All-in-One PDF Suite
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink-900 dark:text-ink-50 mb-6 tracking-tight">
            PDF Tools
          </h1>
          <p className="text-xl text-ink-600 dark:text-ink-400 max-w-2xl mx-auto">
            Everything you need to work with PDFs. Merge, split, compress, and more — all free, no signup required.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
          {PDF_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white dark:bg-ink-900 p-6 rounded-2xl border border-ink-200 dark:border-ink-800 hover:border-accent-300 dark:hover:border-accent-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${tool.color} rounded-xl flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
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
            Why Use Our PDF Tools?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🔒', title: 'Secure & Private', desc: 'Files are processed securely and deleted after 15 minutes. We never store your documents.' },
              { icon: '⚡', title: 'Fast Processing', desc: 'Optimized for speed. Most operations complete in seconds, even for large files.' },
              { icon: '💯', title: 'Completely Free', desc: 'No watermarks, no limits, no registration. All PDF tools are 100% free to use.' },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-ink-50 dark:text-ink-900 mb-2">{feature.title}</h3>
                <p className="text-ink-400 dark:text-ink-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-ink-600 dark:text-ink-400 mb-4">Need to convert files between formats?</p>
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

