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
              href="/merge"
              className="px-8 py-4 bg-ink-900 dark:bg-ink-100 text-ink-50 dark:text-ink-900 rounded-xl font-semibold hover:bg-ink-800 dark:hover:bg-ink-200 transition-all duration-200"
            >
              Merge PDFs
            </Link>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-20">
          {[
            { href: '/convert', icon: '🔄', name: 'Convert', desc: '50+ formats' },
            { href: '/merge', icon: '📎', name: 'Merge', desc: 'Combine PDFs' },
            { href: '/split', icon: '✂️', name: 'Split', desc: 'Extract pages' },
            { href: '/compress', icon: '🗜️', name: 'Compress', desc: 'Reduce size' },
            { href: '/watermark', icon: '💧', name: 'Watermark', desc: 'Add text' },
            { href: '/protect', icon: '🔐', name: 'Protect', desc: 'Password PDF' },
            { href: '/qr-code', icon: '📱', name: 'QR Code', desc: 'Generate QR' },
            { href: '/resize', icon: '📐', name: 'Resize', desc: 'Image resize' },
            { href: '/heic', icon: '📸', name: 'HEIC', desc: 'iPhone photos' },
            { href: '/logo-resize', icon: '🎨', name: 'Logo', desc: 'All sizes' },
            { href: '/images-to-pdf', icon: '🖼️', name: 'Images→PDF', desc: 'Combine images' },
            { href: '/rotate-pdf', icon: '🔄', name: 'Rotate', desc: 'Rotate PDF' },
          ].map((tool) => (
            <Link 
              key={tool.href}
              href={tool.href} 
              className="group bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200 dark:border-ink-800 text-center hover:border-accent-300 dark:hover:border-accent-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{tool.icon}</div>
              <div className="font-semibold text-ink-900 dark:text-ink-100 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">{tool.name}</div>
              <div className="text-xs text-ink-500 dark:text-ink-400">{tool.desc}</div>
            </Link>
          ))}
        </div>

        {/* Developer Tools Section */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
            <h2 className="text-lg font-semibold text-ink-600 dark:text-ink-400 uppercase tracking-wider">Developer &amp; Text Tools</h2>
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { href: '/tools/json-formatter', icon: '{ }', name: 'JSON Format' },
              { href: '/tools/color-picker', icon: '🎨', name: 'Color Picker' },
              { href: '/tools/base64', icon: '🔤', name: 'Base64' },
              { href: '/tools/url-encoder', icon: '🔗', name: 'URL Encode' },
              { href: '/tools/uuid', icon: '🆔', name: 'UUID Gen' },
              { href: '/tools/timestamp', icon: '⏰', name: 'Timestamp' },
              { href: '/tools/hash', icon: '#️⃣', name: 'Hash Gen' },
              { href: '/tools/diff', icon: '📊', name: 'Diff Check' },
              { href: '/tools/regex', icon: '🔍', name: 'Regex Test' },
              { href: '/tools/markdown-preview', icon: '📑', name: 'Markdown' },
              { href: '/tools/word-counter', icon: '📝', name: 'Word Count' },
              { href: '/tools/aspect-ratio', icon: '📐', name: 'Aspect Ratio' },
            ].map((tool) => (
              <Link 
                key={tool.href}
                href={tool.href} 
                className="group bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200 dark:border-ink-800 text-center hover:border-accent-300 dark:hover:border-accent-700 transition-all duration-200"
              >
                <div className="text-xl mb-2">{tool.icon}</div>
                <div className="font-medium text-ink-700 dark:text-ink-300 text-sm">{tool.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Image Tools Section */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
            <h2 className="text-lg font-semibold text-ink-600 dark:text-ink-400 uppercase tracking-wider">Image Tools</h2>
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { href: '/tools/background-remover', icon: '✂️', name: 'Remove BG' },
              { href: '/tools/image-crop', icon: '🖼️', name: 'Crop Image' },
              { href: '/png-to-jpg', icon: '🔄', name: 'PNG → JPG' },
              { href: '/jpg-to-png', icon: '🔄', name: 'JPG → PNG' },
              { href: '/heic', icon: '📸', name: 'HEIC Convert' },
              { href: '/logo-resize', icon: '🎨', name: 'Logo Resize' },
            ].map((tool) => (
              <Link 
                key={tool.href}
                href={tool.href} 
                className="group bg-white dark:bg-ink-900 p-4 rounded-xl border border-ink-200 dark:border-ink-800 text-center hover:border-accent-300 dark:hover:border-accent-700 transition-all duration-200"
              >
                <div className="text-xl mb-2">{tool.icon}</div>
                <div className="font-medium text-ink-700 dark:text-ink-300 text-sm">{tool.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { value: '50+', label: 'Conversion Types' },
            { value: '100%', label: 'Free to Use' },
            { value: '200MB', label: 'Max File Size' },
            { value: '15min', label: 'Auto Delete' },
          ].map((stat) => (
            <div key={stat.label} className="bg-ink-900 dark:bg-ink-100 p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-accent-400 dark:text-accent-600 mb-1 font-mono">{stat.value}</div>
              <div className="text-sm text-ink-400 dark:text-ink-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Conversion Types */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {[
            { title: '📄 Documents', items: ['DOCX → TXT', 'TXT → PDF', 'TXT → DOCX', 'PDF → TXT', 'Markdown → PDF', 'Markdown ↔ HTML', 'HTML → PDF'] },
            { title: '🖼️ Images', items: ['PNG ↔ JPG', 'PNG/JPG → WebP', 'WebP → PNG/JPG', 'GIF ↔ PNG/JPG/WebP', 'HEIC → JPG/PNG', 'SVG → PNG/JPG', 'PNG/JPG → ICO'] },
            { title: '🎵 Audio', items: ['MP3 ↔ WAV', 'M4A/AAC → MP3', 'Audio Trimming'] },
            { title: '🎬 Video', items: ['MP4 → WEBM', 'Extract Audio', 'Resolution Downscale'] },
            { title: '📊 Data', items: ['CSV ↔ XLSX', 'JSON ↔ CSV', 'JSON ↔ XLSX', 'JSON ↔ YAML', 'XML → JSON/CSV', 'TSV ↔ CSV'] },
            { title: '🔒 Privacy', items: ['Files deleted after 15 min', 'No permanent storage', 'Secure processing'] },
          ].map((category) => (
            <div key={category.title} className="bg-white dark:bg-ink-900 p-6 rounded-2xl border border-ink-200 dark:border-ink-800">
              <h2 className="text-lg font-semibold text-ink-900 dark:text-ink-100 mb-4">
                {category.title}
              </h2>
              <ul className="text-ink-600 dark:text-ink-400 space-y-2 text-sm">
                {category.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-ink-900 dark:bg-ink-100 p-8 md:p-12 rounded-3xl mb-20">
          <h2 className="text-2xl font-bold text-ink-50 dark:text-ink-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: '01', text: 'Upload your files using drag & drop' },
              { step: '02', text: 'Select your desired output format' },
              { step: '03', text: 'Wait for conversion to complete' },
              { step: '04', text: 'Download converted files' },
              { step: '05', text: 'Files auto-delete in 15 min' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl font-bold text-accent-400 dark:text-accent-600 font-mono mb-3">{item.step}</div>
                <p className="text-ink-300 dark:text-ink-700 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-ink-900 dark:text-ink-100 text-center mb-12">
            Why Choose FileForge?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔒', title: 'Privacy First', desc: 'Your files are processed securely and automatically deleted after 15 minutes. We never store your data permanently.' },
              { icon: '⚡', title: 'Fast & Reliable', desc: 'Convert files in seconds with our optimized processing pipeline. Real-time progress tracking keeps you informed.' },
              { icon: '🌐', title: 'No Installation', desc: 'Works entirely in your browser. No software downloads, no plugins, no hassle. Just upload, convert, and download.' },
              { icon: '📦', title: 'Batch Processing', desc: 'Convert multiple files at once and download them individually or as a convenient ZIP archive.' },
              { icon: '🎯', title: '50+ Formats', desc: 'Support for documents, images, audio, video, and data formats. From PDFs to spreadsheets, we\'ve got you covered.' },
              { icon: '💯', title: 'Completely Free', desc: 'No credit card required, no hidden fees, no subscriptions. Convert your files completely free.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white dark:bg-ink-900 p-6 rounded-2xl border border-ink-200 dark:border-ink-800 hover:border-accent-300 dark:hover:border-accent-700 transition-all duration-300 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-ink-900 dark:text-ink-100 mb-3">
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
        <div className="bg-white dark:bg-ink-900 p-8 md:p-12 rounded-3xl border border-ink-200 dark:border-ink-800 mb-16">
          <h2 className="text-3xl font-bold text-ink-900 dark:text-ink-100 text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              { q: 'Is FileForge free to use?', a: 'Yes! FileForge is completely free to use. No registration, no credit card, no hidden fees. Just upload, convert, and download.' },
              { q: 'How secure is my data?', a: 'Your files are processed securely and automatically deleted after 15 minutes. We never store your files permanently or share them with third parties.' },
              { q: 'What file size limits apply?', a: 'The maximum file size is 200MB per file. This limit helps ensure fast processing and server stability.' },
              { q: 'Can I convert multiple files at once?', a: 'Absolutely! You can upload multiple files and convert them all at once. Download them individually or as a convenient ZIP archive.' },
              { q: 'How long are files stored?', a: 'Files are automatically deleted after 15 minutes, or immediately after you download the converted files.' },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-ink-200 dark:border-ink-800 pb-6 last:border-0">
                <h3 className="text-lg font-semibold text-ink-900 dark:text-ink-100 mb-2">
                  {faq.q}
                </h3>
                <p className="text-ink-600 dark:text-ink-400 leading-relaxed">
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
