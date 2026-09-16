import { DocsHome } from '@/components/docs-home';
import { defaultLanguage, locales } from '@/lib/metadata';

/**
 * The default language's home is `/`; `/zh` and `/zh/` are permanent redirects to it (edgeone.json),
 * so no `/{lang}/` home is generated for the default language.
 */
export function generateStaticParams() {
  return locales
    .filter((lang) => lang !== defaultLanguage)
    .map((lang) => ({ lang }));
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  return <DocsHome lang={lang} />;
}
