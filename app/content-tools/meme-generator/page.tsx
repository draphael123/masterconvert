'use client';

import { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MEME_TEMPLATES = [
  { id: 'drake', name: 'Drake Hotline', preview: '👎👍' },
  { id: 'distracted', name: 'Distracted BF', preview: '👀' },
  { id: 'buttons', name: 'Two Buttons', preview: '😰' },
  { id: 'brain', name: 'Expanding Brain', preview: '🧠' },
  { id: 'change', name: 'Change My Mind', preview: '☕' },
  { id: 'pikachu', name: 'Surprised Pikachu', preview: '😮' },
];

export default function MemeGeneratorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    multiple: false,
  });

  const drawMeme = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imgRef.current) return;

    const img = imgRef.current;
    canvas.width = img.naturalWidth || 800;
    canvas.height = img.naturalHeight || 600;

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Text settings
    ctx.font = `bold ${fontSize}px Impact, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Draw top text
    if (topText) {
      const topY = 20;
      wrapText(ctx, topText.toUpperCase(), canvas.width / 2, topY, canvas.width - 40, fontSize * 1.2, true);
    }

    // Draw bottom text
    if (bottomText) {
      ctx.textBaseline = 'bottom';
      const lines = getWrappedLines(ctx, bottomText.toUpperCase(), canvas.width - 40);
      const totalHeight = lines.length * fontSize * 1.2;
      const bottomY = canvas.height - 20;
      
      lines.forEach((line, i) => {
        const y = bottomY - totalHeight + (i + 1) * fontSize * 1.2;
        ctx.strokeText(line, canvas.width / 2, y);
        ctx.fillText(line, canvas.width / 2, y);
      });
    }
  };

  const getWrappedLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    fromTop: boolean
  ) => {
    const lines = getWrappedLines(ctx, text, maxWidth);
    lines.forEach((line, i) => {
      const lineY = fromTop ? y + i * lineHeight : y - (lines.length - 1 - i) * lineHeight;
      ctx.strokeText(line, x, lineY);
      ctx.fillText(line, x, lineY);
    });
  };

  const downloadMeme = () => {
    drawMeme();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meme.png';
    a.click();
  };

  const copyMeme = async () => {
    drawMeme();
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-yellow-900 to-slate-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full text-yellow-300 text-sm mb-6">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            Content Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meme Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Add impact font text to images. Classic meme style.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6">
            {!image ? (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-yellow-400 bg-yellow-500/10'
                      : 'border-white/20 hover:border-yellow-400/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="text-6xl mb-4">😂</div>
                  <p className="text-xl text-white mb-2">Drop your image here</p>
                  <p className="text-gray-400">or click to select</p>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Or use a blank canvas:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['#1a1a2e', '#ffffff', '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3'].map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          const canvas = document.createElement('canvas');
                          canvas.width = 800;
                          canvas.height = 600;
                          const ctx = canvas.getContext('2d')!;
                          ctx.fillStyle = color;
                          ctx.fillRect(0, 0, 800, 600);
                          setImage(canvas.toDataURL());
                        }}
                        className="h-12 rounded-lg border border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Text</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Top Text</label>
                      <input
                        type="text"
                        value={topText}
                        onChange={(e) => setTopText(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white uppercase"
                        placeholder="TOP TEXT"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Bottom Text</label>
                      <input
                        type="text"
                        value={bottomText}
                        onChange={(e) => setBottomText(e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white uppercase"
                        placeholder="BOTTOM TEXT"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Style</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Font Size: {fontSize}px</label>
                      <input
                        type="range"
                        min="24"
                        max="96"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Text Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Stroke Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={strokeColor}
                            onChange={(e) => setStrokeColor(e.target.value)}
                            className="w-12 h-10 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={strokeColor}
                            onChange={(e) => setStrokeColor(e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Stroke Width: {strokeWidth}px</label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => { setImage(null); setTopText(''); setBottomText(''); }}
                    className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm"
                  >
                    Change Image
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Preview */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
            
            <div className="relative rounded-xl overflow-hidden bg-checkered">
              {image ? (
                <div className="relative">
                  <img 
                    ref={imgRef}
                    src={image} 
                    alt="Meme" 
                    className="w-full"
                    onLoad={drawMeme}
                  />
                  {/* Text overlay preview */}
                  <div 
                    className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none"
                    style={{ fontFamily: 'Impact, sans-serif' }}
                  >
                    {topText && (
                      <div 
                        className="text-center font-bold uppercase"
                        style={{ 
                          fontSize: `${fontSize / 2}px`,
                          color: textColor,
                          textShadow: `
                            -${strokeWidth}px -${strokeWidth}px 0 ${strokeColor},
                            ${strokeWidth}px -${strokeWidth}px 0 ${strokeColor},
                            -${strokeWidth}px ${strokeWidth}px 0 ${strokeColor},
                            ${strokeWidth}px ${strokeWidth}px 0 ${strokeColor}
                          `,
                        }}
                      >
                        {topText}
                      </div>
                    )}
                    {bottomText && (
                      <div 
                        className="text-center font-bold uppercase"
                        style={{ 
                          fontSize: `${fontSize / 2}px`,
                          color: textColor,
                          textShadow: `
                            -${strokeWidth}px -${strokeWidth}px 0 ${strokeColor},
                            ${strokeWidth}px -${strokeWidth}px 0 ${strokeColor},
                            -${strokeWidth}px ${strokeWidth}px 0 ${strokeColor},
                            ${strokeWidth}px ${strokeWidth}px 0 ${strokeColor}
                          `,
                        }}
                      >
                        {bottomText}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p>Upload an image to start</p>
                  </div>
                </div>
              )}
            </div>

            {image && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={downloadMeme}
                  className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-semibold"
                >
                  📥 Download
                </button>
                <button
                  onClick={copyMeme}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl"
                >
                  📋 Copy
                </button>
              </div>
            )}
          </div>
        </div>

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
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>

      <Footer />
    </div>
  );
}

