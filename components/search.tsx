'use client';

import { liteClient } from 'algoliasearch/lite';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { algoliaClient } from 'fumadocs-core/search/client/algolia';
import { staticClient } from 'fumadocs-core/search/client/orama-static';
import {
  SearchDialog as SearchDialogPrimitive,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useMemo } from 'react';

/**
 * v4 §6.2/§7.2：SEARCH_MODE 构建期烘焙。
 * - static（ci/preview）：浏览器本地静态搜索（staticClient 抓 /api/search 静态索引）
 * - algolia（production）：algoliaClient + tag=locale 过滤
 *
 * 两种模式统一走自定义对话框原语：归属链接放在 SearchDialogContent 内部
 * （预建 AlgoliaSearchDialog 的 footer 渲染在对话框外的普通 div 上，
 * 关闭状态下会常驻页面左上角——已弃用该组件）。
 */
const SEARCH_MODE = process.env.NEXT_PUBLIC_SEARCH_MODE ?? 'static';
const RESULT_LIMIT = 50;
const searchCopy: Record<string, { prompt: string; limited: (count: number) => string }> = {
  zh: { prompt: '输入关键词，搜索标题、章节与正文。', limited: (count) => `共 ${count} 条结果，仅显示前 ${RESULT_LIMIT} 条。` },
  en: { prompt: 'Search titles, sections, and page content.', limited: (count) => `${count} results; showing the first ${RESULT_LIMIT}.` },
  de: { prompt: 'Titel, Abschnitte und Seiteninhalte durchsuchen.', limited: (count) => `${count} Treffer; die ersten ${RESULT_LIMIT} werden angezeigt.` },
  fr: { prompt: 'Recherchez dans les titres, sections et contenus.', limited: (count) => `${count} résultats ; les ${RESULT_LIMIT} premiers sont affichés.` },
};

export default function SearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const isAlgolia = SEARCH_MODE === 'algolia';

  // client 必须记忆化：每次渲染新建实例会触发 useDocsSearch 无限重渲染
  const client = useMemo(
    () =>
      isAlgolia
        ? algoliaClient({
            indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? 'tiangong-lca-docs',
            client: liteClient(
              process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
              process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? '',
            ),
            // v4 §7.2：locale 不自动形成 Algolia filter，必须用 tag
            tag: locale,
          })
        : staticClient({ locale }),
    [isAlgolia, locale],
  );

  const { search, setSearch, query } = useDocsSearch({ client });
  const copy = searchCopy[locale ?? 'en'] ?? searchCopy.en;
  const items = Array.isArray(query.data) ? query.data : [];
  const visibleItems = items.slice(0, RESULT_LIMIT);

  return (
    <SearchDialogPrimitive
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        {search.trim().length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-fd-muted-foreground">{copy.prompt}</p>
        ) : (
          <SearchDialogList items={visibleItems} />
        )}
        {(isAlgolia || items.length > RESULT_LIMIT) && (
          <SearchDialogFooter>
            {items.length > RESULT_LIMIT && <span className="text-xs text-fd-muted-foreground">{copy.limited(items.length)}</span>}
            {isAlgolia && (
              <a href="https://algolia.com" target="_blank" rel="noreferrer noopener" className="ms-auto text-xs text-fd-muted-foreground">
                Search powered by Algolia
              </a>
            )}
          </SearchDialogFooter>
        )}
      </SearchDialogContent>
    </SearchDialogPrimitive>
  );
}
