# FileForge

A production-ready web application for converting files between common formats. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Document Conversion**: DOCX ↔ PDF, DOCX → TXT, TXT/MD → PDF, HTML → PDF
- **Image Conversion**: PNG ↔ JPG, PNG/JPG → WebP, WebP → PNG/JPG, Image resize & compression
- **Audio Conversion**: MP3 ↔ WAV, M4A/AAC → MP3, Audio trimming
- **Video Conversion**: MP4 → WEBM, Extract audio from video, Resolution downscale
- **Data Conversion**: CSV ↔ XLSX, JSON ↔ CSV, XLSX → CSV

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **File Processing**:
  - `sharp` - Image conversion
  - `ffmpeg-static` + `fluent-ffmpeg` - Audio/Video conversion
  - `playwright` - HTML to PDF
  - `mammoth` - DOCX processing
  - `papaparse` - CSV processing
  - `xlsx` - Excel processing
- **Job Queue**: In-memory queue (can be upgraded to BullMQ + Redis)

## Local Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- For audio/video conversions: FFmpeg must be installed on your system
- For DOCX→PDF: LibreOffice (optional, see limitations below)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fileforge
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file (copy from `.env.example`):
```bash
cp .env.example .env.local
```

4. Configure environment variables (see `.env.example` for details)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### FFmpeg Setup

For local development with audio/video conversions:

**Windows:**
1. Download FFmpeg from https://ffmpeg.org/download.html
2. Extract and add to PATH, or the `ffmpeg-static` package will handle it automatically

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
# or
sudo yum install ffmpeg
```

The app uses `ffmpeg-static` which includes a pre-built binary, but having system FFmpeg ensures better compatibility.

## Vercel Deployment

### Deployment Steps

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Vercel

Set these in your Vercel project settings:

```
MAX_FILE_SIZE_MB=200
RATE_LIMIT_REQUESTS_PER_MINUTE=10
ENABLE_FULL_CONVERSIONS=false
TEMP_FILE_TTL_MINUTES=15
```

### Vercel Limitations

⚠️ **Important**: Vercel serverless functions have limitations:

1. **FFmpeg/Audio/Video Conversions**: 
   - FFmpeg is not available in Vercel's serverless environment
   - Audio and video conversions will not work on Vercel
   - Consider using a dedicated conversion service or self-hosted solution

2. **DOCX to PDF**:
   - Requires LibreOffice which is not available in serverless
   - This conversion will show an error message on Vercel
   - Use a hosted conversion API or self-hosted solution

3. **File Size Limits**:
   - Vercel has a 4.5MB limit for serverless functions
   - For larger files, consider using Vercel's Edge Functions or external storage

4. **Execution Timeout**:
   - Vercel serverless functions have a 10-second timeout (Hobby) or 60-second (Pro)
   - Large file conversions may timeout

### Recommended Solutions for Vercel

1. **Use External Services**:
   - CloudConvert API for document conversions
   - AWS Lambda with FFmpeg layer for audio/video
   - Google Cloud Functions with FFmpeg

2. **Self-Hosted Alternative**:
   - Deploy to a VPS or dedicated server
   - Use Docker with FFmpeg and LibreOffice pre-installed
   - Use a container orchestration service (Kubernetes, Docker Swarm)

3. **Hybrid Approach**:
   - Keep image and data conversions on Vercel
   - Route audio/video/document conversions to external services

## Supported Conversions

### Documents
- ✅ DOCX → TXT (works everywhere)
- ✅ TXT → PDF (works everywhere)
- ✅ Markdown → PDF (works everywhere)
- ✅ HTML → PDF (works everywhere)
- ⚠️ DOCX → PDF (requires LibreOffice, not available on Vercel)
- ⚠️ PDF → DOCX (not available, requires specialized tools)

### Images
- ✅ PNG ↔ JPG
- ✅ PNG/JPG → WebP
- ✅ WebP → PNG/JPG
- ✅ Image resize & quality adjustment

### Audio
- ⚠️ MP3 ↔ WAV (requires FFmpeg, not available on Vercel)
- ⚠️ M4A/AAC → MP3 (requires FFmpeg, not available on Vercel)
- ⚠️ Audio trimming (requires FFmpeg, not available on Vercel)

### Video
- ⚠️ MP4 → WEBM (requires FFmpeg, not available on Vercel)
- ⚠️ Extract audio from video (requires FFmpeg, not available on Vercel)
- ⚠️ Resolution downscale (requires FFmpeg, not available on Vercel)

### Data
- ✅ CSV ↔ XLSX
- ✅ JSON ↔ CSV (simple tabular data)
- ✅ XLSX → CSV (with sheet selection)

## Architecture

### File Flow

1. **Upload**: Files are uploaded via `/api/upload` and stored temporarily
2. **Conversion**: Conversion jobs are created via `/api/convert`
3. **Processing**: Jobs are processed asynchronously with status updates
4. **Download**: Converted files are available via `/api/download` or `/api/download-zip`
5. **Cleanup**: Temporary files are deleted after 15 minutes or immediately after download

### Job Queue

The app uses an in-memory job queue for tracking conversion status. For production with high traffic, consider upgrading to:

- **BullMQ** with Redis (Upstash Redis for serverless)
- **AWS SQS** or **Google Cloud Tasks**
- **RabbitMQ** for self-hosted solutions

### Security

- File type validation (MIME sniffing + extension checking)
- Dangerous file type blocking (executables, scripts, etc.)
- Rate limiting per IP address
- Temporary file storage with automatic cleanup
- No permanent file storage

## Development

### Project Structure

```
fileforge/
├── app/
│   ├── api/           # API routes
│   ├── convert/       # Conversion page
│   ├── privacy/       # Privacy page
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Landing page
│   └── globals.css    # Global styles
├── components/         # React components
├── lib/
│   ├── conversions/   # Conversion logic
│   ├── types.ts       # TypeScript types
│   ├── validation.ts  # File validation
│   ├── presets.ts     # Conversion presets
│   ├── capabilities.ts # Environment capability checks
│   └── job-queue.ts   # Job queue implementation
└── public/            # Static assets
```

### Adding New Conversions

1. Add conversion type to `lib/types.ts`
2. Add preset to `lib/presets.ts`
3. Implement conversion logic in `lib/conversions/`
4. Add case to `lib/conversions/index.ts`
5. Update capability checks if needed

## Troubleshooting

### FFmpeg Not Found

If you see "FFmpeg not found" errors:

1. Ensure `ffmpeg-static` is installed: `npm install ffmpeg-static`
2. For local dev, install system FFmpeg
3. Check that the binary path is correct in `lib/conversions/audio.ts` and `lib/conversions/video.ts`

### Playwright Browser Not Found

If HTML→PDF conversion fails:

1. Install Playwright browsers: `npx playwright install chromium`
2. Ensure the browser is available in the deployment environment

### Large File Timeouts

For files larger than 50MB:

1. Increase timeout in `next.config.js`
2. Consider chunked uploads
3. Use external processing services

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and questions:
- Open a GitHub issue
- Check the troubleshooting section above
- Review Vercel deployment limitations

