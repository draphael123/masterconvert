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
            <p className="text-sm leading-relaxed">
              Convert files between formats with privacy and ease. 
              Free, secure, and fast file conversion.
            </p>
          </div>
          
          <div>
            <h4 className="text-ink-200 font-semibold mb-4 text-sm uppercase tracking-wider">PDF Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/merge" className="hover:text-accent-400 transition-colors">Merge PDFs</Link></li>
              <li><Link href="/split" className="hover:text-accent-400 transition-colors">Split PDF</Link></li>
              <li><Link href="/compress" className="hover:text-accent-400 transition-colors">Compress</Link></li>
              <li><Link href="/rotate-pdf" className="hover:text-accent-400 transition-colors">Rotate PDF</Link></li>
              <li><Link href="/watermark" className="hover:text-accent-400 transition-colors">Watermark</Link></li>
              <li><Link href="/protect" className="hover:text-accent-400 transition-colors">Protect</Link></li>
              <li><Link href="/images-to-pdf" className="hover:text-accent-400 transition-colors">Images to PDF</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-ink-200 font-semibold mb-4 text-sm uppercase tracking-wider">Image Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/convert" className="hover:text-accent-400 transition-colors">Convert Files</Link></li>
              <li><Link href="/heic" className="hover:text-accent-400 transition-colors">HEIC to JPG/PNG</Link></li>
              <li><Link href="/logo-resize" className="hover:text-accent-400 transition-colors">Logo Resizer</Link></li>
              <li><Link href="/tools/background-remover" className="hover:text-accent-400 transition-colors">Background Remover</Link></li>
              <li><Link href="/tools/image-crop" className="hover:text-accent-400 transition-colors">Image Cropper</Link></li>
              <li><Link href="/resize" className="hover:text-accent-400 transition-colors">Resize Images</Link></li>
              <li><Link href="/qr-code" className="hover:text-accent-400 transition-colors">QR Generator</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-ink-200 font-semibold mb-4 text-sm uppercase tracking-wider">Content Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/content-tools" className="text-accent-400 hover:text-accent-300 transition-colors font-medium">All Content Tools →</Link></li>
              <li><Link href="/content-tools/headline-analyzer" className="hover:text-accent-400 transition-colors">Headline Analyzer</Link></li>
              <li><Link href="/content-tools/meta-generator" className="hover:text-accent-400 transition-colors">Meta Tag Generator</Link></li>
              <li><Link href="/content-tools/social-resizer" className="hover:text-accent-400 transition-colors">Social Resizer</Link></li>
              <li><Link href="/content-tools/hashtag-generator" className="hover:text-accent-400 transition-colors">Hashtag Generator</Link></li>
              <li><Link href="/content-tools/readability" className="hover:text-accent-400 transition-colors">Readability Score</Link></li>
              <li><Link href="/content-tools/quote-maker" className="hover:text-accent-400 transition-colors">Quote Maker</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-ink-200 font-semibold mb-4 text-sm uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="text-accent-500">✓</span> 50+ Conversion Types</li>
              <li className="flex items-center gap-2"><span className="text-accent-500">✓</span> Batch Processing</li>
              <li className="flex items-center gap-2"><span className="text-accent-500">✓</span> Privacy First</li>
              <li className="flex items-center gap-2"><span className="text-accent-500">✓</span> No Registration</li>
              <li className="flex items-center gap-2"><span className="text-accent-500">✓</span> Auto File Cleanup</li>
              <li className="flex items-center gap-2"><span className="text-accent-500">✓</span> Mobile Friendly</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-ink-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {new Date().getFullYear()} FileForge. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-accent-400 transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-accent-400 transition-colors">Privacy Policy</Link>
            <span className="text-ink-600">Built with Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


