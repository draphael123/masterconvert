import { chromium } from 'playwright';
import mammoth from 'mammoth';
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

