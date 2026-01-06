import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { getRateLimiter, getClientIdentifier } from '@/lib/rate-limit';

const RATE_LIMIT_PER_MINUTE = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '10');
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB total

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
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
    const files = formData.getAll('pdfs') as File[];

    if (!files || files.length < 2) {
      return NextResponse.json(
        { error: 'Please provide at least 2 PDF files to merge' },
        { status: 400 }
      );
    }

    // Check total size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Total file size exceeds 200MB limit' },
        { status: 400 }
      );
    }

    // Create merged PDF
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      // Validate it's a PDF
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: `File "${file.name}" is not a PDF` },
          { status: 400 }
        );
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        
        for (const page of pages) {
          mergedPdf.addPage(page);
        }
      } catch (err) {
        return NextResponse.json(
          { error: `Failed to process "${file.name}". Make sure it's a valid PDF.` },
          { status: 400 }
        );
      }
    }

    const mergedPdfBytes = await mergedPdf.save();
    
    // Convert to ArrayBuffer for NextResponse
    const arrayBuffer = mergedPdfBytes.buffer.slice(
      mergedPdfBytes.byteOffset,
      mergedPdfBytes.byteOffset + mergedPdfBytes.byteLength
    );

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="merged.pdf"',
        'Content-Length': mergedPdfBytes.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF merge error:', error);
    return NextResponse.json(
      { error: 'Failed to merge PDFs. Please try again.' },
      { status: 500 }
    );
  }
}

