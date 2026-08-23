'use client';

import { useCallback, useMemo, useState } from 'react';
import { useI18n } from 'fumadocs-ui/contexts/i18n';

type Schema = Record<string, unknown>;

export interface JsonSchemaViewerProps {
  /** Public URL to a JSON Schema. It is fetched only after the reader opens the explorer. */
  src: string;
  title?: string;
}

interface TaxonomyItem {
  id: string;
  level: number;
  label: string;
  parents: string[];
  children: TaxonomyItem[];
}

const SEARCH_LIMIT = 50;
const ROOT_LIMIT = 50;

const strings = {
  zh: {
    open: '打开 Schema 浏览器', loading: '正在读取 Schema…', retry: '重试', download: '下载原始 JSON Schema',
    error: '无法读取 Schema。请检查网络连接或下载原始文件。', search: '搜索名称或分类 ID', taxonomy: '分类目录',
    entries: '个分类', levels: '层级', resultLimit: `最多显示 ${SEARCH_LIMIT} 个结果，请输入更精确的关键词。`,
    rootLimit: `根分类超过 ${ROOT_LIMIT} 个，请使用搜索定位其余分类。`, noResults: '没有匹配的分类。', structure: 'Schema 结构',
  },
  en: {
    open: 'Open schema explorer', loading: 'Loading schema…', retry: 'Retry', download: 'Download raw JSON Schema',
    error: 'The schema could not be loaded. Check the connection or download the raw file.', search: 'Search by name or category ID',
    taxonomy: 'Taxonomy', entries: 'entries', levels: 'levels',
    resultLimit: `Only the first ${SEARCH_LIMIT} matches are shown. Refine your search to narrow the list.`,
    rootLimit: `More than ${ROOT_LIMIT} root entries exist. Use search to find the rest.`, noResults: 'No matching categories.', structure: 'Schema structure',
  },
  de: {
    open: 'Schema-Explorer öffnen', loading: 'Schema wird geladen…', retry: 'Erneut versuchen', download: 'JSON Schema herunterladen',
    error: 'Das Schema konnte nicht geladen werden. Prüfen Sie die Verbindung oder laden Sie die Rohdatei herunter.',
    search: 'Nach Name oder Kategorie-ID suchen', taxonomy: 'Klassifikation', entries: 'Einträge', levels: 'Ebenen',
    resultLimit: `Es werden höchstens ${SEARCH_LIMIT} Treffer angezeigt. Präzisieren Sie die Suche.`,
    rootLimit: `Es gibt mehr als ${ROOT_LIMIT} Wurzeleinträge. Verwenden Sie die Suche.`, noResults: 'Keine passenden Kategorien.', structure: 'Schema-Struktur',
  },
  fr: {
    open: 'Ouvrir l’explorateur de schéma', loading: 'Chargement du schéma…', retry: 'Réessayer', download: 'Télécharger le JSON Schema',
    error: 'Impossible de charger le schéma. Vérifiez la connexion ou téléchargez le fichier brut.',
    search: 'Rechercher par nom ou identifiant', taxonomy: 'Taxonomie', entries: 'entrées', levels: 'niveaux',
    resultLimit: `Seuls les ${SEARCH_LIMIT} premiers résultats sont affichés. Affinez la recherche.`,
    rootLimit: `Plus de ${ROOT_LIMIT} entrées racines existent. Utilisez la recherche.`, noResults: 'Aucune catégorie correspondante.', structure: 'Structure du schéma',
  },
};

function isSchema(value: unknown): value is Schema {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function scalar(value: unknown): string | null {
  if (value === null) return 'null';
  if (['string', 'number', 'boolean'].includes(typeof value)) return String(value);
  return null;
}

function typeOf(node: Schema): string {
  if (typeof node.$ref === 'string') return '$ref';
  if (Array.isArray(node.type)) return node.type.join(' | ');
  if (typeof node.type === 'string') return node.type;
  if (node.const !== undefined) return typeof node.const;
  if (node.properties || node.additionalProperties || node.patternProperties) return 'object';
  if (node.items || node.prefixItems) return 'array';
  if (node.enum) return 'enum';
  if (node.anyOf) return 'anyOf';
  if (node.oneOf) return 'oneOf';
  if (node.allOf) return 'allOf';
  return 'any';
}

function referenceName(ref: string): string {
  const part = ref.split('/').filter(Boolean).at(-1) ?? ref;
  return decodeURIComponent(part.replace(/\.json$/, ''));
}

function semanticName(node: Schema, fallback: string): string {
  if (typeof node.title === 'string' && node.title.trim()) return node.title;
  const value = scalar(node.const);
  if (value !== null) return value;
  if (Array.isArray(node.enum) && node.enum.length > 0) return node.enum.slice(0, 3).map((item) => scalar(item) ?? '…').join(' | ');
  if (typeof node.$ref === 'string') return referenceName(node.$ref);
  if (isSchema(node.properties)) {
    const properties = node.properties;
    const values = ['#text', '@classId', '@catId', '@level']
      .map((key) => isSchema(properties[key]) ? scalar((properties[key] as Schema).const) : null)
      .filter((item): item is string => item !== null);
    if (values.length > 0) return values.join(' · ');
  }
  if (typeof node.description === 'string' && node.description.trim()) {
    return node.description.length > 54 ? `${node.description.slice(0, 51)}…` : node.description;
  }
  return fallback;
}

function qualifiers(node: Schema): Array<{ key: string; value: string }> {
  const result: Array<{ key: string; value: string }> = [];
  if (typeof node.description === 'string' && node.description.trim()) result.push({ key: 'description', value: node.description });
  if (typeof node.$ref === 'string') result.push({ key: '$ref', value: node.$ref });
  const constant = scalar(node.const);
  if (constant !== null) result.push({ key: 'const', value: constant });
  if (Array.isArray(node.required)) result.push({ key: 'required', value: node.required.join(', ') });
  if (Array.isArray(node.enum)) result.push({ key: 'enum', value: node.enum.map((item) => JSON.stringify(item)).join(' | ') });
  for (const key of ['pattern', 'format', 'minimum', 'maximum', 'minItems', 'maxItems', 'default'] as const) {
    if (node[key] !== undefined) result.push({ key, value: typeof node[key] === 'string' ? node[key] : JSON.stringify(node[key]) });
  }
  return result;
}

function childSchemas(node: Schema): Array<{ name: string; node: Schema; required?: boolean }> {
  const children: Array<{ name: string; node: Schema; required?: boolean }> = [];
  const required = new Set(Array.isArray(node.required) ? node.required.filter((item): item is string => typeof item === 'string') : []);
  if (isSchema(node.properties)) {
    for (const [name, child] of Object.entries(node.properties)) if (isSchema(child)) children.push({ name, node: child, required: required.has(name) });
  }

  const tuple = Array.isArray(node.prefixItems) ? node.prefixItems : Array.isArray(node.items) ? node.items : null;
  if (tuple) tuple.forEach((child, index) => { if (isSchema(child)) children.push({ name: `[${index}]`, node: child }); });
  else if (isSchema(node.items)) children.push({ name: 'items', node: node.items });

  for (const combinator of ['oneOf', 'anyOf', 'allOf'] as const) {
    const list = node[combinator];
    if (!Array.isArray(list)) continue;
    list.forEach((child, index) => { if (isSchema(child)) children.push({ name: semanticName(child, `${combinator} ${index + 1}`), node: child }); });
  }

  for (const group of ['$defs', 'definitions', 'patternProperties', 'dependencies'] as const) {
    if (!isSchema(node[group])) continue;
    for (const [name, child] of Object.entries(node[group])) if (isSchema(child)) children.push({ name: `${group}.${name}`, node: child });
  }
  if (isSchema(node.additionalProperties)) children.push({ name: 'additionalProperties', node: node.additionalProperties });
  return children;
}

function SchemaNode({ name, node, depth, required = false }: { name: string; node: Schema; depth: number; required?: boolean }) {
  const [open, setOpen] = useState(depth === 0);
  const children = useMemo(() => childSchemas(node), [node]);
  const details = qualifiers(node);
  const expandable = children.length > 0;
  return (
    <div role="none" className="schema-node">
      <button type="button" role="treeitem" aria-level={depth + 1} aria-expanded={expandable ? open : undefined}
        onClick={() => expandable && setOpen((current) => !current)} className="schema-node-trigger">
        <span className="schema-chevron" aria-hidden="true">{expandable ? (open ? '−' : '+') : '·'}</span>
        <code>{name}</code>
        {required && <span className="schema-required">required</span>}
        <span className="schema-type">{typeOf(node)}</span>
      </button>
      {details.length > 0 && <dl className="schema-qualifiers">{details.map((detail) => (
        <div key={`${detail.key}:${detail.value}`}><dt>{detail.key}</dt><dd>{detail.value}</dd></div>
      ))}</dl>}
      {open && expandable && <div role="group" className="schema-children">{children.map((child, index) => (
        <SchemaNode key={`${child.name}:${index}`} name={child.name} node={child.node} depth={depth + 1} required={child.required} />
      ))}</div>}
    </div>
  );
}

function taxonomyFrom(schema: Schema): { roots: TaxonomyItem[]; flat: TaxonomyItem[]; maxLevel: number } | null {
  if (!Array.isArray(schema.oneOf) || schema.oneOf.length === 0) return null;
  const raw: Array<Omit<TaxonomyItem, 'children' | 'parents'>> = [];
  for (const branch of schema.oneOf) {
    if (!isSchema(branch) || !isSchema(branch.properties)) return null;
    const properties = branch.properties;
    const labelNode = properties['#text'];
    const idNode = properties['@catId'] ?? properties['@classId'];
    const levelNode = properties['@level'];
    if (!isSchema(labelNode) || !isSchema(idNode) || !isSchema(levelNode)) return null;
    const label = scalar(labelNode.const);
    const id = scalar(idNode.const);
    const levelValue = scalar(levelNode.const);
    if (label === null || id === null || levelValue === null || !/^\d+$/.test(levelValue)) return null;
    raw.push({ label, id, level: Number(levelValue) });
  }

  const roots: TaxonomyItem[] = [];
  const flat: TaxonomyItem[] = [];
  const stack: TaxonomyItem[] = [];
  let maxLevel = 0;
  for (const entry of raw) {
    const parent = entry.level > 0 ? stack[entry.level - 1] : undefined;
    const item: TaxonomyItem = { ...entry, parents: parent ? [...parent.parents, parent.label] : [], children: [] };
    if (parent) parent.children.push(item); else roots.push(item);
    stack.splice(entry.level);
    stack[entry.level] = item;
    flat.push(item);
    maxLevel = Math.max(maxLevel, entry.level);
  }
  return { roots, flat, maxLevel };
}

function TaxonomyNode({ item }: { item: TaxonomyItem }) {
  const [open, setOpen] = useState(false);
  const expandable = item.children.length > 0;
  return (
    <div role="none" className="taxonomy-node">
      <button type="button" role="treeitem" aria-expanded={expandable ? open : undefined}
        onClick={() => expandable && setOpen((current) => !current)} className="taxonomy-row">
        <span className="schema-chevron" aria-hidden="true">{expandable ? (open ? '−' : '+') : '·'}</span>
        <code>{item.id}</code><span>{item.label}</span><small>L{item.level}</small>
      </button>
      {open && expandable && <div role="group" className="taxonomy-children">{item.children.map((child) => (
        <TaxonomyNode item={child} key={`${child.level}:${child.id}:${child.label}`} />
      ))}</div>}
    </div>
  );
}

function TaxonomyViewer({ data, copy }: { data: NonNullable<ReturnType<typeof taxonomyFrom>>; copy: typeof strings.en }) {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLocaleLowerCase();
  const matches = normalized.length === 0 ? [] : data.flat.filter((item) =>
    item.id.toLocaleLowerCase().includes(normalized) || item.label.toLocaleLowerCase().includes(normalized));
  const visible = matches.slice(0, SEARCH_LIMIT);
  return (
    <div data-schema-mode="taxonomy" data-schema-taxonomy>
      <div className="schema-summary" aria-label={copy.taxonomy}><strong>{copy.taxonomy}</strong><span>{data.flat.length.toLocaleString()} {copy.entries}</span><span>{data.maxLevel + 1} {copy.levels}</span></div>
      <label className="schema-search"><span>{copy.search}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} /></label>
      {normalized ? <div className="taxonomy-results" role="list">
        {visible.map((item) => <div className="taxonomy-result" role="listitem" key={`${item.level}:${item.id}:${item.label}`}>
          <code>{item.id}</code><span><strong>{item.label}</strong>{item.parents.length > 0 && <small>{item.parents.join(' / ')}</small>}</span><small>L{item.level}</small>
        </div>)}
        {matches.length === 0 && <p className="schema-notice">{copy.noResults}</p>}
        {matches.length > SEARCH_LIMIT && <p className="schema-notice">{copy.resultLimit}</p>}
      </div> : <>
        <div role="tree" className="taxonomy-tree">{data.roots.slice(0, ROOT_LIMIT).map((item) => <TaxonomyNode item={item} key={`${item.id}:${item.label}`} />)}</div>
        {data.roots.length > ROOT_LIMIT && <p className="schema-notice">{copy.rootLimit}</p>}
      </>}
    </div>
  );
}

export function JsonSchemaViewer({ src, title }: JsonSchemaViewerProps) {
  const { locale } = useI18n();
  const copy = strings[locale as keyof typeof strings] ?? strings.en;
  const [status, setStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [schema, setSchema] = useState<Schema | null>(null);
  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const response = await fetch(src, { headers: { accept: 'application/schema+json, application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const value: unknown = await response.json();
      if (!isSchema(value)) throw new Error('Schema root must be an object');
      setSchema(value);
      setStatus('loaded');
    } catch { setStatus('error'); }
  }, [src]);
  const taxonomy = useMemo(() => schema ? taxonomyFrom(schema) : null, [schema]);
  const filename = src.split('/').at(-1) ?? src;
  return (
    <section className="schema-explorer" aria-label={title ?? filename} data-schema-src={src}>
      <header className="schema-explorer-header"><div><p>{title ?? filename}</p><code>{src}</code></div><a href={src} download>{copy.download}</a></header>
      {status === 'idle' && <button className="schema-load" type="button" onClick={load}>{copy.open}</button>}
      {status === 'loading' && <p className="schema-notice" role="status">{copy.loading}</p>}
      {status === 'error' && <div className="schema-error" role="alert"><p>{copy.error}</p><button type="button" onClick={load}>{copy.retry}</button></div>}
      {status === 'loaded' && schema && (taxonomy ? <TaxonomyViewer data={taxonomy} copy={copy} /> :
        <div data-schema-mode="structure"><div className="schema-summary"><strong>{copy.structure}</strong><span>{typeOf(schema)}</span></div><div role="tree" className="schema-tree"><SchemaNode name={semanticName(schema, '(root)')} node={schema} depth={0} /></div></div>)}
    </section>
  );
}

export default JsonSchemaViewer;
