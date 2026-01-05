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

export async function convertMdToCsv(mdBuffer: Buffer): Promise<Buffer> {
  const mdText = mdBuffer.toString('utf-8');
  const lines = mdText.split('\n');
  
  // First, try to extract markdown tables
  const tableRegex = /^\|(.+)\|$/;
  const tableRows: string[][] = [];
  let inTable = false;
  let headers: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this is a table row
    if (tableRegex.test(line)) {
      // Extract cells, removing leading/trailing pipes and whitespace
      const cells = line
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0);
      
      // Check if this is a separator row (e.g., |---|---|)
      const isSeparator = cells.every(cell => /^:?-+:?$/.test(cell));
      
      if (isSeparator) {
        // Skip separator row
        continue;
      }
      
      if (!inTable) {
        // First row is headers
        headers = cells;
        inTable = true;
      } else {
        // Data row
        if (cells.length === headers.length) {
          tableRows.push(cells);
        }
      }
    } else {
      // If we were in a table and now we're not, finalize the table
      if (inTable && tableRows.length > 0) {
        break; // Use the first table found
      }
      inTable = false;
    }
  }
  
  // If we found a table, convert it to CSV
  if (headers.length > 0 && tableRows.length > 0) {
    const csvData = [headers, ...tableRows];
    const csv = Papa.unparse(csvData);
    return Buffer.from(csv, 'utf-8');
  }
  
  // If no table found, convert markdown structure to CSV
  // Extract headers (lines starting with #)
  const csvRows: string[][] = [];
  let currentRow: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Headers (H1, H2, etc.)
    if (trimmed.startsWith('#')) {
      const level = trimmed.match(/^#+/)?.[0].length || 0;
      const text = trimmed.replace(/^#+\s*/, '').trim();
      if (text) {
        csvRows.push([`H${level}`, text]);
      }
    }
    // Lists
    else if (trimmed.match(/^[-*+]\s/)) {
      const text = trimmed.replace(/^[-*+]\s+/, '').trim();
      if (text) {
        csvRows.push(['List Item', text]);
      }
    }
    // Numbered lists
    else if (trimmed.match(/^\d+\.\s/)) {
      const text = trimmed.replace(/^\d+\.\s+/, '').trim();
      if (text) {
        csvRows.push(['Numbered Item', text]);
      }
    }
    // Regular text (non-empty lines)
    else if (trimmed.length > 0 && !trimmed.match(/^[-=*_]+$/)) {
      // Skip horizontal rules and separators
      csvRows.push(['Text', trimmed]);
    }
  }
  
  // If we have structured data, use it
  if (csvRows.length > 0) {
    const csv = Papa.unparse([['Type', 'Content'], ...csvRows]);
    return Buffer.from(csv, 'utf-8');
  }
  
  // Fallback: convert each non-empty line to a CSV row
  const nonEmptyLines = lines
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.match(/^[-=*_]+$/));
  
  if (nonEmptyLines.length > 0) {
    const csv = Papa.unparse([['Content'], ...nonEmptyLines.map(line => [line])]);
    return Buffer.from(csv, 'utf-8');
  }
  
  throw new Error('Markdown file is empty or contains no convertible content');
}

