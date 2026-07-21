'use client';

import React, { useEffect } from 'react';
import i18n from '@/lib/i18n';
import { useSettingsStore } from '@/stores/settings.store';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useSettingsStore((state) => state.locale);

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale || 'en';
  }, [locale]);

  return <>{children}</>;
}
