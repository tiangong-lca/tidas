#!/usr/bin/env node
/**
 * tidas docs out/ 结构契约验证（manifest 驱动）。
 * 用法：DEPLOY_ENV=ci SOURCE_COMMIT=<sha> node scripts/verify-out.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { classifyPageDescription } from '../lib/seo-policy.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const outRoot = path.join(ROOT, 'out');
const commit = process.env.SOURCE_COMMIT ?? null;
const deployEnv = process.env.DEPLOY_ENV ?? 'ci';

const errors = [];
const passed = [];

const exists = (rel) => fs.existsSync(path.join(outRoot, rel));
const read = (rel) => fs.readFileSync(path.join(outRoot, rel), 'utf8');

if (!fs.existsSync(outRoot)) {
  console.error('[verify-out] FAIL out/ does not exist; run the build first');
  process.exit(1);
}

// 1. 全量 HTML 路由（从 out/ 目录结构推导预期）
const locales = ['zh', 'en', 'de', 'fr'];
const categoryBases = ['core-modules', 'tool', 'integration', 'use-case', 'faq'];
// zh/en 21 正文页 × 4 locale + 分类页 × 4 + docs index × 4 + 语言入口 4 + 根 1
// 总计 = 4×21 + 4×7(含 core-modules/schema/schema-content 子分类) + 4 + 4 + 1

// 2. 系统端点
for (const p of ['llms.txt', 'robots.txt', 'sitemap.xml', 'search-records.json', 'api/search']) {
  if (exists(p) && fs.statSync(path.join(outRoot, p)).isFile()) passed.push(`endpoint ${p}`);
  else errors.push(`missing file endpoint ${p}`);
}
if (exists('404.html')) passed.push('404.html');
else errors.push('missing 404.html');

// 3. 内部路径零泄漏
let leaked = null;
const NEXT_NS = /^(_next|_not-found|__next)/;
(function walkAll(dir) {
  if (leaked) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    // Next.js 构建产物命名空间（_next/**/_not-found/__next*）不是泄漏
    if (NEXT_NS.test(e.name)) continue;
    if (e.name.startsWith('_') || e.name.includes('_todo') || e.name.includes('_reference')) {
      leaked = path.relative(outRoot, path.join(dir, e.name));
      return;
    }
    if (e.isDirectory()) walkAll(path.join(dir, e.name));
  }
})(outRoot);
if (!leaked) passed.push('no internal path leak');
else errors.push(`internal path leaked into out/: ${leaked}`);

// 4. search-records 契约
if (exists('search-records.json')) {
  const sr = JSON.parse(read('search-records.json'));
  if (sr.sourceCommit !== commit) {
    errors.push(`search-records sourceCommit ${sr.sourceCommit} != ${commit}`);
  }
  const recomputed = createHash('sha256').update(JSON.stringify(sr.records)).digest('hex');
  if (sr.digest !== `sha256:${recomputed}`) errors.push('search-records digest mismatch');
  for (const record of sr.records) {
    if (record.tag !== String(record.url).split('/')[1]) {
      errors.push(`record tag/locale mismatch: ${record._id}`);
      break;
    }
  }
  passed.push(`search-records count=${sr.count} counts=${JSON.stringify(sr.countsByLocale)}`);
}

// 5. llms.txt：commit + 条目计数（21 zh + 21 en = 42 正文 + 4 index = 46；de/fr scaffold 也算）
const llms = read('llms.txt');
if (commit && !llms.includes(commit)) errors.push('llms.txt does not expose SOURCE_COMMIT');
const llmsEntries = (llms.match(/^- \[/gm) ?? []).length;
if (llmsEntries < 42) errors.push(`llms entries = ${llmsEntries}, expected >= 42`);
else passed.push(`llms entries ${llmsEntries} + commit`);

// 6. html lang 映射（默认语言首页就是 / 本身）
if (!exists('zh/index.html')) passed.push('no duplicate /zh home in the export');
else errors.push('zh/index.html exists: /zh is a permanent redirect and must not be exported');
if (read('index.html').includes('lang="zh-CN"')) passed.push('html lang zh-CN at /');
else errors.push('root html lang is not zh-CN');

// 7. 非生产 noindex + robots disallow
if (deployEnv !== 'production') {
  if (read('index.html').includes('noindex')) passed.push('noindex (non-prod)');
  else errors.push('non-production pages missing noindex');
  if (read('robots.txt').includes('Disallow: /')) passed.push('robots disallow (non-prod)');
  else errors.push('non-production robots.txt must disallow all');
}

// 7b. 默认语言首页 canonical 指向 /，且 /zh 别名不得出现在 canonical 或 hreflang 中
const canonicalOrigin = process.env.CANONICAL_ORIGIN ?? '';
const homeCanonical = /<link rel="canonical" href="([^"]+)"/u.exec(read('index.html'))?.[1] ?? '';
if (canonicalOrigin && homeCanonical === `${canonicalOrigin.replace(/\/+$/u, '')}/`) {
  passed.push('root canonical is /');
} else {
  errors.push(`root canonical is ${JSON.stringify(homeCanonical)}, expected ${canonicalOrigin}/`);
}
const aliasHrefs = new Set([`${canonicalOrigin}/zh`, `${canonicalOrigin}/zh/`, '/zh', '/zh/']);
const homes = ['index.html', 'en/index.html', 'de/index.html', 'fr/index.html'];
const aliasTarget = homes
  .flatMap((relative) => [...read(relative).matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/gu)])
  .find(([, , href]) => aliasHrefs.has(href));
if (aliasTarget) errors.push(`/zh alias is used as an hreflang target: ${aliasTarget[2]}`);
else passed.push('no /zh alias in home hreflang targets');

// 7c. 托管重定向声明：/zh 与 /zh/ 永久跳转到 /
const edgeOne = JSON.parse(fs.readFileSync(path.join(ROOT, 'edgeone.json'), 'utf8'));
const redirects = new Map((edgeOne.redirects ?? []).map((entry) => [`${entry.source} ${entry.statusCode}`, entry.destination]));
for (const source of ['/zh', '/zh/']) {
  if (redirects.get(`${source} 301`) === '/') passed.push(`redirect ${source} -> / (301)`);
  else errors.push(`edgeone.json must redirect ${source} to / with status 301`);
}

// 7d. 可选搜索引擎归属标记：仅在构建环境提供时输出。
// 该标记是公开的，但本门禁仍然不回显其值：只报告存在/一致或缺失/不一致。
const baiduToken = (process.env.BAIDU_SITE_VERIFICATION ?? '').trim();
const headProbes = ['index.html', 'en/index.html', 'de/index.html', 'fr/index.html', 'zh/docs/intro/index.html']
  .filter((relative) => exists(relative));
const outHtmlFiles = [];
(function collectHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectHtml(full);
    else if (entry.name.endsWith('.html')) outHtmlFiles.push(full);
  }
})(outRoot);

if (headProbes.length === 0) {
  errors.push('no document head was available to check the ownership marker');
} else if (baiduToken) {
  const notExact = headProbes.filter((relative) => !read(relative).includes(`content="${baiduToken}"`));
  if (notExact.length > 0) {
    errors.push(
      `the configured baidu-site-verification marker is missing or not exact on ${notExact.length} of ` +
        `${headProbes.length} document heads (first: ${notExact[0]})`,
    );
  } else {
    passed.push(`baidu-site-verification marker present and exact on ${headProbes.length} document heads`);
  }
} else {
  const carrying = outHtmlFiles.filter((file) => fs.readFileSync(file, 'utf8').includes('baidu-site-verification'));
  if (carrying.length > 0) {
    errors.push(
      `baidu-site-verification appears in ${carrying.length} pages although no marker was configured ` +
        `(first: ${path.relative(outRoot, carrying[0])}); it must come from the build environment, never from source`,
    );
  } else {
    passed.push(`no baidu-site-verification marker across ${outHtmlFiles.length} pages (not configured)`);
  }
}

// 8. sitemap 契约：locale 隔离、无 /zh 别名、无统一 lastmod、目标均为真实产物
const sitemap = read('sitemap.xml');
if (/\/ja\/docs/.test(sitemap)) errors.push('sitemap contains dropped ja locale');
else passed.push('no ja locale leak');

const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1]);
const sitemapAlternates = [...sitemap.matchAll(/<xhtml:link[^>]*\bhref="([^"]+)"/gu)].map((match) => match[1]);
const aliasTargets = [...sitemapLocs, ...sitemapAlternates].filter((href) => aliasHrefs.has(href));
if (aliasTargets.length > 0) errors.push(`sitemap advertises the /zh alias: ${aliasTargets[0]}`);
else passed.push('sitemap free of /zh alias entries');
if (/<lastmod/u.test(sitemap)) errors.push('sitemap carries lastmod although only the deploy time is known');
else passed.push('sitemap omits lastmod (no deployment-time dates)');

const resolveOut = (href) => {
  let url;
  try {
    url = new URL(href);
  } catch {
    return `unparseable URL ${href}`;
  }
  if (canonicalOrigin && url.origin !== canonicalOrigin) return `sitemap target has wrong origin: ${href}`;
  const relative = url.pathname.replace(/^\/+/, '');
  const candidates = url.pathname.endsWith('/')
    ? [path.join(relative, 'index.html')]
    : [relative, `${relative}.html`, path.join(relative, 'index.html')];
  const found = candidates.some(
    (candidate) => fs.existsSync(path.join(outRoot, candidate)) && fs.statSync(path.join(outRoot, candidate)).isFile(),
  );
  return found ? null : `no artifact for ${url.pathname}`;
};
const unresolvedTargets = [...new Set([...sitemapLocs, ...sitemapAlternates])].map(resolveOut).filter(Boolean);
if (unresolvedTargets.length > 0) errors.push(`sitemap target missing from the export: ${unresolvedTargets[0]}`);
else {
  passed.push(
    `${new Set([...sitemapLocs, ...sitemapAlternates]).size} sitemap URLs and alternates resolve to real artifacts`,
  );
}

// 8b. 已退役路径必须保持 404：不得重新生成
for (const retired of ['docs/intro/integration', 'docs/intro/use-case']) {
  if (!exists(retired) && !exists(`${retired}/index.html`)) passed.push(`retired ${retired} stays absent`);
  else errors.push(`retired path ${retired} was regenerated into the export`);
}

// 9. OG 图数量
let ogCount = 0;
(function walkO(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkO(full);
    else if (e.isFile() && !e.name.endsWith('.html')) ogCount += 1;
  }
})(path.join(outRoot, 'og'));
if (ogCount >= 80) passed.push(`og images (${ogCount})`);
else errors.push(`expected >=80 OG images, found ${ogCount}`);

// --- 页面摘要内容债（advisory，不是门禁）---
// 没有 authored/derived 摘要的页面不发布页面级 description，Next 于是继承布局的站点级
// description。那个继承值是站点默认，不是页面摘要，所以这里把该 URL 作为编辑内容债列出，
// 而不是算作已覆盖。该报告不改变索引策略、不阻塞构建、也没有放宽任何既有门禁。
const mdxSourcePages = [];
(function collectMdx(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectMdx(full);
    else if (entry.name.endsWith('.mdx')) {
      const locale = /\.(en|de|fr)\.mdx$/u.exec(entry.name)?.[1] ?? 'zh';
      const segments = path
        .relative(path.join(ROOT, 'content', 'docs'), full)
        .split(path.sep)
        .join('/')
        .replace(/\.(?:en|de|fr)?\.?mdx$/u, '')
        .split('/')
        .filter((segment) => segment.length > 0 && segment !== 'index');
      mdxSourcePages.push({
        locale,
        file: full,
        url: `/${locale}/docs/${segments.length > 0 ? `${segments.join('/')}/` : ''}`,
      });
    }
  }
})(path.join(ROOT, 'content', 'docs'));

const missingArtifacts = mdxSourcePages
  .filter((page) => !exists(`${page.url.replace(/^\//u, '')}index.html`))
  .map((page) => page.url);
if (missingArtifacts.length > 0) {
  errors.push(`source page has no exported artifact: ${missingArtifacts[0]}`);
} else {
  passed.push(`all ${mdxSourcePages.length} source pages export an artifact`);
}

const descriptionDebt = { authored: [], derived: [], unresolved: [] };
for (const page of mdxSourcePages) {
  const source = fs.readFileSync(page.file, 'utf8');
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/u.exec(source)?.[1] ?? '';
  const declared = /^description:\s*(.+)$/mu.exec(frontmatter)?.[1] ?? '';
  const htmlPath = `${page.url.replace(/^\//u, '')}index.html`;
  const output = exists(htmlPath)
    ? /<meta name="description" content="([^"]*)"/u.exec(read(htmlPath))?.[1]
    : undefined;
  descriptionDebt[classifyPageDescription({ authored: declared, output, lang: page.locale })].push(page.url);
}
const unresolvedDescriptions = [...descriptionDebt.unresolved].sort();
passed.push(
  `page descriptions measured: ${descriptionDebt.authored.length} authored / ` +
    `${descriptionDebt.derived.length} derived / ${unresolvedDescriptions.length} unresolved (advisory)`,
);

// --- summary ---
console.log(`\n[verify-out] ${passed.length} checks passed:`);
for (const p of passed) console.log(`  ✓ ${p}`);
if (unresolvedDescriptions.length > 0) {
  console.log(
    `\n[verify-out] ${unresolvedDescriptions.length} URLs have no page-specific description ` +
      '(editorial content debt; the layout site description is inherited, nothing is blocked):',
  );
  for (const url of unresolvedDescriptions) console.log(`  ! ${url}`);
}
if (errors.length > 0) {
  console.error(`\n[verify-out] ${errors.length} FAILURES:`);
  for (const e of errors.slice(0, 30)) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('\n[verify-out] ALL GREEN');
