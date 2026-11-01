export interface TaxonomyEntry {
  id: string;
  level: number;
  label: string;
}

export interface TaxonomyItem extends TaxonomyEntry {
  key: string;
  parents: string[];
  children: TaxonomyItem[];
}

/** Interpret explicit numeric dot paths without imposing that scheme on other vocabularies. */
export function buildTaxonomy(entries: readonly TaxonomyEntry[]): {
  roots: TaxonomyItem[];
  flat: TaxonomyItem[];
  maxLevel: number;
} {
  const dotted = entries.every(({ id, level }) =>
    /^\d+(?:\.\d+)*$/.test(id) && id.split('.').length - 1 === level);
  const flat: TaxonomyItem[] = entries.map((entry, index) => ({
    ...entry,
    key: `${entry.level}:${entry.id}:${index}`,
    parents: [],
    children: [],
  }));
  const uniqueIds = new Map<string, TaxonomyItem | null>();
  if (dotted) {
    for (const item of flat) uniqueIds.set(item.id, uniqueIds.has(item.id) ? null : item);
  }

  const roots: TaxonomyItem[] = [];
  const stack: TaxonomyItem[] = [];
  let maxLevel = 0;
  for (const item of flat) {
    let parent: TaxonomyItem | null | undefined;
    if (item.level > 0) {
      parent = dotted
        ? uniqueIds.get(item.id.slice(0, item.id.lastIndexOf('.')))
        : stack[item.level - 1];
    }
    if (parent && parent.level === item.level - 1) parent.children.push(item);
    else roots.push(item);
    if (!dotted) {
      stack.splice(item.level);
      stack[item.level] = item;
    }
    maxLevel = Math.max(maxLevel, item.level);
  }

  // Assign ancestry after linking so a child can precede its explicit parent in the input.
  const pending = roots.map((item) => ({ item, parent: null as TaxonomyItem | null }));
  for (let index = 0; index < pending.length; index++) {
    const { item, parent } = pending[index];
    item.key = `${parent?.key ?? 'root'}/${item.key}`;
    item.parents = parent ? [...parent.parents, parent.label] : [];
    for (const child of item.children) pending.push({ item: child, parent: item });
  }
  return { roots, flat, maxLevel };
}
