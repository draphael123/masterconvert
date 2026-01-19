import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'JPG to PNG Converter - Free Online Tool | FileForge',
  description: 'Convert JPG images to PNG format for free. Get lossless quality and transparency support. No registration, no limits, instant conversion.',
  keywords: 'jpg to png, jpeg to png, convert jpg to png, image converter, free converter',
};

export default function JpgToPngPage() {
  const faqs = [
    {
      q: 'Why convert JPG to PNG?',
      a: 'PNG offers lossless compression and supports transparency, making it ideal for logos, graphics, and images that need crisp edges. PNG is better for images with text, line art, or when you need to preserve quality through multiple edits.',
    },
    {
      q: 'Will converting JPG to PNG improve quality?',
      a: 'Converting from JPG to PNG will not restore quality lost during the original JPG compression. However, it will prevent any further quality loss from future edits and enable transparency support.',
    },
    {
      q: 'Is the file size larger with PNG?',
      a: 'Yes, PNG files are typically larger than JPG because PNG uses lossless compression. The tradeoff is perfect quality preservation.',
    },
    {
      q: 'Can I add transparency after converting?',
      a: 'Yes! Once converted to PNG, you can edit the image in any image editor to add transparency where needed.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-purple-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/convert" className="text-gray-300 hover:text-white transition-colors">All Conversions</Link>
              <Link href="/png-to-jpg" className="text-gray-300 hover:text-white transition-colors">PNG to JPG</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            JPG to PNG Converter
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Convert JPG images to PNG format with lossless quality and transparency support.
          </p>
          <Link
            href="/convert"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold text-lg transition-colors"
          >
            Start Converting →
          </Link>
        </div>

        {/* How It Works */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload JPG</h3>
              <p className="text-gray-400">Drag and drop your JPG file or click to browse</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-white mb-2">Select PNG</h3>
              <p className="text-gray-400">Choose PNG as your output format</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-white mb-2">Download</h3>
              <p className="text-gray-400">Get your converted PNG file instantly</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold text-white mb-2">Transparency Support</h3>
            <p className="text-gray-400">PNG supports alpha channel transparency, perfect for logos and graphics.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="text-lg font-semibold text-white mb-2">Lossless Quality</h3>
            <p className="text-gray-400">PNG compression preserves every pixel - no quality degradation.</p>
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
            <Link href="/png-to-jpg" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-white font-medium">PNG to JPG</div>
            </Link>
            <Link href="/tools/background-remover" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
              <div className="text-2xl mb-2">✂️</div>
              <div className="text-white font-medium">Remove BG</div>
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold text-lg transition-colors"
          >
            Convert JPG to PNG Now →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

