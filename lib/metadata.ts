import { i18n } from '@/lib/i18n';

export const siteOrigin = process.env.CANONICAL_ORIGIN ?? 'https://tidas.tiangong.earth';

export const localeMetadata: Record<string, { title: string; description: string; openGraphLocale: string }> = {
  zh: {
    title: 'TIDAS Data Specification',
    description: 'TIDAS 天工 LCA 数据规范：可验证、可转换、可共享的生命周期数据契约。',
    openGraphLocale: 'zh_CN',
  },
  en: {
    title: 'TIDAS Data Specification',
    description: 'The TIDAS specification for verifiable, convertible, and shareable life cycle assessment data.',
    openGraphLocale: 'en_US',
  },
  de: {
    title: 'TIDAS Data Specification',
    description: 'Die TIDAS-Spezifikation für prüfbare, konvertierbare und gemeinsam nutzbare Ökobilanzdaten.',
    openGraphLocale: 'de_DE',
  },
  fr: {
    title: 'TIDAS Data Specification',
    description: 'La spécification TIDAS pour des données d’ACV vérifiables, convertibles et partageables.',
    openGraphLocale: 'fr_FR',
  },
};

export function languageAlternates(path = ''): Record<string, string> {
  const suffix = path.length === 0 ? '' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  return {
    'x-default': path.length === 0 ? '/' : `/zh${suffix}/`,
    ...Object.fromEntries(i18n.languages.map((lang) => [lang === 'zh' ? 'zh-CN' : lang, `/${lang}${suffix}/`])),
  };
}

export function pageImagePath(lang: string, slugs: string[]): string {
  return `/${['og', lang, 'docs', ...slugs, 'image.png'].filter(Boolean).join('/')}`;
}
