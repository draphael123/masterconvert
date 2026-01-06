import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Compress Images Online - Reduce Image Size Free | FileForge',
  description: 'Compress JPG, PNG, and WebP images online. Reduce file size while maintaining quality. Free image compressor with adjustable quality settings.',
  keywords: 'compress image, reduce image size, image compressor, compress JPG, compress PNG, optimize images',
};

export default function CompressImageToolPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Compress Images Online
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Reduce image file sizes without losing quality
          </p>
          <Link
            href="/compress"
            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start Compressing →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Supported Formats
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl mb-2">🖼️</div>
              <div className="font-semibold">JPEG/JPG</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl mb-2">🎨</div>
              <div className="font-semibold">PNG</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl mb-2">🌐</div>
              <div className="font-semibold">WebP</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              📊 Quality Control
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Adjust compression quality from 10% to 100%. Lower quality means smaller files, 
              higher quality preserves more detail.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              📦 Batch Processing
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Compress multiple images at once. Upload all your images and compress them 
              with a single click.
            </p>
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300 mb-3">
            💡 Compression Tips
          </h3>
          <ul className="text-indigo-700 dark:text-indigo-400 space-y-2">
            <li>• For photos: 70-85% quality usually looks great</li>
            <li>• For graphics: PNG with 90%+ quality preserves edges</li>
            <li>• For web: WebP offers best compression with quality</li>
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/compress"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Go to Image Compressor →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

