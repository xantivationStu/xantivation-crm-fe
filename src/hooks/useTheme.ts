import { useThemeStore } from '@/stores/theme.store';
import { useEffect, useState } from 'react';

export function useTheme() {
  const { themeMode, setThemeMode } = useThemeStore();
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (themeMode === 'auto') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      };
      setResolvedTheme(media.matches ? 'dark' : 'light');
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      setResolvedTheme(themeMode);
    }
  }, [themeMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (resolvedTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  return {
    theme: resolvedTheme,
    themeMode,
    setTheme: setThemeMode,
    isDark: resolvedTheme === 'dark',
  };
}
