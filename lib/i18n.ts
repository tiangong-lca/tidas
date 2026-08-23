import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'zh',
  languages: ['zh', 'en', 'de', 'fr'],
  hideLocale: 'never',
  fallbackLanguage: null,
});

export const languageNames: Record<string, string> = {
  zh: '中文',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
};

export function toHtmlLang(lang: string): string {
  return lang === 'zh' ? 'zh-CN' : lang;
}
