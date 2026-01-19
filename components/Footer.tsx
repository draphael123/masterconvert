import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ink-900 dark:bg-ink-950 text-ink-400 border-t border-ink-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-ink-50 text-lg font-semibold mb-4">
              File<span className="text-accent-500">Forge</span>
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Free online tools for files, images, PDFs, and content creation. 
              Secure, fast, and privacy-focused.
            </p>
            <div className="flex gap-4 text-2xl">
              <span>📄</span>
              <span>🖼️</span>
              <span>⚡</span>
              <span>✍️</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-ink-200 font-semibold mb-4 text-sm uppercase tracking-wider">PDF Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pdf-tools" className="text-accent-400 hover:text-accent-300 transition-colors font-medium">All PDF Tools →</Link></li>
              <li><Link href="/merge" className="hover:text-accent-400 transition-colors">Merge PDFs</Link></li>
              <li><Link href="/split" className="hover:text-accent-400 transition-colors">Split PDF</Link></li>
              <li><Link href="/compress" className="hover:text-accent-400 transition-colors">Compress PDF</Link></li>
              <li><Link href="/watermark" className="hover:text-accent-400 transition-colors">Watermark</Link></li>
              <li><Link href="/protect" className="hover:text-accent-400 transition-colors">Protect PDF</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-ink-200 font-semibold mb-4 text-sm uppercase tracking-wider">Image Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/image-tools" className="text-accent-400 hover:text-accent-300 transition-colors font-medium">All Image Tools →</Link></li>
              <li><Link href="/resize" className="hover:text-accent-400 transition-colors">Resize Image</Link></li>
              <li><Link href="/heic" className="hover:text-accent-400 transition-colors">HEIC Convert</Link></li>
              <li><Link href="/tools/background-remover" className="hover:text-accent-400 transition-colors">Remove Background</Link></li>
              <li><Link href="/tools/image-crop" className="hover:text-accent-400 transition-colors">Crop Image</Link></li>
              <li><Link href="/logo-resize" className="hover:text-accent-400 transition-colors">Logo Resizer</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-ink-200 font-semibold mb-4 text-sm uppercase tracking-wider">Dev Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dev-tools" className="text-accent-400 hover:text-accent-300 transition-colors font-medium">All Dev Tools →</Link></li>
              <li><Link href="/tools/json-formatter" className="hover:text-accent-400 transition-colors">JSON Formatter</Link></li>
              <li><Link href="/tools/base64" className="hover:text-accent-400 transition-colors">Base64 Encoder</Link></li>
              <li><Link href="/tools/uuid" className="hover:text-accent-400 transition-colors">UUID Generator</Link></li>
              <li><Link href="/tools/hash" className="hover:text-accent-400 transition-colors">Hash Generator</Link></li>
              <li><Link href="/tools/regex" className="hover:text-accent-400 transition-colors">Regex Tester</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-ink-200 font-semibold mb-4 text-sm uppercase tracking-wider">Content Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/content-tools" className="text-accent-400 hover:text-accent-300 transition-colors font-medium">All Content Tools →</Link></li>
              <li><Link href="/content-tools/hook-generator" className="hover:text-accent-400 transition-colors">Hook Generator</Link></li>
              <li><Link href="/content-tools/hashtag-generator" className="hover:text-accent-400 transition-colors">Hashtag Generator</Link></li>
              <li><Link href="/content-tools/carousel-creator" className="hover:text-accent-400 transition-colors">Carousel Creator</Link></li>
              <li><Link href="/content-tools/engagement-calculator" className="hover:text-accent-400 transition-colors">Engagement Calc</Link></li>
              <li><Link href="/content-tools/meta-generator" className="hover:text-accent-400 transition-colors">Meta Tags</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-ink-800 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <Link href="/" className="hover:text-accent-400 transition-colors">Home</Link>
              <Link href="/convert" className="hover:text-accent-400 transition-colors">Convert</Link>
              <Link href="/qr-code" className="hover:text-accent-400 transition-colors">QR Code</Link>
              <Link href="/privacy" className="hover:text-accent-400 transition-colors">Privacy</Link>
            </div>
            <p className="text-sm text-ink-500">
              © {new Date().getFullYear()} FileForge. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
