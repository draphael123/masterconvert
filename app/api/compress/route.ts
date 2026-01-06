import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { PDFDocument } from 'pdf-lib';
import { getRateLimiter, getClientIdentifier } from '@/lib/rate-limit';

const RATE_LIMIT_PER_MINUTE = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '10');

export async function POST(request: NextRequest) {
  try {
    const rateLimiter = getRateLimiter();
    const clientId = getClientIdentifier(request);
    const limitCheck = rateLimiter.checkLimit(clientId, RATE_LIMIT_PER_MINUTE, 60000);

    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const quality = parseInt(formData.get('quality') as string) || 80;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let compressedBuffer: Buffer;
    let contentType: string;
    let filename: string;

    if (type === 'image' || file.type.startsWith('image/')) {
      // Image compression using sharp
      const image = sharp(buffer);
      const metadata = await image.metadata();

      // Determine output format based on input
      const format = metadata.format || 'jpeg';
      
      if (format === 'png') {
        compressedBuffer = await image
          .png({ quality: quality, compressionLevel: 9 })
          .toBuffer();
        contentType = 'image/png';
        filename = file.name.replace(/\.[^.]+$/, '.png');
      } else if (format === 'webp') {
        compressedBuffer = await image
          .webp({ quality: quality })
          .toBuffer();
        contentType = 'image/webp';
        filename = file.name.replace(/\.[^.]+$/, '.webp');
      } else {
        // Default to JPEG for best compression
        compressedBuffer = await image
          .jpeg({ quality: quality, mozjpeg: true })
          .toBuffer();
        contentType = 'image/jpeg';
        filename = file.name.replace(/\.[^.]+$/, '.jpg');
      }
    } else if (type === 'pdf' || file.type === 'application/pdf') {
      // PDF compression
      // Note: pdf-lib doesn't have built-in compression, but we can
      // remove unused objects and optimize the structure
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      
      // Get all pages and their embedded images
      const pages = pdfDoc.getPages();
      
      // Save with object streams for better compression
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      
      compressedBuffer = Buffer.from(compressedBytes);
      contentType = 'application/pdf';
      filename = `compressed-${file.name}`;

      // If the "compressed" file is larger, return original
      if (compressedBuffer.length >= buffer.length) {
        compressedBuffer = buffer;
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    return new NextResponse(new Uint8Array(compressedBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': compressedBuffer.length.toString(),
        'X-Original-Size': buffer.length.toString(),
        'X-Compressed-Size': compressedBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Compression error:', error);
    return NextResponse.json(
      { error: 'Failed to compress file. Please try again.' },
      { status: 500 }
    );
  }
}

