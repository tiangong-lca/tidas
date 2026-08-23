import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { zhCN } from '@fumadocs/language/zh-cn';
import { uiTranslations } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .preset('zh', zhCN())
  .add({
    zh: {
      displayName: '中文',
    },
    en: {
      displayName: 'English',
    },
    de: {
      displayName: 'Deutsch',
      'On this page(table of contents)': 'Auf dieser Seite',
      'Next Page(pagination)': 'Nächste Seite',
      'Previous Page(pagination)': 'Vorherige Seite',
      'No results found(search dialog)': 'Keine Ergebnisse gefunden',
      'Choose a language(language switcher)': 'Sprache wählen',
      'Back to Home(404 page)': 'Zurück zur Startseite',
      'Page Not Found(404 page)': 'Seite nicht gefunden',
    },
    fr: {
      displayName: 'Français',
      'On this page(table of contents)': 'Sur cette page',
      'Next Page(pagination)': 'Page suivante',
      'Previous Page(pagination)': 'Page précédente',
      'No results found(search dialog)': 'Aucun résultat trouvé',
      'Choose a language(language switcher)': 'Choisir une langue',
      'Back to Home(404 page)': "Retour à l'accueil",
      'Page Not Found(404 page)': 'Page introuvable',
    },
  });

/** 品牌区：浅色主题紫色 logo，深色主题白色 logo */
function brandTitle() {
  return (
    <span className="flex items-center gap-2">
      <img src="/logo-light.svg" alt="TIDAS" width={28} height={28} className="dark:hidden" />
      <img src="/logo-dark.svg" alt="TIDAS" width={28} height={28} className="hidden dark:block" />
    </span>
  );
}

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    nav: {
      title: brandTitle(),
      url: `/${locale}`,
    },
    githubUrl: 'https://github.com/tiangong-lca/tidas',
    links: [
      {
        type: 'main',
        text: locale === 'zh' ? '文档' : 'Documentation',
        url: `/${locale}/docs`,
      },
    ],
  };
}
