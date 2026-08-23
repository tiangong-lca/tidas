import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { zhCN } from '@fumadocs/language/zh-cn';
import { uiTranslations } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';
import { SiteBrand } from '@/components/site-brand';

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

const docsLabel: Record<string, string> = {
  zh: '文档',
  en: 'Documentation',
  de: 'Dokumentation',
  fr: 'Documentation',
};

export function baseOptions(locale: string, homeUrl?: string): BaseLayoutProps {
  return {
    nav: {
      title: <SiteBrand />,
      url: homeUrl ?? `/${locale}`,
      transparentMode: 'top',
    },
    githubUrl: 'https://github.com/tiangong-lca/tidas',
    links: [
      {
        type: 'main',
        text: docsLabel[locale] ?? docsLabel.en,
        url: `/${locale}/docs`,
      },
    ],
  };
}
