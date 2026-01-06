import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
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

    // Just return page count
    if (action === 'count') {
      return NextResponse.json({ pageCount });
    }

    // Extract all pages as separate PDFs in a ZIP
    if (action === 'extractAll') {
      const zip = new JSZip();

      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(page);
        const pdfBytes = await newPdf.save();
        zip.file(`page-${i + 1}.pdf`, pdfBytes);
      }

      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      const arrayBuffer = zipBuffer.buffer.slice(
        zipBuffer.byteOffset,
        zipBuffer.byteOffset + zipBuffer.byteLength
      );

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="extracted-pages.zip"',
        },
      });
    }

    // Split/extract specific pages
    if (action === 'split') {
      const pageRange = formData.get('pageRange') as string;
      
      if (!pageRange) {
        return NextResponse.json({ error: 'No page range specified' }, { status: 400 });
      }

      const pagesToExtract = parsePageRange(pageRange, pageCount);

      if (pagesToExtract.length === 0) {
        return NextResponse.json({ error: 'No valid pages specified' }, { status: 400 });
      }

      const newPdf = await PDFDocument.create();
      const pageIndices = pagesToExtract.map(p => p - 1); // Convert to 0-based
      const pages = await newPdf.copyPages(pdfDoc, pageIndices);

      for (const page of pages) {
        newPdf.addPage(page);
      }

      const pdfBytes = await newPdf.save();
      const responseBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength
      );

      return new NextResponse(responseBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="extracted-pages.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('PDF split error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF. Please try again.' },
      { status: 500 }
    );
  }
}

