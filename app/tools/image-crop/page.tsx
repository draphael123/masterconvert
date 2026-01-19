'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ASPECT_RATIOS = [
  { name: 'Free', value: null },
  { name: '1:1', value: 1 },
  { name: '4:3', value: 4 / 3 },
  { name: '3:2', value: 3 / 2 },
  { name: '16:9', value: 16 / 9 },
  { name: '9:16', value: 9 / 16 },
  { name: '2:3', value: 2 / 3 },
  { name: '3:4', value: 3 / 4 },
];

export default function ImageCropPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 200 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpg' | 'webp'>('png');
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImageSize({ width: img.width, height: img.height });
          const initialSize = Math.min(img.width, img.height) * 0.6;
          setCropArea({
            x: (img.width - initialSize) / 2,
            y: (img.height - initialSize) / 2,
            width: initialSize,
            height: initialSize,
          });
        };
        img.src = e.target?.result as string;
        setOriginalImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    multiple: false,
  });

  const getScale = () => {
    if (!containerRef.current || !imageSize.width) return 1;
    const containerWidth = containerRef.current.clientWidth;
    return Math.min(1, containerWidth / imageSize.width);
  };

  const handleMouseDown = (e: React.MouseEvent, action: 'move' | string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (action === 'move') {
      setIsDragging(true);
    } else {
      setIsResizing(action);
    }
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging && !isResizing) return;

      const scale = getScale();
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      setDragStart({ x: e.clientX, y: e.clientY });

      setCropArea(prev => {
        let newArea = { ...prev };

        if (isDragging) {
          newArea.x = Math.max(0, Math.min(imageSize.width - prev.width, prev.x + dx));
          newArea.y = Math.max(0, Math.min(imageSize.height - prev.height, prev.y + dy));
        } else if (isResizing) {
          if (isResizing.includes('e')) {
            newArea.width = Math.max(50, Math.min(imageSize.width - prev.x, prev.width + dx));
          }
          if (isResizing.includes('w')) {
            const newWidth = Math.max(50, prev.width - dx);
            const newX = prev.x + (prev.width - newWidth);
            if (newX >= 0) {
              newArea.width = newWidth;
              newArea.x = newX;
            }
          }
          if (isResizing.includes('s')) {
            newArea.height = Math.max(50, Math.min(imageSize.height - prev.y, prev.height + dy));
          }
          if (isResizing.includes('n')) {
            const newHeight = Math.max(50, prev.height - dy);
            const newY = prev.y + (prev.height - newHeight);
            if (newY >= 0) {
              newArea.height = newHeight;
              newArea.y = newY;
            }
          }

          // Apply aspect ratio
          if (aspectRatio) {
            if (isResizing.includes('e') || isResizing.includes('w')) {
              newArea.height = newArea.width / aspectRatio;
            } else {
              newArea.width = newArea.height * aspectRatio;
            }
          }
        }

        return newArea;
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, imageSize, aspectRatio]);

  const applyAspectRatio = (ratio: number | null) => {
    setAspectRatio(ratio);
    if (ratio) {
      setCropArea(prev => {
        const newWidth = prev.width;
        const newHeight = newWidth / ratio;
        return {
          ...prev,
          height: Math.min(newHeight, imageSize.height - prev.y),
        };
      });
    }
  };

  const cropImage = async () => {
    if (!originalImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    const img = new Image();
    await new Promise<void>(resolve => {
      img.onload = () => resolve();
      img.src = originalImage;
    });

    ctx.drawImage(
      img,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : 
                     outputFormat === 'webp' ? 'image/webp' : 'image/png';
    
    const dataUrl = canvas.toDataURL(mimeType, 0.92);
    
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `cropped-image.${outputFormat}`;
    a.click();
  };

  const scale = getScale();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              File<span className="text-violet-400">Forge</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/resize" className="text-gray-300 hover:text-white transition-colors">Resize</Link>
              <Link href="/tools/background-remover" className="text-gray-300 hover:text-white transition-colors">Remove BG</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 rounded-full text-violet-300 text-sm mb-6">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
            Image Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Image Cropper
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Crop your images to any size or aspect ratio. Perfect for social media and profile pictures.
          </p>
        </div>

        {!originalImage ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-violet-400 bg-violet-500/10'
                  : 'border-white/20 hover:border-violet-400/50 hover:bg-white/5'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-6xl mb-4">✂️</div>
              <p className="text-xl text-white mb-2">Drop your image here</p>
              <p className="text-gray-400">PNG, JPG, WebP, or GIF</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Aspect Ratio:</span>
                  <div className="flex gap-1">
                    {ASPECT_RATIOS.map(ratio => (
                      <button
                        key={ratio.name}
                        onClick={() => applyAspectRatio(ratio.value)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          aspectRatio === ratio.value
                            ? 'bg-violet-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {ratio.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-400">Format:</span>
                  {(['png', 'jpg', 'webp'] as const).map(format => (
                    <button
                      key={format}
                      onClick={() => setOutputFormat(format)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        outputFormat === format
                          ? 'bg-violet-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Crop Area */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 overflow-hidden">
              <div
                ref={containerRef}
                className="relative mx-auto overflow-hidden"
                style={{
                  width: imageSize.width * scale,
                  height: imageSize.height * scale,
                }}
              >
                {/* Background Image (dimmed) */}
                <img
                  ref={imageRef}
                  src={originalImage}
                  alt="Original"
                  className="absolute top-0 left-0 opacity-40"
                  style={{
                    width: imageSize.width * scale,
                    height: imageSize.height * scale,
                  }}
                  draggable={false}
                />

                {/* Crop Preview */}
                <div
                  className="absolute overflow-hidden"
                  style={{
                    left: cropArea.x * scale,
                    top: cropArea.y * scale,
                    width: cropArea.width * scale,
                    height: cropArea.height * scale,
                  }}
                >
                  <img
                    src={originalImage}
                    alt="Crop preview"
                    style={{
                      position: 'absolute',
                      left: -cropArea.x * scale,
                      top: -cropArea.y * scale,
                      width: imageSize.width * scale,
                      height: imageSize.height * scale,
                    }}
                    draggable={false}
                  />
                </div>

                {/* Crop Handle */}
                <div
                  className="absolute border-2 border-violet-400 cursor-move"
                  style={{
                    left: cropArea.x * scale,
                    top: cropArea.y * scale,
                    width: cropArea.width * scale,
                    height: cropArea.height * scale,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'move')}
                >
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="border border-white/20" />
                    ))}
                  </div>

                  {/* Resize Handles */}
                  {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map(dir => (
                    <div
                      key={dir}
                      className={`absolute w-4 h-4 bg-violet-400 rounded-full border-2 border-white cursor-${
                        dir === 'n' || dir === 's' ? 'ns' :
                        dir === 'e' || dir === 'w' ? 'ew' :
                        dir === 'nw' || dir === 'se' ? 'nwse' : 'nesw'
                      }-resize`}
                      style={{
                        left: dir.includes('w') ? -8 : dir.includes('e') ? '100%' : '50%',
                        top: dir.includes('n') ? -8 : dir.includes('s') ? '100%' : '50%',
                        transform: `translate(${dir.includes('e') ? '-50%' : dir.includes('w') ? '0' : '-50%'}, ${dir.includes('s') ? '-50%' : dir.includes('n') ? '0' : '-50%'})`,
                      }}
                      onMouseDown={(e) => handleMouseDown(e, dir)}
                    />
                  ))}
                </div>
              </div>

              {/* Size Info */}
              <div className="mt-4 text-center text-sm text-gray-400">
                Output size: {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={cropImage}
                className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 transition-all"
              >
                Download Cropped Image
              </button>
              <button
                onClick={() => setOriginalImage(null)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
              >
                New Image
              </button>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">📐</div>
            <h3 className="font-medium text-white mb-1">Preset Ratios</h3>
            <p className="text-sm text-gray-400">Common aspect ratios for social media and photos.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-medium text-white mb-1">Precise Control</h3>
            <p className="text-sm text-gray-400">Drag to move, resize handles for fine adjustments.</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-medium text-white mb-1">100% Private</h3>
            <p className="text-sm text-gray-400">All processing in your browser. Nothing uploaded.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

