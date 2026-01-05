import { ConversionType, AdvancedOptions } from '../types';
import * as imageConv from './image';
import * as audioConv from './audio';
import * as videoConv from './video';
import * as docConv from './document';
import * as dataConv from './data';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function convertFile(
  inputBuffer: Buffer,
  conversionType: ConversionType,
  options?: AdvancedOptions,
  inputExtension?: string
): Promise<Buffer> {
  // Determine if we need a temp file with extension (for ffmpeg)
  const needsTempFile = conversionType.includes('mp3') || 
                        conversionType.includes('wav') || 
                        conversionType.includes('m4a') || 
                        conversionType.includes('aac') ||
                        conversionType.includes('mp4') ||
                        conversionType.includes('webm');
  
  const ext = inputExtension || (needsTempFile ? getInputExtension(conversionType) : '');
  const tempInputPath = join(
    tmpdir(),
    `input-${Date.now()}-${Math.random().toString(36).substring(7)}${ext ? '.' + ext : ''}`
  );

  try {
    // Write input to temp file (needed for ffmpeg operations and some other conversions)
    if (needsTempFile || conversionType.includes('html') || conversionType.includes('txt') || conversionType.includes('md')) {
      await writeFile(tempInputPath, inputBuffer);
    }

    switch (conversionType) {
      // Images
      case 'png-to-jpg':
        return await imageConv.convertImage(inputBuffer, 'jpg', options);
      case 'jpg-to-png':
        return await imageConv.convertImage(inputBuffer, 'png', options);
      case 'png-to-webp':
        return await imageConv.convertImage(inputBuffer, 'webp', options);
      case 'jpg-to-webp':
        return await imageConv.convertImage(inputBuffer, 'webp', options);
      case 'webp-to-png':
        return await imageConv.convertImage(inputBuffer, 'png', options);
      case 'webp-to-jpg':
        return await imageConv.convertImage(inputBuffer, 'jpg', options);
      case 'gif-to-png':
        return await imageConv.convertImage(inputBuffer, 'png', options);
      case 'gif-to-jpg':
        return await imageConv.convertImage(inputBuffer, 'jpg', options);
      case 'gif-to-webp':
        return await imageConv.convertImage(inputBuffer, 'webp', options);
      case 'png-to-gif':
        return await imageConv.convertImage(inputBuffer, 'gif', options);
      case 'jpg-to-gif':
        return await imageConv.convertImage(inputBuffer, 'gif', options);
      case 'image-resize':
        if (!options?.width || !options?.height) {
          throw new Error('Width and height are required for image resize');
        }
        return await imageConv.resizeImage(
          inputBuffer,
          options.width,
          options.height,
          options.quality
        );

      // Audio
      case 'mp3-to-wav':
        return await audioConv.convertAudio(tempInputPath, 'wav', options);
      case 'wav-to-mp3':
        return await audioConv.convertAudio(tempInputPath, 'mp3', options);
      case 'm4a-to-mp3':
        return await audioConv.convertAudio(tempInputPath, 'mp3', options);
      case 'aac-to-mp3':
        return await audioConv.convertAudio(tempInputPath, 'mp3', options);

      // Video
      case 'mp4-to-webm':
        return await videoConv.convertVideo(tempInputPath, 'webm', options);
      case 'mp4-to-mp3':
        return await audioConv.extractAudioFromVideo(tempInputPath, 'mp3');

      // Documents
      case 'docx-to-pdf':
        return await docConv.convertDocxToPdf(inputBuffer);
      case 'pdf-to-docx':
        return await docConv.convertPdfToDocx(inputBuffer);
      case 'docx-to-txt':
        return await docConv.convertDocxToTxt(inputBuffer);
      case 'txt-to-pdf':
        return await docConv.convertTxtToPdf(inputBuffer);
      case 'md-to-pdf':
        return await docConv.convertMdToPdf(inputBuffer);
      case 'html-to-pdf':
        return await docConv.convertHtmlToPdf(inputBuffer);
      case 'md-to-html':
        return await docConv.convertMdToHtml(inputBuffer);
      case 'html-to-md':
        return await docConv.convertHtmlToMd(inputBuffer);
      case 'pdf-to-txt':
        return await docConv.convertPdfToTxt(inputBuffer);
      case 'txt-to-docx':
        return await docConv.convertTxtToDocx(inputBuffer);

      // Data
      case 'csv-to-xlsx':
        return await dataConv.convertCsvToXlsx(inputBuffer);
      case 'xlsx-to-csv':
        return await dataConv.convertXlsxToCsv(inputBuffer, options);
      case 'json-to-csv':
        return await dataConv.convertJsonToCsv(inputBuffer);
      case 'csv-to-json':
        return await dataConv.convertCsvToJson(inputBuffer);
      case 'md-to-csv':
        return await dataConv.convertMdToCsv(inputBuffer);
      case 'xml-to-json':
        return await dataConv.convertXmlToJson(inputBuffer);
      case 'xml-to-csv':
        return await dataConv.convertXmlToCsv(inputBuffer);
      case 'yaml-to-json':
        return await dataConv.convertYamlToJson(inputBuffer);
      case 'yaml-to-csv':
        return await dataConv.convertYamlToCsv(inputBuffer);
      case 'tsv-to-csv':
        return await dataConv.convertTsvToCsv(inputBuffer);
      case 'csv-to-tsv':
        return await dataConv.convertCsvToTsv(inputBuffer);
      case 'json-to-xlsx':
        return await dataConv.convertJsonToXlsx(inputBuffer);
      case 'xlsx-to-json':
        return await dataConv.convertXlsxToJson(inputBuffer, options);
      case 'json-to-yaml':
        return await dataConv.convertJsonToYaml(inputBuffer);

      default:
        throw new Error(`Unsupported conversion type: ${conversionType}`);
    }
  } finally {
    // Clean up temp file if it was created
    if (needsTempFile || conversionType.includes('html') || conversionType.includes('txt') || conversionType.includes('md')) {
      await unlink(tempInputPath).catch(() => {});
    }
  }
}

function getInputExtension(conversionType: ConversionType): string {
  if (conversionType.includes('mp3')) return 'mp3';
  if (conversionType.includes('wav')) return 'wav';
  if (conversionType.includes('m4a')) return 'm4a';
  if (conversionType.includes('aac')) return 'aac';
  if (conversionType.includes('mp4')) return 'mp4';
  if (conversionType.includes('webm')) return 'webm';
  return '';
}

