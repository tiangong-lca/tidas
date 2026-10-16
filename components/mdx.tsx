import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { AnchorHTMLAttributes } from 'react';
import { CategoryDirectory } from '@/components/category-directory';
import { DocsPortal } from '@/components/docs-portal';
import { SchemaInventorySummary } from '@/components/schema-inventory-summary';
import { VideoEmbed } from '@/components/video-embed';
import { DataRelationshipsDiagram } from '@/components/data-relationships-diagram';

function DocumentLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  // These are static files, not App Router pages with RSC prefetch payloads.
  if (/^\/(?:schemas|spec)\/.+\.(?:json|ya?ml)(?:[?#].*)?$/.test(props.href ?? '')) {
    return <a {...props} />;
  }
  return <defaultMdxComponents.a {...props} />;
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    a: DocumentLink,
    CategoryDirectory,
    DocsPortal,
    SchemaInventorySummary,
    VideoEmbed,
    DataRelationshipsDiagram,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
