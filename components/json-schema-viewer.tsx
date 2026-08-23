'use client';

import { useMemo, useState } from 'react';

export interface JsonSchemaViewerProps {
  /** schema 对象（由调用方 import JSON 传入） */
  schema: unknown;
  /** 根标题 */
  title?: string;
}

/**
 * Docusaurus `docusaurus-json-schema-plugin` 的轻量替代：
 * 以可折叠树 + 类型/约束标签渲染 JSON Schema。
 * 旧插件为运行时懒加载（SSR 只输出 "Loading ...."），此实现为纯静态渲染。
 */
function typeOf(node: Record<string, unknown>): string {
  if (Array.isArray(node.type)) return node.type.join(' | ');
  if (typeof node.type === 'string') return node.type;
  if (node.properties || node.additionalProperties) return 'object';
  if (node.items) return 'array';
  if (node.enum) return 'string';
  if (node.anyOf) return 'anyOf';
  if (node.oneOf) return 'oneOf';
  if (node.allOf) return 'allOf';
  if (node.const !== undefined) return 'const';
  return 'any';
}

function qualifiers(node: Record<string, unknown>): string[] {
  const out: string[] = [];
  if (node.description && typeof node.description === 'string' && node.description.length > 0) out.push(String(node.description).slice(0, 160));
  if (node.required) out.push(`必填: ${(node.required as string[]).join(', ')}`);
  if (node.pattern) out.push(`pattern: ${node.pattern}`);
  if (node.format) out.push(`format: ${node.format}`);
  if (node.minimum !== undefined) out.push(`min: ${node.minimum}`);
  if (node.maximum !== undefined) out.push(`max: ${node.maximum}`);
  if (node.enum) out.push(`enum: ${(node.enum as unknown[]).map((v) => JSON.stringify(v)).join(' | ')}`);
  if (node.default !== undefined) out.push(`default: ${JSON.stringify(node.default)}`);
  return out;
}

function SchemaNode({ name, node, depth, required = false }: {
  name: string;
  node: Record<string, unknown>;
  depth: number;
  required?: boolean;
}) {
  const [open, setOpen] = useState(depth < 1);
  const type = typeOf(node);
  const quals = qualifiers(node);
  const properties = (node.properties ?? {}) as Record<string, Record<string, unknown>>;
  const items = node.items as Record<string, unknown> | undefined;
  const combinators = (node.anyOf ?? node.oneOf ?? node.allOf) as Array<Record<string, unknown>> | undefined;
  const hasChildren = Object.keys(properties).length > 0 || !!items || !!combinators;

  return (
    <div className="my-1 border-l border-fd-border pl-3" style={{ marginLeft: depth > 0 ? undefined : 0 }}>
      <button
        type="button"
        onClick={() => hasChildren && setOpen((v) => !v)}
        className="flex w-full flex-wrap items-baseline gap-2 py-0.5 text-left text-sm"
      >
        {hasChildren ? (
          <span className="inline-block w-4 shrink-0 text-fd-muted-foreground">{open ? '▾' : '▸'}</span>
        ) : (
          <span className="inline-block w-4 shrink-0" />
        )}
        <code className="font-mono text-[13px]">{name}</code>
        {required && <span className="rounded bg-fd-primary/10 px-1 text-[10px] text-fd-primary">required</span>}
        <span className="rounded bg-fd-secondary px-1.5 py-0.5 font-mono text-[11px] text-fd-muted-foreground">{type}</span>
      </button>
      {quals.length > 0 && (
        <ul className="ml-8 list-disc text-xs text-fd-muted-foreground">
          {quals.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      )}
      {open && hasChildren && (
        <div className="ml-4">
          {Object.entries(properties).map(([key, child]) => (
            <SchemaNode
              key={key}
              name={key}
              node={child}
              depth={depth + 1}
              required={Array.isArray(node.required) && (node.required as string[]).includes(key)}
            />
          ))}
          {items && <SchemaNode name="(items)" node={items} depth={depth + 1} />}
          {combinators?.map((child, i) => (
            <SchemaNode key={i} name={`(${type === 'anyOf' ? 'anyOf' : type === 'oneOf' ? 'oneOf' : 'allOf'} ${i + 1})`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function JsonSchemaViewer({ schema, title }: JsonSchemaViewerProps) {
  const root = useMemo(() => {
    if (schema && typeof schema === 'object' && !Array.isArray(schema)) {
      return schema as Record<string, unknown>;
    }
    return {};
  }, [schema]);

  return (
    <div className="my-4 rounded-lg border bg-fd-secondary/30 p-4">
      {title && <p className="mb-2 text-sm font-semibold">{title}</p>}
      <SchemaNode name="(root)" node={root} depth={0} />
    </div>
  );
}

export default JsonSchemaViewer;
