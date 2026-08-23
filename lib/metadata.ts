import { i18n } from '@/lib/i18n';

export const siteOrigin = process.env.CANONICAL_ORIGIN ?? 'https://tidas.tiangong.earth';

export const localeMetadata: Record<string, { title: string; description: string; openGraphLocale: string }> = {
  zh: {
    title: 'TIDAS — TianGong Data System',
    description: '面向 LCA 与碳足迹管理的开源生命周期数据系统，提供方法论、JSON 数据结构、数据资源与校验转换工具。',
    openGraphLocale: 'zh_CN',
  },
  en: {
    title: 'TIDAS — TianGong Data System',
    description: 'An open life cycle data system combining methodology, JSON data structures, data resources, and validation and conversion tools.',
    openGraphLocale: 'en_US',
  },
  de: {
    title: 'TIDAS — TianGong Data System',
    description: 'Ein offenes System für Lebenszyklusdaten mit Methodik, JSON-Datenstrukturen, Datenressourcen sowie Prüf- und Konvertierungswerkzeugen.',
    openGraphLocale: 'de_DE',
  },
  fr: {
    title: 'TIDAS — TianGong Data System',
    description: 'Un système ouvert de données de cycle de vie réunissant méthodologie, structures JSON, ressources et outils de validation et de conversion.',
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
