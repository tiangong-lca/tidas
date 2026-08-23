#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outRoot = path.join(root, 'out');
const docsRoot = path.join(root, 'content', 'docs');
const canonicalOrigin = process.env.CANONICAL_ORIGIN;
const productionOrigin = 'https://tidas.tiangong.earth';
const linkOrigin = (() => {
  try {
    return new URL(canonicalOrigin).origin;
  } catch {
    return 'https://tidas.invalid';
  }
})();
const internalOrigins = new Set([linkOrigin, productionOrigin]);
const errors = [];
const passed = [];

function walk(directory, predicate) {
  const result = [];
  if (!fs.existsSync(directory)) return result;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...walk(full, predicate));
    else if (predicate(full)) result.push(full);
  }
  return result;
}

function decodeHtml(value) {
  return value.replace(
    /&(?:#(\d+)|#x([\da-f]+)|(amp|apos|gt|lt|quot));/gi,
    (entity, decimal, hexadecimal, named) => {
      if (decimal) return String.fromCodePoint(Number.parseInt(decimal, 10));
      if (hexadecimal) return String.fromCodePoint(Number.parseInt(hexadecimal, 16));
      return { amp: '&', apos: "'", gt: '>', lt: '<', quot: '"' }[named.toLowerCase()];
    },
  );
}

function routeForHtml(htmlFile) {
  const relative = path.relative(outRoot, htmlFile).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  return `/${relative}`;
}

function decodeUrlComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function resolveOutputFile(pathname) {
  const decodedPath = decodeUrlComponent(pathname);
  if (decodedPath === null) return { error: 'invalid percent-encoding in URL path' };

  const relative = decodedPath.replace(/^\/+/, '');
  const candidates = decodedPath.endsWith('/')
    ? [path.join(relative, 'index.html')]
    : [relative, `${relative}.html`, path.join(relative, 'index.html')];

  for (const candidate of candidates) {
    const absolute = path.resolve(outRoot, candidate);
    const relativeToOut = path.relative(outRoot, absolute);
    if (relativeToOut.startsWith('..') || path.isAbsolute(relativeToOut)) continue;
    if (fs.existsSync(absolute) && fs.statSync(absolute).isFile()) return { absolute };
  }

  return { error: `target does not exist (${decodedPath})` };
}

function collectAnchors(html) {
  const anchors = new Set();
  const attribute = /(?<![\w:-])\bid\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let match;
  while ((match = attribute.exec(html)) !== null) anchors.add(decodeHtml(match[1] ?? match[2]));
  for (const anchor of html.matchAll(/<a\b[^>]*>/gi)) {
    const name = anchor[0].match(/(?<![\w:-])\bname\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (name) anchors.add(decodeHtml(name[1] ?? name[2]));
  }
  return anchors;
}

function blankNonNewlines(value) {
  return value.replace(/[^\r\n]/g, ' ');
}

function maskMdxCode(source) {
  let masked = source.replace(/<!--[\s\S]*?-->/g, (value) => blankNonNewlines(value));
  const lines = masked.match(/.*(?:\r?\n|$)/g) ?? [];
  let fence = null;
  masked = lines.map((line) => {
    const marker = line.match(/^[ \t]{0,3}(`{3,}|~{3,})/);
    if (!fence && marker) {
      fence = { character: marker[1][0], length: marker[1].length };
      return blankNonNewlines(line);
    }
    if (fence) {
      const closing = new RegExp(`^[ \\t]{0,3}${fence.character}{${fence.length},}[ \\t]*(?:\\r?\\n)?$`);
      if (closing.test(line)) fence = null;
      return blankNonNewlines(line);
    }
    return line;
  }).join('');
  return masked.replace(/(`+)([^`\n]*?)\1/g, (value) => blankNonNewlines(value));
}

function sourceLine(source, offset) {
  return source.slice(0, offset).split('\n').length;
}

function extractMdxDestinations(source) {
  const links = [];
  const masked = maskMdxCode(source);
  const pattern = /(?<!!)\[[^\]\n]+\]\(\s*/g;
  let match;
  while ((match = pattern.exec(masked)) !== null) {
    let cursor = pattern.lastIndex;
    let value = '';
    if (masked[cursor] === '<') {
      const end = masked.indexOf('>', cursor + 1);
      if (end === -1) continue;
      value = masked.slice(cursor + 1, end);
      pattern.lastIndex = end + 1;
    } else {
      let nested = 0;
      const start = cursor;
      for (; cursor < masked.length; cursor += 1) {
        const character = masked[cursor];
        if (/\s/.test(character) && nested === 0) break;
        if (character === '(' && masked[cursor - 1] !== '\\') nested += 1;
        if (character === ')' && masked[cursor - 1] !== '\\') {
          if (nested === 0) break;
          nested -= 1;
        }
      }
      value = masked.slice(start, cursor);
      pattern.lastIndex = cursor;
    }
    if (value) links.push({ value, line: sourceLine(source, match.index) });
  }

  const reference = /^[ \t]{0,3}\[[^\]\n]+\]:[ \t]*(?:<([^>\n]+)>|([^\s]+))/gm;
  while ((match = reference.exec(masked)) !== null) {
    links.push({ value: match[1] ?? match[2], line: sourceLine(source, match.index) });
  }

  const jsxHref = /(?<![\w:-])\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  while ((match = jsxHref.exec(masked)) !== null) {
    links.push({ value: match[1] ?? match[2], line: sourceLine(source, match.index) });
  }
  return links;
}

function isPathRelative(value) {
  return value !== ''
    && !/^(?:[a-z][a-z\d+.-]*:|\/|#|\?|\{|\\)/i.test(value);
}

function extract(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => decodeHtml(match[1]));
}

if (!fs.existsSync(outRoot)) {
  console.error('[verify-site] FAIL out/ does not exist');
  process.exit(1);
}

const parserFixture = [
  '```md', '[ignored](inside/fence/)', '```',
  '[bare](integration/foo/)', '[angle](<./angle/>)', '[reference]: ../reference/',
  '<Link href="nested/jsx/" />',
].join('\n');
const fixtureRelative = extractMdxDestinations(parserFixture).filter((item) => isPathRelative(item.value)).map((item) => item.value);
if (JSON.stringify(fixtureRelative) !== JSON.stringify(['integration/foo/', './angle/', '../reference/', 'nested/jsx/'])) {
  errors.push(`internal source-link parser regression: ${JSON.stringify(fixtureRelative)}`);
}
const anchorFixture = collectAnchors('<meta name="viewport"><div id="real"></div><a name="legacy"></a>');
if (anchorFixture.has('viewport') || !anchorFixture.has('real') || !anchorFixture.has('legacy')) {
  errors.push('internal fragment-anchor parser regression');
}
passed.push('link verifier adversarial fixtures');

const htmlFiles = walk(outRoot, (file) => file.endsWith('.html'));
if (fs.existsSync(path.join(outRoot, 'static'))) {
  errors.push('retired /static compatibility tree leaked into the export');
}
for (const file of walk(outRoot, (candidate) => candidate.endsWith('.md') || candidate.endsWith('.mdx'))) {
  errors.push(`source Markdown leaked into the export: ${path.relative(outRoot, file)}`);
}
passed.push('no retired /static tree or source Markdown leak');

const sitemapPath = path.join(outRoot, 'sitemap.xml');
if (!canonicalOrigin || !fs.existsSync(sitemapPath)) {
  errors.push('canonical origin or sitemap.xml is unavailable for alternate-link validation');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const alternateUrls = extract(sitemap, /<xhtml:link\b[^>]*\bhref=["']([^"']+)["'][^>]*\/>/gi);
  if (alternateUrls.length === 0) errors.push('sitemap.xml has no hreflang alternate URLs');
  for (const href of alternateUrls) {
    try {
      if (new URL(href).origin !== canonicalOrigin) errors.push(`sitemap alternate has wrong origin: ${href}`);
    } catch {
      errors.push(`sitemap alternate is not absolute: ${href}`);
    }
  }
  passed.push(`${alternateUrls.length} sitemap alternate URLs are absolute and canonical`);
}

let linkCount = 0;
let imageCount = 0;
let fragmentCount = 0;
const anchorCache = new Map();
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(outRoot, file);
  const pageUrl = new URL(routeForHtml(file), linkOrigin);
  for (const href of extract(html, /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    let resolved;
    try {
      resolved = new URL(href, pageUrl);
    } catch {
      errors.push(`invalid link ${href} in ${relative}`);
      continue;
    }
    if (!internalOrigins.has(resolved.origin)) continue;
    linkCount += 1;
    if (/^\/(?:zh|en|de|fr)\/docs\/intro\/(?:integration|use-case)(?:\/|$)/.test(resolved.pathname)) {
      errors.push(`retired route shape ${resolved.pathname} from ${href} in ${relative}`);
      continue;
    }
    const target = resolveOutputFile(resolved.pathname);
    if (target.error) {
      errors.push(`broken internal link ${href} in ${relative}: ${target.error}`);
      continue;
    }
    if (resolved.hash.length <= 1 || !target.absolute.endsWith('.html')) continue;
    fragmentCount += 1;
    const fragment = decodeUrlComponent(resolved.hash.slice(1));
    if (fragment === null) {
      errors.push(`invalid fragment encoding ${href} in ${relative}`);
      continue;
    }
    let anchors = anchorCache.get(target.absolute);
    if (!anchors) {
      anchors = collectAnchors(fs.readFileSync(target.absolute, 'utf8'));
      anchorCache.set(target.absolute, anchors);
    }
    if (!anchors.has(fragment)) errors.push(`missing fragment #${fragment} from ${href} in ${relative}`);
  }
  for (const src of extract(html, /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    let resolved;
    try {
      resolved = new URL(src, pageUrl);
    } catch {
      errors.push(`invalid image URL ${src} in ${relative}`);
      continue;
    }
    if (!internalOrigins.has(resolved.origin)) continue;
    imageCount += 1;
    const target = resolveOutputFile(resolved.pathname);
    if (target.error) errors.push(`missing image ${src} in ${relative}: ${target.error}`);
  }

  if (relative.includes(`${path.sep}schema-content${path.sep}`)) {
    const bytes = Buffer.byteLength(html);
    const buttons = (html.match(/<button\b/g) ?? []).length;
    const elements = (html.match(/<[a-z][^>]*>/gi) ?? []).length;
    if (bytes > 300_000) errors.push(`schema HTML budget exceeded: ${relative} = ${bytes} bytes`);
    if (buttons >= 500) errors.push(`schema button budget exceeded: ${relative} = ${buttons}`);
    if (elements >= 6_000) errors.push(`schema element budget exceeded: ${relative} = ${elements}`);
    if (/\boneOf\s+\d+\b/.test(html)) errors.push(`anonymous oneOf labels leaked into ${relative}`);
  }
}
passed.push(`${linkCount} internal link references resolve with browser URL semantics`);
passed.push(`${fragmentCount} internal fragments resolve to real anchors`);
passed.push(`${imageCount} rendered image references resolve`);
passed.push('schema HTML, element, button, and semantic-label budgets');

const mdxFiles = walk(docsRoot, (file) => file.endsWith('.mdx'));
const metaFiles = walk(docsRoot, (file) => /\/meta(?:\.(?:en|de|fr))?\.json$/.test(file));
let declaredNavigationPages = 0;
for (const file of metaFiles) {
  const relative = path.relative(root, file);
  const directory = path.dirname(file);
  const locale = path.basename(file).match(/^meta\.(en|de|fr)\.json$/)?.[1] ?? null;
  const meta = JSON.parse(fs.readFileSync(file, 'utf8'));
  const pages = Array.isArray(meta.pages) ? meta.pages.filter((entry) => typeof entry === 'string') : [];
  const declared = new Set(pages.filter((entry) => !/^(?:---|\.\.\.)/.test(entry)));
  for (const entry of declared) {
    declaredNavigationPages += 1;
    if (entry.includes('/')) errors.push(`folder meta entries must be relative child slugs: ${relative} -> ${entry}`);
    const pageFile = path.join(directory, `${entry}${locale ? `.${locale}` : ''}.mdx`);
    const childDirectory = path.join(directory, entry);
    if (!fs.existsSync(pageFile) && !fs.existsSync(childDirectory)) {
      errors.push(`folder meta entry has no matching localized page or directory: ${relative} -> ${entry}`);
    }
  }
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const match = locale
      ? entry.name.match(new RegExp(`^(.+)\\.${locale}\\.mdx$`))
      : entry.name.match(/^(.+)\.mdx$/);
    if (!match || (!locale && /\.(?:en|de|fr)$/.test(match[1]))) continue;
    if (match[1] !== 'index' && !declared.has(match[1])) {
      errors.push(`localized page is missing from folder meta navigation: ${relative} -> ${match[1]}`);
    }
  }
}
passed.push(`${declaredNavigationPages} localized folder-meta entries are relative and complete`);

const credentialSample = /(?:token|令牌|jeton|prüftoken|verification token)[^\n`]{0,32}[A-Za-z0-9+/=]{48,}/iu;
for (const file of mdxFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);
  if (/<a(?:\s|>)/i.test(source)) errors.push(`raw <a> is forbidden in MDX (use Markdown links): ${relative}`);
  if (/<p(?:\s|>)/i.test(source)) errors.push(`raw <p> is forbidden in MDX (prevents nested paragraph hydration): ${relative}`);
  if (/https:\/\/github\.com\/user-attachments\//i.test(source)) {
    errors.push(`GitHub user-attachment media must be vendored for deterministic builds: ${relative}`);
  }
  for (const link of extractMdxDestinations(source)) {
    if (isPathRelative(link.value)) {
      errors.push(`relative internal Markdown link is forbidden; use a locale-absolute route: ${relative}:${link.line} -> ${link.value}`);
    }
  }
  if (credentialSample.test(source)) errors.push(`credential-shaped token example is forbidden in public MDX: ${relative}`);
}
passed.push(`${mdxFiles.length} MDX files pass hydration, locale-absolute-link, deterministic-media, and credential-sample guards`);

const schemaViewerPath = path.join(root, 'components', 'json-schema-viewer.tsx');
const schemaViewerSource = fs.readFileSync(schemaViewerPath, 'utf8');
for (const keyword of [
  'minLength', 'maxLength', 'uniqueItems', 'additionalProperties',
  "'if'", "'then'", "'else'", "'not'", "'propertyNames'",
]) {
  if (!schemaViewerSource.includes(keyword)) errors.push(`Schema Viewer omits governed keyword ${keyword}`);
}
passed.push('Schema Viewer source covers governed scalar and conditional keywords');

for (const marker of [
  'data-schema-taxonomy',
  'data-taxonomy-row',
  'data-taxonomy-id',
  'data-taxonomy-label',
  'schema-data-table',
  'not-prose',
]) {
  if (!schemaViewerSource.includes(marker)) errors.push(`Schema Viewer omits visual-test marker ${marker}`);
}
if (schemaViewerSource.includes('function TaxonomyNode')) {
  errors.push('Schema taxonomy regressed to recursively nested rows instead of the governed flat table');
}
passed.push('Schema Viewer retains flat-table and visual-test contracts');

const homeSource = fs.readFileSync(path.join(root, 'components', 'docs-home.tsx'), 'utf8');
const brandSource = fs.readFileSync(path.join(root, 'components', 'site-brand.tsx'), 'utf8');
const metadataSource = fs.readFileSync(path.join(root, 'lib', 'metadata.ts'), 'utf8');
const identitySource = `${homeSource}\n${brandSource}\n${metadataSource}`;
if (!homeSource.includes('data-hero-signature="tidas-system-map"')) {
  errors.push('TIDAS homepage omits the governed system-map signature');
}
if (!homeSource.includes('data-primary-action')) {
  errors.push('TIDAS homepage omits primary-action visual-test markers');
}
if (!homeSource.includes("fumadocs-ui/components/card")) {
  errors.push('TIDAS task routes must use the shared Fumadocs Card primitives');
}
if (homeSource.includes('<main')) {
  errors.push('TIDAS homepage must not nest a second main landmark inside HomeLayout');
}
for (const retiredLabel of ['TIDAS Data Specification', 'TianGong Data Atlas', 'Data Contract']) {
  if (identitySource.includes(retiredLabel)) errors.push(`retired TIDAS identity remains in public UI source: ${retiredLabel}`);
}
if (!identitySource.includes('TianGong Data System')) errors.push('TianGong Data System identity is missing');
passed.push('TIDAS system identity, homepage signature, Fumadocs cards, and landmark composition are governed');

const globalCssSource = fs.readFileSync(path.join(root, 'app', 'global.css'), 'utf8');
if (/\b(?:linear|radial|conic|repeating-linear|repeating-radial)-gradient\s*\(/i.test(globalCssSource)) {
  errors.push('custom site CSS contains a prohibited decorative gradient');
}
if (/\bbox-shadow\s*:/i.test(globalCssSource)) {
  errors.push('custom site CSS contains a prohibited decorative box shadow');
}
passed.push('custom site CSS stays gradient- and shadow-free');

if (errors.length > 0) {
  console.error(`\n[verify-site] ${errors.length} FAILURES:`);
  for (const error of errors.slice(0, 80)) console.error(`  ✗ ${error}`);
  process.exit(1);
}

console.log(`\n[verify-site] ${passed.length} checks passed:`);
for (const item of passed) console.log(`  ✓ ${item}`);
console.log('\n[verify-site] ALL GREEN');
