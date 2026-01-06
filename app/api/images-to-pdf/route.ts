import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { getRateLimiter, getClientIdentifier } from '@/lib/rate-limit';

const RATE_LIMIT_PER_MINUTE = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '10');

// Page dimensions in points (72 points = 1 inch)
const PAGE_SIZES = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

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
    const images = formData.getAll('images') as File[];
    const pageSize = formData.get('pageSize') as string || 'a4';

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    const pdfDoc = await PDFDocument.create();

    for (const imageFile of images) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Convert to PNG/JPG for PDF embedding using sharp
      let processedBuffer: Buffer;
      let imageType: 'png' | 'jpg';

      try {
        // Get image metadata
        const metadata = await sharp(buffer).metadata();
        
        // Convert to PNG for best compatibility
        processedBuffer = await sharp(buffer).png().toBuffer();
        imageType = 'png';

        // Embed image in PDF
        const image = await pdfDoc.embedPng(processedBuffer);
        
        let pageWidth: number;
        let pageHeight: number;
        let x = 0;
        let y = 0;
        let imgWidth = image.width;
        let imgHeight = image.height;

        if (pageSize === 'fit') {
          // Page fits to image size
          pageWidth = image.width;
          pageHeight = image.height;
        } else {
          // Fixed page size, scale image to fit
          const dims = PAGE_SIZES[pageSize as keyof typeof PAGE_SIZES] || PAGE_SIZES.a4;
          pageWidth = dims.width;
          pageHeight = dims.height;

          // Scale image to fit page with padding
          const padding = 40;
          const maxWidth = pageWidth - padding * 2;
          const maxHeight = pageHeight - padding * 2;

          const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
          imgWidth = image.width * scale;
          imgHeight = image.height * scale;

          // Center image on page
          x = (pageWidth - imgWidth) / 2;
          y = (pageHeight - imgHeight) / 2;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(image, {
          x,
          y,
          width: imgWidth,
          height: imgHeight,
        });
      } catch (err) {
        console.error('Error processing image:', err);
        // Try JPEG if PNG fails
        try {
          processedBuffer = await sharp(buffer).jpeg().toBuffer();
          const image = await pdfDoc.embedJpg(processedBuffer);
          
          const dims = PAGE_SIZES[pageSize as keyof typeof PAGE_SIZES] || PAGE_SIZES.a4;
          const page = pdfDoc.addPage([dims.width, dims.height]);
          
          const scale = Math.min(
            (dims.width - 80) / image.width,
            (dims.height - 80) / image.height
          );
          const imgWidth = image.width * scale;
          const imgHeight = image.height * scale;
          
          page.drawImage(image, {
            x: (dims.width - imgWidth) / 2,
            y: (dims.height - imgHeight) / 2,
            width: imgWidth,
            height: imgHeight,
          });
        } catch (err2) {
          console.error('Failed to process image as JPEG:', err2);
          continue;
        }
      }
    }

    if (pdfDoc.getPageCount() === 0) {
      return NextResponse.json(
        { error: 'No valid images could be processed' },
        { status: 400 }
      );
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="images.pdf"',
      },
    });
  } catch (error) {
    console.error('Images to PDF error:', error);
    return NextResponse.json(
      { error: 'Failed to create PDF. Please try again.' },
      { status: 500 }
    );
  }
}

