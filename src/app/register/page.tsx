'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, message } from 'antd';
import { FloatingInput } from '@/components/FloatingInput';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      message.success('Đăng ký tài khoản thành công');
      router.push('/login');
    } catch (err) {
      message.error('Đăng ký thất bại');
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
            Create Account
          </h2>
          <p className="text-sm text-[var(--color-muted-fg)] mt-2">Get started with Xantivation CRM workspace.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <FloatingInput
            label="Full Name"
            type="text"
            value={name}
            onChange={setName}
            required
          />

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

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-11 rounded-xl text-sm font-semibold mt-6 cursor-pointer"
          >
            Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-[var(--color-muted-fg)]">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--color-accent)] hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
