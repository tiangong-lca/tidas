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
        <SearchDialogList items={query.data === 'empty' ? [] : query.data} />
        {isAlgolia && (
          <SearchDialogFooter>
            <a
              href="https://algolia.com"
              target="_blank"
              rel="noreferrer noopener"
              className="ms-auto text-xs text-fd-muted-foreground"
            >
              Search powered by Algolia
            </a>
          </SearchDialogFooter>
        )}
      </SearchDialogContent>
    </SearchDialogPrimitive>
  );
}
