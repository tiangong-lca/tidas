import type { Metadata } from 'next';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { Provider } from '@/components/provider';
import { translations } from '@/lib/layout.shared';
import { i18n, toHtmlLang } from '@/lib/i18n';
import { languageAlternates, localeMetadata, siteOrigin } from '@/lib/metadata';
import '@/app/global.css';

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  const copy = localeMetadata[lang] ?? localeMetadata.en;

  return {
    metadataBase: new URL(siteOrigin),
    title: {
      default: copy.title,
      template: `%s | TIDAS`,
    },
    description: copy.description,
    alternates: {
      canonical: `/${lang}/`,
      languages: languageAlternates(),
    },
    openGraph: {
      type: 'website',
      url: `/${lang}/`,
      siteName: 'TIDAS Data Specification',
      title: copy.title,
      description: copy.description,
      locale: copy.openGraphLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title: copy.title,
      description: copy.description,
    },
    ...(process.env.DEPLOY_ENV !== 'production'
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  return (
    <html lang={toHtmlLang(lang)} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider i18n={i18nProvider(translations, lang)}>{children}</Provider>
      </body>
    </html>
  );
}
