'use client';

import React, { useState, use } from 'react';
import { Button, Steps, Progress, message, Table, Spin, Modal } from 'antd';
import { ArrowLeft, User, Calendar, Plus, PenTool, ArrowRight, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Landmark, Send, Ban } from 'lucide-react';
import Link from 'next/link';
import { useContract, useStartContractSigning, useForceSignContract, useVoidContract, useConfirmPayment } from '@/hooks/api/useContract';
import { FloatingInput } from '@/components/FloatingInput';

interface PaymentScheduleRecord {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paidAt?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  milestoneName: string;
  milestonePercentage: number;
}

export default function ContractDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('overview');

  // API Queries
  const { data: contractRes, isLoading } = useContract(id);

  // API Mutations
  const startSigningMutation = useStartContractSigning();
  const forceSignMutation = useForceSignContract();
  const voidMutation = useVoidContract();
  const confirmPaymentMutation = useConfirmPayment();

  const c = contractRes?.data;

  // Local state for sending envelope inputs
  const [signerModalOpen, setSignerModalOpen] = useState(false);
  const [companySignerName, setCompanySignerName] = useState('Luu The Man');
  const [companySignerEmail, setCompanySignerEmail] = useState('manh.lt@xantivation.com');
  const [customerSignerName, setCustomerSignerName] = useState('');
  const [customerSignerEmail, setCustomerSignerEmail] = useState('');

  // Hydrate fields once data is loaded
  React.useEffect(() => {
    if (c) {
      setCustomerSignerName(c.contact ? `${c.contact.firstName || ''} ${c.contact.lastName || ''}`.trim() : '');
      setCustomerSignerEmail(c.contact?.email || '');
    }
  }, [c]);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col justify-center items-center gap-3">
        <Spin size="large" />
        <span className="text-xs text-[var(--color-muted-fg)] font-mono">Loading contract details...</span>
      </div>
    );
  }

  if (!c) {
    return <div className="p-8 text-center text-red-500 font-bold">Contract not found</div>;
  }

  // Stepper helper
  const getStepIndex = (st: string) => {
    const steps = ['DRAFT', 'SENT', 'SIGNED'];
    if (st === 'VOIDED' || st === 'DECLINED' || st === 'EXPIRED') return 2;
    return steps.indexOf(st) !== -1 ? steps.indexOf(st) : 0;
  };

  const handleSendSigning = async () => {
    if (!customerSignerName.trim() || !customerSignerEmail.trim()) {
      message.error('Please enter customer signer name and email');
      return;
    }

    try {
      await startSigningMutation.mutateAsync({
        id: c.id,
        dto: {
          companySignerName,
          companySignerEmail,
          customerSignerName,
          customerSignerEmail,
        }
      });
      setSignerModalOpen(false);
    } catch (err) {
      // Handled
    }
  };

  const handleForceSign = async () => {
    try {
      await forceSignMutation.mutateAsync(c.id);
    } catch (err) {
      // Handled
    }
  };

  const handleVoid = async () => {
    try {
      await voidMutation.mutateAsync(c.id);
    } catch (err) {
      // Handled
    }
  };

  const handleConfirmPaymentRow = async (paymentId: string) => {
    try {
      await confirmPaymentMutation.mutateAsync(paymentId);
    } catch (err) {
      // Handled
    }
  };

  // Convert payments from API format
  const paymentsList: PaymentScheduleRecord[] = (c.payments || []).map((p) => ({
    id: p.id,
    invoiceNumber: p.invoiceCode || `INV-${p.id.substring(0, 8).toUpperCase()}`,
    amount: Number(p.amount) || 0,
    dueDate: p.dueDate ? p.dueDate.substring(0, 10) : '',
    paidAt: p.paidDate ? p.paidDate.substring(0, 16).replace('T', ' ') : undefined,
    status: p.status as any,
    milestoneName: p.milestoneName,
    milestonePercentage: p.milestonePercentage,
  }));

  const paymentColumns = [
    {
      title: 'Mã Hóa đơn',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (val: string) => <span className="font-mono text-xs font-semibold">{val}</span>
    },
    {
      title: 'Mốc thanh toán',
      dataIndex: 'milestoneName',
      key: 'milestoneName',
      render: (val: string, rec: any) => (
        <div>
          <p className="font-semibold text-xs text-[var(--color-fg)]">{val}</p>
          <span className="px-2 py-0.2 rounded-full font-bold bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[9px] font-mono">
            {rec.milestonePercentage}%
          </span>
        </div>
      )
    },
    {
      title: 'Hạn thanh toán',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (val: string) => <span className="text-xs font-mono text-[var(--color-muted-fg)]">{val}</span>
    },
    {
      title: 'Số tiền (VND)',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => <span className="font-mono font-semibold text-xs">{(Number(val) || 0).toLocaleString('vi-VN')} VND</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
          st === 'PAID' ? 'bg-green-500/10 text-green-500' :
          st === 'OVERDUE' ? 'bg-red-500/10 text-red-500' :
          st === 'CANCELLED' ? 'bg-gray-500/10 text-gray-500' : 'bg-amber-500/10 text-amber-600'
        }`}>{st}</span>
      )
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paidAt',
      key: 'paidAt',
      render: (val: string) => <span className="text-xs font-mono text-[var(--color-muted-fg)]">{val || '-'}</span>
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, rec: any) => (
        rec.status === 'PENDING' ? (
          <Button size="small" type="primary" onClick={() => handleConfirmPaymentRow(rec.id)} loading={confirmPaymentMutation.isPending} className="text-[10px] rounded-lg">
            Xác nhận thanh toán
          </Button>
        ) : null
      )
    }
  ];

  // Visual calculation of total payments paid
  const totalPaid = paymentsList.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const paidPercent = c.contractValue ? Math.round((totalPaid / c.contractValue) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Title */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <div className="text-xs text-[var(--color-muted-fg)] flex items-center gap-1.5 mb-2 font-mono">
            <Link href="/contracts" className="hover:underline">Contracts</Link>
            <span>&gt;</span>
            <span className="text-[var(--color-fg)] font-semibold">{c.contractCode}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">
            {c.title}
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Contract Code: {c.contractCode} • Value: {(c.contractValue || 0).toLocaleString('vi-VN')} VND</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            c.status === 'SIGNED' ? 'bg-green-500/10 text-green-500' :
            c.status === 'VOIDED' || c.status === 'DECLINED' ? 'bg-red-500/10 text-red-500' :
            'bg-blue-500/10 text-blue-500'
          }`}>
            Trạng thái: {c.status}
          </span>
        </div>
      </div>

      {/* Visual Stepper */}
      {c.status !== 'VOIDED' && c.status !== 'DECLINED' && c.status !== 'EXPIRED' ? (
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] p-6 rounded-2xl">
          <Steps
            current={getStepIndex(c.status)}
            items={[
              { title: 'Draft', description: 'Legal Clauses' },
              { title: 'Sent to Sign', description: 'DocuSign Connect' },
              { title: 'Signed', description: 'Activated' },
            ]}
          />
        </div>
      ) : (
        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="text-red-500 shrink-0" size={20} />
          <div className="text-xs text-red-800 font-mono">
            <span className="font-bold uppercase block">CONTRACT {c.status}</span>
            <span>Legal Notes: {c.legalNotes || 'No additional legal notes.'}</span>
          </div>
        </div>
      )}

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-6 border-b border-[var(--color-border)] pb-px">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'payments', name: 'Lịch thanh toán (Payments)' },
              { id: 'clauses', name: 'Điều khoản pháp lý' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'border-transparent text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 min-h-[300px]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Revenue collection progress */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Doanh thu đã thu</p>
                    <p className="text-2xl font-bold tracking-tight text-[var(--color-fg)] font-mono">{totalPaid.toLocaleString('vi-VN')} VND</p>
                  </div>
                  <div className="flex-1 max-w-xs space-y-1">
                    <div className="flex justify-between text-xs font-mono text-[var(--color-muted-fg)]">
                      <span>Tiến độ thanh toán</span>
                      <span className="font-bold">{paidPercent}%</span>
                    </div>
                    <Progress percent={paidPercent} size="small" showInfo={false} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Thông tin thương vụ</h3>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-muted-fg)]">Thương vụ gốc</span>
                      <Link href={`/deals/${c.dealId}`} className="font-semibold text-[var(--color-accent)] hover:underline">
                        {c.deal?.projectName || 'Chi tiết Deal'}
                      </Link>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-muted-fg)]">Giá trị hợp đồng</span>
                      <span className="font-semibold font-mono">{(Number(c.contractValue) || 0).toLocaleString('vi-VN')} VND</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Khách hàng pháp nhân</h3>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-muted-fg)]">Doanh nghiệp</span>
                      <span className="font-semibold">{c.account?.name || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-muted-fg)]">Người ký đại diện</span>
                      <span className="font-semibold">{c.contact ? `${c.contact.firstName || ''} ${c.contact.lastName || ''}`.trim() : '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Lịch phát hành hóa đơn và đợt thanh toán</h3>
                <Table
                  columns={paymentColumns}
                  dataSource={paymentsList}
                  pagination={false}
                  rowKey="id"
                  className="border border-[var(--color-border)] rounded-xl overflow-hidden text-xs"
                />
              </div>
            )}

            {activeTab === 'clauses' && (
              <div className="space-y-6 text-xs text-[var(--color-fg)] font-mono leading-relaxed">
                <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl whitespace-pre-wrap">
                  {c.termsConditions || 'Điều khoản dịch vụ tiêu chuẩn áp dụng cho các hạng mục bàn giao công nghệ.'}
                </div>
                {c.legalNotes && (
                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-2">
                    <h4 className="text-[10px] uppercase font-mono tracking-widest text-amber-600 font-bold">Ghi chú pháp lý riêng biệt</h4>
                    <p className="text-[11px]">{c.legalNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Control */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              DocuSign Controls
            </h3>

            <div className="space-y-3">
              {c.status === 'DRAFT' && (
                <Button type="primary" onClick={() => setSignerModalOpen(true)} className="w-full flex items-center justify-center gap-1.5 h-10 rounded-xl cursor-pointer">
                  <Send size={14} />
                  <span>Start Envelope Sign</span>
                </Button>
              )}

              {c.status === 'SENT' && (
                <>
                  <Button type="primary" onClick={handleForceSign} loading={forceSignMutation.isPending} className="w-full bg-green-600 hover:bg-green-700 border-green-600 flex items-center justify-center gap-1.5 h-10 rounded-xl cursor-pointer">
                    <PenTool size={14} />
                    <span>Force Sign Contract</span>
                  </Button>
                  <Button danger onClick={handleVoid} loading={voidMutation.isPending} className="w-full flex items-center justify-center gap-1.5 h-10 rounded-xl cursor-pointer">
                    <Ban size={14} />
                    <span>Void Contract</span>
                  </Button>
                </>
              )}
            </div>

            <div className="space-y-4 border-t border-[var(--color-border)]/50 pt-4 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted-fg)]">Envelope ID:</span>
                <span className="font-semibold text-right max-w-[120px] truncate">{c.esignEnvelopeId || 'Not Generated'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted-fg)]">Ngày tạo:</span>
                <span className="font-semibold">{c.createdAt ? c.createdAt.substring(0, 10) : ''}</span>
              </div>
              {c.signedDate && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted-fg)]">Ngày ký:</span>
                  <span className="font-semibold">{c.signedDate.substring(0, 10)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Start Envelope Sign Modal */}
      <Modal
        title="Start Envelope Sign (DocuSign)"
        open={signerModalOpen}
        onCancel={() => setSignerModalOpen(false)}
        onOk={handleSendSigning}
        confirmLoading={startSigningMutation.isPending}
        okText="Generate Envelope"
        cancelText="Cancel"
      >
        <div className="space-y-4 pt-4">
          <p className="text-xs text-[var(--color-muted-fg)]">Cung cấp thông tin chi tiết của người ký đại diện các bên để tạo Envelope ký số.</p>
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput label="Tên Đại diện Xantivation" value={companySignerName} onChange={setCompanySignerName} required />
            <FloatingInput label="Email Đại diện Xantivation" value={companySignerEmail} onChange={setCompanySignerEmail} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput label="Tên Đại diện Khách hàng" value={customerSignerName} onChange={setCustomerSignerName} required />
            <FloatingInput label="Email Đại diện Khách hàng" value={customerSignerEmail} onChange={setCustomerSignerEmail} required />
          </div>
        </div>
      </Modal>
    </div>
  );
}
