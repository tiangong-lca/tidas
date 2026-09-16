import type { MetadataRoute } from 'next';
import { availableLocales, source } from '@/lib/source';
import {
  defaultLanguage,
  homePath,
  languageAlternates,
  locales,
  siteOrigin,
  withTrailingSlash,
} from '@/lib/metadata';

export const dynamic = 'force-static';

/**
 * Only real pages are listed. The default language's home is `/`; `/zh/` is a permanent redirect to
 * it, so it is never an entry and never an alternate. Alternates are resolved from the locale
 * versions that actually exist, so no alternate names a page that was never built.
 *
 * `lastModified` is omitted deliberately. The build's only date is the deployment commit time, which
 * would claim that every page changed at deploy time; the governed policy accepts omitting lastmod
 * when the available date is not a content date.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const alternatesFor = (path = '', available?: string[]) => ({
    languages: Object.fromEntries(
      Object.entries(languageAlternates(path, available)).map(([language, href]) => [
        language,
        new URL(href, `${siteOrigin}/`).href,
      ]),
    ),
  });

  const entries: MetadataRoute.Sitemap = [
    { url: `${siteOrigin}/`, changeFrequency: 'weekly', priority: 1, alternates: alternatesFor() },
  ];

  for (const lang of locales) {
    if (lang !== defaultLanguage) {
      entries.push({
        url: `${siteOrigin}${homePath(lang)}`,
        changeFrequency: 'weekly',
        priority: 1,
        alternates: alternatesFor(),
      });
    }

    for (const page of source.getPages(lang)) {
      entries.push({
        url: `${siteOrigin}${withTrailingSlash(page.url)}`,
        priority: 0.8,
        alternates: alternatesFor(['docs', ...page.slugs].join('/'), availableLocales(page.slugs)),
      });
    }
  }

  return entries;
}
