#!/usr/bin/env node
/**
 * tidas docs 迁移执行器：docs/**（zh 源）+ i18n/en/**（en 镜像）→ content/docs/**
 * 变换链与 tiangong-lca-next-docs 的 migrate.mjs 相同（弯引号归一、围栏归一化、
 * H1→title(/m)、heading ID 剥离、iframe→VideoEmbed、图片→hash 命名空间、
 * 链接→新 IA、锚点重映射），此处处理 tidas 特有的下划线内部文件排除。
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '..');
const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry-run');

const BASELINE = '073e182';
const EN_BASE = 'i18n/en/docusaurus-plugin-content-docs/current';

// 内部文件（下划线前缀）：不进入公开内容树
const INTERNAL = (name) => name.startsWith('_');

// 新 IA 决策：旧 sidebar id → 新路径（kebab-case，integration/_index 系列吸收为正文页）
const PAGE_MAP = {
  'intro': 'intro',
  'core-modules/schema/tidas-schema-intro': 'core-modules/schema/tidas-schema-intro',
  'core-modules/schema/tidas-schema-validation': 'core-modules/schema/tidas-schema-validation',
  'core-modules/schema/schema-content/json-schema-contact': 'core-modules/schema/schema-content/json-schema-contact',
  'core-modules/schema/schema-content/json-schema-datatype': 'core-modules/schema/schema-content/json-schema-datatype',
  'core-modules/schema/schema-content/json-schema-flowproperty': 'core-modules/schema/schema-content/json-schema-flowproperty',
  'core-modules/schema/schema-content/json-schema-flows': 'core-modules/schema/schema-content/json-schema-flows',
  'core-modules/schema/schema-content/json-schema-lciamethods': 'core-modules/schema/schema-content/json-schema-lciamethods',
  'core-modules/schema/schema-content/json-schema-model': 'core-modules/schema/schema-content/json-schema-model',
  'core-modules/schema/schema-content/json-schema-processes': 'core-modules/schema/schema-content/json-schema-processes',
  'core-modules/schema/schema-content/json-schema-source': 'core-modules/schema/schema-content/json-schema-source',
  'core-modules/schema/schema-content/json-schema-unitgroup': 'core-modules/schema/schema-content/json-schema-unitgroup',
  'tool/tidas-tool-intro': 'tool/tidas-tool-intro',
  'tool/_tidas-eilcd': null,            // 内部（下划线）——公开版在 en 镜像无，zh 有？检查后定
  'tool/_tidas-export': null,
  'tool/_tidas-validation': null,
  'integration/_index': 'integration/index',          // 区块链系列目录页转为分类首页
  'integration/_tidas-to-ai': null,
  'integration/tidas-blockchain': 'integration/tidas-blockchain',
  'integration/tidas-permission-control': 'integration/tidas-permission-control',
  'integration/tidas-privacy-computing': 'integration/tidas-privacy-computing',
  'integration/tidas-to-ai': 'integration/tidas-to-ai',
  'use_case/_TIDAS-to-Hyperledger': null,
  'use_case/_openlca-ipc-mcp': null,
  'use_case/block_builder': 'use-case/block-builder',
  'use_case/tidas-to-antchain': 'use-case/tidas-to-antchain',
  'faq/how-to-contribute-tidas-doc': 'faq/how-to-contribute-tidas-doc',
  'faq/vscode-guide': 'faq/vscode-guide',
};

const CATEGORY_MAP = {
  '/core-modules': 'core-modules',
  '/core-modules/schema': 'core-modules/schema',
  '/core-modules/schema/schema-content': 'core-modules/schema/schema-content',
  '/tool': 'tool',
  '/integration': 'integration',
  '/platform': 'platform',
  '/use-case': 'use-case',
  '/faq': 'faq',
};

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const norm = (p) => path.posix.normalize(p);
const slugify = (name) =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/-+/g, '-');

function parseFrontmatter(text) {
  const fm = {};
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return fm;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return fm;
}

// 媒体：static/img + docs/**/img（tidas 的图片在 static/img 下按语言组织 + 部分内联）
const mediaPathMap = new Map();
function walkFiles(dir, exts, out = []) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return out;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) walkFiles(rel, exts, out);
    else if (exts.some((x) => e.name.toLowerCase().endsWith(x))) out.push(rel);
  }
  return out;
}
const mediaSources = [
  ...walkFiles('docs', ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.mp4']),
  ...walkFiles('static/img', ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.mp4']),
];
const mediaByHash = new Map();
for (const rel of mediaSources) {
  const buf = fs.readFileSync(path.join(ROOT, rel));
  const hash = sha256(buf);
  if (!mediaByHash.has(hash)) {
    mediaByHash.set(hash, {
      sha256: hash,
      targetAssetPath: `/assets/docs/${hash.slice(0, 8)}/${slugify(path.basename(rel))}`,
      sourcePaths: [],
      referencedBy: [],
    });
  }
  mediaByHash.get(hash).sourcePaths.push(rel);
}

const report = { pages: [], media: [], warnings: [], internal: [] };

function transformPage(pageId, newPath, src, locale) {
  const srcDir = path.posix.dirname(src);
  let text = fs.readFileSync(path.join(ROOT, src), 'utf8');
  const transforms = [];

  const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const fm = {};
  if (fmMatch) {
    for (const line of fmMatch[1].split(/\r?\n/)) {
      const kv = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
      if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
    }
    text = text.slice(fmMatch[0].length);
    transforms.push('strip-sidebar-frontmatter');
  }
  if (!fm.title) {
    const h1 = text.match(/^#\s+(.+)\r?\n?/m);
    if (h1) {
      fm.title = h1[1].trim();
      text = text.replace(h1[0], '');
      transforms.push('h1-to-title');
    }
  }

  // @site import 与 Docusaurus 专属组件变换
  // 1) JSON schema import：@site/static/schemas/x.json → @/public/schemas/x.json
  text = text.replace(/import\s+(\w+)\s+from\s+["']@site\/static\/schemas\/([^"']+)["'];?/g,
    (m, name, file) => `import ${name} from '@/public/schemas/${file}';`);
  // 2) TidasImage import：@site/src/components/TidasImage → @/components/tidas-image
  text = text.replace(/import\s+TidasImage\s+from\s+["']@site\/src\/components\/TidasImage["'];?/,
    `import { TidasImage } from '@/components/tidas-image';`);
  // 3) JSONSchemaViewer import：@theme/JSONSchemaViewer → @/components/json-schema-viewer
  text = text.replace(/import\s+JSONSchemaViewer\s+from\s+["']@theme\/JSONSchemaViewer["'];?/,
    `import { JsonSchemaViewer } from '@/components/json-schema-viewer';`);
  // 4) <JSONSchemaViewer → <JsonSchemaViewer
  text = text.replace(/<JSONSchemaViewer\b/g, '<JsonSchemaViewer');
  // 5) TidasImage 补 title（文件名做 alt 基础）
  text = text.replace(/<TidasImage\s+filename="([^"]+)"\s*\/>/g,
    (m, fn) => `<TidasImage\n  filename="${fn}"\n  title="${fn.replace(/\.(svg|png|webp)$/i, '')}"\n/>`);
  // 6) Docusaurus CodeBlock import 剥离（fumadocs 默认组件已带）
  text = text.replace(/import\s+CodeBlock\s+from\s+["']@theme\/CodeBlock["'];?\n?/g, '');
  transforms.push('docusaurus-component-rewrites');

  // 围栏归一化（小写 + env→dotenv，含缩进）
  text = text.replace(/^(\s*)```([A-Za-z][\w+-]*)/gm, (m, indent, lang) => {
    const n = lang.toLowerCase();
    return `${indent}\`\`\`${n === 'env' ? 'dotenv' : n}`;
  });

  // heading ID 剥离
  text = text.replace(/\s*\{#[^}]+\}\s*$/gm, '');

  // 图片引用（相对 + /img/ 绝对）→ hash 命名空间
  text = text.replace(/(!\[[^\]]*\]\()([^)\s]+)([^)]*\))/g, (m, pre, ref, tail) => {
    if (/^(https?:)?\/\//.test(ref)) return m;
    const abs = ref.startsWith('/')
      ? norm(ref.replace(/^\/img\//, 'static/img/'))
      : norm(path.posix.join(srcDir, decodeURIComponent(ref.split(/\s+/)[0])));
    const media = mediaByHash.get([...mediaByHash.values()].find((x) => x.sourcePaths.includes(abs))?.sha256 ?? '');
    const entry = [...mediaByHash.values()].find((x) => x.sourcePaths.includes(abs));
    if (!entry) {
      report.warnings.push(`unresolved image ${ref} in ${src}`);
      return m;
    }
    entry.referencedBy.push(`${locale}:${pageId}`);
    return `${pre}${entry.targetAssetPath}${tail}`;
  });

  // 链接：内部相对链接补尾斜杠 + 绝对 /docs/ 链接 → locale 前缀
  text = text.replace(/(?<!!)(\[[^\]]*\]\()([^)\s]+)([^)]*\))/g, (m, pre, ref, tail) => {
    if (/^(https?:|mailto:|#)/.test(ref)) return m;
    const anchorMatch = ref.match(/^(.*?)(#[^#]*)?$/);
    const target = anchorMatch[1];
    const anchor = anchorMatch[2] ?? '';
    if (!target) return m;
    if (target.startsWith('/')) {
      let t = target;
      if (locale === 'en' && (t === '/en' || t.startsWith('/en/'))) t = t.slice(3);
      // /docs/intro → /{locale}/docs/intro/
      if (t.startsWith('/docs/')) {
        return `${pre}/${locale}${t}/${anchor}${tail}`;
      }
      if (t === '/docs') return `${pre}/${locale}/docs/${anchor}${tail}`;
      return m;
    }
    // 相对链接：目标可能是 md 文件（.md 后缀剥离）或页面 id
    const stripped = target.replace(/\.mdx?$/, '');
    const oldTarget = norm(path.posix.join(path.posix.dirname(src), stripped));
    const oldId = oldTarget
      .replace(/^docs\//, '')
      .replace(/^i18n\/en\/docusaurus-plugin-content-docs\/current\//, '');
    const mapped = PAGE_MAP[oldId] ?? (INTERNAL(path.basename(oldId)) ? null : oldId);
    if (mapped) {
      const rel = path.posix.relative(path.posix.dirname(newPath), mapped) || path.posix.basename(mapped);
      const newUrl = rel.startsWith('.') ? `${rel}/` : `./${rel}/`;
      return `${pre}${newUrl}${anchor}${tail}`;
    }
    // 指向下划线内部文件的链接——保留文本去掉链接会破坏正文；改为去掉链接保留文字
    if (INTERNAL(path.basename(oldId))) {
      report.warnings.push(`link to internal file ${ref} in ${src} (text kept, link removed)`);
      const inner = m.match(/^\[([^\]]*)\]\(/)[1];
      return inner;
    }
    report.warnings.push(`unresolved link ${ref} in ${src}`);
    return m;
  });

  const outFm = [`title: ${JSON.stringify(fm.title ?? pageId)}`];
  if (fm.description) outFm.push(`description: ${JSON.stringify(fm.description)}`);
  const out = `---\n${outFm.join('\n')}\n---\n\n${text.trimStart()}`;

  report.pages.push({ locale, sourcePath: src, targetPath: `content/docs/${newPath}${locale === 'zh' ? '.mdx' : '.en.mdx'}`, pageId, transforms: [...new Set(transforms)] });

  if (!DRY) {
    fs.mkdirSync(path.join(ROOT, 'content/docs', path.posix.dirname(newPath)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, 'content/docs', `${newPath}${locale === 'zh' ? '.mdx' : '.en.mdx'}`), out);
  }
}

// 枚举 zh 源（排除下划线内部文件）
const zhFiles = walkFiles('docs', ['.md', '.mdx']);
for (const f of zhFiles) {
  const id = f.replace(/^docs\//, '').replace(/\.mdx?$/, '');
  if (INTERNAL(path.basename(id))) {
    report.internal.push(id);
    continue;
  }
  const mapped = PAGE_MAP[id];
  const newPath = mapped ?? id; // 未显式映射的沿用原路径（schema-content 系列已映射）
  if (newPath === null) continue;
  // use_case → use-case 目录改名
  const finalPath = newPath.replace(/^use_case\//, 'use-case/');
  transformPage(id, finalPath, f, 'zh');
}

// en 镜像
const enFiles = walkFiles(EN_BASE, ['.md', '.mdx']);
for (const f of enFiles) {
  const id = f.replace(/^i18n\/en\/docusaurus-plugin-content-docs\/current\//, '').replace(/\.mdx?$/, '');
  if (INTERNAL(path.basename(id))) continue;
  const mapped = PAGE_MAP[id];
  if (mapped === null) continue;
  const newPath = (mapped ?? id).replace(/^use_case\//, 'use-case/');
  transformPage(id, newPath, f, 'en');
}

// 媒体复制（引用到的）
for (const m of mediaByHash.values()) {
  if (m.referencedBy.length === 0) continue;
  report.media.push({ targetAssetPath: m.targetAssetPath, refs: m.referencedBy.length });
  if (!DRY) {
    const targetAbs = path.join(ROOT, 'public', m.targetAssetPath.replace(/^\//, ''));
    fs.mkdirSync(path.dirname(targetAbs), { recursive: true });
    fs.copyFileSync(path.join(ROOT, m.sourcePaths[0]), targetAbs);
  }
}

fs.mkdirSync(path.join(ROOT, 'manifests'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'manifests/migration-report.json'), `${JSON.stringify({ dryRun: DRY, ...report }, null, 2)}\n`);

console.log(`[migrate] pages=${report.pages.length} media=${report.media.length} internal-excluded=${report.internal.length} warnings=${report.warnings.length}${DRY ? ' (dry-run)' : ''}`);
for (const w of report.warnings.slice(0, 15)) console.warn(`[migrate] WARN ${w}`);
if (report.warnings.length > 15) console.warn(`[migrate] ... ${report.warnings.length - 15} more`);
