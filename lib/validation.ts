import { fileTypeFromBuffer } from 'file-type';

const DANGEROUS_EXTENSIONS = [
  '.exe', '.dll', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js',
  '.jar', '.app', '.deb', '.rpm', '.msi', '.sh', '.ps1', '.dmg'
];

const DANGEROUS_MIMES = [
  'application/x-msdownload',
  'application/x-executable',
  'application/x-msdos-program',
  'application/x-sh',
  'application/x-shellscript',
];

export async function validateFile(
  file: File,
  maxSizeMB: number = 200
): Promise<{ valid: boolean; error?: string }> {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  // Check extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (DANGEROUS_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'File type is not allowed for security reasons',
    };
  }

  // Check MIME type
  if (file.type) {
    if (DANGEROUS_MIMES.some(mime => file.type.includes(mime))) {
      return {
        valid: false,
        error: 'File type is not allowed for security reasons',
      };
    }
  }

  // Additional MIME sniffing
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileType = await fileTypeFromBuffer(buffer);
    
    if (fileType) {
      if (DANGEROUS_MIMES.some(mime => fileType.mime.includes(mime))) {
        return {
          valid: false,
          error: 'File type is not allowed for security reasons',
        };
      }
    }
  } catch (error) {
    // If MIME detection fails, we'll still allow the file but log it
    console.warn('MIME detection failed:', error);
  }

  return { valid: true };
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function getMimeType(extension: string): string {
  const mimeMap: Record<string, string> = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    md: 'text/markdown',
    html: 'text/html',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    mp4: 'video/mp4',
    webm: 'video/webm',
    csv: 'text/csv',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    json: 'application/json',
  };
  return mimeMap[extension] || 'application/octet-stream';
}

