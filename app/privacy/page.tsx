import Link from "next/link";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              FileForge
            </Link>
            <div className="flex gap-4">
              <Link
                href="/convert"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Convert
              </Link>
              <Link
                href="/merge"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Merge PDFs
              </Link>
              <Link
                href="/privacy"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                File Storage & Deletion
              </h2>
              <p>
                Your files are temporarily stored on our servers during the conversion process.
                All files are automatically deleted after 15 minutes, or immediately after you
                download the converted files. We do not store your files permanently.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Data Processing
              </h2>
              <p>
                Files are processed server-side for conversion. We do not share your files with
                third parties. All processing happens in isolated environments and files are
                cleaned up after conversion completes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Security
              </h2>
              <p>
                We implement file type validation and block potentially dangerous file types
                (executables, scripts, etc.). However, we do not perform virus scanning. Please
                only upload files from trusted sources.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                File Size Limits
              </h2>
              <p>
                Maximum file size is 200MB per file. This limit helps ensure fast processing
                and server stability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Rate Limiting
              </h2>
              <p>
                To prevent abuse, we implement rate limiting on conversion requests. This helps
                ensure fair usage for all users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Contact
              </h2>
              <p>
                If you have questions about our privacy practices, please review this page
                regularly as we may update it from time to time.
              </p>
            </section>
          </div>

          <div className="mt-8">
            <Link
              href="/convert"
              className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start Converting
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

