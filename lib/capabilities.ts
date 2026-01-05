// Check what conversion capabilities are available in the current environment

export interface ConversionCapability {
  available: boolean;
  reason?: string;
  fallback?: string;
}

export function checkConversionCapability(
  conversionType: string,
  enableFullConversions: boolean = true
): ConversionCapability {
  // For Vercel serverless, some conversions may not be available
  const isVercel = process.env.VERCEL === '1';
  
  // If full conversions are disabled, check what's available
  if (!enableFullConversions || isVercel) {
    // On Vercel, ffmpeg and LibreOffice may not be available
    if (conversionType.includes('mp4') || conversionType.includes('webm') || 
        conversionType.includes('mp3') || conversionType.includes('wav') ||
        conversionType.includes('m4a') || conversionType.includes('aac')) {
      return {
        available: false,
        reason: 'Audio/Video conversion requires ffmpeg which may not be available in serverless environments',
        fallback: 'Consider using a dedicated conversion service or self-hosted solution',
      };
    }
    
    if (conversionType.includes('docx-to-pdf') || conversionType.includes('pdf-to-docx')) {
      return {
        available: false,
        reason: 'DOCX/PDF conversion requires LibreOffice which is not available in serverless environments',
        fallback: 'Use a hosted conversion API or self-hosted solution',
      };
    }
  }
  
  return { available: true };
}

export function getCapabilityMessage(capability: ConversionCapability): string {
  if (capability.available) {
    return '';
  }
  
  let message = `⚠️ ${capability.reason || 'Conversion not available'}`;
  if (capability.fallback) {
    message += `\n💡 ${capability.fallback}`;
  }
  return message;
}

