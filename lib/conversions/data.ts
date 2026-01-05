import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import yaml from 'js-yaml';
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

export async function convertXmlToJson(xmlBuffer: Buffer): Promise<Buffer> {
  const xmlText = xmlBuffer.toString('utf-8');
  
  // Simple XML to JSON converter (for complex XML, consider using xml2js library)
  // This handles simple, well-formed XML
  try {
    // Remove XML declaration and comments
    let cleaned = xmlText.replace(/<\?xml[^>]*\?>/gi, '');
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');
    
    // Simple parser for basic XML structures
    const result: any = {};
    
    // Extract root element name
    const rootMatch = cleaned.match(/<([^/>\s]+)[^>]*>/);
    if (!rootMatch) {
      throw new Error('Invalid XML format');
    }
    
    // For simple cases, convert to JSON structure
    // This is a basic implementation - for production, use xml2js
    const json = parseSimpleXml(cleaned);
    
    return Buffer.from(JSON.stringify(json, null, 2), 'utf-8');
  } catch (error: any) {
    throw new Error(`XML to JSON conversion failed: ${error.message}`);
  }
}

function parseSimpleXml(xml: string): any {
  // Remove leading/trailing whitespace
  xml = xml.trim();
  
  // Handle text-only content
  if (!xml.includes('<')) {
    return xml;
  }
  
  // Extract tag name
  const tagMatch = xml.match(/^<([^/>\s]+)[^>]*>/);
  if (!tagMatch) return xml;
  
  const tagName = tagMatch[1];
  const isSelfClosing = xml.endsWith('/>') || xml.match(/^<[^>]+\/>/);
  
  if (isSelfClosing) {
    return { [tagName]: null };
  }
  
  // Extract content between tags
  const contentMatch = xml.match(new RegExp(`^<[^>]+>(.*)</${tagName}>$`, 's'));
  if (!contentMatch) {
    return { [tagName]: null };
  }
  
  const content = contentMatch[1].trim();
  
  // Check if content contains nested tags
  if (content.includes('<')) {
    // Has nested elements - parse recursively
    const children: any = {};
    let current = content;
    
    while (current.includes('<')) {
      const childMatch = current.match(/<([^/>\s]+)[^>]*>([\s\S]*?)<\/\1>/);
      if (childMatch) {
        const childName = childMatch[1];
        const childContent = childMatch[2];
        
        if (children[childName]) {
          // Multiple children with same name - convert to array
          if (!Array.isArray(children[childName])) {
            children[childName] = [children[childName]];
          }
          children[childName].push(parseSimpleXml(childContent));
        } else {
          children[childName] = parseSimpleXml(childContent);
        }
        
        current = current.replace(childMatch[0], '');
      } else {
        break;
      }
    }
    
    return { [tagName]: children };
  } else {
    // Text content
    return { [tagName]: content || null };
  }
}

export async function convertXmlToCsv(xmlBuffer: Buffer): Promise<Buffer> {
  // First convert to JSON, then to CSV
  const jsonBuffer = await convertXmlToJson(xmlBuffer);
  return await convertJsonToCsv(jsonBuffer);
}

export async function convertYamlToJson(yamlBuffer: Buffer): Promise<Buffer> {
  const yamlText = yamlBuffer.toString('utf-8');
  
  // Simple YAML to JSON converter (for production, use js-yaml library)
  // This handles basic YAML structures
  try {
    const json = parseSimpleYaml(yamlText);
    return Buffer.from(JSON.stringify(json, null, 2), 'utf-8');
  } catch (error: any) {
    throw new Error(`YAML to JSON conversion failed: ${error.message}. Consider using js-yaml library for full YAML support.`);
  }
}

function parseSimpleYaml(yaml: string): any {
  const lines = yaml.split('\n');
  const result: any = {};
  const stack: any[] = [result];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const indent = line.match(/^(\s*)/)?.[1].length || 0;
    const colonIndex = trimmed.indexOf(':');
    
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();
      
      // Adjust stack based on indentation
      while (stack.length > 1 && indent <= getIndentLevel(stack[stack.length - 2])) {
        stack.pop();
      }
      
      const current = stack[stack.length - 1];
      
      if (value) {
        // Simple value
        current[key] = parseYamlValue(value);
      } else {
        // Nested object
        const newObj: any = {};
        current[key] = newObj;
        stack.push(newObj);
      }
    } else if (trimmed.startsWith('-')) {
      // Array item
      const current = stack[stack.length - 1];
      const value = trimmed.substring(1).trim();
      if (!Array.isArray(current)) {
        // Convert to array
        const lastKey = Object.keys(current)[Object.keys(current).length - 1];
        current[lastKey] = [current[lastKey]];
      }
      // This is simplified - full YAML arrays need more handling
    }
  }
  
  return result;
}

function parseYamlValue(value: string): any {
  // Remove quotes if present
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  
  // Try to parse as number
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value);
  
  // Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '~') return null;
  
  return value;
}

function getIndentLevel(obj: any): number {
  // This is a simplified approach - in reality, we'd track indentation
  return 0;
}

export async function convertYamlToCsv(yamlBuffer: Buffer): Promise<Buffer> {
  // First convert to JSON, then to CSV
  const jsonBuffer = await convertYamlToJson(yamlBuffer);
  return await convertJsonToCsv(jsonBuffer);
}

export async function convertTsvToCsv(tsvBuffer: Buffer): Promise<Buffer> {
  const tsvText = tsvBuffer.toString('utf-8');
  // TSV is just CSV with tab separators instead of commas
  const csvText = tsvText.replace(/\t/g, ',');
  return Buffer.from(csvText, 'utf-8');
}

export async function convertCsvToTsv(csvBuffer: Buffer): Promise<Buffer> {
  const csvText = csvBuffer.toString('utf-8');
  // CSV to TSV - need to handle quoted fields properly
  const parsed = Papa.parse(csvText, {
    header: false,
    skipEmptyLines: true,
  });
  
  // Convert back to TSV
  const tsvLines = (parsed.data as any[][]).map(row => 
    row.map(cell => String(cell || '')).join('\t')
  );
  
  return Buffer.from(tsvLines.join('\n'), 'utf-8');
}

export async function convertJsonToXlsx(jsonBuffer: Buffer): Promise<Buffer> {
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
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      
      return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
    } else {
      throw new Error('JSON must be an array of objects for XLSX conversion');
    }
  }
  
  // Handle single object
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([data]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
  }
  
  throw new Error('JSON must be an object or array of objects for XLSX conversion');
}

export async function convertXlsxToJson(
  xlsxBuffer: Buffer,
  options?: AdvancedOptions
): Promise<Buffer> {
  const workbook = XLSX.read(xlsxBuffer, { type: 'buffer' });
  const sheetName = options?.sheetName || workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert sheet to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
  const json = JSON.stringify(jsonData, null, 2);
  
  return Buffer.from(json, 'utf-8');
}

export async function convertJsonToYaml(jsonBuffer: Buffer): Promise<Buffer> {
  const jsonText = jsonBuffer.toString('utf-8');
  let data: any;
  
  try {
    data = JSON.parse(jsonText);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
  
  try {
    const yamlText = yaml.dump(data, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });
    
    return Buffer.from(yamlText, 'utf-8');
  } catch (error: any) {
    throw new Error(`JSON to YAML conversion failed: ${error.message}`);
  }
}

