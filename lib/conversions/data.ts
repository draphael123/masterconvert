import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { AdvancedOptions } from '../../lib/types';

export async function convertCsvToXlsx(csvBuffer: Buffer): Promise<Buffer> {
  const csvText = csvBuffer.toString('utf-8');
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(parsed.data as any[]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
}

export async function convertXlsxToCsv(
  xlsxBuffer: Buffer,
  options?: AdvancedOptions
): Promise<Buffer> {
  const workbook = XLSX.read(xlsxBuffer, { type: 'buffer' });
  const sheetName = options?.sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  return Buffer.from(csv, 'utf-8');
}

export async function convertJsonToCsv(jsonBuffer: Buffer): Promise<Buffer> {
  const jsonText = jsonBuffer.toString('utf-8');
  let data: any;
  
  try {
    data = JSON.parse(jsonText);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
  
  // Handle array of objects
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error('JSON array is empty');
    }
    
    // Check if it's an array of objects (tabular)
    if (typeof data[0] === 'object' && data[0] !== null && !Array.isArray(data[0])) {
      const csv = Papa.unparse(data);
      return Buffer.from(csv, 'utf-8');
    } else {
      throw new Error('JSON must be an array of objects for CSV conversion');
    }
  }
  
  // Handle single object
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const csv = Papa.unparse([data]);
    return Buffer.from(csv, 'utf-8');
  }
  
  throw new Error('JSON must be an object or array of objects for CSV conversion');
}

export async function convertCsvToJson(csvBuffer: Buffer): Promise<Buffer> {
  const csvText = csvBuffer.toString('utf-8');
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });
  
  const json = JSON.stringify(parsed.data, null, 2);
  return Buffer.from(json, 'utf-8');
}

