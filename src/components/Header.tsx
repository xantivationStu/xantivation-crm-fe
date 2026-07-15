'use client';

import React from 'react';
import { useTheme } from './Providers';
import { Sun, Moon, Laptop, Bell, Search, LogOut, User } from 'lucide-react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import MagneticButton from './MagneticButton';

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
    <header className="h-16 mt-4 mr-4 ml-4 lg:ml-2 rounded-2xl glass-panel px-6 flex items-center justify-between sticky top-4 z-40 shadow-sm">
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
      <div className="flex items-center gap-3">
        {/* Theme Select */}
        <Dropdown menu={{ items: themeMenu }} trigger={['click']}>
          <div>
            <MagneticButton range={30}>
              <button className="p-2 rounded-xl hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all duration-200 cursor-pointer">
                {theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
              </button>
            </MagneticButton>
          </div>
        </Dropdown>

        {/* Notifications */}
        <MagneticButton range={30}>
          <button className="p-2 rounded-xl hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all duration-200 relative cursor-pointer">
            <Bell size={17} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500"></span>
          </button>
        </MagneticButton>

        {/* Divider */}
        <div className="w-px h-5 bg-[var(--color-border)]"></div>

        {/* User Account */}
        <Dropdown menu={{ items: userMenu }} trigger={['click']}>
          <div>
            <MagneticButton range={40}>
              <div className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-[var(--color-surface)] transition-all duration-200">
                <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold font-mono shadow-sm">
                  SA
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-semibold text-[var(--color-fg)] leading-tight">System Admin</p>
                  <p className="text-[9px] text-[var(--color-muted-fg)] leading-none uppercase tracking-wider">ADMIN</p>
                </div>
              </div>
            </MagneticButton>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
