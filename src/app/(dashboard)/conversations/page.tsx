'use client';

import React from 'react';
import { RefreshCw, MessageSquare } from 'lucide-react';

export default function Conversations() {
  const chatwootUrl = process.env.NEXT_PUBLIC_CHATWOOT_IFRAME_URL || 'http://localhost:3100/app/accounts/1/inbox/1';

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">Conversations</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Manage multi-channel client messages via embedded Chatwoot panels.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all cursor-pointer">
          <RefreshCw size={12} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Embedded Panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Left sidebar: Context & Match */}
        <div className="lg:col-span-1 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              CRM Context Matcher
            </h3>

            <div className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] space-y-2">
              <span className="text-[10px] font-mono text-[var(--color-accent)] uppercase font-semibold">Active Sync</span>
              <h4 className="text-sm font-semibold text-[var(--color-fg)]">Zalo / Telegram Inbox</h4>
              <p className="text-xs text-[var(--color-muted-fg)]">Automatic client webhook synchronization is currently active.</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-[var(--color-fg)]">Active Conversations</p>
              <div className="space-y-2">
                <div className="p-3 bg-[var(--color-surface)]/50 rounded-xl border border-[var(--color-border)]/50 text-xs">
                  <p className="font-semibold text-[var(--color-fg)]">Bruce Wayne (CyberCore)</p>
                  <p className="text-[10px] text-[var(--color-muted-fg)] mt-1">Discussing consultancy quotes...</p>
                </div>
                <div className="p-3 bg-[var(--color-surface)]/50 rounded-xl border border-[var(--color-border)]/50 text-xs">
                  <p className="font-semibold text-[var(--color-fg)]">Alice Smith (Acme Corp)</p>
                  <p className="text-[10px] text-[var(--color-muted-fg)] mt-1">BANT qualification complete</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--color-border)]/50 text-[10px] text-[var(--color-muted-fg)] flex items-center gap-1.5">
            <MessageSquare size={12} className="text-[var(--color-accent)]" />
            <span>Chatwoot integration synced</span>
          </div>
        </div>

        {/* Right main panel: Chatwoot dashboard Iframe */}
        <div className="lg:col-span-3 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl overflow-hidden flex flex-col">
          <iframe
            src={chatwootUrl}
            className="w-full flex-1 border-none"
            title="Chatwoot Conversations"
            allow="camera;microphone;clipboard-read;clipboard-write;"
          />
        </div>
      </div>
    </div>
  );
}
