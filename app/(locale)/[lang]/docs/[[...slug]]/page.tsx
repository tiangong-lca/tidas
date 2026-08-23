import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { getMDXComponents } from '@/components/mdx';
import { source } from '@/lib/source';
import { languageAlternates, pageImagePath } from '@/lib/metadata';

export const dynamicParams = false;

export default async function Page(props: PageProps<'/[lang]/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<'/[lang]/docs/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url.endsWith('/') ? page.url : `${page.url}/`,
      languages: languageAlternates(['docs', ...(params.slug ?? [])].join('/')),
    },
    openGraph: {
      type: 'article',
      url: page.url.endsWith('/') ? page.url : `${page.url}/`,
      title: page.data.title,
      description: page.data.description,
      images: [{ url: pageImagePath(params.lang, params.slug ?? []) }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
      images: [pageImagePath(params.lang, params.slug ?? [])],
    },
  };
}
