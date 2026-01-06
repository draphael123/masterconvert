import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://masterconvert.vercel.app';
  
  const mainRoutes = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/convert', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/merge', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/split', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/compress', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/watermark', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/protect', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  const toolRoutes = [
    '/tools/pdf-to-txt',
    '/tools/merge-pdf',
    '/tools/split-pdf',
    '/tools/compress-image',
    '/tools/json-to-csv',
    '/tools/json-formatter',
    '/tools/base64',
    '/tools/hash',
    '/tools/diff',
    '/tools/regex',
    '/tools/word-counter',
    '/tools/case-converter',
    '/tools/lorem-ipsum',
    '/images-to-pdf',
    '/pdf-to-images',
    '/qr-code',
    '/rotate-pdf',
    '/resize',
  ];

  const mainSitemap = mainRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const toolSitemap = toolRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...mainSitemap, ...toolSitemap];
}

