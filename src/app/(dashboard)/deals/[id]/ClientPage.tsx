'use client';

import React, { useState, use } from 'react';
import { Button, Steps, Select, Modal, Progress, message, Table, Spin } from 'antd';
import { ArrowLeft, User, Calendar, Plus, Trash2, ArrowRight, UserCheck, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Landmark } from 'lucide-react';
import Link from 'next/link';
import { useDeal, useConfigureMilestones, useSubmitDealReview, useApproveDeal } from '@/hooks/api/useDeal';
import { useUsers } from '@/hooks/api/useUser';
import { FloatingInput } from '@/components/FloatingInput';

interface DealMilestoneRecord {
  milestoneName: string;
  percentage: number;
  amount: number;
  dueDate: string;
  acceptanceCondition?: string;
}

interface ScopeItemRecord {
  itemName: string;
  description?: string;
  fixedPrice: number;
  estimatedEffort?: string;
  deliverables?: string;
}

export default function DealDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeSubTab, setActiveSubTab] = useState('overview');

  // API Queries
  const { data: dealRes, isLoading } = useDeal(id);
  const { data: usersRes } = useUsers();

  // API Mutations
  const configureMilestonesMutation = useConfigureMilestones();
  const submitReviewMutation = useSubmitDealReview();
  const approveDealMutation = useApproveDeal();

  const d = dealRes?.data as any;
  const realUsers = usersRes?.data || [];

  // Local state for Milestones configure edit
  const [milestones, setMilestones] = useState<DealMilestoneRecord[]>([]);
  const [isEditingMilestones, setIsEditingMilestones] = useState(false);

  // Review states
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  // Initial load of milestones once API returns data
  React.useEffect(() => {
    if (d?.milestones) {
      setMilestones(
        d.milestones.map((m: any) => ({
          milestoneName: m.milestoneName,
          percentage: Number(m.percentage) || 0,
          amount: Number(m.amount) || 0,
          dueDate: m.dueDate ? m.dueDate.substring(0, 10) : '',
          acceptanceCondition: m.acceptanceCondition || '',
        }))
      );
    }
  }, [d]);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col justify-center items-center gap-3">
        <Spin size="large" />
        <span className="text-xs text-[var(--color-muted-fg)] font-mono">Loading deal details...</span>
      </div>
    );
  }

  if (!d) {
    return <div className="p-8 text-center text-red-500 font-bold">Deal not found</div>;
  }

  const dealTotalAmount = Number(d.dealValue) || 0;

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { milestoneName: '', percentage: 0, amount: 0, dueDate: '', acceptanceCondition: '' }
    ]);
  };

  const handleRemoveMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleMilestoneFieldChange = (idx: number, field: keyof DealMilestoneRecord, val: any) => {
    const updated = [...milestones];
    if (field === 'percentage') {
      const pct = Number(val) || 0;
      updated[idx] = {
        ...updated[idx],
        percentage: pct,
        amount: Math.round(dealTotalAmount * (pct / 100))
      };
    } else {
      updated[idx] = { ...updated[idx], [field]: val };
    }
    setMilestones(updated);
  };

  const handleSaveMilestones = async () => {
    const totalPercent = milestones.reduce((sum, m) => sum + m.percentage, 0);
    if (totalPercent !== 100) {
      message.error(`Tổng tỷ lệ phần trăm phải bằng 100% (Hiện tại là: ${totalPercent}%)`);
      return;
    }

    if (milestones.some(m => !m.milestoneName.trim() || !m.dueDate)) {
      message.error('Tất cả các mốc phải điền Tên mốc và Ngày đến hạn.');
      return;
    }

    try {
      await configureMilestonesMutation.mutateAsync({
        id: d.id,
        dto: { milestones },
      });
      setIsEditingMilestones(false);
    } catch (err) {
      // Handled
    }
  };

  const handleSubmitReview = async () => {
    try {
      await submitReviewMutation.mutateAsync({
        id: d.id,
        dto: { reviewNotes },
      });
      setReviewModalOpen(false);
    } catch (err) {
      // Handled
    }
  };

  const handleApproveDeal = async () => {
    try {
      await approveDealMutation.mutateAsync(d.id);
    } catch (err) {
      // Handled
    }
  };

  // Convert stage list to index for visual Stepper
  const stagesOrder = ['DRAFT', 'INTERNAL_REVIEW', 'CUSTOMER_REVIEW', 'CLOSED_WON'];
  const currentStep = stagesOrder.indexOf(d.status === 'CLOSED_LOST' ? 'CLOSED_WON' : d.status);

  const assignedOwnerName = 'System Admin';

  const scopesColumns = [
    {
      title: 'Hạng mục dịch vụ',
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
      title: 'Giá trị (VND)',
      dataIndex: 'fixedPrice',
      key: 'fixedPrice',
      align: 'right' as const,
      render: (val: number) => <span className="font-mono font-semibold text-xs">{(Number(val) || 0).toLocaleString('vi-VN')} VND</span>
    }
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Title */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <div className="text-xs text-[var(--color-muted-fg)] flex items-center gap-1.5 mb-2 font-mono">
            <Link href="/deals" className="hover:underline">Deals</Link>
            <span>&gt;</span>
            <span className="text-[var(--color-fg)] font-semibold">{d.dealCode || `DEAL-${d.id.substring(0,8).toUpperCase()}`}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">
            {d.name}
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Deal Code: {d.dealCode} • Client: {d.opportunity?.account?.name}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            d.stage === 'CLOSED_WON' ? 'bg-green-500/10 text-green-500' :
            d.stage === 'CLOSED_LOST' ? 'bg-red-500/10 text-red-500' :
            'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
          }`}>
            Trạng thái: {d.stage}
          </span>
        </div>
      </div>

      {/* Visual Stepper */}
      {d.stage !== 'CLOSED_LOST' ? (
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] p-6 rounded-2xl">
          <Steps
            current={currentStep}
            items={[
              { title: 'Draft', description: 'Milestones Config' },
              { title: 'Internal Review', description: 'Manager Approval' },
              { title: 'Customer Review', description: 'DocuSign Send' },
              { title: 'Closed Won', description: 'Contract Signed' },
            ]}
          />
        </div>
      ) : (
        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="text-red-500 shrink-0" size={20} />
          <div className="text-xs text-red-800 font-mono">
            <span className="font-bold uppercase block">CLOSED LOST</span>
            <span>Review Notes: {d.reviewNotes || 'No notes provided.'}</span>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-6 border-b border-[var(--color-border)] pb-px">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'milestones', name: 'Cấu hình mốc thanh toán' },
              { id: 'scopes', name: 'Scope Snapshot' },
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

          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 min-h-[300px]">
            {activeSubTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Commercial Terms</h3>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-muted-fg)]">Deal Value</span>
                      <span className="font-semibold font-mono">{(Number(d.dealValue) || 0).toLocaleString('vi-VN')} VND</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-muted-fg)]">Expected Start</span>
                      <span className="font-semibold font-mono">{d.expectedStart ? d.expectedStart.substring(0, 10) : ''}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-muted-fg)]">Payment Terms Description</span>
                      <span className="font-semibold">{d.paymentTerms || 'Standard'}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Client Representative</h3>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-muted-fg)]">Company Account</span>
                      <span className="font-semibold">{d.account?.name || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-muted-fg)]">Representative Contact</span>
                      <span className="font-semibold">{d.contact ? `${d.contact.firstName || ''} ${d.contact.lastName || ''}`.trim() : '-'}</span>
                    </div>
                  </div>
                </div>

                {d.reviewNotes && (
                  <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Review Feedback Notes</h4>
                    <p className="text-xs text-[var(--color-fg)] whitespace-pre-wrap">{d.reviewNotes}</p>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'milestones' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-[var(--color-fg)]">Payment Milestones Schedule</h3>
                  {d.status === 'DRAFT' && (
                    <div className="flex items-center gap-2">
                      {isEditingMilestones ? (
                        <>
                          <Button size="small" onClick={handleAddMilestone} className="text-xs rounded-lg flex items-center gap-1">
                            <Plus size={10} />
                            <span>Thêm mốc</span>
                          </Button>
                          <Button size="small" type="primary" onClick={handleSaveMilestones} loading={configureMilestonesMutation.isPending} className="text-xs rounded-lg">
                            Lưu cấu hình
                          </Button>
                        </>
                      ) : (
                        <Button size="small" onClick={() => setIsEditingMilestones(true)} className="text-xs rounded-lg">
                          Chỉnh sửa cấu hình
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {isEditingMilestones ? (
                  <div className="space-y-4">
                    {milestones.map((m, idx) => (
                      <div key={idx} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl relative space-y-3">
                        <button
                          onClick={() => handleRemoveMilestone(idx)}
                          className="absolute top-2 right-2 text-[10px] font-semibold text-red-500 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                        <div className="grid grid-cols-4 gap-4">
                          <div className="col-span-2">
                            <FloatingInput label="Tên mốc thanh toán" value={m.milestoneName} onChange={(val) => handleMilestoneFieldChange(idx, 'milestoneName', val)} required />
                          </div>
                          <div>
                            <FloatingInput label="Tỷ lệ (%)" type="number" value={m.percentage ? String(m.percentage) : ''} onChange={(val) => handleMilestoneFieldChange(idx, 'percentage', Number(val))} required />
                          </div>
                          <div>
                            <FloatingInput label="Ngày đến hạn" type="date" value={m.dueDate} onChange={(val) => handleMilestoneFieldChange(idx, 'dueDate', val)} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FloatingInput label="Điều kiện nghiệm thu" value={m.acceptanceCondition || ''} onChange={(val) => handleMilestoneFieldChange(idx, 'acceptanceCondition', val)} />
                          <div className="flex items-center pl-2 text-xs font-mono text-[var(--color-muted-fg)] pt-4">
                            Số tiền tương ứng: <span className="font-bold text-[var(--color-fg)] ml-1">{m.amount.toLocaleString('vi-VN')} VND</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {milestones.length === 0 && (
                      <div className="py-8 text-center text-xs text-[var(--color-muted-fg)] border border-dashed border-[var(--color-border)] rounded-xl">
                        Chưa có mốc thanh toán nào. Nhấn "Thêm mốc" để bắt đầu cấu hình.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    {milestones.map((m, idx) => (
                      <div key={idx} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="font-semibold text-xs text-[var(--color-fg)]">{m.milestoneName}</p>
                          <p className="text-[10px] text-[var(--color-muted-fg)]">Đến hạn: {m.dueDate} • Điều kiện: {m.acceptanceCondition || 'Ký nhận bàn giao'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-xs">{m.amount.toLocaleString('vi-VN')} VND</p>
                          <span className="px-2 py-0.5 rounded-full font-bold bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[9px] font-mono">
                            {m.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                    {milestones.length === 0 && (
                      <div className="py-12 text-center text-xs text-[var(--color-muted-fg)]">
                        Chưa cấu hình mốc thanh toán.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'scopes' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Scope items details</h3>
                <Table
                  columns={scopesColumns}
                  dataSource={d.quotation?.items || []}
                  pagination={false}
                  rowKey="id"
                  className="border border-[var(--color-border)] rounded-xl overflow-hidden text-xs"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Control */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Deal Control Panel
            </h3>

            <div className="space-y-3">
              {d.status === 'DRAFT' && milestones.length > 0 && (
                <Button type="primary" onClick={() => { setReviewNotes(''); setReviewModalOpen(true); }} className="w-full flex items-center justify-center gap-1.5 h-10 rounded-xl cursor-pointer">
                  <ShieldCheck size={14} />
                  <span>Submit for Review</span>
                </Button>
              )}

              {d.status === 'INTERNAL_REVIEW' && (
                <Button type="primary" onClick={handleApproveDeal} loading={approveDealMutation.isPending} className="w-full bg-green-600 hover:bg-green-700 border-green-600 flex items-center justify-center gap-1.5 h-10 rounded-xl cursor-pointer">
                  <CheckCircle2 size={14} />
                  <span>Phê duyệt (Approve)</span>
                </Button>
              )}
            </div>

            <div className="space-y-4 border-t border-[var(--color-border)]/50 pt-4 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted-fg)]">Revision:</span>
                <span className="font-semibold">v{d.quotation?.version || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted-fg)]">Owner:</span>
                <span className="font-semibold">{assignedOwnerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted-fg)]">Created At:</span>
                <span className="font-semibold">{d.createdAt ? d.createdAt.substring(0, 10) : ''}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Submit for Review notes modal */}
      <Modal
        title="Gửi phê duyệt nội bộ"
        open={reviewModalOpen}
        onCancel={() => setReviewModalOpen(false)}
        onOk={handleSubmitReview}
        confirmLoading={submitReviewMutation.isPending}
        okText="Gửi duyệt"
        cancelText="Hủy"
      >
        <div className="space-y-4 pt-4">
          <p className="text-xs text-[var(--color-muted-fg)]">Vui lòng cung cấp ghi chú hoặc đề xuất duyệt mốc thanh toán cho Kế toán và Quản lý.</p>
          <textarea
            placeholder="Review notes..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="w-full min-h-[100px] p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-fg)] focus:outline-none"
          />
        </div>
      </Modal>
    </div>
  );
}
