import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { VideoEmbed } from '@/components/video-embed';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    VideoEmbed,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
