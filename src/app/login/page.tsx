'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, message } from 'antd';
import { FloatingInput } from '@/components/FloatingInput';
import { useTheme } from '@/components/Providers';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const router = useRouter();
  const { theme } = useTheme();
  
  // Use Ant Design's message hook to consume dynamic theme context
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Handled inside useAuth hook
    }
  };

  const logoSrc = theme === 'dark' ? '/White_Logo.png' : '/Black_Logo.png';

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[var(--color-bg)] overflow-hidden relative">
      {/* Context holder for dynamic message API */}
      {contextHolder}

      {/* Background ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--color-accent)]/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/3 blur-3xl pointer-events-none"></div>
      <div className="noise-overlay pointer-events-none z-0"></div>

      {/* LEFT SIDE: Visual Brand Showcase (50% Width on Desktop) */}
      <div className="hidden md:flex w-1/2 flex-col justify-between p-12 lg:p-16 relative select-none border-r border-[var(--color-border)] min-h-screen">
        {/* Subtle grid lines accents */}
        <div className="absolute top-0 bottom-0 left-[25%] w-px bg-[var(--color-border)] opacity-30"></div>
        <div className="absolute top-0 bottom-0 left-[75%] w-px bg-[var(--color-border)] opacity-30"></div>
        <div className="absolute left-0 right-0 top-[35%] h-px bg-[var(--color-border)] opacity-30"></div>
        <div className="absolute left-0 right-0 top-[65%] h-px bg-[var(--color-border)] opacity-30"></div>

        {/* Brand indicator */}
        <div className="flex items-center gap-3 relative z-10">
          <img
            src={logoSrc}
            alt="Xantivation Logo"
            className="h-5.5 object-contain"
          />
          <span className="text-[11px] font-bold tracking-wider text-[var(--color-fg)] uppercase font-sans">
            XANTIVATION STUDIO
          </span>
        </div>

        {/* Centered Large Typographic Title & Real-Time Clock */}
        <div className="my-auto space-y-12 lg:space-y-16 relative z-10 flex flex-col items-center text-center justify-center w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4 lg:space-y-6 flex flex-col items-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-none text-[var(--color-fg)]">
              {t('login.operational')}
              <br />
              <span className="bg-gradient-to-r from-[var(--color-accent)] to-cyan-500 bg-clip-text text-transparent">
                {t('login.intelligence')}
              </span>
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-[var(--color-muted-fg)] max-w-md lg:max-w-lg font-medium leading-relaxed">
              {t('login.heroText')}
            </p>
          </motion.div>

          {/* Elegant clock display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="space-y-2 border-t border-[var(--color-border)] pt-6 px-12"
          >
            <span className="text-[10px] lg:text-xs font-mono tracking-widest text-[var(--color-muted-fg)] block">
              {t('login.stationLocalTime')}
            </span>
            <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-widest text-[var(--color-fg)] font-mono">
              {currentTime || "00:00:00"}
            </span>
          </motion.div>
        </div>

        {/* Empty bottom element to keep flex layout balanced */}
        <div className="h-4"></div>
      </div>

      {/* RIGHT SIDE: Auth Panel (50% Width on Desktop) */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-8 sm:p-16 bg-[var(--color-bg-tint)]/85 backdrop-blur-xl z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-lg md:max-w-xl space-y-10 lg:space-y-12"
        >
          {/* Logo visible on mobile */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="mb-4 md:hidden">
              <img
                src={logoSrc}
                alt="Xantivation Logo"
                className="h-6 object-contain hover:opacity-80 transition-opacity"
              />
            </Link>
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--color-fg)]">
              {t('login.welcomeBack')}
            </h2>
            <p className="text-sm lg:text-base text-[var(--color-muted-fg)] mt-1.5 font-medium">{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 lg:space-y-8">
            <FloatingInput
              label={t('login.emailLabel')}
              type="email"
              value={email}
              onChange={setEmail}
              required
            />

            <FloatingInput
              label={t('login.passwordLabel')}
              type="password"
              value={password}
              onChange={setPassword}
              required
            />

            <div className="flex justify-between items-center text-xs lg:text-sm mt-2">
              <span className="text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] cursor-pointer transition-colors font-medium">
                {t('login.forgotPassword')}
              </span>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="pt-2">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 lg:h-14 rounded-xl text-base lg:text-lg font-semibold mt-4 cursor-pointer"
              >
                {t('login.signIn')}
              </Button>
            </motion.div>
          </form>

          <div className="text-center md:text-left text-xs sm:text-sm lg:text-base text-[var(--color-muted-fg)]">
            {t('login.noAccount')}{' '}
            <Link href="/register" className="text-[var(--color-accent)] hover:underline font-semibold transition-all">
              {t('login.signUp')}
            </Link>
          </div>
        </motion.div>

        {/* Bottom copyright visible on mobile/desktop right side */}
        <div className="absolute bottom-6 left-8 md:left-16 text-[9px] font-mono text-[var(--color-muted-fg)] uppercase">
          © {new Date().getFullYear()} Xantivation Studio
        </div>
      </div>
    </div>
  );
}
