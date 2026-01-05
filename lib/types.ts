export type ConversionType =
  | 'docx-to-pdf'
  | 'pdf-to-docx'
  | 'docx-to-txt'
  | 'txt-to-pdf'
  | 'txt-to-docx'
  | 'md-to-pdf'
  | 'html-to-pdf'
  | 'md-to-html'
  | 'html-to-md'
  | 'pdf-to-txt'
  | 'png-to-jpg'
  | 'jpg-to-png'
  | 'png-to-webp'
  | 'jpg-to-webp'
  | 'webp-to-png'
  | 'webp-to-jpg'
  | 'gif-to-png'
  | 'gif-to-jpg'
  | 'gif-to-webp'
  | 'png-to-gif'
  | 'jpg-to-gif'
  | 'mp3-to-wav'
  | 'wav-to-mp3'
  | 'm4a-to-mp3'
  | 'aac-to-mp3'
  | 'mp4-to-webm'
  | 'mp4-to-mp3'
  | 'csv-to-xlsx'
  | 'xlsx-to-csv'
  | 'xlsx-to-json'
  | 'json-to-csv'
  | 'json-to-xlsx'
  | 'csv-to-json'
  | 'json-to-yaml'
  | 'md-to-csv'
  | 'xml-to-json'
  | 'xml-to-csv'
  | 'yaml-to-json'
  | 'yaml-to-csv'
  | 'tsv-to-csv'
  | 'csv-to-tsv'
  | 'image-resize';

export interface ConversionPreset {
  id: ConversionType;
  label: string;
  from: string[];
  to: string;
  category: 'document' | 'image' | 'audio' | 'video' | 'data';
  requiresAdvanced?: boolean;
}

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  preset?: ConversionType;
  advancedOptions?: AdvancedOptions;
}

export interface AdvancedOptions {
  // Image options
  width?: number;
  height?: number;
  quality?: number;
  // Audio options
  trimStart?: number;
  trimEnd?: number;
  // Video options
  resolution?: string;
  // Data options
  sheetName?: string;
}

export interface JobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  resultFiles?: string[];
  error?: string;
}

export interface ConversionHistoryItem {
  id: string;
  fileName: string;
  fromType: string;
  toType: string;
  timestamp: number;
  status: 'success' | 'failed';
}

