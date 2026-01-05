import { chromium } from 'playwright';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import TurndownService from 'turndown';
import { readFile, writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function convertDocxToTxt(docxBuffer: Buffer): Promise<Buffer> {
  const result = await mammoth.extractRawText({ buffer: docxBuffer });
  return Buffer.from(result.value, 'utf-8');
}

export async function convertHtmlToPdf(htmlBuffer: Buffer): Promise<Buffer> {
  const htmlPath = join(
    tmpdir(),
    `html-${Date.now()}-${Math.random().toString(36).substring(7)}.html`
  );
  const pdfPath = join(
    tmpdir(),
    `pdf-${Date.now()}-${Math.random().toString(36).substring(7)}.pdf`
  );

  try {
    await writeFile(htmlPath, htmlBuffer);
    
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    await page.pdf({ path: pdfPath, format: 'A4' });
    
    await browser.close();
    
    const pdfBuffer = await readFile(pdfPath);
    await unlink(htmlPath);
    await unlink(pdfPath);
    
    return pdfBuffer;
  } catch (error) {
    await unlink(htmlPath).catch(() => {});
    await unlink(pdfPath).catch(() => {});
    throw error;
  }
}

export async function convertTxtToPdf(txtBuffer: Buffer): Promise<Buffer> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            line-height: 1.6;
          }
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
          }
        </style>
      </head>
      <body>
        <pre>${Buffer.from(txtBuffer).toString('utf-8').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      </body>
    </html>
  `;
  
  return convertHtmlToPdf(Buffer.from(html, 'utf-8'));
}

export async function convertMdToPdf(mdBuffer: Buffer): Promise<Buffer> {
  // Simple markdown to HTML conversion (for production, use a proper markdown parser)
  const mdText = mdBuffer.toString('utf-8');
  let html = mdText
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n/g, '<br>');
  
  html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;
  
  return convertHtmlToPdf(Buffer.from(html, 'utf-8'));
}

// DOCX to PDF requires LibreOffice or a cloud service
// This is a placeholder that indicates the limitation
export async function convertDocxToPdf(docxBuffer: Buffer): Promise<Buffer> {
  throw new Error(
    'DOCX to PDF conversion requires LibreOffice which is not available in serverless environments. ' +
    'Please use a hosted conversion service or self-hosted solution.'
  );
}

export async function convertPdfToDocx(pdfBuffer: Buffer): Promise<Buffer> {
  throw new Error(
    'PDF to DOCX conversion requires specialized tools which are not available in serverless environments. ' +
    'Please use a hosted conversion service or self-hosted solution.'
  );
}

export async function convertMdToHtml(mdBuffer: Buffer): Promise<Buffer> {
  const mdText = mdBuffer.toString('utf-8');
  
  // Enhanced markdown to HTML conversion
  let html = mdText
    // Headers
    .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
    .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  // Wrap in paragraphs
  html = html.split('</p><p>').map(para => {
    if (!para.startsWith('<h') && !para.startsWith('<pre') && !para.startsWith('<ul') && !para.startsWith('<ol')) {
      return `<p>${para}</p>`;
    }
    return para;
  }).join('');
  
  // Lists
  const lines = html.split('<br>');
  let inList = false;
  let listType = '';
  const processedLines: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.match(/^[-*+]\s/)) {
      if (!inList || listType !== 'ul') {
        if (inList) processedLines.push(`</${listType}>`);
        processedLines.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      processedLines.push(`<li>${trimmed.replace(/^[-*+]\s+/, '')}</li>`);
    } else if (trimmed.match(/^\d+\.\s/)) {
      if (!inList || listType !== 'ol') {
        if (inList) processedLines.push(`</${listType}>`);
        processedLines.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      processedLines.push(`<li>${trimmed.replace(/^\d+\.\s+/, '')}</li>`);
    } else {
      if (inList) {
        processedLines.push(`</${listType}>`);
        inList = false;
      }
      processedLines.push(line);
    }
  }
  if (inList) processedLines.push(`</${listType}>`);
  
  html = processedLines.join('\n');
  
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Converted Markdown</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
          }
          h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
          h2 { border-bottom: 1px solid #eee; padding-bottom: 8px; }
          code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
          }
          pre {
            background: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
          }
          pre code { background: none; padding: 0; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;
  
  return Buffer.from(fullHtml, 'utf-8');
}

export async function convertPdfToTxt(pdfBuffer: Buffer): Promise<Buffer> {
  try {
    const data = await pdfParse(pdfBuffer);
    const text = data.text || '';
    return Buffer.from(text, 'utf-8');
  } catch (error: any) {
    throw new Error(`PDF to TXT conversion failed: ${error.message}`);
  }
}

export async function convertTxtToDocx(txtBuffer: Buffer): Promise<Buffer> {
  try {
    const text = txtBuffer.toString('utf-8');
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    const paragraphs = lines.map(line => 
      new Paragraph({
        children: [new TextRun(line.trim())],
      })
    );
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs.length > 0 ? paragraphs : [
          new Paragraph({
            children: [new TextRun('')],
          })
        ],
      }],
    });
    
    const buffer = await Packer.toBuffer(doc);
    return Buffer.from(buffer);
  } catch (error: any) {
    throw new Error(`TXT to DOCX conversion failed: ${error.message}`);
  }
}

export async function convertHtmlToMd(htmlBuffer: Buffer): Promise<Buffer> {
  try {
    const html = htmlBuffer.toString('utf-8');
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });
    
    const markdown = turndownService.turndown(html);
    return Buffer.from(markdown, 'utf-8');
  } catch (error: any) {
    throw new Error(`HTML to Markdown conversion failed: ${error.message}`);
  }
}

