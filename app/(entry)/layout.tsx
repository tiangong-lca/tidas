import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import { toHtmlLang } from '@/lib/i18n';
import '@/app/global.css';

export const metadata: Metadata = {
  title: 'TIDAS Documentation',
  description: '天工 LCA 数据系统（TIDAS）文档',
  ...(process.env.DEPLOY_ENV !== 'production'
    ? { robots: { index: false, follow: false } }
    : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={toHtmlLang('en')} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
