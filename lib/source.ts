import { loader } from 'fumadocs-core/source';
import { defineDocs } from 'fumadocs-mdx/macro';
import { i18n } from '@/lib/i18n';

const docs = defineDocs({
  dir: 'content/docs',
});

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  i18n,
});

/**
 * Locales that actually publish this logical page. hreflang alternates and the sitemap are emitted
 * only for these, so an alternate never names a page that was not built.
 */
export function availableLocales(slugs: string[] = []): string[] {
  return i18n.languages.filter((lang) => source.getPage(slugs, lang) !== undefined);
}
