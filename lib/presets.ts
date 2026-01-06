import { ConversionPreset, ConversionType } from './types';

export const CONVERSION_PRESETS: ConversionPreset[] = [
  // Documents
  // Note: docx-to-pdf and pdf-to-docx are not available in serverless environments
  // They require LibreOffice or specialized tools that aren't available on Vercel
  // These conversions have been removed from the presets list
  {
    id: 'docx-to-txt',
    label: 'DOCX to TXT',
    from: ['docx'],
    to: 'txt',
    category: 'document',
  },
  {
    id: 'txt-to-pdf',
    label: 'TXT to PDF',
    from: ['txt'],
    to: 'pdf',
    category: 'document',
  },
  {
    id: 'md-to-pdf',
    label: 'Markdown to PDF',
    from: ['md', 'markdown'],
    to: 'pdf',
    category: 'document',
  },
  {
    id: 'html-to-pdf',
    label: 'HTML to PDF',
    from: ['html', 'htm'],
    to: 'pdf',
    category: 'document',
  },
  {
    id: 'md-to-html',
    label: 'Markdown to HTML',
    from: ['md', 'markdown'],
    to: 'html',
    category: 'document',
  },
  {
    id: 'html-to-md',
    label: 'HTML to Markdown',
    from: ['html', 'htm'],
    to: 'md',
    category: 'document',
  },
  {
    id: 'pdf-to-txt',
    label: 'PDF to TXT',
    from: ['pdf'],
    to: 'txt',
    category: 'document',
  },
  {
    id: 'txt-to-docx',
    label: 'TXT to DOCX',
    from: ['txt'],
    to: 'docx',
    category: 'document',
  },
  // Images
  {
    id: 'png-to-jpg',
    label: 'PNG to JPG',
    from: ['png'],
    to: 'jpg',
    category: 'image',
  },
  {
    id: 'jpg-to-png',
    label: 'JPG to PNG',
    from: ['jpg', 'jpeg'],
    to: 'png',
    category: 'image',
  },
  {
    id: 'png-to-webp',
    label: 'PNG to WebP',
    from: ['png'],
    to: 'webp',
    category: 'image',
  },
  {
    id: 'jpg-to-webp',
    label: 'JPG to WebP',
    from: ['jpg', 'jpeg'],
    to: 'webp',
    category: 'image',
  },
  {
    id: 'webp-to-png',
    label: 'WebP to PNG',
    from: ['webp'],
    to: 'png',
    category: 'image',
  },
  {
    id: 'webp-to-jpg',
    label: 'WebP to JPG',
    from: ['webp'],
    to: 'jpg',
    category: 'image',
  },
  {
    id: 'gif-to-png',
    label: 'GIF to PNG',
    from: ['gif'],
    to: 'png',
    category: 'image',
  },
  {
    id: 'gif-to-jpg',
    label: 'GIF to JPG',
    from: ['gif'],
    to: 'jpg',
    category: 'image',
  },
  {
    id: 'gif-to-webp',
    label: 'GIF to WebP',
    from: ['gif'],
    to: 'webp',
    category: 'image',
  },
  {
    id: 'png-to-gif',
    label: 'PNG to GIF',
    from: ['png'],
    to: 'gif',
    category: 'image',
  },
  {
    id: 'jpg-to-gif',
    label: 'JPG to GIF',
    from: ['jpg', 'jpeg'],
    to: 'gif',
    category: 'image',
  },
  {
    id: 'heic-to-jpg',
    label: 'HEIC to JPG',
    from: ['heic', 'heif'],
    to: 'jpg',
    category: 'image',
  },
  {
    id: 'heic-to-png',
    label: 'HEIC to PNG',
    from: ['heic', 'heif'],
    to: 'png',
    category: 'image',
  },
  {
    id: 'svg-to-png',
    label: 'SVG to PNG',
    from: ['svg'],
    to: 'png',
    category: 'image',
  },
  {
    id: 'svg-to-jpg',
    label: 'SVG to JPG',
    from: ['svg'],
    to: 'jpg',
    category: 'image',
  },
  {
    id: 'png-to-ico',
    label: 'PNG to ICO (Favicon)',
    from: ['png'],
    to: 'ico',
    category: 'image',
  },
  {
    id: 'jpg-to-ico',
    label: 'JPG to ICO (Favicon)',
    from: ['jpg', 'jpeg'],
    to: 'ico',
    category: 'image',
  },
  {
    id: 'image-resize',
    label: 'Resize Image',
    from: ['png', 'jpg', 'jpeg', 'webp', 'gif'],
    to: 'same',
    category: 'image',
    requiresAdvanced: true,
  },
  // Audio
  {
    id: 'mp3-to-wav',
    label: 'MP3 to WAV',
    from: ['mp3'],
    to: 'wav',
    category: 'audio',
  },
  {
    id: 'wav-to-mp3',
    label: 'WAV to MP3',
    from: ['wav'],
    to: 'mp3',
    category: 'audio',
  },
  {
    id: 'm4a-to-mp3',
    label: 'M4A to MP3',
    from: ['m4a'],
    to: 'mp3',
    category: 'audio',
  },
  {
    id: 'aac-to-mp3',
    label: 'AAC to MP3',
    from: ['aac'],
    to: 'mp3',
    category: 'audio',
  },
  // Video
  {
    id: 'mp4-to-webm',
    label: 'MP4 to WEBM',
    from: ['mp4'],
    to: 'webm',
    category: 'video',
  },
  {
    id: 'mp4-to-mp3',
    label: 'Extract Audio (MP4 to MP3)',
    from: ['mp4'],
    to: 'mp3',
    category: 'video',
  },
  // Data
  {
    id: 'csv-to-xlsx',
    label: 'CSV to XLSX',
    from: ['csv'],
    to: 'xlsx',
    category: 'data',
  },
  {
    id: 'xlsx-to-csv',
    label: 'XLSX to CSV',
    from: ['xlsx', 'xls'],
    to: 'csv',
    category: 'data',
  },
  {
    id: 'json-to-csv',
    label: 'JSON to CSV',
    from: ['json'],
    to: 'csv',
    category: 'data',
  },
  {
    id: 'csv-to-json',
    label: 'CSV to JSON',
    from: ['csv'],
    to: 'json',
    category: 'data',
  },
  {
    id: 'md-to-csv',
    label: 'Markdown to CSV',
    from: ['md', 'markdown'],
    to: 'csv',
    category: 'data',
  },
  {
    id: 'xml-to-json',
    label: 'XML to JSON',
    from: ['xml'],
    to: 'json',
    category: 'data',
  },
  {
    id: 'xml-to-csv',
    label: 'XML to CSV',
    from: ['xml'],
    to: 'csv',
    category: 'data',
  },
  {
    id: 'yaml-to-json',
    label: 'YAML to JSON',
    from: ['yaml', 'yml'],
    to: 'json',
    category: 'data',
  },
  {
    id: 'yaml-to-csv',
    label: 'YAML to CSV',
    from: ['yaml', 'yml'],
    to: 'csv',
    category: 'data',
  },
  {
    id: 'tsv-to-csv',
    label: 'TSV to CSV',
    from: ['tsv'],
    to: 'csv',
    category: 'data',
  },
  {
    id: 'csv-to-tsv',
    label: 'CSV to TSV',
    from: ['csv'],
    to: 'tsv',
    category: 'data',
  },
  {
    id: 'json-to-yaml',
    label: 'JSON to YAML',
    from: ['json'],
    to: 'yaml',
    category: 'data',
  },
];

export function getPresetForFile(filename: string, extension: string): ConversionPreset[] {
  const ext = extension.toLowerCase();
  return CONVERSION_PRESETS.filter(preset => preset.from.includes(ext));
}

export function getPresetById(id: ConversionType): ConversionPreset | undefined {
  return CONVERSION_PRESETS.find(p => p.id === id);
}

