import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  baiduVerificationMetadata,
  breadcrumbJsonLd,
  breadcrumbTrail,
  classifyPageDescription,
  homePath,
  languageAlternates,
  locales,
  maximumPageDescriptionLength,
  pageDescription,
  siteDescription,
  siteOrigin,
} from '../lib/seo-policy.mjs';

const prose = (text) => ({ content: text });
const page = (contents) => ({ structuredData: { contents } });

test('the default language home is the site root, never a locale alias', () => {
  assert.equal(homePath('zh'), '/');
  assert.equal(homePath('en'), '/en/');
  assert.equal(homePath('de'), '/de/');
  assert.equal(homePath('fr'), '/fr/');
});

test('no alternate or canonical target is the /zh alias', () => {
  // `/zh` and `/zh/` are permanent redirects to `/`. Documentation keeps its `/zh/docs/**` URLs,
  // so only the alias itself is forbidden as a target -- not every `/zh/...` path.
  const alias = new Set(['/zh', '/zh/']);
  for (const available of [locales, ['zh'], ['zh', 'en'], ['en', 'fr']]) {
    for (const path of ['', 'docs/intro', 'docs/core-modules/schema/tidas-schema-intro']) {
      const alternates = languageAlternates(path, available);
      assert.ok(Object.keys(alternates).length > 0, `${path} produced no alternate`);
      for (const href of Object.values(alternates)) {
        assert.ok(!alias.has(href), `${href} points at the /zh alias`);
      }
    }
  }
});

test('home alternates name the real locale homes and the x-default is the root', () => {
  assert.deepEqual(languageAlternates('', locales), {
    'x-default': '/',
    'zh-CN': '/',
    en: '/en/',
    de: '/de/',
    fr: '/fr/',
  });
});

test('documentation alternates stay locale-prefixed including the default language', () => {
  assert.deepEqual(languageAlternates('docs/intro', locales), {
    'x-default': '/zh/docs/intro/',
    'zh-CN': '/zh/docs/intro/',
    en: '/en/docs/intro/',
    de: '/de/docs/intro/',
    fr: '/fr/docs/intro/',
  });
});

test('an alternate is only emitted for a locale that really publishes the page', () => {
  assert.deepEqual(languageAlternates('docs/intro', ['en', 'fr']), {
    en: '/en/docs/intro/',
    fr: '/fr/docs/intro/',
  });
});

test('x-default is omitted when the same-content default-language counterpart is missing', () => {
  const withoutZh = languageAlternates('docs/intro', ['en', 'de']);
  assert.equal(withoutZh['x-default'], undefined);
  assert.deepEqual(Object.keys(withoutZh), ['en', 'de']);
});

test('authored frontmatter is the summary and is never rewritten', () => {
  const authored = '  An authored summary that is long enough to publish.  ';
  assert.deepEqual(pageDescription({ description: authored }), {
    status: 'authored',
    description: authored.trim(),
  });
});

test('a summary is derived from the page own prose, not from navigation or code', () => {
  const derived = pageDescription(page([
    prose('- Home'),
    prose('```bash\ntidas validate ./package\n```'),
    prose('TIDAS Schema describes dataset objects, classification vocabularies, and shared types for JSON workflows.'),
  ]));
  assert.equal(derived.status, 'derived');
  assert.match(derived.description, /^TIDAS Schema describes dataset objects/u);
});

test('link and image markup is cleaned before prose is accepted', () => {
  const derived = pageDescription(page([
    prose('See [the validation guide](https://example.test/x) and ![chart](./chart.png) for the full walkthrough of Schema diagnostics.'),
  ]));
  assert.equal(derived.status, 'derived');
  assert.ok(!derived.description.includes(']('));
  assert.ok(derived.description.includes('the validation guide'));
});

test('a page without usable prose stays unresolved and publishes no page description', () => {
  const unresolved = pageDescription(page([
    prose('- Convert'),
    prose('- Validate'),
    prose('| a | b |'),
  ]));
  assert.deepEqual(unresolved, { status: 'unresolved', description: undefined });
  assert.notEqual(unresolved.description, siteDescription('zh'));
});

test('an empty page is unresolved rather than inheriting the site description', () => {
  assert.deepEqual(pageDescription({}), { status: 'unresolved', description: undefined });
  assert.deepEqual(pageDescription(page([])), { status: 'unresolved', description: undefined });
});

test('derived summaries are cut on Unicode code points and marked as truncated', () => {
  const derived = pageDescription(page([prose('数据🛰️'.repeat(maximumPageDescriptionLength))]));
  assert.equal(derived.status, 'derived');
  const characters = Array.from(derived.description);
  assert.ok(characters.length <= maximumPageDescriptionLength + 1);
  assert.ok(!characters.some((character) => character === '�'));
  assert.ok(derived.description.endsWith('…'));
});

test('classification from artifacts separates authored, derived and unresolved', () => {
  const site = siteDescription('zh');
  assert.equal(classifyPageDescription({ authored: 'x', output: site, lang: 'zh' }), 'authored');
  assert.equal(classifyPageDescription({ authored: '', output: 'A real page summary.', lang: 'zh' }), 'derived');
  assert.equal(classifyPageDescription({ authored: '', output: site, lang: 'zh' }), 'unresolved');
  assert.equal(classifyPageDescription({ authored: '', output: undefined, lang: 'zh' }), 'unresolved');
});

test('breadcrumbs follow resolved pages and skip folders that have no page', () => {
  const pages = {
    '': { title: 'TIDAS 文档', url: '/zh/docs' },
    'core-modules': { title: '数据结构', url: '/zh/docs/core-modules' },
    'core-modules/schema/schema-content/json-schema-flows': { title: '流', url: '/zh/docs/core-modules/schema/schema-content/json-schema-flows' },
  };
  const resolve = (slugs) => pages[slugs.join('/')];
  const trail = breadcrumbTrail('zh', ['core-modules', 'schema', 'schema-content', 'json-schema-flows'], resolve);
  assert.deepEqual(trail, [
    { name: 'TIDAS — TianGong Data System', url: '/' },
    { name: 'TIDAS 文档', url: '/zh/docs/' },
    { name: '数据结构', url: '/zh/docs/core-modules/' },
    { name: '流', url: '/zh/docs/core-modules/schema/schema-content/json-schema-flows/' },
  ]);
  assert.ok(!trail.some((crumb) => crumb.url.includes('/schema/') && crumb.name !== '流'));
});

test('breadcrumbs use the locale home and real titles for non-default locales', () => {
  const resolve = (slugs, lang) => (lang === 'en'
    ? { '': { title: 'Documentation', url: '/en/docs' }, intro: { title: 'Introduction', url: '/en/docs/intro' } }[slugs.join('/')]
    : undefined);
  assert.deepEqual(breadcrumbTrail('en', ['intro'], resolve), [
    { name: 'TIDAS — TianGong Data System', url: '/en/' },
    { name: 'Documentation', url: '/en/docs/' },
    { name: 'Introduction', url: '/en/docs/intro/' },
  ]);
});

test('no breadcrumb is produced for a home or the documentation index itself', () => {
  const resolve = () => ({ title: 'Documentation', url: '/zh/docs' });
  assert.deepEqual(breadcrumbTrail('zh', [], resolve), []);
  assert.deepEqual(breadcrumbJsonLd([]), null);
});

test('a trail whose current page does not resolve is not emitted', () => {
  assert.deepEqual(breadcrumbTrail('zh', ['gone'], () => undefined), []);
});

test('breadcrumb JSON-LD is absolute, ordered and typed', () => {
  const jsonLd = breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'Intro', url: '/zh/docs/intro/' }]);
  assert.equal(jsonLd['@type'], 'BreadcrumbList');
  assert.deepEqual(jsonLd.itemListElement.map((item) => item.position), [1, 2]);
  assert.equal(jsonLd.itemListElement[0].item, `${siteOrigin}/`);
  assert.equal(jsonLd.itemListElement[1].item, `${siteOrigin}/zh/docs/intro/`);
  assert.ok(jsonLd.itemListElement.every((item) => item['@type'] === 'ListItem'));
});

const withVerification = (value, run) => {
  const previous = process.env.BAIDU_SITE_VERIFICATION;
  if (value === undefined) delete process.env.BAIDU_SITE_VERIFICATION;
  else process.env.BAIDU_SITE_VERIFICATION = value;
  try {
    return run();
  } finally {
    if (previous === undefined) delete process.env.BAIDU_SITE_VERIFICATION;
    else process.env.BAIDU_SITE_VERIFICATION = previous;
  }
};

test('the ownership marker is absent unless the build supplies one', () => {
  assert.deepEqual(withVerification(undefined, baiduVerificationMetadata), {});
  assert.deepEqual(withVerification('', baiduVerificationMetadata), {});
  assert.deepEqual(withVerification('   ', baiduVerificationMetadata), {});
});

test('a supplied marker is carried into the document head verbatim and trimmed', () => {
  assert.deepEqual(withVerification('codeva-ExampleValue', baiduVerificationMetadata), {
    other: { 'baidu-site-verification': 'codeva-ExampleValue' },
  });
  assert.deepEqual(withVerification('  codeva-ExampleValue  ', baiduVerificationMetadata), {
    other: { 'baidu-site-verification': 'codeva-ExampleValue' },
  });
});

test('the helper never logs the marker value', () => {
  const calls = [];
  const original = { log: console.log, error: console.error, warn: console.warn, info: console.info };
  console.log = (...args) => calls.push(args);
  console.error = (...args) => calls.push(args);
  console.warn = (...args) => calls.push(args);
  console.info = (...args) => calls.push(args);
  try {
    withVerification('codeva-SecretLookingValue', baiduVerificationMetadata);
    withVerification(undefined, baiduVerificationMetadata);
  } finally {
    Object.assign(console, original);
  }
  assert.deepEqual(calls, []);
});

test('no verification token is hardcoded in the policy module or the app layouts', () => {
  // The marker belongs to the deployed site and must come from the build environment. A literal
  // here would publish one site's token from every checkout.
  for (const relative of ['../lib/seo-policy.mjs', '../app/(entry)/layout.tsx', '../app/(locale)/[lang]/layout.tsx']) {
    const source = readFileSync(new URL(relative, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /codeva-/u, `${relative} hardcodes a verification token`);
  }
});
