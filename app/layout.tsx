import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: "FileForge - Convert Files Online | Free File Converter",
  description: "Convert documents, images, audio, video, and data files with ease. Free, secure, and privacy-focused file conversion tool. Support for 50+ formats including PDF, DOCX, CSV, JSON, PNG, JPG, and more.",
  keywords: "file converter, convert files, PDF converter, image converter, document converter, CSV converter, JSON converter, free file conversion, online file converter, merge PDF, split PDF, compress images, watermark PDF",
  authors: [{ name: "FileForge" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "FileForge - Convert Files Online",
    description: "Free, secure file conversion for 50+ formats. Convert documents, images, data files and more.",
    type: "website",
    url: "https://masterconvert.vercel.app",
    siteName: "FileForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileForge - Convert Files Online",
    description: "Free, secure file conversion for 50+ formats",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "FileForge",
  "description": "Free online file converter supporting 50+ formats. Convert, merge, split, compress, and protect files.",
  "url": "https://masterconvert.vercel.app",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "File conversion",
    "PDF merge",
    "PDF split",
    "Image compression",
    "PDF watermark",
    "PDF password protection"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

