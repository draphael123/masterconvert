'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface LogoSize {
  name: string;
  width: number;
  height: number;
  category: string;
}

interface GeneratedLogo {
  size: LogoSize;
  url: string;
  blob: Blob;
}

const LOGO_SIZES: LogoSize[] = [
  // Favicons
  { name: 'Favicon (16×16)', width: 16, height: 16, category: 'Favicon' },
  { name: 'Favicon (32×32)', width: 32, height: 32, category: 'Favicon' },
  { name: 'Favicon (48×48)', width: 48, height: 48, category: 'Favicon' },
  { name: 'Favicon (64×64)', width: 64, height: 64, category: 'Favicon' },
  { name: 'Apple Touch Icon', width: 180, height: 180, category: 'Favicon' },
  
  // Social Media
  { name: 'Twitter Profile', width: 400, height: 400, category: 'Social Media' },
  { name: 'Facebook Profile', width: 170, height: 170, category: 'Social Media' },
  { name: 'Instagram Profile', width: 320, height: 320, category: 'Social Media' },
  { name: 'LinkedIn Profile', width: 400, height: 400, category: 'Social Media' },
  { name: 'YouTube Profile', width: 800, height: 800, category: 'Social Media' },
  { name: 'TikTok Profile', width: 200, height: 200, category: 'Social Media' },
  { name: 'Discord Server', width: 512, height: 512, category: 'Social Media' },
  
  // App Icons
  { name: 'iOS App (120×120)', width: 120, height: 120, category: 'App Icons' },
  { name: 'iOS App (180×180)', width: 180, height: 180, category: 'App Icons' },
  { name: 'iOS App Store', width: 1024, height: 1024, category: 'App Icons' },
  { name: 'Android App (48×48)', width: 48, height: 48, category: 'App Icons' },
  { name: 'Android App (72×72)', width: 72, height: 72, category: 'App Icons' },
  { name: 'Android App (96×96)', width: 96, height: 96, category: 'App Icons' },
  { name: 'Android App (144×144)', width: 144, height: 144, category: 'App Icons' },
  { name: 'Android App (192×192)', width: 192, height: 192, category: 'App Icons' },
  { name: 'Android Play Store', width: 512, height: 512, category: 'App Icons' },
  { name: 'Windows Tile', width: 256, height: 256, category: 'App Icons' },
  
  // Web & Email
  { name: 'Email Signature', width: 300, height: 100, category: 'Web & Email' },
  { name: 'Website Header', width: 250, height: 60, category: 'Web & Email' },
  { name: 'Website Header (Retina)', width: 500, height: 120, category: 'Web & Email' },
  { name: 'Open Graph Image', width: 1200, height: 630, category: 'Web & Email' },
  { name: 'Twitter Card', width: 1200, height: 600, category: 'Web & Email' },
  
  // Common Squares
  { name: 'Square (100×100)', width: 100, height: 100, category: 'Common Sizes' },
  { name: 'Square (200×200)', width: 200, height: 200, category: 'Common Sizes' },
  { name: 'Square (300×300)', width: 300, height: 300, category: 'Common Sizes' },
  { name: 'Square (500×500)', width: 500, height: 500, category: 'Common Sizes' },
  { name: 'Square (1000×1000)', width: 1000, height: 1000, category: 'Common Sizes' },
];

const CATEGORIES = ['Favicon', 'Social Media', 'App Icons', 'Web & Email', 'Common Sizes'];

export default function LogoResizePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setGeneratedLogos([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'],
    },
    multiple: false,
  });

  const toggleSize = (sizeName: string) => {
    setSelectedSizes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sizeName)) {
        newSet.delete(sizeName);
      } else {
        newSet.add(sizeName);
      }
      return newSet;
    });
  };

  const selectCategory = (category: string) => {
    const categorySizes = LOGO_SIZES.filter(s => s.category === category);
    setSelectedSizes(prev => {
      const newSet = new Set(prev);
      const allSelected = categorySizes.every(s => prev.has(s.name));
      if (allSelected) {
        categorySizes.forEach(s => newSet.delete(s.name));
      } else {
        categorySizes.forEach(s => newSet.add(s.name));
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedSizes.size === LOGO_SIZES.length) {
      setSelectedSizes(new Set());
    } else {
      setSelectedSizes(new Set(LOGO_SIZES.map(s => s.name)));
    }
  };

  const generateLogos = async () => {
    if (!uploadedImage || selectedSizes.size === 0) return;

    setGenerating(true);
    setProgress(0);
    const generated: GeneratedLogo[] = [];
    const sizesToGenerate = LOGO_SIZES.filter(s => selectedSizes.has(s.name));

    for (let i = 0; i < sizesToGenerate.length; i++) {
      const size = sizesToGenerate[i];
      setProgress(((i + 0.5) / sizesToGenerate.length) * 100);

      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        canvas.width = size.width;
        canvas.height = size.height;

        // Fill background (especially important for JPG)
        if (outputFormat === 'jpg') {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, size.width, size.height);
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            let drawWidth = size.width;
            let drawHeight = size.height;
            let offsetX = 0;
            let offsetY = 0;

            if (maintainAspect) {
              const imgAspect = img.width / img.height;
              const targetAspect = size.width / size.height;

              if (imgAspect > targetAspect) {
                drawHeight = size.width / imgAspect;
                offsetY = (size.height - drawHeight) / 2;
              } else {
                drawWidth = size.height * imgAspect;
                offsetX = (size.width - drawWidth) / 2;
              }

              // Fill background for transparent areas
              if (outputFormat !== 'jpg') {
                ctx.fillStyle = 'transparent';
              } else {
                ctx.fillStyle = backgroundColor;
              }
              ctx.fillRect(0, 0, size.width, size.height);
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            resolve();
          };
          img.onerror = reject;
          img.src = uploadedImage;
        });

        const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : 
                         outputFormat === 'webp' ? 'image/webp' : 'image/png';
        const quality = outputFormat === 'png' ? 1 : 0.92;

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), mimeType, quality);
        });

        const url = URL.createObjectURL(blob);
        generated.push({ size, url, blob });
      } catch (error) {
        console.error(`Failed to generate ${size.name}:`, error);
      }

      setProgress(((i + 1) / sizesToGenerate.length) * 100);
    }

    setGeneratedLogos(generated);
    setGenerating(false);
  };

  const downloadLogo = (logo: GeneratedLogo) => {
    const a = document.createElement('a');
    a.href = logo.url;
    const ext = outputFormat === 'jpg' ? 'jpg' : outputFormat;
    a.download = `logo-${logo.size.width}x${logo.size.height}.${ext}`;
    a.click();
  };

  const downloadAll = async () => {
    // Download each file
    for (const logo of generatedLogos) {
      downloadLogo(logo);
      await new Promise(r => setTimeout(r, 100)); // Small delay between downloads
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-indigo-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/convert" className="text-gray-300 hover:text-white transition-colors">
                Convert
              </Link>
              <Link href="/heic" className="text-gray-300 hover:text-white transition-colors">
                HEIC
              </Link>
              <Link href="/resize" className="text-gray-300 hover:text-white transition-colors">
                Resize
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm mb-6">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            Logo & Icon Generator
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Logo Resizer
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate logos in all the sizes you need for favicons, social media, 
            app stores, and more. One upload, multiple sizes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Settings */}
          <div className="space-y-6">
            {/* Upload Zone */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">1. Upload Your Logo</h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-indigo-400 bg-indigo-500/10'
                    : 'border-white/20 hover:border-indigo-400/50 hover:bg-white/5'
                }`}
              >
                <input {...getInputProps()} />
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded logo" 
                      className="max-h-32 max-w-full mx-auto rounded-lg"
                    />
                    <p className="text-sm text-gray-400">
                      {uploadedFile?.name} • Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-5xl mb-4">🎨</div>
                    <p className="text-lg text-white mb-2">
                      Drop your logo here
                    </p>
                    <p className="text-gray-400 text-sm">
                      PNG, JPG, SVG, or WebP
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Output Settings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">2. Output Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Output Format
                  </label>
                  <div className="flex gap-2">
                    {(['png', 'jpg', 'webp'] as const).map(format => (
                      <button
                        key={format}
                        onClick={() => setOutputFormat(format)}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                          outputFormat === format
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">
                    Maintain Aspect Ratio
                  </label>
                  <button
                    onClick={() => setMaintainAspect(!maintainAspect)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      maintainAspect ? 'bg-indigo-600' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                        maintainAspect ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {outputFormat === 'jpg' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Background Color (for JPG)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Size Selection */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">3. Select Sizes</h2>
              <button
                onClick={selectAll}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                {selectedSizes.size === LOGO_SIZES.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {CATEGORIES.map(category => {
                const categorySizes = LOGO_SIZES.filter(s => s.category === category);
                const allSelected = categorySizes.every(s => selectedSizes.has(s.name));
                const someSelected = categorySizes.some(s => selectedSizes.has(s.name));

                return (
                  <div key={category}>
                    <button
                      onClick={() => selectCategory(category)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white mb-2"
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center ${
                        allSelected ? 'bg-indigo-600 border-indigo-600' :
                        someSelected ? 'bg-indigo-600/50 border-indigo-600' : 'border-white/30'
                      }`}>
                        {(allSelected || someSelected) && <span className="text-white text-xs">✓</span>}
                      </span>
                      {category}
                    </button>
                    <div className="grid grid-cols-2 gap-2 ml-6">
                      {categorySizes.map(size => (
                        <button
                          key={size.name}
                          onClick={() => toggleSize(size.name)}
                          className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            selectedSizes.has(size.name)
                              ? 'bg-indigo-600/30 border border-indigo-500/50 text-white'
                              : 'bg-white/5 border border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="font-medium truncate">{size.name}</div>
                          <div className="text-xs opacity-70">{size.width}×{size.height}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">
                  {selectedSizes.size} size{selectedSizes.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <button
                onClick={generateLogos}
                disabled={!uploadedImage || selectedSizes.size === 0 || generating}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  !uploadedImage || selectedSizes.size === 0 || generating
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
                }`}
              >
                {generating ? 'Generating...' : 'Generate Logos'}
              </button>
            </div>
          </div>
        </div>

        {/* Progress */}
        {generating && (
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Generating logos...</span>
              <span className="text-gray-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Generated Logos */}
        {generatedLogos.length > 0 && (
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Generated Logos ({generatedLogos.length})
              </h2>
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Download All
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {generatedLogos.map((logo, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-indigo-500/50 transition-colors group"
                >
                  <div className="aspect-square bg-checkered rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                    <img
                      src={logo.url}
                      alt={logo.size.name}
                      className="max-w-full max-h-full object-contain"
                      style={{ 
                        maxWidth: Math.min(logo.size.width, 150),
                        maxHeight: Math.min(logo.size.height, 150)
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-white text-sm font-medium truncate">{logo.size.name}</p>
                    <p className="text-gray-400 text-xs">
                      {logo.size.width}×{logo.size.height} • {formatFileSize(logo.blob.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadLogo(logo)}
                    className="w-full mt-3 py-2 bg-white/10 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Generation</h3>
            <p className="text-gray-400 text-sm">
              All sizes generated instantly in your browser. No upload needed.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">📐</div>
            <h3 className="text-lg font-semibold text-white mb-2">All Sizes Included</h3>
            <p className="text-gray-400 text-sm">
              Favicons, social media, app icons, and common sizes all in one place.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-white mb-2">100% Private</h3>
            <p className="text-gray-400 text-sm">
              Processing happens entirely in your browser. Files never leave your device.
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        .bg-checkered {
          background-color: #1a1a2e;
          background-image: 
            linear-gradient(45deg, #2a2a4a 25%, transparent 25%),
            linear-gradient(-45deg, #2a2a4a 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #2a2a4a 75%),
            linear-gradient(-45deg, transparent 75%, #2a2a4a 75%);
          background-size: 16px 16px;
          background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
        }
      `}</style>

      <Footer />
    </div>
  );
}

