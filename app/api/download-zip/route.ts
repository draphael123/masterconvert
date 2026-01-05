import { NextRequest, NextResponse } from 'next/server';
import { readFile, unlink } from 'fs/promises';
import { getJobQueue } from '@/lib/job-queue';
import JSZip from 'jszip';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');

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

    const zip = new JSZip();

    // Add all result files to zip
    for (let i = 0; i < job.resultFiles.length; i++) {
      const filePath = job.resultFiles[i];
      try {
        const fileBuffer = await readFile(filePath);
        const fileName = `converted-${i + 1}.${filePath.split('.').pop()}`;
        zip.file(fileName, fileBuffer);
      } catch (error) {
        console.error(`Failed to read file ${filePath}:`, error);
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Clean up files after creating zip
    for (const filePath of job.resultFiles) {
      setTimeout(() => {
        unlink(filePath).catch(() => {});
      }, 1000);
    }

    // Convert Node.js Buffer to Uint8Array for NextResponse
    // NextResponse accepts: string | ArrayBuffer | Uint8Array | Blob | ReadableStream
    const uint8Array = new Uint8Array(zipBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="converted-files.zip"',
        'Content-Length': zipBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Download ZIP error:', error);
    return NextResponse.json(
      { error: 'Failed to create ZIP file' },
      { status: 500 }
    );
  }
}

