import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, degrees } from 'pdf-lib';
import { getRateLimiter, getClientIdentifier } from '@/lib/rate-limit';

const RATE_LIMIT_PER_MINUTE = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '10');

function parsePageRange(rangeStr: string, maxPages: number): number[] {
  const pages: Set<number> = new Set();
  const parts = rangeStr.split(',').map(s => s.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(s => parseInt(s.trim()));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
          pages.add(i);
        }
      }
    } else {
      const page = parseInt(part);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        pages.add(page);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

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
    const action = formData.get('action') as string;

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    if (action === 'count') {
      return NextResponse.json({ pageCount });
    }

    if (action === 'rotate') {
      const rotation = parseInt(formData.get('rotation') as string) || 90;
      const rotateAll = formData.get('rotateAll') === 'true';
      const pagesStr = formData.get('pages') as string;

      const pages = pdfDoc.getPages();
      const pagesToRotate = rotateAll 
        ? Array.from({ length: pageCount }, (_, i) => i + 1)
        : parsePageRange(pagesStr, pageCount);

      for (const pageNum of pagesToRotate) {
        const page = pages[pageNum - 1];
        if (page) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + rotation));
        }
      }

      const pdfBytes = await pdfDoc.save();
      const responseBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength
      );

      return new NextResponse(responseBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="rotated.pdf"',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Rotate PDF error:', error);
    return NextResponse.json(
      { error: 'Failed to rotate PDF. Please try again.' },
      { status: 500 }
    );
  }
}

