import sharp from 'sharp';
import { AdvancedOptions } from '../../lib/types';

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

