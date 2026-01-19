import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Compress PDF - Free Online PDF Compressor | FileForge',
  description: 'Compress PDF files for free. Reduce PDF size without losing quality. Perfect for email, uploading, and sharing. No registration required.',
  keywords: 'compress pdf, pdf compressor, reduce pdf size, shrink pdf, make pdf smaller, free pdf compression',
};

export default function CompressPdfPage() {
  const faqs = [
    {
      q: 'How much can I reduce my PDF size?',
      a: 'Results vary depending on the PDF content. PDFs with lots of images typically compress 50-80%. Text-heavy PDFs may only compress 10-30% as they are already fairly efficient.',
    },
    {
      q: 'Will compression affect PDF quality?',
      a: 'Our compression optimizes PDFs while maintaining readability. Images may be slightly reduced in quality, but text and vector graphics remain sharp.',
    },
    {
      q: 'What is the maximum file size?',
      a: 'You can upload PDFs up to 200MB. Larger files may take a few seconds to process.',
    },
    {
      q: 'Is my PDF secure during compression?',
      a: 'Yes! Your files are processed securely and automatically deleted after 15 minutes. We never access or store your documents.',
    },
    {
      q: 'Can I compress password-protected PDFs?',
      a: 'Password-protected PDFs need to be unlocked first. You can use our PDF Password Remover tool if you know the password.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-rose-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/merge" className="text-gray-300 hover:text-white transition-colors">Merge PDF</Link>
              <Link href="/split" className="text-gray-300 hover:text-white transition-colors">Split PDF</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Compress PDF Files
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Reduce PDF file size while maintaining quality. Perfect for email attachments and uploading.
          </p>
          <Link
            href="/compress"
            className="inline-flex items-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold text-lg transition-colors"
          >
            Compress PDF Now →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-rose-400 mb-1">50-80%</div>
            <div className="text-gray-400 text-sm">Size Reduction</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-rose-400 mb-1">200MB</div>
            <div className="text-gray-400 text-sm">Max File Size</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-rose-400 mb-1">100%</div>
            <div className="text-gray-400 text-sm">Free Forever</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-white mb-2">Upload PDF</h3>
              <p className="text-gray-400">Drag and drop your PDF or click to select</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-white mb-2">Compress</h3>
              <p className="text-gray-400">We optimize your PDF for smaller size</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-white mb-2">Download</h3>
              <p className="text-gray-400">Get your smaller PDF instantly</p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="text-lg font-semibold text-white mb-2">Email Attachments</h3>
            <p className="text-gray-400">Reduce PDF size to fit email attachment limits (typically 25MB).</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">☁️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Cloud Storage</h3>
            <p className="text-gray-400">Save storage space by compressing PDFs before uploading.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-lg font-semibold text-white mb-2">Website Upload</h3>
            <p className="text-gray-400">Many websites have file size limits for document uploads.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="text-lg font-semibold text-white mb-2">Mobile Sharing</h3>
            <p className="text-gray-400">Smaller files are faster to download on mobile networks.</p>
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
          <h2 className="text-2xl font-bold text-white mb-6">More PDF Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/merge" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
              <div className="text-2xl mb-2">📎</div>
              <div className="text-white font-medium">Merge PDF</div>
            </Link>
            <Link href="/split" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
              <div className="text-2xl mb-2">✂️</div>
              <div className="text-white font-medium">Split PDF</div>
            </Link>
            <Link href="/protect" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
              <div className="text-2xl mb-2">🔐</div>
              <div className="text-white font-medium">Protect PDF</div>
            </Link>
            <Link href="/watermark" className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-center transition-colors">
              <div className="text-2xl mb-2">💧</div>
              <div className="text-white font-medium">Watermark</div>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/compress"
            className="inline-flex items-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold text-lg transition-colors"
          >
            Compress Your PDF Now →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

