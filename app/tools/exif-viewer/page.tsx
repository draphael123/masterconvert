'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface ExifData {
  [key: string]: string | number | undefined;
}

export default function ExifViewerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cleanedImage, setCleanedImage] = useState<string | null>(null);

  const parseExif = (arrayBuffer: ArrayBuffer): ExifData => {
    const view = new DataView(arrayBuffer);
    const exif: ExifData = {};

    // Check for JPEG
    if (view.getUint16(0) !== 0xFFD8) {
      throw new Error('Not a valid JPEG file');
    }

    let offset = 2;
    while (offset < view.byteLength) {
      const marker = view.getUint16(offset);
      
      // APP1 marker (EXIF)
      if (marker === 0xFFE1) {
        const length = view.getUint16(offset + 2);
        const exifOffset = offset + 4;
        
        // Check for "Exif\0\0"
        const exifHeader = String.fromCharCode(
          view.getUint8(exifOffset),
          view.getUint8(exifOffset + 1),
          view.getUint8(exifOffset + 2),
          view.getUint8(exifOffset + 3)
        );
        
        if (exifHeader === 'Exif') {
          const tiffOffset = exifOffset + 6;
          const littleEndian = view.getUint16(tiffOffset) === 0x4949;
          
          const ifdOffset = view.getUint32(tiffOffset + 4, littleEndian);
          const numEntries = view.getUint16(tiffOffset + ifdOffset, littleEndian);
          
          for (let i = 0; i < numEntries; i++) {
            const entryOffset = tiffOffset + ifdOffset + 2 + (i * 12);
            const tag = view.getUint16(entryOffset, littleEndian);
            const type = view.getUint16(entryOffset + 2, littleEndian);
            const count = view.getUint32(entryOffset + 4, littleEndian);
            
            // Common EXIF tags
            const tagNames: Record<number, string> = {
              0x010F: 'Make',
              0x0110: 'Model',
              0x0112: 'Orientation',
              0x011A: 'XResolution',
              0x011B: 'YResolution',
              0x0128: 'ResolutionUnit',
              0x0131: 'Software',
              0x0132: 'DateTime',
              0x8769: 'ExifIFDPointer',
              0x8825: 'GPSInfoIFDPointer',
              0xA002: 'PixelXDimension',
              0xA003: 'PixelYDimension',
            };
            
            const tagName = tagNames[tag];
            if (tagName) {
              let value: string | number = '';
              
              if (type === 2) { // ASCII
                const valueOffset = count > 4 
                  ? view.getUint32(entryOffset + 8, littleEndian) + tiffOffset
                  : entryOffset + 8;
                for (let j = 0; j < count - 1; j++) {
                  value += String.fromCharCode(view.getUint8(valueOffset + j));
                }
              } else if (type === 3) { // SHORT
                value = view.getUint16(entryOffset + 8, littleEndian);
              } else if (type === 4) { // LONG
                value = view.getUint32(entryOffset + 8, littleEndian);
              }
              
              if (value) {
                exif[tagName] = value;
              }
            }
          }
        }
        break;
      }
      
      // Move to next marker
      if ((marker & 0xFF00) === 0xFF00) {
        offset += 2 + view.getUint16(offset + 2);
      } else {
        offset++;
      }
    }
    
    return exif;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setExifData(null);
    setCleanedImage(null);
    setFileName(file.name);

    try {
      // Read as data URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Read as array buffer for EXIF parsing
      const arrayBuffer = await file.arrayBuffer();
      const exif = parseExif(arrayBuffer);
      
      // Add file info
      exif['File Name'] = file.name;
      exif['File Size'] = `${(file.size / 1024).toFixed(2)} KB`;
      exif['File Type'] = file.type;
      exif['Last Modified'] = new Date(file.lastModified).toLocaleString();
      
      setExifData(exif);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read EXIF data');
      setExifData({
        'File Name': file.name,
        'File Size': `${(file.size / 1024).toFixed(2)} KB`,
        'File Type': file.type,
        'Note': 'No EXIF data found or unsupported format',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic'] },
    multiple: false,
  });

  const removeExif = async () => {
    if (!image) return;

    // Create canvas and redraw image without EXIF
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      
      // Convert to blob without EXIF
      setCleanedImage(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.src = image;
  };

  const downloadCleanedImage = () => {
    if (!cleanedImage) return;
    const a = document.createElement('a');
    a.href = cleanedImage;
    a.download = `clean_${fileName.replace(/\.[^/.]+$/, '')}.jpg`;
    a.click();
  };

  const copyToClipboard = () => {
    if (!exifData) return;
    const text = Object.entries(exifData)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-orange-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/tools/background-remover" className="text-gray-300 hover:text-white transition-colors">Remove BG</Link>
              <Link href="/tools/image-crop" className="text-gray-300 hover:text-white transition-colors">Crop</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-300 text-sm mb-6">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
            Privacy Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            EXIF Metadata Viewer
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            View and remove EXIF metadata from images. Protect your privacy by stripping location and device info.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload / Image Preview */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            {!image ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-orange-400 bg-orange-500/10'
                    : 'border-white/20 hover:border-orange-400/50 hover:bg-white/5'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-6xl mb-4">📷</div>
                <p className="text-xl text-white mb-2">Drop your image here</p>
                <p className="text-gray-400">JPG, PNG, WebP, or HEIC</p>
              </div>
            ) : (
              <div>
                <div className="relative">
                  <img
                    src={cleanedImage || image}
                    alt="Uploaded"
                    className="max-w-full max-h-80 mx-auto rounded-lg"
                  />
                  {cleanedImage && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                      EXIF Removed
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  {!cleanedImage ? (
                    <button
                      onClick={removeExif}
                      className="flex-1 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors"
                    >
                      Remove EXIF Data
                    </button>
                  ) : (
                    <button
                      onClick={downloadCleanedImage}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
                    >
                      Download Clean Image
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setImage(null);
                      setExifData(null);
                      setCleanedImage(null);
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    New
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* EXIF Data */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Metadata</h2>
              {exifData && (
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-orange-400 hover:text-orange-300"
                >
                  Copy All
                </button>
              )}
            </div>

            {loading && (
              <div className="text-center py-12 text-gray-400">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                Reading metadata...
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 mb-4">
                {error}
              </div>
            )}

            {exifData && !loading && (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {Object.entries(exifData).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-start px-3 py-2 bg-white/5 rounded-lg"
                  >
                    <span className="text-sm text-gray-400">{key}</span>
                    <span className="text-sm text-white text-right ml-4 break-all">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {!exifData && !loading && (
              <div className="text-center py-12 text-gray-500">
                Upload an image to view metadata
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">📍</div>
            <h3 className="font-medium text-white mb-1">Location Data</h3>
            <p className="text-sm text-gray-400">Photos can contain GPS coordinates revealing where they were taken.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">📱</div>
            <h3 className="font-medium text-white mb-1">Device Info</h3>
            <p className="text-sm text-gray-400">Camera model, software, and settings are often embedded.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-medium text-white mb-1">Privacy First</h3>
            <p className="text-sm text-gray-400">Remove metadata before sharing photos online.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

