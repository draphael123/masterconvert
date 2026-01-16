import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            FileForge
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Convert, merge, split, compress, and protect files with ease
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/convert"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start Converting
            </Link>
            <Link
              href="/merge"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-indigo-200 dark:border-gray-600"
            >
              Merge PDFs
            </Link>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          <Link href="/convert" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
            <div className="text-3xl mb-2">🔄</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Convert</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">50+ formats</div>
          </Link>
          <Link href="/merge" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
            <div className="text-3xl mb-2">📎</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Merge</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Combine PDFs</div>
          </Link>
          <Link href="/split" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
            <div className="text-3xl mb-2">✂️</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Split</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Extract pages</div>
          </Link>
          <Link href="/compress" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
            <div className="text-3xl mb-2">🗜️</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Compress</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Reduce size</div>
          </Link>
          <Link href="/watermark" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
            <div className="text-3xl mb-2">💧</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Watermark</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Add text</div>
          </Link>
          <Link href="/protect" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
            <div className="text-3xl mb-2">🔐</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Protect</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Password PDF</div>
          </Link>
          <Link href="/qr-code" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
            <div className="text-3xl mb-2">📱</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">QR Code</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Generate QR</div>
          </Link>
          <Link href="/resize" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
            <div className="text-3xl mb-2">📐</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Resize</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Image resize</div>
          </Link>
          <Link href="/heic" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
            <div className="text-3xl mb-2">📸</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">HEIC</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">iPhone photos</div>
          </Link>
          <Link href="/logo-resize" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
            <div className="text-3xl mb-2">🎨</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Logo</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">All sizes</div>
          </Link>
          <Link href="/images-to-pdf" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
            <div className="text-3xl mb-2">🖼️</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Images→PDF</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Combine images</div>
          </Link>
          <Link href="/rotate-pdf" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
            <div className="text-3xl mb-2">🔄</div>
            <div className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Rotate</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Rotate PDF</div>
          </Link>
        </div>

        {/* Developer Tools Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Developer & Text Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link href="/tools/json-formatter" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
              <div className="text-2xl mb-2">{ }</div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">JSON Format</div>
            </Link>
            <Link href="/tools/base64" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
              <div className="text-2xl mb-2">🔤</div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">Base64</div>
            </Link>
            <Link href="/tools/hash" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
              <div className="text-2xl mb-2">#️⃣</div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">Hash Gen</div>
            </Link>
            <Link href="/tools/diff" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">Diff Check</div>
            </Link>
            <Link href="/tools/regex" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">Regex Test</div>
            </Link>
            <Link href="/tools/word-counter" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">Word Count</div>
            </Link>
            <Link href="/tools/case-converter" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
              <div className="text-2xl mb-2">Aa</div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">Case Convert</div>
            </Link>
            <Link href="/tools/lorem-ipsum" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow group">
              <div className="text-2xl mb-2">📄</div>
              <div className="font-medium text-gray-900 dark:text-white text-sm">Lorem Ipsum</div>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16" key="stats">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">50+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Types</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Free to Use</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">200MB</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Max File Size</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">15min</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Auto Delete</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              📄 Documents
            </h2>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>DOCX → TXT</li>
              <li>TXT → PDF</li>
              <li>TXT → DOCX</li>
              <li>PDF → TXT</li>
              <li>Markdown → PDF</li>
              <li>Markdown ↔ HTML</li>
              <li>HTML → PDF</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              🖼️ Images
            </h2>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>PNG ↔ JPG</li>
              <li>PNG/JPG → WebP</li>
              <li>WebP → PNG/JPG</li>
              <li>GIF ↔ PNG/JPG/WebP</li>
              <li>HEIC → JPG/PNG (iPhone)</li>
              <li>SVG → PNG/JPG</li>
              <li>PNG/JPG → ICO (Favicon)</li>
              <li>Resize & Compress</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              🎵 Audio
            </h2>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>MP3 ↔ WAV</li>
              <li>M4A/AAC → MP3</li>
              <li>Audio Trimming</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              🎬 Video
            </h2>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>MP4 → WEBM</li>
              <li>Extract Audio</li>
              <li>Resolution Downscale</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              📊 Data
            </h2>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>CSV ↔ XLSX</li>
              <li>JSON ↔ CSV</li>
              <li>JSON ↔ XLSX</li>
              <li>JSON ↔ YAML</li>
              <li>XLSX → CSV/JSON</li>
              <li>Markdown → CSV</li>
              <li>XML → JSON/CSV</li>
              <li>YAML → JSON/CSV</li>
              <li>TSV ↔ CSV</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              🔒 Privacy
            </h2>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>Files deleted after 15 min</li>
              <li>No permanent storage</li>
              <li>Secure processing</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
            <li>Upload your files using drag & drop or file picker</li>
            <li>Select your desired output format</li>
            <li>Wait for conversion to complete</li>
            <li>Download your converted files individually or as a ZIP</li>
            <li>Files are automatically deleted after 15 minutes</li>
          </ol>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Why Choose FileForge?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Privacy First
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your files are processed securely and automatically deleted after 15 minutes. 
                We never store your data permanently or share it with third parties.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Fast & Reliable
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Convert files in seconds with our optimized processing pipeline. 
                Real-time progress tracking keeps you informed every step of the way.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                No Installation Required
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Works entirely in your browser. No software downloads, no plugins, 
                no hassle. Just upload, convert, and download.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Multiple File Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Convert multiple files at once and download them individually or 
                as a convenient ZIP archive. Batch processing made simple.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                50+ Conversion Types
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Support for documents, images, audio, video, and data formats. 
                From PDFs to spreadsheets, we&apos;ve got you covered.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">💯</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Free to Use
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                No credit card required, no hidden fees, no subscriptions. 
                Convert your files completely free with generous file size limits.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <Link
            href="/convert"
            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-lg"
          >
            Start Converting Now
          </Link>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Is FileForge free to use?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! FileForge is completely free to use. No registration, no credit card, 
                no hidden fees. Just upload, convert, and download.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                How secure is my data?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your files are processed securely and automatically deleted after 15 minutes. 
                We never store your files permanently or share them with third parties. 
                All processing happens in isolated environments.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                What file size limits apply?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                The maximum file size is 200MB per file. This limit helps ensure fast 
                processing and server stability. For larger files, consider splitting 
                them into smaller chunks.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Can I convert multiple files at once?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely! You can upload multiple files and convert them all at once. 
                Download them individually or as a convenient ZIP archive.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Which conversions work on Vercel/serverless?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Image conversions, data format conversions (CSV, JSON, XLSX, etc.), and 
                document conversions like TXT/MD/HTML to PDF work perfectly. Audio/video 
                conversions require FFmpeg which isn&apos;t available in serverless environments.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                How long are files stored?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Files are automatically deleted after 15 minutes, or immediately after you 
                download the converted files. We don&apos;t store your files permanently.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

