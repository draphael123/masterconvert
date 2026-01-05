# Quick Start Guide

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your settings (optional for local dev).

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## First Conversion

1. Go to the **Convert** page
2. Drag and drop a file (or click to select)
3. Choose a conversion format from the dropdown
4. Click **Start Conversion**
5. Wait for the conversion to complete
6. Click **Download** to get your converted file

## Supported File Types

### Images
- PNG, JPG, WebP (convert between formats)
- Image resize with quality control

### Documents
- DOCX → TXT (works everywhere)
- TXT/MD → PDF (works everywhere)
- HTML → PDF (works everywhere)
- DOCX → PDF (requires LibreOffice, not available on Vercel)

### Audio/Video
- MP3, WAV, M4A, AAC conversions
- MP4 → WEBM
- Extract audio from video
- **Note:** Audio/video conversions require FFmpeg and won't work on Vercel serverless

### Data
- CSV ↔ XLSX
- JSON ↔ CSV
- XLSX → CSV (with sheet selection)

## Troubleshooting

### "FFmpeg not found" error
- Install FFmpeg on your system
- Or ensure `ffmpeg-static` package is installed (it includes a pre-built binary)

### "Conversion not available" error
- Some conversions require system dependencies (FFmpeg, LibreOffice)
- Check the README for Vercel limitations
- Consider using a self-hosted solution for full functionality

### Large files timing out
- Increase timeout in `next.config.js`
- Consider using external processing services for very large files

## Next Steps

- Read the full [README.md](README.md) for detailed information
- Check deployment instructions for Vercel
- Review the code structure in `/lib/conversions/` to add custom conversions

