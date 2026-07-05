'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserPlus,
  Building2,
  TrendingUp,
  FileText,
  Handshake,
  FileSignature,
  CreditCard,
  MessageSquare,
  BrainCircuit,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const sidebarGroups = [
  {
    title: 'Sales Operations',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Leads', path: '/leads', icon: UserPlus },
      { name: 'Customers', path: '/customers', icon: Building2 },
      { name: 'Opportunities', path: '/opportunities', icon: TrendingUp },
    ],
  },
  {
    title: 'Billing & Documents',
    items: [
      { name: 'Quotations', path: '/quotations', icon: FileText },
      { name: 'Deals', path: '/deals', icon: Handshake },
      { name: 'Contracts', path: '/contracts', icon: FileSignature },
      { name: 'Payments', path: '/payments', icon: CreditCard },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { name: 'Conversations', path: '/conversations', icon: MessageSquare },
      { name: 'AI Hub', path: '/ai-hub', icon: BrainCircuit },
      { name: 'Reports', path: '/reports', icon: BarChart3 },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`h-screen sticky top-0 left-0 bg-[var(--color-bg-tint)] border-r border-[var(--color-border)] flex flex-col justify-between transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-6">
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 mb-8">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-accent)] to-cyan-500 bg-clip-text text-transparent">
                Xantivation
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-colors duration-200 cursor-pointer"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-6 px-4">
          {sidebarGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              {!collapsed && (
                <h3 className="px-3 text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  {group.title}
                </h3>
              )}
              <div className="space-y-0.5">
                {group.items.map((item, iIdx) => {
                  const isActive = pathname ? pathname.startsWith(item.path) : false;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={iIdx}
                      href={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-[var(--color-accent)] text-white shadow-sm'
                          : 'text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface)]'
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold font-mono">
            XS
          </div>
          {!collapsed && (
            <div className="truncate">
              <p className="text-xs font-semibold text-[var(--color-fg)]">Xantivation Studio</p>
              <p className="text-[10px] text-[var(--color-muted-fg)]">CRM v1.0</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
