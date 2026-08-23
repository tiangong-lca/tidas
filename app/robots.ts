import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

/**
 * v4 §5.4：非生产环境整体 disallow；生产暴露绝对 sitemap URL。
 */
export default function robots(): MetadataRoute.Robots {
  const deployEnv = process.env.DEPLOY_ENV ?? 'ci';

  if (deployEnv !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://tidas.tiangong.earth/sitemap.xml',
  };
}
