import { createHash } from 'node:crypto';
import { source } from '@/lib/source';
import { i18n } from '@/lib/i18n';
import { isCategoryIndex } from '@/lib/ia';

export const revalidate = false;

const SCHEMA_VERSION = 1;

/**
 * 构建产物搜索记录：sourceCommit/digest 契约，post-deploy reconcile 以此为唯一数据源。
 */
export function GET() {
  const records: Array<Record<string, unknown>> = [];
  const countsByLocale: Record<string, number> = {};

  for (const lang of i18n.languages) {
    const pages = source.getPages(lang).filter((page) => !isCategoryIndex(page.slugs));
    countsByLocale[lang] = pages.length;

    for (const page of pages) {
      records.push({
        _id: page.url,
        title: page.data.title,
        description: page.data.description ?? null,
        structured: page.data.structuredData,
        url: page.url,
        tag: lang,
        locale: lang,
        extra_data: {
          sourceCommit: process.env.SOURCE_COMMIT ?? null,
        },
      });
    }
  }

  const digest = createHash('sha256').update(JSON.stringify(records)).digest('hex');
  const epoch = Number(process.env.SOURCE_DATE_EPOCH ?? 0);

  return Response.json(
    {
      schemaVersion: SCHEMA_VERSION,
      sourceCommit: process.env.SOURCE_COMMIT ?? null,
      generatedAt: epoch > 0 ? new Date(epoch * 1000).toISOString() : null,
      count: records.length,
      countsByLocale,
      digest: `sha256:${digest}`,
      records,
    },
    { headers: { 'cache-control': 'public, max-age=0, must-revalidate' } },
  );
}
