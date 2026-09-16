/**
 * Node-safe SEO policy shared by the app and by plain `node --test` regression checks.
 *
 * `lib/metadata.ts` re-exports these for application code; this module deliberately avoids the
 * `@/` alias and framework-only APIs so `scripts/*.test.mjs` can import it directly.
 */
import { i18n } from './i18n.ts';

export const siteOrigin = process.env.CANONICAL_ORIGIN ?? 'https://tidas.tiangong.earth';

/** @type {readonly string[]} */
export const locales = i18n.languages;
/** @type {string} */
export const defaultLanguage = i18n.defaultLanguage;

/**
 * Locale identifiers as they appear in `html lang` and in hreflang values.
 * @param {string} lang
 * @returns {string}
 */
export function toHrefLang(lang) {
  return lang === 'zh' ? 'zh-CN' : lang;
}

/** @type {Record<string, { title: string; description: string; openGraphLocale: string }>} */
export const localeMetadata = {
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

/**
 * @param {string} lang
 * @returns {string}
 */
export function siteDescription(lang) {
  return (localeMetadata[lang] ?? localeMetadata.en).description;
}

/**
 * The Chinese home is the canonical site entry at `/`, so `/{lang}/` is never the default
 * language's home. `/zh` and `/zh/` are permanent provider redirects (see edgeone.json) and are
 * therefore never a canonical or hreflang target. Documentation stays at `/{lang}/docs/**` for
 * every locale, including `zh`.
 *
 * @param {string} lang
 * @returns {string}
 */
export function homePath(lang) {
  return lang === defaultLanguage ? '/' : `/${lang}/`;
}

/**
 * @param {string} path
 * @returns {string}
 */
export function withTrailingSlash(path) {
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * hreflang map for one logical page.
 *
 * `available` names the locales that actually publish this page, resolved by the caller with
 * `source.getPage`; an alternate is only emitted for a real counterpart. The default-language
 * counterpart is the x-default, and it is omitted entirely when that counterpart does not exist,
 * so no alternate ever points at the `/zh` alias or at a page that was never built.
 *
 * @param {string} [path]
 * @param {readonly string[]} [available]
 * @returns {Record<string, string>}
 */
export function languageAlternates(path = '', available = locales) {
  const suffix = path.length === 0 ? '' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  const published = locales.filter((lang) => available.includes(lang));
  const localized = (lang) => (suffix === '' ? homePath(lang) : `/${lang}${suffix}/`);

  return Object.fromEntries([
    ...(published.includes(defaultLanguage) ? [['x-default', localized(defaultLanguage)]] : []),
    ...published.map((lang) => [toHrefLang(lang), localized(lang)]),
  ]);
}

/** Published description length cap, counted in Unicode characters. */
export const maximumPageDescriptionLength = 300;

/** Boilerplate shapes: JSX/code/table syntax, markdown list or heading markers, link targets. */
const nonProsePattern = /[`{}<>|]|\]\(|^\s*(?:#{1,6}\s|[-*+]\s|\d+\.\s)/u;

function cleanProse(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/gu, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/\s+/gu, ' ')
    .trim();
}

function isProse(value) {
  if (nonProsePattern.test(value)) return false;
  return (value.match(/[\p{L}\p{N}]/gu)?.length ?? 0) >= 20;
}

/**
 * Cut derived text at the published cap: prefer a sentence end, else a word break. Counting and
 * slicing happen on Unicode code points, so astral characters are neither miscounted nor split;
 * truncation is marked with an ellipsis and the prose itself is never rewritten.
 */
function truncateProse(value) {
  const characters = Array.from(value);
  if (characters.length <= maximumPageDescriptionLength) return value;
  const window = characters.slice(0, maximumPageDescriptionLength).join('');
  const sentenceEnd = window.search(/[。！？.!?](?:\s|$)/u);
  if (sentenceEnd >= 0) return window.slice(0, sentenceEnd + 1);
  const wordBreak = window.lastIndexOf(' ');
  const kept = wordBreak > maximumPageDescriptionLength / 2 ? window.slice(0, wordBreak) : window;
  return `${kept.trimEnd()}…`;
}

/**
 * Page summary status for one documentation page.
 *
 * `authored` is the frontmatter `description`, which is also the author override. Without one the
 * summary comes from the page's own structured content: the first block that reads as prose after
 * link cleanup, with code, JSX, tables, list runs and navigation labels rejected rather than
 * trimmed into a sentence. When no block qualifies the page is explicitly `unresolved` and gets no
 * page-specific description; the layout's site description is then inherited by Next, which is a
 * site-level default, not a page summary, and the URL is reported as editorial debt by
 * `verify:out` instead of being counted as covered.
 *
 * @param {{ description?: string, structuredData?: { contents?: Array<{ content?: string }> } }} page
 * @returns {{ status: 'authored' | 'derived' | 'unresolved', description: string | undefined }}
 */
export function pageDescription(page) {
  const authored = page.description?.trim();
  if (authored) return { status: 'authored', description: authored };

  for (const entry of page.structuredData?.contents ?? []) {
    const cleaned = cleanProse(entry.content ?? '');
    if (!isProse(cleaned)) continue;
    return { status: 'derived', description: truncateProse(cleaned) };
  }

  return { status: 'unresolved', description: undefined };
}

/**
 * Classify one built page for verification, from artifacts rather than from the derivation itself:
 * authored frontmatter, an output description that differs from the inherited site default, or an
 * unresolved page whose output still equals that default.
 *
 * @param {{ authored?: string, output?: string, lang: string }} page
 * @returns {'authored' | 'derived' | 'unresolved'}
 */
export function classifyPageDescription({ authored, output, lang }) {
  if (typeof authored === 'string' && authored.trim().length > 0) return 'authored';
  const site = siteDescription(lang);
  if (typeof output === 'string' && output.trim().length > 0 && output.trim() !== site.trim()) {
    return 'derived';
  }
  return 'unresolved';
}

/**
 * Truthful breadcrumb trail for one documentation page.
 *
 * Every crumb except the first and the last comes from `resolve(slugs, lang)`, which the caller
 * wires to `source.getPage`: an ancestor that is only a folder and has no page of its own is
 * skipped rather than linked to a URL that would 404, and each crumb carries that page's real
 * title. Nothing is derived from a URL segment, so no trail is invented. Home pages and the
 * documentation index return an empty trail, where a breadcrumb would only repeat the navigation
 * it sits in.
 *
 * @param {string} lang
 * @param {string[]} slugs
 * @param {(slugs: string[], lang: string) => { title: string, url: string } | undefined} resolve
 * @returns {Array<{ name: string, url: string }>}
 */
export function breadcrumbTrail(lang, slugs, resolve) {
  if (!Array.isArray(slugs) || slugs.length === 0) return [];
  const trail = [{
    name: (localeMetadata[lang] ?? localeMetadata.en).title,
    url: homePath(lang),
  }];

  for (let depth = 0; depth < slugs.length; depth += 1) {
    const ancestor = resolve(slugs.slice(0, depth), lang);
    if (ancestor) trail.push({ name: ancestor.title, url: withTrailingSlash(ancestor.url) });
  }

  const current = resolve(slugs, lang);
  if (!current) return [];
  trail.push({ name: current.title, url: withTrailingSlash(current.url) });
  return trail;
}

/**
 * schema.org BreadcrumbList for a resolved trail; presentation metadata only.
 *
 * @param {Array<{ name: string, url: string }>} trail
 * @returns {Record<string, unknown> | null}
 */
export function breadcrumbJsonLd(trail) {
  if (trail.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: new URL(crumb.url, `${siteOrigin}/`).href,
    })),
  };
}

/**
 * Optional search-console ownership marker for the Baidu property.
 *
 * The token belongs to the deployed site, not to the repository: it is supplied by the build
 * environment as `BAIDU_SITE_VERIFICATION` and is never hardcoded here, so a checkout without the
 * variable publishes no marker rather than someone else's. The owning site is responsible for the
 * value matching the verified property; this helper only carries it into the document head.
 *
 * The value is intentionally never logged: both this helper and `verify:out` report presence or a
 * mismatch without echoing the token.
 *
 * @returns {Record<string, unknown>} spreadable Next.js metadata fragment
 */
export function baiduVerificationMetadata() {
  const token = (process.env.BAIDU_SITE_VERIFICATION ?? '').trim();
  return token ? { other: { 'baidu-site-verification': token } } : {};
}
