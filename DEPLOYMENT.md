# Deployment Guide

## GitHub Deployment ✅

Your code has been successfully pushed to: https://github.com/draphael123/masterconvert.git

## Vercel Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Click "Add New Project"**
4. **Import your repository**: `draphael123/masterconvert`
5. **Configure Project Settings**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

6. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   MAX_FILE_SIZE_MB=200
   RATE_LIMIT_REQUESTS_PER_MINUTE=10
   ENABLE_FULL_CONVERSIONS=false
   TEMP_FILE_TTL_MINUTES=15
   ```

7. **Click "Deploy"**

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? **No** (first time)
   - Project name: `masterconvert` (or your choice)
   - Directory: `./` (default)
   - Override settings? **No**

4. **Set Environment Variables**:
   ```bash
   vercel env add MAX_FILE_SIZE_MB
   # Enter: 200
   
   vercel env add RATE_LIMIT_REQUESTS_PER_MINUTE
   # Enter: 10
   
   vercel env add ENABLE_FULL_CONVERSIONS
   # Enter: false
   
   vercel env add TEMP_FILE_TTL_MINUTES
   # Enter: 15
   ```

5. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

## Important Vercel Limitations

⚠️ **Please read these limitations before deploying:**

### 1. Audio/Video Conversions
- **Will NOT work** on Vercel serverless functions
- FFmpeg is not available in Vercel's environment
- These conversions will show error messages

### 2. DOCX to PDF
- **Will NOT work** on Vercel
- Requires LibreOffice which is not available
- Error message will be shown to users

### 3. File Size Limits
- Vercel has a **4.5MB limit** for serverless functions
- Your app is configured for 200MB, but Vercel will reject larger files
- Consider using Vercel Blob Storage or external storage for larger files

### 4. Execution Timeout
- **Hobby plan**: 10-second timeout
- **Pro plan**: 60-second timeout
- Large conversions may timeout

### What WILL Work on Vercel:
✅ Image conversions (PNG, JPG, WebP)
✅ Data conversions (CSV, XLSX, JSON)
✅ TXT/MD/HTML to PDF
✅ DOCX to TXT

## Post-Deployment

After deployment, your app will be available at:
- **Production**: `https://masterconvert.vercel.app` (or your custom domain)
- **Preview**: Each push creates a preview deployment

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Monitoring

- Check deployment logs in Vercel dashboard
- Monitor function execution times
- Set up error tracking (Sentry, etc.) if needed

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses 18.x by default)

### Functions Timeout
- Reduce file size limits
- Optimize conversion logic
- Consider using Edge Functions for lighter operations

### Environment Variables Not Working
- Ensure variables are set for **Production**, **Preview**, and **Development**
- Redeploy after adding new variables

## Next Steps

1. **Test the deployment**: Visit your Vercel URL
2. **Test conversions**: Try image and data conversions (these work on Vercel)
3. **Monitor performance**: Check Vercel analytics
4. **Set up error tracking**: Consider adding error monitoring
5. **Optimize**: Review and optimize based on usage patterns

## Support

For issues:
- Check Vercel documentation: https://vercel.com/docs
- Review Next.js deployment guide: https://nextjs.org/docs/deployment
- Check project README.md for more details

