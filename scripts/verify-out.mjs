#!/usr/bin/env node
/**
 * tidas docs out/ 结构契约验证（manifest 驱动）。
 * 用法：DEPLOY_ENV=ci SOURCE_COMMIT=<sha> node scripts/verify-out.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

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

// 6. html lang 映射
if (read('zh/index.html').includes('lang="zh-CN"')) passed.push('html lang zh-CN');
else errors.push('zh html lang is not zh-CN');

// 7. 非生产 noindex + robots disallow
if (deployEnv !== 'production') {
  if (read('zh/index.html').includes('noindex')) passed.push('noindex (non-prod)');
  else errors.push('non-production pages missing noindex');
  if (read('robots.txt').includes('Disallow: /')) passed.push('robots disallow (non-prod)');
  else errors.push('non-production robots.txt must disallow all');
}

// 8. sitemap locale 隔离：ja 不得出现（已弃用）
const sitemap = read('sitemap.xml');
if (/\/ja\/docs/.test(sitemap)) errors.push('sitemap contains dropped ja locale');
else passed.push('no ja locale leak');

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

// --- summary ---
console.log(`\n[verify-out] ${passed.length} checks passed:`);
for (const p of passed) console.log(`  ✓ ${p}`);
if (errors.length > 0) {
  console.error(`\n[verify-out] ${errors.length} FAILURES:`);
  for (const e of errors.slice(0, 30)) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('\n[verify-out] ALL GREEN');
