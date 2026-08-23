#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outRoot = path.join(root, 'out');
const docsRoot = path.join(root, 'content', 'docs');
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

function publicTargetExists(url) {
  if (!url.startsWith('/') || url.startsWith('//')) return true;
  const clean = decodeURIComponent(url.split(/[?#]/, 1)[0]).replace(/^\/+/, '');
  if (clean.length === 0) return fs.existsSync(path.join(outRoot, 'index.html'));
  const direct = path.join(outRoot, clean);
  return fs.existsSync(direct)
    || fs.existsSync(path.join(direct, 'index.html'))
    || fs.existsSync(`${direct}.html`);
}

function extract(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1].replaceAll('&amp;', '&'));
}

if (!fs.existsSync(outRoot)) {
  console.error('[verify-site] FAIL out/ does not exist');
  process.exit(1);
}

const htmlFiles = walk(outRoot, (file) => file.endsWith('.html'));
let linkCount = 0;
let imageCount = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(outRoot, file);
  for (const href of extract(html, /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
    if (/^(?:https?:|mailto:|tel:|#|javascript:|data:)/i.test(href)) continue;
    linkCount += 1;
    if (!publicTargetExists(href)) errors.push(`broken internal link ${href} in ${relative}`);
  }
  for (const src of extract(html, /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    if (/^(?:https?:|data:|blob:)/i.test(src)) continue;
    imageCount += 1;
    if (!publicTargetExists(src)) errors.push(`missing image ${src} in ${relative}`);
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
passed.push(`${linkCount} internal link references resolve`);
passed.push(`${imageCount} rendered image references resolve`);
passed.push('schema HTML, element, button, and semantic-label budgets');

const mdxFiles = walk(docsRoot, (file) => file.endsWith('.mdx'));
for (const file of mdxFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);
  if (/<a(?:\s|>)/i.test(source)) errors.push(`raw <a> is forbidden in MDX (use Markdown links): ${relative}`);
  if (/<p(?:\s|>)/i.test(source)) errors.push(`raw <p> is forbidden in MDX (prevents nested paragraph hydration): ${relative}`);
}
passed.push(`${mdxFiles.length} MDX files pass hydration-source guards`);

if (errors.length > 0) {
  console.error(`\n[verify-site] ${errors.length} FAILURES:`);
  for (const error of errors.slice(0, 80)) console.error(`  ✗ ${error}`);
  process.exit(1);
}

console.log(`\n[verify-site] ${passed.length} checks passed:`);
for (const item of passed) console.log(`  ✓ ${item}`);
console.log('\n[verify-site] ALL GREEN');
