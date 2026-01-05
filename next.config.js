/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
  // Note: The 'api' key is for Pages Router only, not App Router
  // For App Router, body size limits are handled via serverActions config above
};

module.exports = nextConfig;

