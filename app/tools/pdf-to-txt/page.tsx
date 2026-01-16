import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'PDF to TXT Converter - Extract Text from PDF | FileForge',
  description: 'Convert PDF files to plain text for free. Extract text content from any PDF document. Fast, secure, and private.',
  keywords: 'PDF to TXT, PDF to text, extract text from PDF, PDF converter, text extraction',
};

export default function PdfToTxtPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            PDF to TXT Converter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Extract text content from PDF files instantly
          </p>
          <Link
            href="/convert"
            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Start Converting →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
            <li>Upload your PDF file (up to 200MB)</li>
            <li>Select &quot;PDF to TXT&quot; as the conversion format</li>
            <li>Click convert and download your text file</li>
          </ol>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              ✅ Ideal For
            </h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Extracting searchable text from PDFs</li>
              <li>• Converting documents for text analysis</li>
              <li>• Making PDF content accessible</li>
              <li>• Copying text from scanned documents</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              🔒 Privacy First
            </h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Files deleted after 15 minutes</li>
              <li>• No permanent storage</li>
              <li>• Secure processing</li>
              <li>• No account required</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/convert"
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Back to all conversions
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}


