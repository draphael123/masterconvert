import { NextRequest, NextResponse } from 'next/server';
import { readFile, unlink } from 'fs/promises';
import { convertFile } from '@/lib/conversions';
import { getJobQueue } from '@/lib/job-queue';
import { ConversionType, AdvancedOptions } from '@/lib/types';
import { checkConversionCapability, getCapabilityMessage } from '@/lib/capabilities';
import { getRateLimiter, getClientIdentifier } from '@/lib/rate-limit';

const ENABLE_FULL_CONVERSIONS = process.env.ENABLE_FULL_CONVERSIONS === 'true';
const RATE_LIMIT_PER_MINUTE = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '10');

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimiter = getRateLimiter();
    const clientId = getClientIdentifier(request);
    const limitCheck = rateLimiter.checkLimit(
      clientId,
      RATE_LIMIT_PER_MINUTE,
      60000
    );

    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { fileId, fileName, conversionType, advancedOptions } = body;

    if (!fileId || !conversionType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check conversion capability
    const capability = checkConversionCapability(conversionType, ENABLE_FULL_CONVERSIONS);
    if (!capability.available) {
      return NextResponse.json(
        {
          error: 'Conversion not available',
          message: getCapabilityMessage(capability),
        },
        { status: 503 }
      );
    }

    // Create job
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const jobQueue = getJobQueue();
    jobQueue.createJob(jobId);

    // Start conversion asynchronously
    processConversion(
      jobId,
      fileId,
      conversionType as ConversionType,
      advancedOptions as AdvancedOptions | undefined
    ).catch((error) => {
      console.error('Conversion error:', error);
      jobQueue.updateJob(jobId, {
        status: 'failed',
        error: error.message || 'Conversion failed',
      });
    });

    return NextResponse.json({
      success: true,
      jobId,
    });
  } catch (error) {
    console.error('Convert error:', error);
    return NextResponse.json(
      { error: 'Failed to start conversion' },
      { status: 500 }
    );
  }
}

async function processConversion(
  jobId: string,
  fileId: string,
  conversionType: ConversionType,
  advancedOptions?: AdvancedOptions
) {
  const jobQueue = getJobQueue();
  
  try {
    jobQueue.updateJob(jobId, {
      status: 'processing',
      progress: 10,
      message: 'Reading input file...',
    });

    // Read input file
    const inputBuffer = await readFile(fileId);

    jobQueue.updateJob(jobId, {
      progress: 30,
      message: 'Converting file...',
    });

    // Extract file extension from fileId
    const inputExtension = fileId.split('.').pop()?.toLowerCase();

    // Perform conversion
    const outputBuffer = await convertFile(inputBuffer, conversionType, advancedOptions, inputExtension);

    jobQueue.updateJob(jobId, {
      progress: 80,
      message: 'Preparing output...',
    });

    // Generate output filename
    const outputExtension = getOutputExtension(conversionType);
    const outputFileName = `${fileId.replace(/\.\w+$/, '')}.${outputExtension}`;
    
    // Save output file
    const { writeFile } = await import('fs/promises');
    await writeFile(outputFileName, outputBuffer);

    jobQueue.updateJob(jobId, {
      status: 'completed',
      progress: 100,
      message: 'Conversion complete',
      resultFiles: [outputFileName],
    });

    // Clean up input file after a delay
    setTimeout(() => {
      unlink(fileId).catch(() => {});
    }, 10000);
  } catch (error: any) {
    jobQueue.updateJob(jobId, {
      status: 'failed',
      error: error.message || 'Conversion failed',
    });
    
    // Clean up input file
    unlink(fileId).catch(() => {});
  }
}

function getOutputExtension(conversionType: ConversionType): string {
  const extensionMap: Record<ConversionType, string> = {
    'docx-to-pdf': 'pdf',
    'pdf-to-docx': 'docx',
    'docx-to-txt': 'txt',
    'txt-to-pdf': 'pdf',
    'md-to-pdf': 'pdf',
    'html-to-pdf': 'pdf',
    'md-to-html': 'html',
    'png-to-jpg': 'jpg',
    'jpg-to-png': 'png',
    'png-to-webp': 'webp',
    'jpg-to-webp': 'webp',
    'webp-to-png': 'png',
    'webp-to-jpg': 'jpg',
    'gif-to-png': 'png',
    'gif-to-jpg': 'jpg',
    'gif-to-webp': 'webp',
    'png-to-gif': 'gif',
    'jpg-to-gif': 'gif',
    'image-resize': 'jpg',
    'mp3-to-wav': 'wav',
    'wav-to-mp3': 'mp3',
    'm4a-to-mp3': 'mp3',
    'aac-to-mp3': 'mp3',
    'mp4-to-webm': 'webm',
    'mp4-to-mp3': 'mp3',
    'csv-to-xlsx': 'xlsx',
    'xlsx-to-csv': 'csv',
    'json-to-csv': 'csv',
    'csv-to-json': 'json',
    'md-to-csv': 'csv',
    'xml-to-json': 'json',
    'xml-to-csv': 'csv',
    'yaml-to-json': 'json',
    'yaml-to-csv': 'csv',
    'tsv-to-csv': 'csv',
    'csv-to-tsv': 'tsv',
  };
  return extensionMap[conversionType] || 'bin';
}

