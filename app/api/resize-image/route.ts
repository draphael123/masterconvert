import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
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
    const file = formData.get('image') as File;
    const width = parseInt(formData.get('width') as string);
    const height = parseInt(formData.get('height') as string);
    const quality = parseInt(formData.get('quality') as string) || 90;
    const format = formData.get('format') as string || 'jpg';

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!width || !height || width < 1 || height < 1) {
      return NextResponse.json({ error: 'Invalid dimensions' }, { status: 400 });
    }

    if (width > 10000 || height > 10000) {
      return NextResponse.json({ error: 'Dimensions too large (max 10000px)' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let pipeline = sharp(buffer).resize(width, height, {
      fit: 'fill',
      withoutEnlargement: false,
    });

    let outputBuffer: Buffer;
    let contentType: string;

    switch (format) {
      case 'png':
        outputBuffer = await pipeline.png().toBuffer();
        contentType = 'image/png';
        break;
      case 'webp':
        outputBuffer = await pipeline.webp({ quality }).toBuffer();
        contentType = 'image/webp';
        break;
      case 'jpg':
      default:
        outputBuffer = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
        contentType = 'image/jpeg';
        break;
    }

    const responseBuffer = outputBuffer.buffer.slice(
      outputBuffer.byteOffset,
      outputBuffer.byteOffset + outputBuffer.byteLength
    );

    return new NextResponse(responseBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="resized.${format}"`,
      },
    });
  } catch (error) {
    console.error('Resize image error:', error);
    return NextResponse.json(
      { error: 'Failed to resize image. Please try again.' },
      { status: 500 }
    );
  }
}

