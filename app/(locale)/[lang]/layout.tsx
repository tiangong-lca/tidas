import type { Metadata } from 'next';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { Provider } from '@/components/provider';
import { translations } from '@/lib/layout.shared';
import { i18n, toHtmlLang } from '@/lib/i18n';
import '@/app/global.css';

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: {
    default: 'TIDAS',
    template: '%s | TIDAS',
  },
  ...(process.env.DEPLOY_ENV !== 'production'
    ? { robots: { index: false, follow: false } }
    : {}),
};

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
