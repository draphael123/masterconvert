import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Image Tools - Resize, Compress, Convert & Edit | FileForge',
  description: 'Free online image tools. Resize, compress, crop, remove backgrounds, and convert between formats. No registration required.',
  keywords: 'image tools, resize image, compress image, crop image, remove background, heic converter, png to jpg, image converter',
};

const IMAGE_TOOLS = [
  {
    href: '/resize',
    icon: '📐',
    name: 'Resize Image',
    desc: 'Change image dimensions by percentage or exact pixels. Maintain aspect ratio.',
    color: 'bg-blue-500',
  },
  {
    href: '/compress',
    icon: '🗜️',
    name: 'Compress Image',
    desc: 'Reduce image file size while preserving quality. Perfect for web optimization.',
    color: 'bg-emerald-500',
  },
  {
    href: '/tools/image-crop',
    icon: '✂️',
    name: 'Crop Image',
    desc: 'Trim images to any size. Use preset aspect ratios or custom dimensions.',
    color: 'bg-violet-500',
  },
  {
    href: '/tools/background-remover',
    icon: '🎭',
    name: 'Remove Background',
    desc: 'Automatically remove image backgrounds. Get transparent PNG output.',
    color: 'bg-pink-500',
  },
  {
    href: '/heic',
    icon: '📸',
    name: 'HEIC Converter',
    desc: 'Convert iPhone HEIC photos to JPG or PNG. Batch convert supported.',
    color: 'bg-amber-500',
  },
  {
    href: '/logo-resize',
    icon: '🎨',
    name: 'Logo Resizer',
    desc: 'Generate logos in all standard sizes for web, social media, and apps.',
    color: 'bg-cyan-500',
  },
  {
    href: '/png-to-jpg',
    icon: '🔄',
    name: 'PNG to JPG',
    desc: 'Convert PNG images to JPG format. Smaller files, wider compatibility.',
    color: 'bg-orange-500',
  },
  {
    href: '/jpg-to-png',
    icon: '🔄',
    name: 'JPG to PNG',
    desc: 'Convert JPG images to PNG format. Better quality, transparency support.',
    color: 'bg-red-500',
  },
];

export default function ImageToolsPage() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
            <span className="text-lg">🖼️</span>
            Professional Image Editing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink-900 dark:text-ink-50 mb-6 tracking-tight">
            Image Tools
          </h1>
          <p className="text-xl text-ink-600 dark:text-ink-400 max-w-2xl mx-auto">
            Resize, compress, crop, and convert images in seconds. No software downloads needed.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
          {IMAGE_TOOLS.map((tool) => (
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

        {/* Supported Formats */}
        <div className="bg-white dark:bg-ink-900 rounded-3xl border border-ink-200 dark:border-ink-800 p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-100 mb-8 text-center">
            Supported Formats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { format: 'JPG/JPEG', desc: 'Most common format' },
              { format: 'PNG', desc: 'Transparency support' },
              { format: 'WebP', desc: 'Modern web format' },
              { format: 'GIF', desc: 'Animated images' },
              { format: 'HEIC', desc: 'iPhone photos' },
              { format: 'SVG', desc: 'Vector graphics' },
              { format: 'ICO', desc: 'Favicon format' },
              { format: 'BMP', desc: 'Bitmap images' },
            ].map((item) => (
              <div key={item.format} className="text-center">
                <div className="text-lg font-mono font-bold text-accent-500 mb-1">{item.format}</div>
                <div className="text-sm text-ink-500 dark:text-ink-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-ink-600 dark:text-ink-400 mb-4">Need more conversion options?</p>
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

