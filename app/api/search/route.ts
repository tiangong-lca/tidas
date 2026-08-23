import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const revalidate = false;

// zero config: the default `multilingual` mode works for every language
export const { staticGET: GET } = createFromSource(source);
