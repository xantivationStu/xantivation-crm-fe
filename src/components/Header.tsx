'use client';

import React from 'react';
import { useTheme } from './Providers';
import { Sun, Moon, Laptop, Bell, Search, LogOut, User } from 'lucide-react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

export default function Header() {
  const { theme, setTheme } = useTheme();

  const themeMenu: MenuProps['items'] = [
    {
      key: 'light',
      label: 'Light Mode',
      icon: <Sun size={14} />,
      onClick: () => setTheme('light'),
    },
    {
      key: 'dark',
      label: 'Dark Mode',
      icon: <Moon size={14} />,
      onClick: () => setTheme('dark'),
    },
    {
      key: 'auto',
      label: 'Auto / System',
      icon: <Laptop size={14} />,
      onClick: () => setTheme('auto'),
    },
  ];

  const userMenu: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'My Profile',
      icon: <User size={14} />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogOut size={14} />,
      danger: true,
    },
  ];

  return (
    <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-bg-tint)] px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Search Bar */}
      <div className="relative w-80">
        <span className="absolute left-3 top-2.5 text-[var(--color-muted-fg)]">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search Leads, Customers..."
          className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-1.5 pl-10 pr-4 text-sm text-[var(--color-fg)] placeholder-[var(--color-muted-fg)] focus:outline-none focus:border-[var(--color-accent)] transition-all duration-200"
        />
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-4">
        {/* Theme Select */}
        <Dropdown menu={{ items: themeMenu }} trigger={['click']}>
          <button className="p-2 rounded-xl hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all duration-200 cursor-pointer">
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </Dropdown>

        {/* Notifications */}
        <button className="p-2 rounded-xl hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all duration-200 relative cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--color-border)]"></div>

        {/* User Account */}
        <Dropdown menu={{ items: userMenu }} trigger={['click']}>
          <div className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-[var(--color-surface)] rounded-xl transition-all duration-200">
            <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold font-mono">
              SA
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-[var(--color-fg)] leading-tight">System Admin</p>
              <p className="text-[10px] text-[var(--color-muted-fg)] leading-none">ADMIN</p>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
