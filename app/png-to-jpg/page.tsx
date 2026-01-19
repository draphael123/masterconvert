import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'PNG to JPG Converter - Free Online Tool | FileForge',
  description: 'Convert PNG images to JPG format for free. Reduce file size while maintaining quality. No registration, no limits, instant conversion.',
  keywords: 'png to jpg, convert png to jpg, png to jpeg, image converter, free converter',
};

export default function PngToJpgPage() {
  const faqs = [
    {
      q: 'Why convert PNG to JPG?',
      a: 'JPG files are typically smaller than PNG files, making them ideal for sharing on the web, email, or social media. JPG uses lossy compression, which reduces file size significantly while maintaining acceptable visual quality.',
    },
    {
      q: 'Will I lose quality converting PNG to JPG?',
      a: 'JPG uses lossy compression, so there may be some quality loss. However, with our high-quality conversion settings, the difference is usually imperceptible for photos. Note that JPG does not support transparency - transparent areas will become white.',
    },
    {
      q: 'Is there a file size limit?',
      a: 'You can upload PNG files up to 200MB. Most images convert in seconds.',
    },
    {
      q: 'Are my files secure?',
      a: 'Yes! Your files are processed securely and automatically deleted after 15 minutes. We never store your images permanently.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-indigo-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/convert" className="text-gray-300 hover:text-white transition-colors">All Conversions</Link>
              <Link href="/jpg-to-png" className="text-gray-300 hover:text-white transition-colors">JPG to PNG</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            PNG to JPG Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Convert PNG images to JPG format instantly. Reduce file size for easier sharing.
          </p>
          <Link
            href="/convert"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-lg transition-colors"
          >
            Start Converting →
          </Link>
        </div>

        {/* How It Works */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload PNG</h3>
              <p className="text-gray-400">Drag and drop your PNG file or click to browse</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-white mb-2">Select JPG</h3>
              <p className="text-gray-400">Choose JPG as your output format</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-white mb-2">Download</h3>
              <p className="text-gray-400">Get your converted JPG file instantly</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-lg font-semibold text-white mb-2">Smaller File Size</h3>
            <p className="text-gray-400">JPG compression typically reduces file size by 50-80% compared to PNG.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-lg font-semibold text-white mb-2">Universal Compatibility</h3>
            <p className="text-gray-400">JPG is supported by virtually every device, browser, and application.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Conversion</h3>
            <p className="text-gray-400">No waiting - your converted file is ready in seconds.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
            <p className="text-gray-400">Files are automatically deleted. We never store your images.</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Related Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/convert" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-white font-medium">JPG to PNG</div>
            </Link>
            <Link href="/convert" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
              <div className="text-2xl mb-2">🖼️</div>
              <div className="text-white font-medium">PNG to WebP</div>
            </Link>
            <Link href="/compress" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
              <div className="text-2xl mb-2">🗜️</div>
              <div className="text-white font-medium">Compress Image</div>
            </Link>
            <Link href="/resize" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
              <div className="text-2xl mb-2">📐</div>
              <div className="text-white font-medium">Resize Image</div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/convert"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-lg transition-colors"
          >
            Convert PNG to JPG Now →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

