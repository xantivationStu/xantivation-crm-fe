'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './Providers';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
import MagneticButton from './MagneticButton';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const sidebarGroups = [
    {
      title: t('sidebar.salesOperations'),
      items: [
        { name: t('sidebar.dashboard'), path: '/dashboard', icon: LayoutDashboard },
        { name: t('sidebar.leads'), path: '/leads', icon: UserPlus },
        { name: t('sidebar.customers'), path: '/customers', icon: Building2 },
        { name: t('sidebar.opportunities'), path: '/opportunities', icon: TrendingUp },
      ],
    },
    {
      title: t('sidebar.billingDocuments'),
      items: [
        { name: t('sidebar.quotations'), path: '/quotations', icon: FileText },
        { name: t('sidebar.deals'), path: '/deals', icon: Handshake },
        { name: t('sidebar.contracts'), path: '/contracts', icon: FileSignature },
        { name: t('sidebar.payments'), path: '/payments', icon: CreditCard },
      ],
    },
    {
      title: t('sidebar.intelligence'),
      items: [
        { name: t('sidebar.conversations'), path: '/conversations', icon: MessageSquare },
        { name: t('sidebar.aiHub'), path: '/ai-hub', icon: BrainCircuit },
        { name: t('sidebar.reports'), path: '/reports', icon: BarChart3 },
        { name: t('sidebar.settings'), path: '/settings', icon: Settings },
      ],
    },
  ];

  // Choose logo version based on light/dark mode
  const logoSrc = theme === 'dark' ? '/White_Logo.png' : '/Black_Logo.png';

  return (
    <aside
      className={`h-[calc(100vh-2rem)] my-4 ml-4 sticky top-4 left-0 bg-[var(--color-bg-tint)] border border-[var(--color-border)] shadow-sm rounded-3xl flex flex-col justify-between transition-[width] duration-300 ease-in-out z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-6">
        {/* Logo Section */}
        <div className={`flex items-center transition-all duration-300 mb-8 ${collapsed ? 'justify-center px-0' : 'px-5 gap-3'}`}>
          <Link href="/" className="flex items-center justify-center shrink-0">
            <img
              src={logoSrc}
              alt="Xantivation Logo"
              className={`transition-all duration-300 object-contain ${
                collapsed ? 'h-7 w-7' : 'h-6'
              }`}
            />
          </Link>
          <span
            className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap text-[11px] font-bold tracking-wider text-[var(--color-fg)] uppercase font-sans ${
              collapsed ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-[150px] opacity-100'
            }`}
          >
            XANTIVATION STUDIO
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-6 px-3">
          {sidebarGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <h3
                className={`px-3 text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
                  collapsed ? 'max-h-0 opacity-0 mb-0' : 'max-h-8 opacity-70 mb-1.5'
                }`}
              >
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item, iIdx) => {
                  const isActive = pathname ? pathname.startsWith(item.path) : false;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={iIdx}
                      href={item.path}
                      className="block relative group/item"
                    >
                      <motion.div
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        className={`flex items-center rounded-xl text-sm font-medium transition-all duration-300 w-full py-2.5 relative z-10 ${
                          collapsed ? 'justify-center px-0' : 'px-3'
                        } ${
                          isActive
                            ? 'bg-[var(--color-accent)] text-white shadow-sm'
                            : 'text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface)]'
                        }`}
                      >
                        <Icon size={18} className="shrink-0" />
                        <span
                          className={`transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap text-xs font-semibold ${
                            collapsed ? 'max-w-0 opacity-0 pointer-events-none ml-0' : 'max-w-[150px] opacity-100 ml-3'
                          }`}
                        >
                          {item.name}
                        </span>
                        {isActive && (
                          <span
                            className={`absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse transition-opacity duration-300 ${
                              collapsed ? 'opacity-0' : 'opacity-100'
                            }`}
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Collapse Button Section */}
      <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-center">
        <MagneticButton range={40}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-10 h-10 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] flex items-center justify-center transition-colors duration-200 cursor-pointer"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </MagneticButton>
      </div>
    </aside>
  );
}
