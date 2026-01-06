import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4">FileForge</h3>
            <p className="text-sm">
              Convert files between formats with privacy and ease. 
              Free, secure, and fast file conversion.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/convert" className="hover:text-white transition-colors">
                  Convert Files
                </Link>
              </li>
              <li>
                <Link href="/merge" className="hover:text-white transition-colors">
                  Merge PDFs
                </Link>
              </li>
              <li>
                <Link href="/split" className="hover:text-white transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link href="/compress" className="hover:text-white transition-colors">
                  Compress Files
                </Link>
              </li>
              <li>
                <Link href="/watermark" className="hover:text-white transition-colors">
                  Watermark PDF
                </Link>
              </li>
              <li>
                <Link href="/protect" className="hover:text-white transition-colors">
                  Protect PDF
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Formats</h4>
            <ul className="space-y-2 text-sm">
              <li>Documents (PDF, DOCX, TXT)</li>
              <li>Images (PNG, JPG, WebP)</li>
              <li>Data (CSV, XLSX, JSON)</li>
              <li>Markdown & HTML</li>
              <li>XML & YAML</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li>✓ 50+ Conversion Types</li>
              <li>✓ Batch Processing</li>
              <li>✓ Privacy First</li>
              <li>✓ No Registration</li>
              <li>✓ Auto File Cleanup</li>
              <li>✓ Mobile Friendly</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} FileForge. All rights reserved.</p>
          <p className="mt-2 text-gray-500">
            Built with Next.js • Secure • Free
          </p>
        </div>
      </div>
    </footer>
  );
}


