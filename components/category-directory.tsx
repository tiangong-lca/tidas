import { findPath, flattenTree, type Folder, type Node } from 'fumadocs-core/page-tree';
import { Card, Cards } from 'fumadocs-ui/components/card';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';

type Language = 'zh' | 'en' | 'de' | 'fr';

const copy: Record<Language, { heading: string; fallback: (title: string) => string }> = {
  zh: { heading: '本节内容', fallback: (title) => `打开“${title}”的指南与参考内容。` },
  en: { heading: 'In this section', fallback: (title) => `Open the guides and references for ${title}.` },
  de: { heading: 'In diesem Abschnitt', fallback: (title) => `Leitfäden und Referenzen zu ${title} öffnen.` },
  fr: { heading: 'Dans cette section', fallback: (title) => `Ouvrir les guides et références pour ${title}.` },
};

function normalizedUrl(value: string) {
  return value.endsWith('/') ? value : `${value}/`;
}

function label(value: ReactNode, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function firstPage(node: Node) {
  if (node.type === 'page') return node;
  if (node.type === 'folder') return node.index ?? flattenTree(node.children)[0];
  return undefined;
}

function findCategoryFolder(language: Language, categoryPath: string): Folder | undefined {
  const tree = source.getPageTree(language);
  const categoryUrl = normalizedUrl(`/${language}/docs/${categoryPath}`);
  const path = findPath(
    tree.children,
    (node) => node.type === 'folder' && node.index !== undefined && normalizedUrl(node.index.url) === categoryUrl,
  );

  return path?.findLast((node): node is Folder => node.type === 'folder' && normalizedUrl(node.index?.url ?? '') === categoryUrl);
}

function slugsForUrl(language: Language, url: string) {
  const prefix = `/${language}/docs/`;
  if (!url.startsWith(prefix)) return [];
  return url.slice(prefix.length).split('/').filter(Boolean);
}

export function CategoryDirectory({ lang, path }: { lang: string; path: string }) {
  const language: Language = lang in copy ? (lang as Language) : 'en';
  const content = copy[language];
  const folder = findCategoryFolder(language, path);
  const entries = (folder?.children ?? []).flatMap((node) => {
    const page = firstPage(node);
    if (!page || page.external) return [];
    const data = source.getPage(slugsForUrl(language, page.url), language)?.data;
    const title = label(node.name, data?.title ?? page.url);

    return [{
      description: data?.description?.trim() || content.fallback(title),
      title,
      url: normalizedUrl(page.url),
    }];
  });

  if (!folder || entries.length === 0) return null;

  return (
    <section className="not-prose mt-8" data-category-directory={path}>
      <h2 className="mb-4 text-xl font-semibold tracking-[-0.02em]">{content.heading}</h2>
      <Cards className="grid-cols-2 gap-3 max-[40rem]:grid-cols-1">
        {entries.map((entry) => (
          <Card
            className="rounded-[2px] border-fd-border bg-fd-card text-inherit transition-colors duration-100 hover:border-fd-primary hover:bg-fd-accent"
            description={entry.description}
            href={entry.url}
            key={entry.url}
            title={entry.title}
          />
        ))}
      </Cards>
    </section>
  );
}
