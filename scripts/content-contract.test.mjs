import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = path.join(repositoryRoot, 'content', 'docs');
const read = (relativePath) => fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(read(relativePath));
const locales = ['zh', 'en', 'de', 'fr'];
const categories = ['core-modules', 'tool', 'integration', 'use-case', 'faq'];
const cliCommands = ['convert', 'import', 'export', 'validate', 'release', 'ruleset', 'version'];

function localizedFile(category, locale, extension) {
  const suffix = locale === 'zh' ? '' : `.${locale}`;
  return `content/docs/${category}/${extension === 'mdx' ? `index${suffix}.mdx` : `meta${suffix}.json`}`;
}

function stripFrontmatter(source) {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/u, '').trim();
}

function walk(directory, predicate) {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...walk(fullPath, predicate));
    else if (predicate(fullPath)) result.push(fullPath);
  }
  return result;
}

test('category overviews are substantive folder indexes in every locale', () => {
  for (const category of categories) {
    for (const locale of locales) {
      const metaPath = localizedFile(category, locale, 'json');
      const indexPath = localizedFile(category, locale, 'mdx');
      const meta = readJson(metaPath);
      const body = stripFrontmatter(read(indexPath));

      assert.equal(meta.pagesIndex, 'index', `${metaPath} must make the existing index URL the folder index`);
      assert.equal(meta.pages.includes('index'), false, `${metaPath} must not duplicate the folder index as a child`);
      assert.match(body, /<CategoryDirectory\b/u, `${indexPath} must render its page-tree directory`);
      assert.match(
        body,
        /<CategoryDirectory\b[^>]*\/>\s*$/u,
        `${indexPath} must not leave legacy summary copy after its page-tree directory`,
      );
      assert.ok(body.length >= 160, `${indexPath} must contain a substantive localized introduction`);
    }
  }
});

test('CategoryDirectory derives entries from the Fumadocs page tree', () => {
  const source = read('components/category-directory.tsx');

  assert.match(source, /source\.getPageTree\(/u);
  assert.match(source, /data-category-directory=/u);
  assert.doesNotMatch(source, /core-modules|tidas-blockchain|block-builder/u, 'directory entries must not be hard-coded');
});

test('the responsive brand uses explicit full and compact labels without ellipsis', () => {
  const brand = read('components/site-brand.tsx');
  const css = read('app/global.css');

  assert.match(brand, /atlas-brand-full/u);
  assert.match(brand, /atlas-brand-compact/u);
  assert.match(brand, /aria-label="TIDAS — TianGong Data System"/u);
  assert.doesNotMatch(css, /\.atlas-brand-name\s*\{[^}]*text-overflow:\s*ellipsis/su);
});

test('schema inventory covers every published JSON asset and reconciles its counts', () => {
  const inventory = readJson('content/schema-inventory.json');
  const published = fs
    .readdirSync(path.join(repositoryRoot, 'public', 'schemas'))
    .filter((fileName) => fileName.endsWith('.json'))
    .sort();
  const inventoried = inventory.assets.map((asset) => asset.file).sort();

  assert.deepEqual(inventoried, published);
  assert.equal(new Set(inventoried).size, inventoried.length, 'inventory file names must be unique');
  assert.deepEqual(
    inventory.counts,
    {
      publishedAssets: inventory.assets.length,
      contractSchemas: inventory.assets.filter((asset) => asset.normative).length,
      datasetObjects: inventory.assets.filter((asset) => asset.role === 'dataset-object').length,
      classificationVocabularies: inventory.assets.filter((asset) => asset.role === 'classification-vocabulary').length,
      sharedTypes: inventory.assets.filter((asset) => asset.role === 'shared-types').length,
      viewerProjections: inventory.assets.filter((asset) => asset.role === 'viewer-projection').length,
      derivedAssets: inventory.assets.filter((asset) => asset.derivation.kind !== 'none-declared').length,
    },
  );

  assert.equal(inventory.counts.datasetObjects, 8);
  assert.equal(inventory.counts.classificationVocabularies, 9);
  assert.equal(inventory.counts.sharedTypes, 1);
  assert.equal(inventory.counts.viewerProjections, 1);

  for (const asset of inventory.assets) {
    assert.ok(
      ['dataset-object', 'classification-vocabulary', 'shared-types', 'viewer-projection'].includes(asset.role),
      `${asset.file}: unknown role`,
    );
    assert.ok(['none-declared', 'viewer-projection'].includes(asset.derivation.kind), `${asset.file}: unknown derivation`);
    if (asset.derivation.source) {
      assert.ok(inventoried.includes(asset.derivation.source), `${asset.file}: missing derived source`);
    }
  }

  const viewer = inventory.assets.find((asset) => asset.role === 'viewer-projection');
  assert.equal(viewer?.normative, false);
  assert.equal(viewer?.derivation.kind, 'viewer-projection');
  assert.equal(viewer?.derivation.source, 'tidas_data_types.json');
  assert.match(inventory.semantics.viewerProjection, /must not be used for validation or conformance/u);
  assert.match(inventory.semantics.sourceAlignment, /byte-for-byte equivalence is not implied/u);

  const expectedDatasetObjects = [
    'tidas_contacts.json',
    'tidas_flowproperties.json',
    'tidas_flows.json',
    'tidas_lciamethods.json',
    'tidas_lifecyclemodels.json',
    'tidas_processes.json',
    'tidas_sources.json',
    'tidas_unitgroups.json',
  ];
  assert.deepEqual(
    inventory.assets.filter((asset) => asset.role === 'dataset-object').map((asset) => asset.file).sort(),
    expectedDatasetObjects.sort(),
  );

  for (const asset of inventory.assets) {
    const schema = readJson(`public/schemas/${asset.file}`);
    assert.match(schema.$schema, /draft-07/u, `${asset.file}: expected Draft-07 declaration`);

    for (const locale of locales) {
      const suffix = locale === 'zh' ? '' : `.${locale}`;
      const pagePath = `content/docs/${asset.docsPath}${suffix}.mdx`;
      assert.ok(fs.existsSync(path.join(repositoryRoot, pagePath)), `${asset.file}: missing ${locale} documentation`);
      assert.match(read(pagePath), new RegExp(asset.file.replaceAll('.', '\\.'), 'u'), `${asset.file}: absent from ${pagePath}`);
    }
  }
});

test('public Schema counts come from the inventory and docs do not pin a CLI release', () => {
  const mdxFiles = walk(docsRoot, (file) => file.endsWith('.mdx'));
  const publicContent = mdxFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  const mdxComponents = read('components/mdx.tsx');

  assert.match(mdxComponents, /SchemaInventorySummary/u);
  assert.doesNotMatch(publicContent, /0\.1\.1/u, 'public guidance must not pin an obsolete CLI release');
  assert.doesNotMatch(publicContent, /17 (?:core )?JSON Schema|17 个核心 JSON Schema|17 logische Module|17 schémas JSON fondamentaux/iu);
});

test('CLI guidance follows the release authority and preserves locale links', () => {
  for (const locale of locales) {
    const suffix = locale === 'zh' ? '' : `.${locale}`;
    const toolPath = `content/docs/tool/tidas-tool-intro${suffix}.mdx`;
    const toolPage = read(toolPath);
    const introPage = read(`content/docs/intro${suffix}.mdx`);

    assert.match(toolPage, /https:\/\/github\.com\/tiangong-lca\/tidas-tools\/releases\/latest/u);
    assert.match(toolPage, /tidas version --format json/u);
    assert.match(toolPage, /--schema-only/u);
    assert.doesNotMatch(toolPage, /\bv?\d+\.\d+\.\d+\b/u, `${toolPath} must not pin a release number`);
    for (const command of cliCommands) assert.match(toolPage, new RegExp(`tidas ${command}\\b`, 'u'));

    assert.match(introPage, new RegExp(`https://docs\\.tiangong\\.earth/${locale}/docs/`, 'u'));
    assert.doesNotMatch(introPage, /\]\(https:\/\/docs\.tiangong\.earth\/?\)/u);
  }
});

test('beginner entry points use plain LCA language and keep software internals in advanced notes', () => {
  const home = read('components/docs-home.tsx');
  const inventory = read('components/schema-inventory-summary.tsx');
  const publicEntryCopy = [
    home,
    inventory,
    ...locales.flatMap((locale) => {
      const suffix = locale === 'zh' ? '' : `.${locale}`;
      return [
        read(`content/docs/core-modules/index${suffix}.mdx`),
        read(`content/docs/tool/index${suffix}.mdx`),
      ];
    }),
  ].join('\n');

  assert.match(home, /让 LCA 数据按同一套规则保存、检查和交换/u);
  assert.match(home, /Save, check, and exchange LCA data with one shared set of rules/u);
  assert.match(home, /titleParts: \['让 LCA 数据', '按同一套规则', '保存、检查和交换'\]/u);
  assert.match(home, /data-controlled-title-line/u);
  assert.match(inventory, /可下载的 JSON 文件/u);
  assert.doesNotMatch(home, /逻辑合同 Schema|logical contract Schemas|Vertrags-Schemas|schémas de contrat/iu);
  assert.doesNotMatch(inventory, /Schema 资产口径|Schema asset inventory|Inventar der Schema-Assets|ressources de schéma/iu);
  assert.doesNotMatch(
    publicEntryCopy,
    /合规层级|规范边界|转换 profile|合同、资产和运行时指纹|binary, contract, asset, and runtime fingerprints|Fingerabdrücke von Binärdatei, Vertrag, Assets und Laufzeit|empreintes du binaire, du contrat, des ressources et de l’exécution/iu,
  );

  const advancedHeadings = {
    zh: '## 进阶：记录工具版本',
    en: '## Advanced: record the tool version',
    de: '## Für Fortgeschrittene: Werkzeugversion festhalten',
    fr: '## Pour aller plus loin : consigner la version de l’outil',
  };

  for (const locale of locales) {
    const suffix = locale === 'zh' ? '' : `.${locale}`;
    const toolPage = read(`content/docs/tool/index${suffix}.mdx`);
    const headingIndex = toolPage.indexOf(advancedHeadings[locale]);
    const commandIndex = toolPage.indexOf('tidas version --format json');
    assert.notEqual(headingIndex, -1, `${locale} tool overview must include the advanced heading`);
    assert.notEqual(commandIndex, -1, `${locale} tool overview must include the version command`);
    assert.ok(
      headingIndex < commandIndex,
      `${locale} tool overview must introduce the version command only after the advanced heading`,
    );
  }
});

test('four locales expose one centralized LCA glossary and distinguish checks from review', () => {
  const requiredTerms = {
    zh: ['生命周期评价（LCA）', '功能单位', '系统边界', '基本流', '生命周期清单（LCI）', '生命周期影响评价（LCIA）', '独立专业评审'],
    en: ['Life Cycle Assessment (LCA)', 'Functional unit', 'System boundary', 'Elementary flow', 'Life cycle inventory (LCI)', 'Life cycle impact assessment (LCIA)', 'Independent critical review'],
    de: ['Ökobilanz (LCA)', 'Funktionelle Einheit', 'Systemgrenze', 'Elementarfluss', 'Sachbilanz (LCI)', 'Wirkungsabschätzung (LCIA)', 'Unabhängige kritische Prüfung'],
    fr: ['Analyse du cycle de vie (ACV)', 'Unité fonctionnelle', 'Frontière du système', 'Flux élémentaire', 'Inventaire du cycle de vie (ICV)', 'Évaluation de l’impact du cycle de vie (ACVI)', 'Revue critique indépendante'],
  };
  const coreBoundaries = {
    zh: [/数据会经过哪些检查/u, /工具能检查什么、不能检查什么/u, /独立专业评审/u, /具名的合规声明/u],
    en: [/Which checks the data goes through/u, /What tools can—and cannot—check/u, /independent critical review/u, /compliance claim/u],
    de: [/Welche Prüfungen die Daten durchlaufen/u, /Was Werkzeuge prüfen können/u, /unabhängige kritische Prüfung/u, /Konformitätsaussage/u],
    fr: [/Quels contrôles sont appliqués aux données/u, /Ce que les outils peuvent contrôler/u, /revue critique indépendante/u, /déclaration de conformité/u],
  };

  for (const locale of locales) {
    const suffix = locale === 'zh' ? '' : `.${locale}`;
    const glossaryPath = `content/docs/glossary${suffix}.mdx`;
    const glossary = read(glossaryPath);
    const meta = readJson(`content/docs/meta${suffix}.json`);
    const core = read(`content/docs/core-modules/index${suffix}.mdx`);

    assert.ok(meta.pages.includes('glossary'), `${locale} navigation must include the glossary`);
    assert.match(glossary, /https:\/\/publications\.jrc\.ec\.europa\.eu\/repository\/bitstream\/JRC48157\//u);
    for (const term of requiredTerms[locale]) {
      assert.ok(glossary.includes(term), `${glossaryPath} must explain ${term}`);
    }
    assert.match(core, /JSON Schema/u);
    for (const pattern of coreBoundaries[locale]) assert.match(core, pattern);
  }

  const chineseCore = read('content/docs/core-modules/index.mdx');
  assert.match(chineseCore, /\*\*过程数据集（Process dataset）\*\*：/u);
  assert.match(chineseCore, /\*\*交换（Exchange）\*\*：/u);
  assert.match(chineseCore, /\*\*流属性（Flow Property）与单位组（Unit Group）\*\*：/u);
  assert.match(chineseCore, /数据会经过哪些检查/u);
  assert.match(chineseCore, /工具能检查什么、不能检查什么/u);
  assert.match(chineseCore, /不能证明.*方法/u);
  assert.match(chineseCore, /独立专业评审/u);
});
