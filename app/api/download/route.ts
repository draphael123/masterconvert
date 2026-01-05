import { NextRequest, NextResponse } from 'next/server';
import { readFile, unlink, stat } from 'fs/promises';
import { getJobQueue } from '@/lib/job-queue';
import { getMimeType } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');
    const fileIndex = parseInt(searchParams.get('fileIndex') || '0');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Missing jobId parameter' },
        { status: 400 }
      );
    }

    const jobQueue = getJobQueue();
    const job = jobQueue.getJob(jobId);

    if (!job || job.status !== 'completed' || !job.resultFiles) {
      return NextResponse.json(
        { error: 'Job not found or not completed' },
        { status: 404 }
      );
    }

    const filePath = job.resultFiles[fileIndex];
    if (!filePath) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Check if file exists
    try {
      await stat(filePath);
    } catch {
      return NextResponse.json(
        { error: 'File no longer available' },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(filePath);
    const extension = filePath.split('.').pop() || 'bin';
    const mimeType = getMimeType(extension);

    // Clean up file after sending
    setTimeout(() => {
      unlink(filePath).catch(() => {});
    }, 1000);

    // Convert Node.js Buffer to Uint8Array for NextResponse
    // NextResponse accepts: string | ArrayBuffer | Uint8Array | Blob | ReadableStream
    const uint8Array = new Uint8Array(fileBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="converted.${extension}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}

