'use client';

import React, { useState } from 'react';
import { Select, Tag, message, Drawer } from 'antd';
import { Search, ChevronRight, CreditCard, AlertTriangle, FileText, SlidersHorizontal } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import Link from 'next/link';

interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paidAt?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  milestoneName: string;
  milestonePercentage: number;
  clientName: string;
  contractTitle: string;
}

const mockPayments: PaymentRecord[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2026-00001',
    amount: 104500000,
    dueDate: '2026-07-05',
    paidAt: '2026-07-05 15:00',
    status: 'PAID',
    milestoneName: 'Deposit Payment',
    milestonePercentage: 50,
    clientName: 'Xantivation Dev',
    contractTitle: 'Service Agreement - Xantivation Dev - CRM Integration Deal',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2026-00002',
    amount: 104500000,
    dueDate: '2026-08-05',
    status: 'PENDING',
    milestoneName: 'Final Delivery',
    milestonePercentage: 50,
    clientName: 'Xantivation Dev',
    contractTitle: 'Service Agreement - Xantivation Dev - CRM Integration Deal',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2026-00003',
    amount: 82500000,
    dueDate: '2026-08-15',
    status: 'OVERDUE',
    milestoneName: 'Advance payment',
    milestonePercentage: 100,
    clientName: 'CyberCore LLC',
    contractTitle: 'Service Agreement - CyberCore LLC - Brand Strategy Deal',
  },
];

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function Payments() {
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const handleSimulatePayment = (rec: PaymentRecord) => {
    message.loading(`Processing payment for invoice ${rec.invoiceNumber}...`);
    setTimeout(() => {
      setPayments(
        payments.map((p) =>
          p.id === rec.id
            ? {
                ...p,
                status: 'PAID',
                paidAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
              }
            : p
        )
      );
      message.success(`Invoice ${rec.invoiceNumber} paid successfully.`);
    }, 1500);
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.milestoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contractTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns: ColumnProps<PaymentRecord>[] = [
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (val, rec) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/payments/${rec.id}`}
            className="font-mono text-xs font-semibold bg-[var(--color-surface)] px-2.5 py-1 rounded-lg border border-[var(--color-border)] hover:text-[var(--color-accent)] transition-colors"
          >
            {val}
          </Link>
          {rec.status === 'OVERDUE' && (
            <span className="text-[10px] text-red-500 font-semibold inline-flex items-center gap-0.5">
              <AlertTriangle size={10} /> Overdue
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Billing Milestone',
      dataIndex: 'milestoneName',
      key: 'milestoneName',
      render: (val, rec) => (
        <div>
          <span className="text-xs font-semibold block">{val}</span>
          <span className="text-[10px] font-mono text-[var(--color-muted-fg)]">{rec.milestonePercentage}% of contract</span>
        </div>
      ),
    },
    {
      title: 'Client & Contract',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (val, rec) => (
        <div>
          <p className="font-semibold text-[var(--color-fg)]">{val}</p>
          <p className="text-xs text-[var(--color-muted-fg)] max-w-xs truncate">{rec.contractTitle}</p>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
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
        if (status === 'PAID') color = 'bg-green-500/10 text-green-500';
        if (status === 'PENDING') color = 'bg-blue-500/10 text-blue-500';
        if (status === 'OVERDUE') color = 'bg-red-500/10 text-red-500';
        if (status === 'CANCELLED') color = 'bg-red-900/10 text-red-600';
        return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${color}`}>{status}</span>;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (val) => <span className="font-mono text-xs text-[var(--color-muted-fg)]">{val}</span>,
    },
    {
      title: 'Paid At',
      dataIndex: 'paidAt',
      key: 'paidAt',
      render: (val) => <span className="font-mono text-xs text-[var(--color-muted-fg)]">{val || '-'}</span>,
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      key: 'actions',
      render: (_, rec) => (
        <div className="flex items-center gap-2">
          {(rec.status === 'PENDING' || rec.status === 'OVERDUE') && (
            <button
              onClick={() => handleSimulatePayment(rec)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white transition-all cursor-pointer"
            >
              <CreditCard size={12} />
              <span>Pay</span>
            </button>
          )}
          <Link
            href={`/payments/${rec.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all cursor-pointer"
          >
            <span>Manage</span>
            <ChevronRight size={12} />
          </Link>
        </div>
      ),
    },
  ];

  const activeFiltersCount = filterStatus !== 'ALL' ? 1 : 0;

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-fg)]">Payments</h1>
          <p className="text-sm text-[var(--color-muted-fg)] mt-1">
            Manage invoicing schedules, track due dates, and process customer payments.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-xl px-3 py-2 w-full md:w-64">
            <Search size={15} className="text-[var(--color-muted-fg)]" />
            <input
              type="text"
              placeholder="Search payments..."
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
            Auto-created from Contract Milestones
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
                onClick={() => setFilterStatus('ALL')}
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
              Payment Status
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
          dataSource={filteredPayments}
          onDelete={(rec) => {
            setPayments(payments.filter((p) => p.id !== rec.id));
            message.success('Payment term deleted successfully');
          }}
        />
      </div>
    </div>
  );
}
