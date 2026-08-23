'use client';

import type { CSSProperties } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { useI18n } from 'fumadocs-ui/contexts/i18n';

type Schema = Record<string, unknown>;

export interface JsonSchemaViewerProps {
  /** Public URL to a JSON Schema. It is fetched only after the reader opens the explorer. */
  src: string;
  title?: string;
}

interface TaxonomyItem {
  id: string;
  key: string;
  level: number;
  label: string;
  parents: string[];
  children: TaxonomyItem[];
}

interface SchemaCopy {
  open: string;
  loading: string;
  retry: string;
  download: string;
  error: string;
  search: string;
  taxonomy: string;
  entries: string;
  levels: string;
  resultLimit: string;
  rootLimit: string;
  noResults: string;
  structure: string;
  categoryName: string;
  categoryId: string;
  childCount: string;
  field: string;
  type: string;
  constraints: string;
  expand: (label: string) => string;
  collapse: (label: string) => string;
  results: (count: number) => string;
}

interface SchemaRow {
  key: string;
  name: string;
  node: Schema;
  depth: number;
  required: boolean;
  expandable: boolean;
  details: Array<{ key: string; value: string }>;
}

const SEARCH_LIMIT = 50;
const ROOT_LIMIT = 50;

const strings: Record<string, SchemaCopy> = {
  zh: {
    open: '打开 Schema 浏览器', loading: '正在读取 Schema…', retry: '重试', download: '下载原始 JSON Schema',
    error: '无法读取 Schema。请检查网络连接或下载原始文件。', search: '搜索名称或分类 ID', taxonomy: '分类目录',
    entries: '个分类', levels: '层级', resultLimit: `最多显示 ${SEARCH_LIMIT} 个结果，请输入更精确的关键词。`,
    rootLimit: `根分类超过 ${ROOT_LIMIT} 个，请使用搜索定位其余分类。`, noResults: '没有匹配的分类。', structure: 'Schema 结构',
    categoryName: '分类名称', categoryId: 'ID', childCount: '子类', field: '字段', type: '类型', constraints: '约束',
    expand: (label) => `展开 ${label}`, collapse: (label) => `收起 ${label}`, results: (count) => `找到 ${count} 个分类`,
  },
  en: {
    open: 'Open schema explorer', loading: 'Loading schema…', retry: 'Retry', download: 'Download raw JSON Schema',
    error: 'The schema could not be loaded. Check the connection or download the raw file.', search: 'Search by name or category ID',
    taxonomy: 'Taxonomy', entries: 'entries', levels: 'levels',
    resultLimit: `Only the first ${SEARCH_LIMIT} matches are shown. Refine your search to narrow the list.`,
    rootLimit: `More than ${ROOT_LIMIT} root entries exist. Use search to find the rest.`, noResults: 'No matching categories.', structure: 'Schema structure',
    categoryName: 'Category', categoryId: 'ID', childCount: 'Children', field: 'Field', type: 'Type', constraints: 'Constraints',
    expand: (label) => `Expand ${label}`, collapse: (label) => `Collapse ${label}`, results: (count) => `${count} categories found`,
  },
  de: {
    open: 'Schema-Explorer öffnen', loading: 'Schema wird geladen…', retry: 'Erneut versuchen', download: 'JSON Schema herunterladen',
    error: 'Das Schema konnte nicht geladen werden. Prüfen Sie die Verbindung oder laden Sie die Rohdatei herunter.',
    search: 'Nach Name oder Kategorie-ID suchen', taxonomy: 'Klassifikation', entries: 'Einträge', levels: 'Ebenen',
    resultLimit: `Es werden höchstens ${SEARCH_LIMIT} Treffer angezeigt. Präzisieren Sie die Suche.`,
    rootLimit: `Es gibt mehr als ${ROOT_LIMIT} Wurzeleinträge. Verwenden Sie die Suche.`, noResults: 'Keine passenden Kategorien.', structure: 'Schema-Struktur',
    categoryName: 'Kategorie', categoryId: 'ID', childCount: 'Untergruppen', field: 'Feld', type: 'Typ', constraints: 'Regeln',
    expand: (label) => `${label} erweitern`, collapse: (label) => `${label} reduzieren`, results: (count) => `${count} Kategorien gefunden`,
  },
  fr: {
    open: 'Ouvrir l’explorateur de schéma', loading: 'Chargement du schéma…', retry: 'Réessayer', download: 'Télécharger le JSON Schema',
    error: 'Impossible de charger le schéma. Vérifiez la connexion ou téléchargez le fichier brut.',
    search: 'Rechercher par nom ou identifiant', taxonomy: 'Taxonomie', entries: 'entrées', levels: 'niveaux',
    resultLimit: `Seuls les ${SEARCH_LIMIT} premiers résultats sont affichés. Affinez la recherche.`,
    rootLimit: `Plus de ${ROOT_LIMIT} entrées racines existent. Utilisez la recherche.`, noResults: 'Aucune catégorie correspondante.', structure: 'Structure du schéma',
    categoryName: 'Catégorie', categoryId: 'ID', childCount: 'Sous-catégories', field: 'Champ', type: 'Type', constraints: 'Contraintes',
    expand: (label) => `Développer ${label}`, collapse: (label) => `Réduire ${label}`, results: (count) => `${count} catégories trouvées`,
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
  for (const key of [
    'pattern', 'format', 'minLength', 'maxLength',
    'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'multipleOf',
    'minItems', 'maxItems', 'uniqueItems', 'additionalItems',
    'minProperties', 'maxProperties', 'minContains', 'maxContains',
    'default', 'deprecated', 'readOnly', 'writeOnly',
  ] as const) {
    if (node[key] !== undefined) result.push({ key, value: typeof node[key] === 'string' ? node[key] : JSON.stringify(node[key]) });
  }
  for (const key of ['additionalProperties', 'unevaluatedProperties', 'unevaluatedItems'] as const) {
    if (typeof node[key] === 'boolean') result.push({ key, value: String(node[key]) });
  }
  for (const group of ['dependencies', 'dependentRequired'] as const) {
    if (!isSchema(node[group])) continue;
    for (const [name, dependency] of Object.entries(node[group])) {
      if (Array.isArray(dependency)) result.push({ key: `${group}.${name}`, value: dependency.map(String).join(', ') });
    }
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

  for (const keyword of ['if', 'then', 'else', 'not', 'contains', 'propertyNames', 'unevaluatedProperties', 'unevaluatedItems'] as const) {
    if (isSchema(node[keyword])) children.push({ name: keyword, node: node[keyword] });
  }

  for (const group of ['$defs', 'definitions', 'patternProperties', 'dependencies', 'dependentSchemas'] as const) {
    if (!isSchema(node[group])) continue;
    for (const [name, child] of Object.entries(node[group])) if (isSchema(child)) children.push({ name: `${group}.${name}`, node: child });
  }
  if (isSchema(node.additionalProperties)) children.push({ name: 'additionalProperties', node: node.additionalProperties });
  return children;
}

function taxonomyFrom(schema: Schema): { roots: TaxonomyItem[]; flat: TaxonomyItem[]; maxLevel: number } | null {
  if (!Array.isArray(schema.oneOf) || schema.oneOf.length === 0) return null;
  const raw: Array<{ id: string; level: number; label: string }> = [];
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
  for (const [index, entry] of raw.entries()) {
    const parent = entry.level > 0 ? stack[entry.level - 1] : undefined;
    const item: TaxonomyItem = {
      ...entry,
      key: `${parent?.key ?? 'root'}/${entry.level}:${entry.id}:${index}`,
      parents: parent ? [...parent.parents, parent.label] : [],
      children: [],
    };
    if (parent) parent.children.push(item); else roots.push(item);
    stack.splice(entry.level);
    stack[entry.level] = item;
    flat.push(item);
    maxLevel = Math.max(maxLevel, entry.level);
  }
  return { roots, flat, maxLevel };
}

function Chevron() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 16 16">
      <path d="m6 3 5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function flattenTaxonomy(roots: TaxonomyItem[], expanded: Set<string>): TaxonomyItem[] {
  const rows: TaxonomyItem[] = [];
  const visit = (item: TaxonomyItem) => {
    rows.push(item);
    if (expanded.has(item.key)) item.children.forEach(visit);
  };
  roots.slice(0, ROOT_LIMIT).forEach(visit);
  return rows;
}

function TaxonomyTable({
  rows,
  copy,
  expanded,
  onToggle,
  searchMode = false,
}: {
  rows: TaxonomyItem[];
  copy: SchemaCopy;
  expanded: Set<string>;
  onToggle: (key: string) => void;
  searchMode?: boolean;
}) {
  return (
    <div className="schema-table-frame">
      <table className="schema-data-table taxonomy-table">
        <caption className="sr-only">{copy.taxonomy}</caption>
        <colgroup>
          <col />
          <col className="taxonomy-id-column" />
          <col className="taxonomy-children-column" />
        </colgroup>
        <thead>
          <tr><th scope="col">{copy.categoryName}</th><th scope="col">{copy.categoryId}</th><th scope="col">{copy.childCount}</th></tr>
        </thead>
        <tbody>
          {rows.map((item) => {
            const expandable = !searchMode && item.children.length > 0;
            const open = expanded.has(item.key);
            const depth = searchMode ? 0 : item.level;
            return (
              <tr data-taxonomy-row data-taxonomy-level={item.level} data-taxonomy-search-result={searchMode || undefined} key={item.key}>
                <th scope="row">
                  <div className="taxonomy-name" style={{ '--taxonomy-depth': depth } as CSSProperties}>
                    {expandable ? (
                      <button
                        aria-expanded={open}
                        aria-label={open ? copy.collapse(item.label) : copy.expand(item.label)}
                        className="taxonomy-toggle"
                        onClick={() => onToggle(item.key)}
                        type="button"
                      >
                        <Chevron />
                      </button>
                    ) : <span aria-hidden="true" className="taxonomy-toggle-spacer" />}
                    <span className="taxonomy-label-wrap">
                      <span className="taxonomy-label" data-taxonomy-label>{item.label}</span>
                      {searchMode && item.parents.length > 0 && <small className="taxonomy-path">{item.parents.join(' / ')}</small>}
                    </span>
                  </div>
                </th>
                <td><code className="taxonomy-id" data-taxonomy-id>{item.id}</code></td>
                <td className="taxonomy-child-count">{item.children.length || '—'}</td>
              </tr>
            );
          })}
          {rows.length === 0 && <tr><td className="schema-empty-cell" colSpan={3}>{copy.noResults}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function TaxonomyViewer({ data, copy }: { data: NonNullable<ReturnType<typeof taxonomyFrom>>; copy: SchemaCopy }) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const normalized = query.trim().toLocaleLowerCase();
  const matches = useMemo(() => normalized.length === 0 ? [] : data.flat.filter((item) =>
    item.id.toLocaleLowerCase().includes(normalized) || item.label.toLocaleLowerCase().includes(normalized)), [data.flat, normalized]);
  const visibleSearchResults = matches.slice(0, SEARCH_LIMIT);
  const visibleTreeRows = useMemo(() => flattenTaxonomy(data.roots, expanded), [data.roots, expanded]);
  const toggle = useCallback((key: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  return (
    <div data-schema-mode="taxonomy" data-schema-taxonomy>
      <div className="schema-summary" aria-label={copy.taxonomy}>
        <strong>{copy.taxonomy}</strong>
        <span>{data.flat.length.toLocaleString()} {copy.entries}</span>
        <span>{data.maxLevel + 1} {copy.levels}</span>
      </div>
      <label className="schema-search">
        <span>{copy.search}</span>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} />
      </label>
      <p className="sr-only" role="status" aria-live="polite">{normalized ? copy.results(matches.length) : ''}</p>
      {normalized ? (
        <>
          <TaxonomyTable copy={copy} expanded={expanded} onToggle={toggle} rows={visibleSearchResults} searchMode />
          {matches.length > SEARCH_LIMIT && <p className="schema-notice">{copy.resultLimit}</p>}
        </>
      ) : (
        <>
          <TaxonomyTable copy={copy} expanded={expanded} onToggle={toggle} rows={visibleTreeRows} />
          {data.roots.length > ROOT_LIMIT && <p className="schema-notice">{copy.rootLimit}</p>}
        </>
      )}
    </div>
  );
}

function flattenSchemaRows(
  name: string,
  node: Schema,
  expanded: Set<string>,
  key = 'root',
  depth = 0,
  required = false,
  rows: SchemaRow[] = [],
): SchemaRow[] {
  const children = childSchemas(node);
  rows.push({ key, name, node, depth, required, expandable: children.length > 0, details: qualifiers(node) });
  if (expanded.has(key)) {
    children.forEach((child, index) => flattenSchemaRows(
      child.name,
      child.node,
      expanded,
      `${key}/${index}:${child.name}`,
      depth + 1,
      child.required ?? false,
      rows,
    ));
  }
  return rows;
}

function SchemaStructureViewer({ schema, copy }: { schema: Schema; copy: SchemaCopy }) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['root']));
  const rows = useMemo(
    () => flattenSchemaRows(semanticName(schema, '(root)'), schema, expanded),
    [expanded, schema],
  );
  const toggle = useCallback((key: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  return (
    <div data-schema-mode="structure">
      <div className="schema-summary"><strong>{copy.structure}</strong><span>{typeOf(schema)}</span></div>
      <div className="schema-table-frame">
        <table className="schema-data-table schema-structure-table">
          <caption className="sr-only">{copy.structure}</caption>
          <colgroup><col className="schema-field-column" /><col className="schema-type-column" /><col /></colgroup>
          <thead><tr><th scope="col">{copy.field}</th><th scope="col">{copy.type}</th><th scope="col">{copy.constraints}</th></tr></thead>
          <tbody>
            {rows.map((row) => {
              const open = expanded.has(row.key);
              return (
                <tr data-schema-row key={row.key}>
                  <th scope="row">
                    <div className="schema-field" style={{ '--schema-depth': row.depth } as CSSProperties}>
                      {row.expandable ? (
                        <button
                          aria-expanded={open}
                          aria-label={open ? copy.collapse(row.name) : copy.expand(row.name)}
                          className="schema-row-toggle"
                          onClick={() => toggle(row.key)}
                          type="button"
                        >
                          <Chevron />
                        </button>
                      ) : <span aria-hidden="true" className="schema-toggle-spacer" />}
                      <span className="schema-field-name">
                        <code>{row.name}</code>
                        {row.required && <span className="schema-required">required</span>}
                      </span>
                    </div>
                  </th>
                  <td><span className="schema-type">{typeOf(row.node)}</span></td>
                  <td>
                    {row.details.length > 0 ? (
                      <span className="schema-constraint-list">
                        {row.details.map((detail) => <span key={`${detail.key}:${detail.value}`}><code>{detail.key}</code>{detail.value}</span>)}
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function JsonSchemaViewer({ src, title }: JsonSchemaViewerProps) {
  const { locale } = useI18n();
  const copy = strings[locale ?? 'en'] ?? strings.en;
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
    } catch {
      setStatus('error');
    }
  }, [src]);
  const taxonomy = useMemo(() => schema ? taxonomyFrom(schema) : null, [schema]);
  const filename = src.split('/').at(-1) ?? src;

  return (
    <section className="schema-explorer not-prose" aria-label={title ?? filename} data-schema-src={src}>
      <header className="schema-explorer-header">
        <div><p>{title ?? filename}</p><code>{src}</code></div>
        <a className={`${buttonVariants({ variant: 'outline', size: 'sm' })} schema-action`} href={src} download>{copy.download}</a>
      </header>
      {status === 'idle' && <button className={`${buttonVariants({ variant: 'primary' })} schema-action schema-load`} type="button" onClick={load}>{copy.open}</button>}
      {status === 'loading' && <p className="schema-notice" role="status">{copy.loading}</p>}
      {status === 'error' && (
        <div className="schema-error" role="alert">
          <p>{copy.error}</p>
          <button className={`${buttonVariants({ variant: 'primary', size: 'sm' })} schema-action`} type="button" onClick={load}>{copy.retry}</button>
        </div>
      )}
      {status === 'loaded' && schema && (
        taxonomy ? <TaxonomyViewer data={taxonomy} copy={copy} /> : <SchemaStructureViewer schema={schema} copy={copy} />
      )}
    </section>
  );
}

export default JsonSchemaViewer;
