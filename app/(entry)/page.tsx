import Link from 'next/link';
import { i18n, languageNames } from '@/lib/i18n';

/**
 * 根 `/` 直接渲染静态语言入口（x-default 目标），不做重定向。
 */
export default function LanguageEntryPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">TIDAS</h1>
        <p className="mt-2 text-fd-muted-foreground">
          天工 LCA 数据系统 · TianGong LCA Data System
        </p>
      </div>
      <nav className="grid w-full max-w-xl gap-3 sm:grid-cols-2" aria-label="Language">
        {i18n.languages.map((lang) => (
          <Link
            key={lang}
            href={`/${lang}/`}
            lang={lang}
            className="rounded-lg border p-6 text-center text-lg font-medium transition-colors hover:bg-fd-accent"
          >
            {languageNames[lang]}
          </Link>
        ))}
      </nav>
    </main>
  );
}
