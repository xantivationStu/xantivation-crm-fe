'use client';

import React, { useState } from 'react';
import { Select, Tag, message, Drawer, Spin, Button } from 'antd';
import { Search, ChevronRight, CreditCard, AlertTriangle, FileText, SlidersHorizontal } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import Link from 'next/link';
import { usePayments, useConfirmPayment } from '@/hooks/api/useContract';

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

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // API Queries & Mutations
  const { data: paymentsRes, isLoading } = usePayments({ limit: 100 });
  const confirmPaymentMutation = useConfirmPayment();

  const rawPayments = paymentsRes?.data?.items || [];

  const paymentsList: PaymentRecord[] = rawPayments.map((p: any) => ({
    id: p.id,
    invoiceNumber: p.invoiceNumber || `INV-${p.id.substring(0, 8).toUpperCase()}`,
    amount: Number(p.amount) || 0,
    dueDate: p.dueDate ? p.dueDate.substring(0, 10) : '',
    paidAt: p.paidAt ? p.paidAt.substring(0, 16).replace('T', ' ') : undefined,
    status: p.status as any,
    milestoneName: p.milestoneName || 'Milestone',
    milestonePercentage: p.milestonePercentage || 0,
    clientName: p.contract?.account?.name || 'Xantivation Client',
    contractTitle: p.contract?.title || 'Service Agreement milestone',
  }));

  const handleSimulatePayment = async (rec: PaymentRecord) => {
    try {
      await confirmPaymentMutation.mutateAsync(rec.id);
    } catch (err) {
      // Handled
    }
  };

  const filteredPayments = paymentsList.filter((p) => {
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
      title: 'Mã Hóa đơn',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (val, rec) => (
        <Link
          href={`/payments/${rec.id}`}
          className="font-mono text-xs font-semibold bg-[var(--color-surface)] px-2.5 py-1 rounded-lg border border-[var(--color-border)] hover:text-[var(--color-accent)] transition-colors"
        >
          {val}
        </Link>
      ),
    },
    {
      title: 'Đợt thanh toán',
      dataIndex: 'milestoneName',
      key: 'milestoneName',
      render: (val, rec) => (
        <div>
          <Link href={`/payments/${rec.id}`} className="font-semibold text-[var(--color-fg)] hover:underline block mb-0.5">
            {val}
          </Link>
          <span className="text-[10px] text-[var(--color-muted-fg)] font-mono">Tỷ lệ: {rec.milestonePercentage}%</span>
        </div>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-mono font-semibold text-xs text-[var(--color-fg)]">
          {amount.toLocaleString('vi-VN')} VND
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'bg-gray-500/10 text-gray-500';
        if (status === 'PAID') color = 'bg-green-500/10 text-green-500';
        if (status === 'PENDING') color = 'bg-amber-500/10 text-amber-600';
        if (status === 'OVERDUE') color = 'bg-red-500/10 text-red-500';
        if (status === 'CANCELLED') color = 'bg-red-900/10 text-red-600';
        return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${color}`}>{status}</span>;
      },
    },
    {
      title: 'Hạn thanh toán',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (val) => <span className="text-xs font-mono text-[var(--color-muted-fg)]">{val || 'N/A'}</span>,
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paidAt',
      key: 'paidAt',
      render: (val) => <span className="text-xs font-mono text-[var(--color-muted-fg)]">{val || '-'}</span>,
    },
    {
      title: 'Thao tác',
      dataIndex: 'id',
      key: 'action',
      render: (_, rec) => (
        <div className="flex items-center gap-2">
          {rec.status === 'PENDING' && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleSimulatePayment(rec)}
              loading={confirmPaymentMutation.isPending}
              className="text-[10px] rounded-lg cursor-pointer"
            >
              Xác nhận
            </Button>
          )}
          <Link
            href={`/payments/${rec.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all cursor-pointer"
          >
            <span>Chi tiết</span>
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
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-fg)]">Hóa đơn & Thanh toán (Payments)</h1>
          <p className="text-sm text-[var(--color-muted-fg)] mt-1">
            Theo dõi dòng tiền thực thu, quản lý công nợ khách hàng và lịch sử thanh toán hóa đơn.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-xl px-3 py-2 w-full md:w-64">
            <Search size={15} className="text-[var(--color-muted-fg)]" />
            <input
              type="text"
              placeholder="Tìm hóa đơn, mốc thanh toán..."
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

          <div className="text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-3 py-2 rounded-xl border border-[var(--color-accent)]/20 font-medium font-mono">
            Auto-generated from Milestones of Signed Contracts
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
              Trạng thái thanh toán
            </label>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              className="w-full h-11"
              options={[
                { value: 'ALL', label: 'Tất cả trạng thái' },
                ...statusOptions,
              ]}
            />
          </div>
        </div>
      </Drawer>

      {isLoading ? (
        <div className="py-24 flex flex-col justify-center items-center gap-3">
          <Spin size="large" />
          <span className="text-xs text-[var(--color-muted-fg)] font-mono">Loading payments list...</span>
        </div>
      ) : (
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
          <SharedTable
            columns={columns}
            dataSource={filteredPayments}
          />
        </div>
      )}
    </div>
  );
}
