import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getRateLimiter, getClientIdentifier } from '@/lib/rate-limit';

const RATE_LIMIT_PER_MINUTE = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '30');

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

    const body = await request.json();
    const { text, size, errorCorrection, darkColor, lightColor } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (text.length > 4000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 4000 characters.' },
        { status: 400 }
      );
    }

    const dataUrl = await QRCode.toDataURL(text, {
      width: size || 256,
      margin: 2,
      errorCorrectionLevel: errorCorrection || 'M',
      color: {
        dark: darkColor || '#000000',
        light: lightColor || '#ffffff',
      },
    });

    return NextResponse.json({ dataUrl });
  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}



