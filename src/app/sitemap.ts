import type { MetadataRoute } from 'next';

const siteUrl = 'https://backsignal.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.APP_ENV !== 'production') return [];

  return [
    { url: `${siteUrl}/` },
    { url: `${siteUrl}/en` },
  ];
}
