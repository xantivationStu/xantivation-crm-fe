'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const themeContext = createContext<{
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}>({
  theme: 'light',
  setTheme: () => {},
});

export const useTheme = () => useContext(themeContext);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [rawTheme, setRawTheme] = useState<'light' | 'dark' | 'auto'>('auto');

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'light' | 'dark' | 'auto') || 'auto';
    setRawTheme(saved);
  }, []);

  useEffect(() => {
    if (rawTheme === 'auto') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        setActiveTheme(e.matches ? 'dark' : 'light');
      };
      setActiveTheme(media.matches ? 'dark' : 'light');
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      setActiveTheme(rawTheme);
    }
  }, [rawTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (activeTheme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
  }, [activeTheme]);

  const changeTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setRawTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <themeContext.Provider value={{ theme: activeTheme, setTheme: changeTheme }}>
      <QueryClientProvider client={queryClient}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              algorithm: activeTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
              token: {
                colorPrimary: '#4F46E5',
                borderRadius: 12,
                colorBgContainer: activeTheme === 'dark' ? '#1c1c1f' : '#fcfcfd',
                colorBorder: activeTheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </QueryClientProvider>
    </themeContext.Provider>
  );
}
