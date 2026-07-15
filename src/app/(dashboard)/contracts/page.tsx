'use client';

import React, { useState } from 'react';
import { Select, Tag, message, Drawer } from 'antd';
import { Search, ChevronRight, PenTool, AlertCircle, FileText, SlidersHorizontal } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import Link from 'next/link';

interface ContractRecord {
  id: string;
  code: string;
  title: string;
  contractValue: number;
  contractType: 'SERVICE_AGREEMENT' | 'NDA' | 'SOW' | 'AMENDMENT';
  signingDeadline?: string;
  docusignEnvelopeId?: string;
  status: 'DRAFT' | 'SENT' | 'SIGNED' | 'EXPIRED' | 'DECLINED' | 'VOIDED';
  signedAt?: string;
  dealId: string;
  dealName: string;
  companyName: string;
}

const mockContracts: ContractRecord[] = [
  {
    id: '1',
    code: 'HĐ-2026-00001',
    title: 'Service Agreement - Xantivation Dev - CRM Integration Deal',
    contractValue: 209000000,
    contractType: 'SERVICE_AGREEMENT',
    signingDeadline: '2026-08-01',
    docusignEnvelopeId: 'env-90df-8b21-4432',
    status: 'SIGNED',
    signedAt: '2026-07-05 14:32',
    dealId: '1',
    dealName: 'CRM Integration Deal',
    companyName: 'Xantivation Dev',
  },
  {
    id: '2',
    code: 'HĐ-2026-00002',
    title: 'Service Agreement - CyberCore LLC - Brand Strategy Deal',
    contractValue: 82500000,
    contractType: 'SERVICE_AGREEMENT',
    signingDeadline: '2026-08-15',
    docusignEnvelopeId: 'env-12ef-34ac-789a',
    status: 'SENT',
    dealId: '2',
    dealName: 'CyberCore Brand Strategy Deal',
    companyName: 'CyberCore LLC',
  },
];

const typeOptions = [
  { value: 'SERVICE_AGREEMENT', label: 'Service Agreement' },
  { value: 'NDA', label: 'NDA' },
  { value: 'SOW', label: 'SOW' },
  { value: 'AMENDMENT', label: 'Amendment' },
];

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'SIGNED', label: 'Signed' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'VOIDED', label: 'Voided' },
];

export default function Contracts() {
  const [contracts, setContracts] = useState<ContractRecord[]>(mockContracts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const handleDocuSignSign = (rec: ContractRecord) => {
    message.loading(`Connecting to DocuSign Envelope: ${rec.docusignEnvelopeId}...`);
    setTimeout(() => {
      setContracts(
        contracts.map((c) =>
          c.id === rec.id
            ? {
                ...c,
                status: 'SIGNED',
                signedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              }
            : c
        )
      );
      message.success('Contract signed successfully via DocuSign Connect Webhook.');
    }, 1500);
  };

  const filteredContracts = contracts.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesType = filterType === 'ALL' || c.contractType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const columns: ColumnProps<ContractRecord>[] = [
    {
      title: 'Contract Code',
      dataIndex: 'code',
      key: 'code',
      render: (val, rec) => (
        <Link
          href={`/contracts/${rec.id}`}
          className="font-mono text-xs font-semibold bg-[var(--color-surface)] px-2.5 py-1 rounded-lg border border-[var(--color-border)] hover:text-[var(--color-accent)] transition-colors"
        >
          {val}
        </Link>
      ),
    },
    {
      title: 'Title & Client',
      dataIndex: 'title',
      key: 'title',
      render: (val, rec) => (
        <div>
          <Link href={`/contracts/${rec.id}`} className="font-semibold text-[var(--color-fg)] hover:underline block mb-0.5 max-w-sm truncate">
            {val}
          </Link>
          <span className="text-[10px] text-[var(--color-muted-fg)]">{rec.companyName}</span>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'contractType',
      key: 'contractType',
      render: (val) => {
        let typeText = 'Service Agreement';
        if (val === 'NDA') typeText = 'NDA';
        if (val === 'SOW') typeText = 'SOW';
        if (val === 'AMENDMENT') typeText = 'Amendment';
        return (
          <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-fg)]">
            {typeText}
          </span>
        );
      },
    },
    {
      title: 'Value',
      dataIndex: 'contractValue',
      key: 'contractValue',
      render: (val: number) => (
        <span className="font-mono font-semibold text-xs text-[var(--color-fg)]">
          {val.toLocaleString('vi-VN')} VND
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'bg-gray-500/10 text-gray-500';
        if (status === 'SIGNED') color = 'bg-green-500/10 text-green-500';
        if (status === 'SENT') color = 'bg-blue-500/10 text-blue-500';
        if (status === 'DECLINED') color = 'bg-red-500/10 text-red-500';
        if (status === 'VOIDED') color = 'bg-red-900/10 text-red-600';
        if (status === 'EXPIRED') color = 'bg-amber-500/10 text-amber-600';
        return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${color}`}>{status}</span>;
      },
    },
    {
      title: 'Deadline',
      dataIndex: 'signingDeadline',
      key: 'signingDeadline',
      render: (val) => <span className="text-xs font-mono text-[var(--color-muted-fg)]">{val || 'N/A'}</span>,
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'actions',
      render: (_, rec) => (
        <div className="flex items-center gap-2">
          {rec.status === 'SENT' && (
            <button
              onClick={() => handleDocuSignSign(rec)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white transition-all cursor-pointer"
            >
              <PenTool size={12} />
              <span>Sign</span>
            </button>
          )}
          <Link
            href={`/contracts/${rec.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all cursor-pointer"
          >
            <span>Manage</span>
            <ChevronRight size={12} />
          </Link>
        </div>
      ),
    },
  ];

  const activeFiltersCount =
    (filterStatus !== 'ALL' ? 1 : 0) + (filterType !== 'ALL' ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-fg)]">Contracts</h1>
          <p className="text-sm text-[var(--color-muted-fg)] mt-1">
            Manage electronic signature envelopes, track real-time DocuSign updates, and sign agreements.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-xl px-3 py-2 w-full md:w-64">
            <Search size={15} className="text-[var(--color-muted-fg)]" />
            <input
              type="text"
              placeholder="Search contracts..."
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
            Auto-created from Closed Won Deals
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
                onClick={() => {
                  setFilterStatus('ALL');
                  setFilterType('ALL');
                }}
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
              Contract Type
            </label>
            <Select
              value={filterType}
              onChange={setFilterType}
              className="w-full h-11"
              options={[
                { value: 'ALL', label: 'All Types' },
                ...typeOptions,
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Contract Status
            </label>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              className="w-full h-11"
              options={[
                { value: 'ALL', label: 'All Statuses' },
                ...statusOptions,
              ]}
            />
          </div>
        </div>
      </Drawer>

      {/* Unified Table Container Canvas */}
      <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
        <SharedTable
          columns={columns}
          dataSource={filteredContracts}
          onDelete={(rec) => {
            setContracts(contracts.filter((c) => c.id !== rec.id));
            message.success('Contract deleted successfully');
          }}
        />
      </div>
    </div>
  );
}
