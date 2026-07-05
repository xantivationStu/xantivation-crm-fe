'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, FileSignature, Wallet } from 'lucide-react';

const leadData = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 45 },
  { name: 'Mar', value: 60 },
  { name: 'Apr', value: 80 },
  { name: 'May', value: 95 },
  { name: 'Jun', value: 120 },
];

const revenueData = [
  { name: 'Q1', value: 12000 },
  { name: 'Q2', value: 19000 },
  { name: 'Q3', value: 32000 },
  { name: 'Q4', value: 45000 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Editorial Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-muted-fg)]">Real-time sales performance and multi-agent metrics.</p>
      </div>

      {/* Asymmetric Bento Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Large Highlight Card */}
        <div className="md:col-span-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 hover-action flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted-fg)]">Overall Performance</span>
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500"><TrendingUp size={18} /></span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight mt-4 text-[var(--color-fg)]">+$45,231.89</h2>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-[var(--color-success)] font-semibold">
            <span>+12.5%</span>
            <span className="text-[var(--color-muted-fg)] font-normal">compared to last quarter</span>
          </div>
        </div>

        {/* Supporting Metric Card 1 */}
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 hover-action flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted-fg)]">Active Customers</span>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500"><Users size={18} /></span>
            </div>
            <h2 className="text-3xl font-bold mt-4 text-[var(--color-fg)]">1,429</h2>
          </div>
          <div className="text-xs text-[var(--color-muted-fg)] mt-4">
            <span className="text-[var(--color-success)] font-semibold">+4.2%</span> new accounts this week
          </div>
        </div>
      </div>

      {/* Bento Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Supporting Metric Card 2 */}
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 hover-action flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted-fg)]">Signed Contracts</span>
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><FileSignature size={18} /></span>
            </div>
            <h2 className="text-3xl font-bold mt-4 text-[var(--color-fg)]">84 / 120</h2>
          </div>
          <div className="text-xs text-[var(--color-muted-fg)] mt-4">
            <span className="text-[var(--color-success)] font-semibold">70%</span> conversion rate through DocuSign
          </div>
        </div>

        {/* Large Highlight Card 2 */}
        <div className="md:col-span-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 hover-action flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted-fg)]">Outstanding Invoices</span>
              <span className="p-2 rounded-xl bg-red-500/10 text-red-500"><Wallet size={18} /></span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight mt-4 text-[var(--color-fg)]">$12,890.00</h2>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-red-500 font-semibold">
            <span>3 Overdue</span>
            <span className="text-[var(--color-muted-fg)] font-normal">awaiting automatic payment reminders</span>
          </div>
        </div>
      </div>

      {/* Main Charts Bento Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Chart (col-span-2) */}
        <div className="md:col-span-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6">
          <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--color-muted-fg)] mb-6">Leads Growth Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadData}>
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--color-muted-fg)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-fg)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-tint)', borderColor: 'var(--color-border)', borderRadius: '12px', color: 'var(--color-fg)' }} />
                <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#leadGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Analytical Chart (col-span-1) */}
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6">
          <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--color-muted-fg)] mb-6">Quarterly Revenue ($)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="name" stroke="var(--color-muted-fg)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-fg)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-tint)', borderColor: 'var(--color-border)', borderRadius: '12px', color: 'var(--color-fg)' }} />
                <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
