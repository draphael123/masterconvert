'use client';

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function BackgroundRemoverPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [tolerance, setTolerance] = useState(30);
  const [mode, setMode] = useState<'auto' | 'color'>('auto');
  const [selectedColor, setSelectedColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setProcessedImage(null);
        setSelectedColor(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: false,
  });

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (mode !== 'color' || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = imageRef.current.naturalWidth;
    canvas.height = imageRef.current.naturalHeight;
    ctx.drawImage(imageRef.current, 0, 0);

    const pixel = ctx.getImageData(Math.floor(x * scaleX), Math.floor(y * scaleY), 1, 1).data;
    setSelectedColor({ r: pixel[0], g: pixel[1], b: pixel[2] });
  };

  const removeBackground = async () => {
    if (!originalImage || !canvasRef.current) return;

    setProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = originalImage;
    });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    if (mode === 'auto') {
      // Auto mode: detect edges and remove similar colors from corners
      const cornerSamples = [
        getPixel(data, 0, 0, canvas.width),
        getPixel(data, canvas.width - 1, 0, canvas.width),
        getPixel(data, 0, canvas.height - 1, canvas.width),
        getPixel(data, canvas.width - 1, canvas.height - 1, canvas.width),
      ];

      // Find most common corner color
      const bgColor = findMostCommonColor(cornerSamples);

      // Remove background using flood fill from corners
      floodFillRemove(data, canvas.width, canvas.height, bgColor, tolerance);
    } else if (mode === 'color' && selectedColor) {
      // Color mode: remove selected color
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const diff = Math.sqrt(
          Math.pow(r - selectedColor.r, 2) +
          Math.pow(g - selectedColor.g, 2) +
          Math.pow(b - selectedColor.b, 2)
        );

        if (diff < tolerance * 2) {
          data[i + 3] = 0; // Set alpha to 0
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setProcessedImage(canvas.toDataURL('image/png'));
    setProcessing(false);
  };

  const getPixel = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const idx = (y * width + x) * 4;
    return { r: data[idx], g: data[idx + 1], b: data[idx + 2] };
  };

  const findMostCommonColor = (colors: { r: number; g: number; b: number }[]) => {
    // Simple average for now
    const avg = colors.reduce(
      (acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }),
      { r: 0, g: 0, b: 0 }
    );
    return {
      r: Math.round(avg.r / colors.length),
      g: Math.round(avg.g / colors.length),
      b: Math.round(avg.b / colors.length),
    };
  };

  const floodFillRemove = (
    data: Uint8ClampedArray,
    width: number,
    height: number,
    bgColor: { r: number; g: number; b: number },
    tolerance: number
  ) => {
    const visited = new Set<number>();
    const queue: [number, number][] = [];

    // Start from all edges
    for (let x = 0; x < width; x++) {
      queue.push([x, 0]);
      queue.push([x, height - 1]);
    }
    for (let y = 0; y < height; y++) {
      queue.push([0, y]);
      queue.push([width - 1, y]);
    }

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      const key = y * width + x;

      if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) continue;
      visited.add(key);

      const idx = key * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const diff = Math.sqrt(
        Math.pow(r - bgColor.r, 2) +
        Math.pow(g - bgColor.g, 2) +
        Math.pow(b - bgColor.b, 2)
      );

      if (diff < tolerance * 2) {
        data[idx + 3] = 0; // Remove pixel

        // Add neighbors
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
      }
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const a = document.createElement('a');
    a.href = processedImage;
    a.download = 'background-removed.png';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-emerald-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/convert" className="text-gray-300 hover:text-white transition-colors">Convert</Link>
              <Link href="/tools/image-crop" className="text-gray-300 hover:text-white transition-colors">Crop</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-300 text-sm mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Image Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Background Remover
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Remove backgrounds from images instantly. Works best with solid color backgrounds.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
          {/* Mode Selection */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('auto')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                mode === 'auto'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              🔮 Auto Detect
            </button>
            <button
              onClick={() => setMode('color')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                mode === 'color'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              🎨 Pick Color
            </button>
          </div>

          {/* Tolerance Slider */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Tolerance</label>
              <span className="text-sm text-gray-400">{tolerance}</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={tolerance}
              onChange={(e) => setTolerance(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Precise</span>
              <span>Aggressive</span>
            </div>
          </div>

          {!originalImage ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-emerald-400 bg-emerald-500/10'
                  : 'border-white/20 hover:border-emerald-400/50 hover:bg-white/5'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-xl text-white mb-2">Drop your image here</p>
              <p className="text-gray-400">PNG, JPG, or WebP</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div>
                  <h3 className="text-white font-medium mb-3">Original</h3>
                  <div 
                    className="bg-checkered rounded-xl overflow-hidden relative"
                    onClick={handleImageClick}
                  >
                    <img
                      ref={imageRef}
                      src={originalImage}
                      alt="Original"
                      className={`max-w-full max-h-80 mx-auto ${mode === 'color' ? 'cursor-crosshair' : ''}`}
                    />
                    {mode === 'color' && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Click to select background color
                      </div>
                    )}
                  </div>
                  {selectedColor && mode === 'color' && (
                    <div className="mt-2 flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded border border-white/20"
                        style={{ backgroundColor: `rgb(${selectedColor.r},${selectedColor.g},${selectedColor.b})` }}
                      />
                      <span className="text-sm text-gray-400">
                        Selected: RGB({selectedColor.r}, {selectedColor.g}, {selectedColor.b})
                      </span>
                    </div>
                  )}
                </div>

                {/* Processed Image */}
                <div>
                  <h3 className="text-white font-medium mb-3">Result</h3>
                  <div className="bg-checkered rounded-xl overflow-hidden min-h-[200px] flex items-center justify-center">
                    {processedImage ? (
                      <img src={processedImage} alt="Processed" className="max-w-full max-h-80 mx-auto" />
                    ) : (
                      <p className="text-gray-500">Click &quot;Remove Background&quot; to see result</p>
                    )}
                  </div>
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-4">
                <button
                  onClick={removeBackground}
                  disabled={processing || (mode === 'color' && !selectedColor)}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    processing || (mode === 'color' && !selectedColor)
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500'
                  }`}
                >
                  {processing ? 'Processing...' : 'Remove Background'}
                </button>
                {processedImage && (
                  <button
                    onClick={downloadImage}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
                  >
                    Download PNG
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setOriginalImage(null);
                  setProcessedImage(null);
                  setSelectedColor(null);
                }}
                className="w-full py-2 text-gray-400 hover:text-white transition-colors"
              >
                Upload Different Image
              </button>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">💡</div>
            <h3 className="font-medium text-white mb-1">Best Results</h3>
            <p className="text-sm text-gray-400">Works best with solid color backgrounds (white, green screen, etc.)</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-medium text-white mb-1">Pick Color Mode</h3>
            <p className="text-sm text-gray-400">Click directly on the background color for more precise removal.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-medium text-white mb-1">100% Private</h3>
            <p className="text-sm text-gray-400">Processing happens in your browser. Images never leave your device.</p>
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

