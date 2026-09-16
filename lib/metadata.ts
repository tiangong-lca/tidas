export {
  breadcrumbJsonLd,
  breadcrumbTrail,
  classifyPageDescription,
  defaultLanguage,
  homePath,
  languageAlternates,
  localeMetadata,
  locales,
  maximumPageDescriptionLength,
  pageDescription,
  siteDescription,
  siteOrigin,
  toHrefLang,
  withTrailingSlash,
} from '@/lib/seo-policy.mjs';

export function pageImagePath(lang: string, slugs: string[]): string {
  return `/${['og', lang, 'docs', ...slugs, 'image.png'].filter(Boolean).join('/')}`;
}
