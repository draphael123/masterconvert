import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                FileForge
              </h1>
            </div>
            <div className="flex gap-4">
              <Link
                href="/convert"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Convert
              </Link>
              <Link
                href="/privacy"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            FileForge
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Convert files between formats with privacy and ease
          </p>
          <Link
            href="/convert"
            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start Converting
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              📄 Documents
            </h2>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>DOCX ↔ PDF</li>
              <li>DOCX → TXT</li>
              <li>TXT/MD → PDF</li>
              <li>HTML → PDF</li>
              <li>Markdown → HTML</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              📊 Data
            </h2>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>CSV ↔ XLSX</li>
              <li>JSON ↔ CSV</li>
              <li>XLSX → CSV</li>
              <li>Markdown → CSV</li>
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
              <li>XLSX → CSV</li>
              <li>Markdown → CSV</li>
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

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
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
      </main>
    </div>
  );
}

