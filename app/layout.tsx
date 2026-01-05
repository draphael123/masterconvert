import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FileForge - Convert Files Online | Free File Converter",
  description: "Convert documents, images, audio, video, and data files with ease. Free, secure, and privacy-focused file conversion tool. Support for 40+ formats including PDF, DOCX, CSV, JSON, PNG, JPG, and more.",
  keywords: "file converter, convert files, PDF converter, image converter, document converter, CSV converter, JSON converter, free file conversion, online file converter",
  authors: [{ name: "FileForge" }],
  openGraph: {
    title: "FileForge - Convert Files Online",
    description: "Free, secure file conversion for 40+ formats. Convert documents, images, data files and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileForge - Convert Files Online",
    description: "Free, secure file conversion for 40+ formats",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

