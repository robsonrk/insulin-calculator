import { useI18n } from 'vue-i18n';
import Cookies from 'js-cookie';

const LANGUAGE_COOKIE_NAME = 'preferred_language';
const DEFAULT_LANGUAGE = 'pt-BR';

export const supportedLanguages = {
  'pt-BR': 'Português (BR)',
  en: 'English',
  ja: '日本語',
};

export function getBrowserLanguage(): string {
  const browserLang = navigator.language || (navigator as any).userLanguage;
  const lang = browserLang.split('-')[0];
  
  // Verifica se o idioma do navegador é suportado
  if (lang in supportedLanguages) {
    return lang;
  }
  
  // Verifica se há uma versão específica do idioma (ex: pt-BR)
  if (browserLang in supportedLanguages) {
    return browserLang;
  }
  
  return DEFAULT_LANGUAGE;
}

export function getSavedLanguage(): string {
  return Cookies.get(LANGUAGE_COOKIE_NAME) || getBrowserLanguage();
}

export function saveLanguage(lang: string): void {
  Cookies.set(LANGUAGE_COOKIE_NAME, lang, { expires: 365 });
}

export function setupLanguage(): void {
  const savedLang = getSavedLanguage();
  const { locale } = useI18n();
  locale.value = savedLang;
} 