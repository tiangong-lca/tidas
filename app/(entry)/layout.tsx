import type { Metadata } from 'next';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { Provider } from '@/components/provider';
import { toHtmlLang } from '@/lib/i18n';
import { baiduVerificationMetadata, languageAlternates, localeMetadata, pageImagePath, siteOrigin } from '@/lib/metadata';
import { translations } from '@/lib/layout.shared';
import '@/app/global.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: localeMetadata.zh.title,
  description: localeMetadata.zh.description,
  alternates: {
    canonical: '/',
    languages: languageAlternates(),
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'TIDAS — TianGong Data System',
    title: localeMetadata.zh.title,
    description: localeMetadata.zh.description,
    locale: localeMetadata.zh.openGraphLocale,
    images: [{ url: pageImagePath('zh', []) }],
  },
  twitter: {
    card: 'summary_large_image',
    title: localeMetadata.zh.title,
    description: localeMetadata.zh.description,
    images: [pageImagePath('zh', [])],
  },
  ...(process.env.DEPLOY_ENV !== 'production'
    ? { robots: { index: false, follow: false } }
    : {}),
  // Optional search-console ownership marker; supplied by the build environment, never hardcoded.
  ...baiduVerificationMetadata(),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={toHtmlLang('zh')} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider i18n={i18nProvider(translations, 'zh')}>{children}</Provider>
      </body>
    </html>
  );
}
