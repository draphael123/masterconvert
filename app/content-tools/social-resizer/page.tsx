'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface SocialSize {
  name: string;
  platform: string;
  width: number;
  height: number;
  icon: string;
}

const SOCIAL_SIZES: SocialSize[] = [
  // Instagram
  { name: 'Post (Square)', platform: 'Instagram', width: 1080, height: 1080, icon: '📷' },
  { name: 'Post (Portrait)', platform: 'Instagram', width: 1080, height: 1350, icon: '📷' },
  { name: 'Post (Landscape)', platform: 'Instagram', width: 1080, height: 566, icon: '📷' },
  { name: 'Story/Reel', platform: 'Instagram', width: 1080, height: 1920, icon: '📷' },
  { name: 'Profile Picture', platform: 'Instagram', width: 320, height: 320, icon: '📷' },
  
  // Facebook
  { name: 'Post', platform: 'Facebook', width: 1200, height: 630, icon: '👤' },
  { name: 'Cover Photo', platform: 'Facebook', width: 820, height: 312, icon: '👤' },
  { name: 'Story', platform: 'Facebook', width: 1080, height: 1920, icon: '👤' },
  { name: 'Profile Picture', platform: 'Facebook', width: 170, height: 170, icon: '👤' },
  { name: 'Event Cover', platform: 'Facebook', width: 1920, height: 1005, icon: '👤' },
  
  // Twitter/X
  { name: 'Post Image', platform: 'Twitter/X', width: 1200, height: 675, icon: '🐦' },
  { name: 'Header Photo', platform: 'Twitter/X', width: 1500, height: 500, icon: '🐦' },
  { name: 'Profile Picture', platform: 'Twitter/X', width: 400, height: 400, icon: '🐦' },
  { name: 'Card Image', platform: 'Twitter/X', width: 800, height: 418, icon: '🐦' },
  
  // LinkedIn
  { name: 'Post Image', platform: 'LinkedIn', width: 1200, height: 627, icon: '💼' },
  { name: 'Cover Photo', platform: 'LinkedIn', width: 1128, height: 191, icon: '💼' },
  { name: 'Profile Picture', platform: 'LinkedIn', width: 400, height: 400, icon: '💼' },
  { name: 'Company Logo', platform: 'LinkedIn', width: 300, height: 300, icon: '💼' },
  
  // YouTube
  { name: 'Thumbnail', platform: 'YouTube', width: 1280, height: 720, icon: '▶️' },
  { name: 'Channel Banner', platform: 'YouTube', width: 2560, height: 1440, icon: '▶️' },
  { name: 'Profile Picture', platform: 'YouTube', width: 800, height: 800, icon: '▶️' },
  
  // TikTok
  { name: 'Video/Post', platform: 'TikTok', width: 1080, height: 1920, icon: '🎵' },
  { name: 'Profile Picture', platform: 'TikTok', width: 200, height: 200, icon: '🎵' },
  
  // Pinterest
  { name: 'Pin (Optimal)', platform: 'Pinterest', width: 1000, height: 1500, icon: '📌' },
  { name: 'Pin (Square)', platform: 'Pinterest', width: 1000, height: 1000, icon: '📌' },
  { name: 'Profile Picture', platform: 'Pinterest', width: 165, height: 165, icon: '📌' },
];

const PLATFORMS = ['All', 'Instagram', 'Facebook', 'Twitter/X', 'LinkedIn', 'YouTube', 'TikTok', 'Pinterest'];

export default function SocialResizerPage() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{ size: SocialSize; url: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setGenerated([]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: false,
  });

  const filteredSizes = selectedPlatform === 'All' 
    ? SOCIAL_SIZES 
    : SOCIAL_SIZES.filter(s => s.platform === selectedPlatform);

  const toggleSize = (name: string) => {
    setSelectedSizes(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectAllVisible = () => {
    const visibleNames = filteredSizes.map(s => `${s.platform}-${s.name}`);
    const allSelected = visibleNames.every(n => selectedSizes.has(n));
    if (allSelected) {
      setSelectedSizes(prev => {
        const next = new Set(prev);
        visibleNames.forEach(n => next.delete(n));
        return next;
      });
    } else {
      setSelectedSizes(prev => new Set([...prev, ...visibleNames]));
    }
  };

  const generateImages = async () => {
    if (!image || selectedSizes.size === 0) return;
    setGenerating(true);
    const results: { size: SocialSize; url: string }[] = [];

    const img = new Image();
    await new Promise<void>(resolve => {
      img.onload = () => resolve();
      img.src = image;
    });

    for (const size of SOCIAL_SIZES) {
      const key = `${size.platform}-${size.name}`;
      if (!selectedSizes.has(key)) continue;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = size.width;
      canvas.height = size.height;

      // Calculate crop to fill
      const imgRatio = img.width / img.height;
      const targetRatio = size.width / size.height;
      
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      
      if (imgRatio > targetRatio) {
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / targetRatio;
        sy = (img.height - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size.width, size.height);
      
      const url = canvas.toDataURL('image/png');
      results.push({ size, url });
    }

    setGenerated(results);
    setGenerating(false);
  };

  const downloadImage = (url: string, size: SocialSize) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${size.platform.toLowerCase()}-${size.name.toLowerCase().replace(/\s+/g, '-')}-${size.width}x${size.height}.png`;
    a.click();
  };

  const downloadAll = () => {
    generated.forEach(({ url, size }) => {
      downloadImage(url, size);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-300 text-sm mb-6">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
            Social Media Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Social Media Image Resizer
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Resize your images for all social media platforms in one click.
          </p>
        </div>

        {/* Upload */}
        {!image ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-orange-400 bg-orange-500/10'
                  : 'border-white/20 hover:border-orange-400/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-xl text-white mb-2">Drop your image here</p>
              <p className="text-gray-400">PNG, JPG, or WebP</p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Preview */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <h2 className="text-lg font-semibold text-white mb-4">Original Image</h2>
              <img src={image} alt="Original" className="w-full rounded-lg" />
              <button
                onClick={() => { setImage(null); setGenerated([]); setSelectedSizes(new Set()); }}
                className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Change Image
              </button>
            </div>

            {/* Size Selection */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Select Sizes</h2>
                <button
                  onClick={selectAllVisible}
                  className="text-sm text-orange-400 hover:text-orange-300"
                >
                  {filteredSizes.every(s => selectedSizes.has(`${s.platform}-${s.name}`)) ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Platform Filter */}
              <div className="flex flex-wrap gap-2 mb-4">
                {PLATFORMS.map(platform => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedPlatform === platform
                        ? 'bg-orange-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>

              {/* Sizes Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
                {filteredSizes.map(size => {
                  const key = `${size.platform}-${size.name}`;
                  return (
                    <button
                      key={key}
                      onClick={() => toggleSize(key)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedSizes.has(key)
                          ? 'bg-orange-600/30 border border-orange-500/50'
                          : 'bg-white/5 border border-transparent hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{size.icon}</span>
                        <span className="text-white text-sm font-medium">{size.name}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {size.width} × {size.height}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={generateImages}
                  disabled={selectedSizes.size === 0 || generating}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
                >
                  {generating ? 'Generating...' : `Generate ${selectedSizes.size} Image${selectedSizes.size !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Generated Images */}
        {generated.length > 0 && (
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Generated Images ({generated.length})</h2>
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors"
              >
                Download All
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {generated.map(({ size, url }, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 group">
                  <div className="aspect-square bg-checkered rounded-lg overflow-hidden flex items-center justify-center mb-2">
                    <img src={url} alt={size.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="text-center">
                    <p className="text-white text-sm font-medium">{size.platform}</p>
                    <p className="text-gray-400 text-xs">{size.name}</p>
                    <p className="text-gray-500 text-xs">{size.width}×{size.height}</p>
                  </div>
                  <button
                    onClick={() => downloadImage(url, size)}
                    className="w-full mt-2 py-1.5 bg-white/10 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </main>

      <style jsx>{`
        .bg-checkered {
          background-color: #1a1a2e;
          background-image: 
            linear-gradient(45deg, #2a2a4a 25%, transparent 25%),
            linear-gradient(-45deg, #2a2a4a 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #2a2a4a 75%),
            linear-gradient(-45deg, transparent 75%, #2a2a4a 75%);
          background-size: 12px 12px;
          background-position: 0 0, 0 6px, 6px -6px, -6px 0px;
        }
      `}</style>

      <Footer />
    </div>
  );
}

