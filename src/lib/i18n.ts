'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en/translation.json';
import vi from '@/locales/vi/translation.json';
import ja from '@/locales/ja/translation.json';
import zh from '@/locales/zh/translation.json';

const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('crm-settings-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        const lang = parsed?.state?.locale;
        if (lang && ['en', 'vi', 'ja', 'zh'].includes(lang)) return lang;
      }
    } catch {}
  }
  return 'en';
};

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
    ja: { translation: ja },
    zh: { translation: zh },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
