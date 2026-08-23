import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { i18n } from '@/lib/i18n';
import { languageAlternates } from '@/lib/metadata';

export const dynamic = 'force-static';

/**
 * 只列真实存在的语言页面（fallbackLanguage 为 null，缺译页面不生成路由）。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.CANONICAL_ORIGIN ?? 'https://tidas.tiangong.earth';
  const lastModified = new Date(Number(process.env.SOURCE_DATE_EPOCH ?? 0) * 1000);

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${origin}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: languageAlternates() },
    },
  ];

  for (const lang of i18n.languages) {
    entries.push({
      url: `${origin}/${lang}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: languageAlternates() },
    });

    for (const page of source.getPages(lang)) {
      const url = page.url.endsWith('/') ? page.url : `${page.url}/`;
      entries.push({
        url: `${origin}${url}`,
        lastModified,
        priority: 0.8,
        alternates: { languages: languageAlternates(['docs', ...page.slugs].join('/')) },
      });
    }
  }

  return entries;
}
