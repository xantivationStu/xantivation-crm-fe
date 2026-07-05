'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, message } from 'antd';
import { FloatingInput } from '@/components/FloatingInput';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Temporary client bypass for demo
      message.success('Đăng nhập thành công');
      router.push('/dashboard');
    } catch (err) {
      message.error('Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      {/* Background soft glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--color-accent)]/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-3xl p-8 shadow-sm relative z-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-accent)] to-cyan-500 bg-clip-text text-transparent inline-block">
            Xantivation CRM
          </h2>
          <p className="text-sm text-[var(--color-muted-fg)] mt-2">Sign in to manage your sales pipeline.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <FloatingInput
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />

          <FloatingInput
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
          />

          <div className="flex justify-between items-center text-xs mt-2">
            <span className="text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] cursor-pointer">
              Forgot password?
            </span>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-11 rounded-xl text-sm font-semibold mt-4 cursor-pointer"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-[var(--color-muted-fg)]">
          Don't have an account?{' '}
          <Link href="/register" className="text-[var(--color-accent)] hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
