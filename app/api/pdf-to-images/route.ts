import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
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
    const format = formData.get('format') as string || 'png';

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    // Note: pdf-lib doesn't support rendering PDFs to images directly
    // For true PDF to image conversion, we'd need a library like pdf-poppler or pdf2pic
    // which requires system dependencies not available in serverless
    
    // As a workaround, we'll create a ZIP with individual page PDFs
    // In a production environment, you'd use a service like CloudConvert or 
    // run this on a server with poppler installed
    
    const zip = new JSZip();

    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(page);
      const pdfBytes = await newPdf.save();
      zip.file(`page-${i + 1}.pdf`, pdfBytes);
    }

    // Add a readme explaining the limitation
    zip.file('README.txt', `PDF to Image Conversion Note
================================

Due to serverless environment limitations, full PDF to image conversion 
requires additional server-side tools (like Poppler or ImageMagick).

Your PDF has been split into ${pageCount} individual page PDFs.

For true image conversion, you can:
1. Open each PDF in a PDF viewer and export as image
2. Use a desktop tool like Adobe Acrobat or Preview (Mac)
3. Use an online service with full conversion capabilities

Thank you for using FileForge!
`);

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="pdf-pages.zip"',
      },
    });
  } catch (error) {
    console.error('PDF to images error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF. Please try again.' },
      { status: 500 }
    );
  }
}

