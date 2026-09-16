import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { getMDXComponents } from '@/components/mdx';
import { availableLocales, source } from '@/lib/source';
import {
  breadcrumbJsonLd,
  breadcrumbTrail,
  languageAlternates,
  localeMetadata,
  pageDescription,
  pageImagePath,
  withTrailingSlash,
} from '@/lib/metadata';

export const dynamicParams = false;

export default async function Page(props: PageProps<'/[lang]/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const slugs = params.slug ?? [];
  // Crumbs come from resolved pages only; a folder that has no page of its own is skipped rather
  // than linked to a URL that would 404.
  const trail = breadcrumbTrail(params.lang, slugs, (ancestors, lang) => {
    const found = source.getPage(ancestors.length > 0 ? ancestors : undefined, lang);
    return found ? { title: found.data.title, url: found.url } : undefined;
  });
  const jsonLd = breadcrumbJsonLd(trail);

  return (
    <DocsPage toc={page.data.toc}>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
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
  const locale = localeMetadata[params.lang] ?? localeMetadata.en;
  const slugs = params.slug ?? [];
  const canonical = withTrailingSlash(page.url);
  // Authored frontmatter first, else a summary derived from this page's own structured content.
  // A page with neither stays unresolved: no page-specific description is published, so Next keeps
  // the layout's site-level description and the URL is reported as content debt by `verify:out`.
  const structuredData =
    typeof page.data.structuredData === 'function' ? undefined : page.data.structuredData;
  const summary = pageDescription({ description: page.data.description, structuredData });
  const descriptionFields = summary.description ? { description: summary.description } : {};
  const alternateLocale = Object.entries(localeMetadata)
    .filter(([language]) => language !== params.lang)
    .map(([, metadata]) => metadata.openGraphLocale);

  return {
    title: page.data.title,
    ...descriptionFields,
    alternates: {
      canonical,
      languages: languageAlternates(['docs', ...slugs].join('/'), availableLocales(slugs)),
    },
    openGraph: {
      type: 'article',
      siteName: 'TIDAS — TianGong Data System',
      url: canonical,
      title: page.data.title,
      ...descriptionFields,
      locale: locale.openGraphLocale,
      alternateLocale,
      images: [{ url: pageImagePath(params.lang, slugs) }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      ...descriptionFields,
      images: [pageImagePath(params.lang, slugs)],
    },
  };
}
