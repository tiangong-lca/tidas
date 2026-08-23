/**
 * tidas docs 分类语义（与迁移决策单一来源）。
 * 分类首页默认 llms:false / search:false。
 */
export const categoryBases: readonly string[] = [
  'core-modules',
  'core-modules/schema',
  'core-modules/schema/schema-content',
  'tool',
  'integration',
  'platform',
  'use-case',
  'faq',
];

export function isCategoryIndex(slugs: string[]): boolean {
  return categoryBases.includes(slugs.join('/'));
}
