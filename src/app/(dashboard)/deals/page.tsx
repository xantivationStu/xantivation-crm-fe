'use client';

import React, { useState } from 'react';
import { Select, Tag, message, Drawer } from 'antd';
import { Search, ChevronRight, CheckCircle2, ShieldCheck, XCircle, AlertCircle, FileText, SlidersHorizontal } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import Link from 'next/link';

interface DealRecord {
  id: string;
  code: string;
  name: string;
  amount: number;
  stage: 'DRAFT' | 'INTERNAL_REVIEW' | 'CUSTOMER_REVIEW' | 'CLOSED_WON' | 'CLOSED_LOST';
  expectedStart?: string;
  paymentTerms?: string;
  timeline?: string;
  milestonesCount: number;
  opportunityName: string;
  companyName: string;
}

const mockDeals: DealRecord[] = [
  {
    id: '1',
    code: 'DEAL-2026-00001',
    name: 'CRM Integration Deal',
    amount: 209000000,
    stage: 'DRAFT',
    expectedStart: '2026-09-30',
    paymentTerms: '50% upfront, 50% on final delivery',
    timeline: '4-6 weeks after contract signing',
    milestonesCount: 0,
    opportunityName: 'CRM Integration Contract',
    companyName: 'Xantivation Dev',
  },
  {
    id: '2',
    code: 'DEAL-2026-00002',
    name: 'CyberCore Brand Strategy Deal',
    amount: 82500000,
    stage: 'CLOSED_WON',
    expectedStart: '2026-08-15',
    paymentTerms: '100% advance payment',
    timeline: '3 weeks',
    milestonesCount: 1,
    opportunityName: 'Brand Identity Redesign',
    companyName: 'CyberCore LLC',
  },
];

const stageOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'INTERNAL_REVIEW', label: 'Internal Review' },
  { value: 'CUSTOMER_REVIEW', label: 'Customer Review' },
  { value: 'CLOSED_WON', label: 'Closed Won' },
  { value: 'CLOSED_LOST', label: 'Closed Lost' },
];

export default function Deals() {
  const [deals, setDeals] = useState<DealRecord[]>(mockDeals);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('ALL');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const filteredDeals = deals.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === 'ALL' || d.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const columns: ColumnProps<DealRecord>[] = [
    {
      title: 'Deal Code',
      dataIndex: 'code',
      key: 'code',
      render: (val, rec) => (
        <Link
          href={`/deals/${rec.id}`}
          className="font-mono text-xs font-semibold bg-[var(--color-surface)] px-2.5 py-1 rounded-lg border border-[var(--color-border)] hover:text-[var(--color-accent)] transition-colors"
        >
          {val}
        </Link>
      ),
    },
    {
      title: 'Project Name & Client',
      dataIndex: 'name',
      key: 'name',
      render: (val, rec) => (
        <div>
          <Link href={`/deals/${rec.id}`} className="font-semibold text-[var(--color-fg)] hover:underline block mb-0.5">
            {val}
          </Link>
          <span className="text-[10px] text-[var(--color-muted-fg)]">{rec.companyName}</span>
        </div>
      ),
    },
    {
      title: 'Deal Value',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-mono font-semibold text-xs text-[var(--color-fg)]">
          {amount.toLocaleString('vi-VN')} VND
        </span>
      ),
    },
    {
      title: 'Status Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => {
        let color = 'bg-gray-500/10 text-gray-500';
        if (stage === 'CLOSED_WON') color = 'bg-green-500/10 text-green-500';
        if (stage === 'CLOSED_LOST') color = 'bg-red-500/10 text-red-500';
        if (stage === 'INTERNAL_REVIEW') color = 'bg-amber-500/10 text-amber-600';
        if (stage === 'CUSTOMER_REVIEW') color = 'bg-blue-500/10 text-blue-500';
        return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${color}`}>{stage}</span>;
      },
    },
    {
      title: 'Expected Start',
      dataIndex: 'expectedStart',
      key: 'expectedStart',
      render: (val) => <span className="text-xs font-mono text-[var(--color-muted-fg)]">{val || 'N/A'}</span>,
    },
    {
      title: 'Milestones Count',
      dataIndex: 'milestonesCount',
      key: 'milestonesCount',
      render: (count: number) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-fg)] font-mono">
          {count} milestones
        </span>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'action',
      render: (_, rec) => (
        <Link
          href={`/deals/${rec.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all cursor-pointer"
        >
          <span>Manage</span>
          <ChevronRight size={12} />
        </Link>
      ),
    },
  ];

  const activeFiltersCount = filterStage !== 'ALL' ? 1 : 0;

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-fg)]">Deals</h1>
          <p className="text-sm text-[var(--color-muted-fg)] mt-1">
            Manage deal progression stages, specify payment milestones distribution, and generate contracts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-xl px-3 py-2 w-full md:w-64">
            <Search size={15} className="text-[var(--color-muted-fg)]" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-[var(--color-fg)] placeholder-[var(--color-muted-fg)] w-full"
            />
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className={`flex items-center gap-2 h-10 px-3.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              activeFiltersCount > 0
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-[var(--color-accent)]'
                : 'border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4.5 h-4.5 rounded-full bg-[var(--color-accent)] text-white text-[9px] flex items-center justify-center font-bold animate-pulse">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-3 py-2 rounded-xl border border-[var(--color-accent)]/20 font-medium">
            Auto-created from Accepted Quotations
          </div>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between w-full pr-4">
            <span className="text-base font-bold text-[var(--color-fg)]">Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <button
                onClick={() => setFilterStage('ALL')}
                className="text-[11px] font-semibold text-[var(--color-accent)] hover:underline cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        }
        placement="right"
        width={360}
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        styles={{
          body: {
            background: 'var(--color-bg)',
            color: 'var(--color-fg)',
          },
          header: {
            background: 'var(--color-bg)',
            borderBottom: '1px solid var(--color-border)',
          }
        }}
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Deal Stage
            </label>
            <Select
              value={filterStage}
              onChange={setFilterStage}
              className="w-full h-11"
              options={[
                { value: 'ALL', label: 'All Stages' },
                ...stageOptions,
              ]}
            />
          </div>
        </div>
      </Drawer>

      {/* Unified Table Container Canvas */}
      <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
        <SharedTable
          columns={columns}
          dataSource={filteredDeals}
          onDelete={(rec) => {
            setDeals(deals.filter((d) => d.id !== rec.id));
            message.success('Deal deleted successfully');
          }}
        />
      </div>
    </div>
  );
}
