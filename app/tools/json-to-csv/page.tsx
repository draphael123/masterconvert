import { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'JSON to CSV Converter - Convert JSON to Spreadsheet | FileForge',
  description: 'Convert JSON data to CSV format online. Transform JSON arrays into spreadsheet-compatible CSV files. Free and easy to use.',
  keywords: 'JSON to CSV, convert JSON to CSV, JSON converter, JSON to spreadsheet, data conversion',
};

export default function JsonToCsvToolPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            JSON to CSV Converter
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Convert JSON data to CSV spreadsheet format
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
            Example Conversion
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">JSON Input</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{`[
  {"name": "John", "age": 30},
  {"name": "Jane", "age": 25}
]`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">CSV Output</h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
{`name,age
John,30
Jane,25`}
              </pre>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              ✅ Best For
            </h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>• API response data</li>
              <li>• Database exports</li>
              <li>• Configuration files</li>
              <li>• Data analysis prep</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              📊 Opens In
            </h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Microsoft Excel</li>
              <li>• Google Sheets</li>
              <li>• LibreOffice Calc</li>
              <li>• Any spreadsheet app</li>
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


