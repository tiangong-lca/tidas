import { DocsHome } from '@/components/docs-home';
import { locales } from '@/lib/metadata';

/** Every locale has an explicit home; the Chinese duplicate keeps canonical `/`. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  return <DocsHome lang={lang} />;
}
