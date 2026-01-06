import sharp from 'sharp';
import { AdvancedOptions } from '../../lib/types';

// Dynamic import for heic-convert (ES module)
async function getHeicConvert() {
  const heicConvert = await import('heic-convert');
  return heicConvert.default;
}

export async function convertImage(
  inputBuffer: Buffer,
  outputFormat: 'png' | 'jpg' | 'webp' | 'gif',
  options?: AdvancedOptions
): Promise<Buffer> {
  let pipeline = sharp(inputBuffer);

  // Apply resize if specified
  if (options?.width || options?.height) {
    pipeline = pipeline.resize(options.width, options.height, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Convert format
  switch (outputFormat) {
    case 'png':
      return await pipeline.png().toBuffer();
    case 'jpg':
      return await pipeline
        .jpeg({ quality: options?.quality || 90 })
        .toBuffer();
    case 'webp':
      return await pipeline
        .webp({ quality: options?.quality || 90 })
        .toBuffer();
    case 'gif':
      return await pipeline.gif().toBuffer();
    default:
      throw new Error(`Unsupported output format: ${outputFormat}`);
  }
}

export async function resizeImage(
  inputBuffer: Buffer,
  width: number,
  height: number,
  quality?: number
): Promise<Buffer> {
  return await sharp(inputBuffer)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: quality || 90 })
    .toBuffer();
}

// HEIC Conversions (iPhone photos)
export async function convertHeicToJpg(
  inputBuffer: Buffer,
  quality?: number
): Promise<Buffer> {
  const convert = await getHeicConvert();
  const outputBuffer = await convert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: quality || 0.9,
  });
  return Buffer.from(outputBuffer);
}

export async function convertHeicToPng(
  inputBuffer: Buffer
): Promise<Buffer> {
  const convert = await getHeicConvert();
  const outputBuffer = await convert({
    buffer: inputBuffer,
    format: 'PNG',
  });
  return Buffer.from(outputBuffer);
}

// SVG Conversions
export async function convertSvgToPng(
  inputBuffer: Buffer,
  width?: number,
  height?: number
): Promise<Buffer> {
  let pipeline = sharp(inputBuffer, { density: 300 });
  
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }
  
  return await pipeline.png().toBuffer();
}

export async function convertSvgToJpg(
  inputBuffer: Buffer,
  width?: number,
  height?: number,
  quality?: number
): Promise<Buffer> {
  let pipeline = sharp(inputBuffer, { density: 300 });
  
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    });
  }
  
  return await pipeline.flatten({ background: '#ffffff' }).jpeg({ quality: quality || 90 }).toBuffer();
}

// ICO Generation (Favicon)
export async function convertToIco(
  inputBuffer: Buffer
): Promise<Buffer> {
  // Generate multiple sizes for ICO
  const sizes = [16, 32, 48];
  const images: Buffer[] = [];
  
  for (const size of sizes) {
    const resized = await sharp(inputBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    images.push(resized);
  }
  
  // Build ICO file format
  // ICO header: 6 bytes
  // Image entries: 16 bytes each
  // Image data: PNG data for each size
  
  const numImages = images.length;
  const headerSize = 6;
  const entrySize = 16;
  const entriesSize = entrySize * numImages;
  
  // Calculate offsets
  let offset = headerSize + entriesSize;
  const offsets: number[] = [];
  for (const img of images) {
    offsets.push(offset);
    offset += img.length;
  }
  
  // Create buffer
  const totalSize = offset;
  const ico = Buffer.alloc(totalSize);
  
  // Write header
  ico.writeUInt16LE(0, 0); // Reserved (must be 0)
  ico.writeUInt16LE(1, 2); // Image type (1 = ICO)
  ico.writeUInt16LE(numImages, 4); // Number of images
  
  // Write directory entries
  for (let i = 0; i < numImages; i++) {
    const entryOffset = headerSize + (i * entrySize);
    const size = sizes[i];
    const imgData = images[i];
    
    ico.writeUInt8(size === 256 ? 0 : size, entryOffset); // Width
    ico.writeUInt8(size === 256 ? 0 : size, entryOffset + 1); // Height
    ico.writeUInt8(0, entryOffset + 2); // Color palette
    ico.writeUInt8(0, entryOffset + 3); // Reserved
    ico.writeUInt16LE(1, entryOffset + 4); // Color planes
    ico.writeUInt16LE(32, entryOffset + 6); // Bits per pixel
    ico.writeUInt32LE(imgData.length, entryOffset + 8); // Image size
    ico.writeUInt32LE(offsets[i], entryOffset + 12); // Image offset
  }
  
  // Write image data
  for (let i = 0; i < numImages; i++) {
    images[i].copy(ico, offsets[i]);
  }
  
  return ico;
}

