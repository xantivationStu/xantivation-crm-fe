'use client';

import React, { useState, use } from 'react';
import { Button, message, Table, Spin } from 'antd';
import { ArrowLeft, Download, Eye, Send, FileText, CheckCircle2, History, Copy, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useQuotation, useCloneQuotation, useUpdateQuotationStatus } from '@/hooks/api/useQuotation';

interface QuotationItemRecord {
  itemName: string;
  description?: string;
  fixedPrice: number;
  estimatedEffort?: string;
  deliverables?: string;
}

export default function QuotationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeSubTab, setActiveSubTab] = useState('overview');

  // API Queries
  const { data: quotationRes, isLoading } = useQuotation(id);

  // API Mutations
  const cloneMutation = useCloneQuotation();
  const statusMutation = useUpdateQuotationStatus();

  const q = quotationRes?.data;

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col justify-center items-center gap-3">
        <Spin size="large" />
        <span className="text-xs text-[var(--color-muted-fg)] font-mono">Loading quotation details...</span>
      </div>
    );
  }

  if (!q) {
    return <div className="p-8 text-center text-red-500 font-bold">Quotation not found</div>;
  }

  const handleUpdateStatus = async (status: string) => {
    try {
      await statusMutation.mutateAsync({ id: q.id, status });
    } catch (err) {
      // Handled
    }
  };

  const handleCloneVersion = async () => {
    try {
      await cloneMutation.mutateAsync(q.id);
    } catch (err) {
      // Handled
    }
  };

  const itemColumns = [
    {
      title: 'Hạng mục',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (val: string, rec: any) => (
        <div>
          <p className="font-semibold text-xs text-[var(--color-fg)]">{val}</p>
          <p className="text-[10px] text-[var(--color-muted-fg)]">{rec.description}</p>
        </div>
      )
    },
    {
      title: 'Chi tiết bàn giao',
      dataIndex: 'deliverables',
      key: 'deliverables',
      render: (val: string) => <span className="text-xs font-mono text-[var(--color-muted-fg)]">{val || '-'}</span>
    },
    {
      title: 'Thời gian dự tính',
      dataIndex: 'estimatedEffort',
      key: 'estimatedEffort',
      render: (val: string) => <span className="text-xs font-mono text-[var(--color-muted-fg)]">{val || '-'}</span>
    },
    {
      title: 'Giá trị (VND)',
      dataIndex: 'fixedPrice',
      key: 'fixedPrice',
      align: 'right' as const,
      render: (val: number) => <span className="font-mono font-semibold text-xs">{val.toLocaleString('vi-VN')} VND</span>
    }
  ];

  const serviceName = q.serviceType || 'CUSTOM';
  const ownerName = q.owner ? `${q.owner.firstName || ''} ${q.owner.lastName || ''}`.trim() : 'System Admin';

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Title */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <div className="text-xs text-[var(--color-muted-fg)] flex items-center gap-1.5 mb-2 font-mono">
            <Link href="/quotations" className="hover:underline">Quotations</Link>
            <span>&gt;</span>
            <span className="text-[var(--color-fg)] font-semibold">{q.quotationCode}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">
            {q.projectName}
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Quotation: {q.quotationCode} (v{q.version}) • {serviceName}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            q.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' :
            q.status === 'REJECTED' || q.status === 'EXPIRED' ? 'bg-red-500/10 text-red-500' :
            q.status === 'REVIEW' ? 'bg-amber-500/10 text-amber-600' :
            q.status === 'SENT' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'
          }`}>
            Trạng thái: {q.status}
          </span>
        </div>
      </div>

      {/* Main Layout 3:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Content (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sub Navigation */}
          <div className="flex gap-6 border-b border-[var(--color-border)] pb-px">
            {[
              { id: 'overview', name: 'Overview & PDF' },
              { id: 'items', name: 'Hạng mục dịch vụ' },
              { id: 'history', name: 'Lịch sử phiên bản' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'border-transparent text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Sub Tab Bodies */}
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 min-h-[300px]">
            {activeSubTab === 'overview' && (
              <div className="space-y-8">
                {/* Visual Pricing Banner */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Grand Total Value</p>
                    <p className="text-2xl font-bold tracking-tight text-[var(--color-fg)] font-mono">{(q.grandTotal || 0).toLocaleString('vi-VN')} VND</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="border-l border-[var(--color-border)] pl-4">
                      <p className="text-[10px] text-[var(--color-muted-fg)]">Subtotal</p>
                      <p className="font-semibold">{(q.subtotal || 0).toLocaleString('vi-VN')} VND</p>
                    </div>
                    {q.adjustmentType && (
                      <div className="border-l border-[var(--color-border)] pl-4">
                        <p className="text-[10px] text-[var(--color-muted-fg)]">Adjustment</p>
                        <p className="font-semibold text-[var(--color-accent)]">{q.adjustmentType === 'DISCOUNT' ? '-' : '+'}{(q.adjustmentAmount || 0).toLocaleString('vi-VN')} VND</p>
                      </div>
                    )}
                    <div className="border-l border-[var(--color-border)] pl-4">
                      <p className="text-[10px] text-[var(--color-muted-fg)]">VAT ({q.taxPercent}%)</p>
                      <p className="font-semibold">{(q.taxAmount || 0).toLocaleString('vi-VN')} VND</p>
                    </div>
                  </div>
                </div>

                {/* Scope Preview Card */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Project Scope Overview</h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Opportunity</span>
                        <Link href={`/opportunities/${q.opportunityId}`} className="font-semibold text-[var(--color-accent)] hover:underline">
                          {q.opportunity?.name || 'View Opportunity'}
                        </Link>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Customer Account</span>
                        <span className="font-semibold">{q.opportunity?.account?.name || '-'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Validity Date</span>
                        <span className="font-semibold font-mono">{q.validUntil ? q.validUntil.substring(0, 10) : ''}</span>
                      </div>
                      <div className="flex justify-between border-b border(--color-border) pb-2">
                        <span className="text-[var(--color-muted-fg)]">Timeline</span>
                        <span className="font-semibold">{q.timeline || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PDF Live View Placeholder */}
                <div className="border border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)]/20 p-8 text-center space-y-4 min-h-[300px] flex flex-col justify-center items-center">
                  <FileText size={48} className="text-[var(--color-accent)]/40" />
                  <div className="max-w-md space-y-2">
                    <h4 className="font-bold text-sm text-[var(--color-fg)]">Quotation PDF Document</h4>
                    <p className="text-xs text-[var(--color-muted-fg)]">Báo giá đã sẵn sàng xuất ra định dạng PDF chính thức cho khách hàng bao gồm các hạng mục điều khoản, giá trị chiết khấu và chữ ký mẫu.</p>
                  </div>
                  <Button type="primary" className="rounded-xl flex items-center gap-1.5 h-10 px-5 cursor-pointer">
                    <Download size={14} />
                    <span>Download PDF Invoice</span>
                  </Button>
                </div>
              </div>
            )}

            {activeSubTab === 'items' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Scope of Work Items</h3>
                <Table
                  columns={itemColumns}
                  dataSource={q.items || []}
                  pagination={false}
                  rowKey="id"
                  className="border border-[var(--color-border)] rounded-xl overflow-hidden text-xs"
                />
              </div>
            )}

            {activeSubTab === 'history' && (
              <div className="space-y-4 font-mono text-xs">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Revision History</h3>
                <div className="relative border-l border-[var(--color-border)] ml-3 pl-6 space-y-6">
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 bg-[var(--color-accent)] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px]">1</span>
                    <p className="font-semibold text-[var(--color-fg)]">Version v1 created</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)]">{q.createdAt ? q.createdAt.substring(0, 10) : ''} • Owner: {ownerName}</p>
                  </div>
                  {q.version > 1 && (
                    <div className="relative">
                      <span className="absolute -left-[30px] top-0 bg-[var(--color-accent)] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px]">{q.version}</span>
                      <p className="font-semibold text-[var(--color-fg)]">Version v{q.version} active</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)]">{q.updatedAt ? q.updatedAt.substring(0, 10) : ''} • Cloned revision</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Actions (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Quotation Controls
            </h3>

            {/* Action buttons */}
            <div className="space-y-3">
              {q.status === 'DRAFT' && (
                <Button type="primary" onClick={() => handleUpdateStatus('SENT')} loading={statusMutation.isPending} className="w-full flex items-center justify-center gap-1.5 h-10 rounded-xl cursor-pointer">
                  <Send size={14} />
                  <span>Send to Client</span>
                </Button>
              )}

              {q.status !== 'ACCEPTED' && q.status !== 'REJECTED' && (
                <>
                  <Button type="primary" onClick={() => handleUpdateStatus('ACCEPTED')} loading={statusMutation.isPending} className="w-full bg-green-600 hover:bg-green-700 border-green-600 flex items-center justify-center gap-1.5 h-10 rounded-xl cursor-pointer">
                    <CheckCircle2 size={14} />
                    <span>Duyệt báo giá (Accept)</span>
                  </Button>
                  <Button danger onClick={() => handleUpdateStatus('REJECTED')} loading={statusMutation.isPending} className="w-full flex items-center justify-center gap-1.5 h-10 rounded-xl cursor-pointer">
                    <span>Từ chối (Reject)</span>
                  </Button>
                </>
              )}

              <Button onClick={handleCloneVersion} loading={cloneMutation.isPending} className="w-full flex items-center justify-center gap-1.5 h-10 rounded-xl cursor-pointer">
                <Copy size={14} />
                <span>Clone New Version</span>
              </Button>
            </div>

            {/* Additional parameters info */}
            <div className="space-y-4 border-t border-[var(--color-border)]/50 pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted-fg)]">Payment Terms:</span>
                <span className="font-semibold text-right">{q.paymentTerms || 'Standard'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted-fg)]">Revision limit:</span>
                <span className="font-semibold">{q.revisionLimit} times</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted-fg)]">Created By:</span>
                <span className="font-semibold">{ownerName}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
