import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
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
    const file = formData.get('pdf') as File;
    const text = formData.get('text') as string;
    const fontSize = parseInt(formData.get('fontSize') as string) || 50;
    const opacity = (parseInt(formData.get('opacity') as string) || 30) / 100;
    const rotation = parseInt(formData.get('rotation') as string) || -45;
    const position = formData.get('position') as string || 'diagonal';

    if (!file || !text) {
      return NextResponse.json(
        { error: 'PDF file and watermark text are required' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);

      let x: number;
      let y: number;
      let rotationDegrees: number;

      switch (position) {
        case 'center':
          x = (width - textWidth) / 2;
          y = height / 2;
          rotationDegrees = 0;
          break;
        case 'footer':
          x = (width - textWidth) / 2;
          y = 30;
          rotationDegrees = 0;
          break;
        case 'diagonal':
        default:
          x = width / 2;
          y = height / 2;
          rotationDegrees = rotation;
          break;
      }

      page.drawText(text, {
        x: position === 'diagonal' ? x - textWidth / 2 : x,
        y,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
        opacity,
        rotate: degrees(rotationDegrees),
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="watermarked.pdf"`,
      },
    });
  } catch (error) {
    console.error('Watermark error:', error);
    return NextResponse.json(
      { error: 'Failed to add watermark. Please try again.' },
      { status: 500 }
    );
  }
}

