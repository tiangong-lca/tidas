import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';
import { isCategoryIndex } from '@/lib/ia';
import { i18n } from '@/lib/i18n';

export const revalidate = false;

const ORIGIN = process.env.CANONICAL_ORIGIN ?? 'https://tidas.tiangong.earth';
const SECTION_TITLES: Record<string, string> = {
  zh: 'Chinese (zh)',
  en: 'English (en)',
  de: 'Deutsch (de)',
  fr: 'Français (fr)',
};

/**
 * llms.txt 暴露构建 commit（post-deploy 回读契约），只列真实公开正文与首页。
 */
export function GET() {
  const commit = process.env.SOURCE_COMMIT ?? 'unknown';
  const lines: string[] = [
    '# TIDAS Documentation',
    '',
    'Public documentation index for the TianGong LCA Data System (TIDAS), integrators, and AI retrieval systems.',
    '',
    `Source site: ${ORIGIN}`,
    'Source repository: https://github.com/tiangong-lca/tidas',
    `Source commit: ${commit}`,
    'Publication scope: public docs only (zh/en full pages, de/fr reviewed pages); internal records excluded.',
  ];

  for (const lang of i18n.languages) {
    const pages = source
      .getPages(lang)
      .filter((page) => !isCategoryIndex(page.slugs));
    if (pages.length === 0) continue;

    lines.push('', `## ${SECTION_TITLES[lang] ?? lang}`, '');
    for (const page of pages) {
      const url = `${ORIGIN}${page.url}${page.url.endsWith('/') ? '' : '/'}`;
      const title = page.data.title;
      const desc = (page.data.description ?? title).replace(/\s+/g, ' ').trim();
      const truncated = desc.length > 160 ? `${desc.slice(0, 157)}...` : desc;
      lines.push(`- [${title}](${url}) - ${truncated}`);
    }
  }

  return new Response(`${lines.join('\n')}\n`);
}
