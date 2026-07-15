'use client';

import React, { useState, use } from 'react';
import { Button, Steps, Modal, DatePicker, Input, message } from 'antd';
import { ArrowLeft, User, Calendar, CreditCard, ArrowRight, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Landmark, Ban, Printer, FileDown } from 'lucide-react';
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
  notes?: string;
  contractId: string;
  contractCode: string;
  contractTitle: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
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
    notes: 'Paid fully via bank transfer transaction reference #TR-998822.',
    contractId: '1',
    contractCode: 'HĐ-2026-00001',
    contractTitle: 'Service Agreement - Xantivation Dev - CRM Integration Deal',
    companyName: 'Xantivation Dev',
    contactName: 'Phan Manh',
    contactEmail: 'manh@xantivation.com',
    contactPhone: '0988777666',
    createdAt: '2026-07-05',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2026-00002',
    amount: 104500000,
    dueDate: '2026-08-05',
    status: 'PENDING',
    milestoneName: 'Final Delivery',
    milestonePercentage: 50,
    contractId: '1',
    contractCode: 'HĐ-2026-00001',
    contractTitle: 'Service Agreement - Xantivation Dev - CRM Integration Deal',
    companyName: 'Xantivation Dev',
    contactName: 'Phan Manh',
    contactEmail: 'manh@xantivation.com',
    contactPhone: '0988777666',
    createdAt: '2026-07-05',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2026-00003',
    amount: 82500000,
    dueDate: '2026-08-15',
    status: 'OVERDUE',
    milestoneName: 'Advance payment',
    milestonePercentage: 100,
    contractId: '2',
    contractCode: 'HĐ-2026-00002',
    contractTitle: 'Service Agreement - CyberCore LLC - Brand Strategy Deal',
    companyName: 'CyberCore LLC',
    contactName: 'David Lee',
    contactEmail: 'david@cybercore.io',
    contactPhone: '0911222333',
    createdAt: '2026-07-06',
  },
];

export default function PaymentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [payment, setPayment] = useState<PaymentRecord | undefined>(mockPayments.find((p) => p.id === id) || mockPayments[1]);
  const [activeTab, setActiveTab] = useState('overview');

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().substring(0, 10));

  if (!payment) {
    return <div className="p-8 text-center text-red-500 font-bold">Payment record not found</div>;
  }

  // Stepper helper
  const getStepIndex = (st: string) => {
    switch (st) {
      case 'PENDING': return 0;
      case 'OVERDUE': return 0;
      case 'PAID': return 1;
      case 'CANCELLED': return 1;
      default: return 0;
    }
  };

  // Actions
  const handleConfirmPayment = () => {
    setPayment({
      ...payment,
      status: 'PAID',
      paidAt: `${paymentDate} 12:00`,
      notes: paymentNotes || 'Marked paid by Finance.',
    });
    setConfirmModalOpen(false);
    message.success('Invoice payment recorded successfully.');
  };

  const handleMarkOverdue = () => {
    setPayment({
      ...payment,
      status: 'OVERDUE',
    });
    message.warning('Invoice status marked as OVERDUE.');
  };

  const handleCancelPayment = () => {
    setPayment({
      ...payment,
      status: 'CANCELLED',
    });
    message.error('Invoice cancelled.');
  };

  const handlePrint = () => {
    message.info('Generating print queue for invoice...');
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <div className="text-xs text-[var(--color-muted-fg)] flex items-center gap-1.5 mb-2 font-mono">
            <Link href="/payments" className="hover:underline">Payments</Link>
            <span>&gt;</span>
            <span className="text-[var(--color-fg)] font-semibold">{payment.invoiceNumber}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">
            Invoice: {payment.invoiceNumber}
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Milestone billing: {payment.milestoneName} ({payment.milestonePercentage}%) • Client: {payment.companyName}</p>
        </div>

        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            payment.status === 'PAID' ? 'bg-green-500/10 text-green-500' :
            payment.status === 'PENDING' ? 'bg-blue-500/10 text-blue-500' :
            payment.status === 'OVERDUE' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'
          }`}>
            Status: {payment.status}
          </span>
        </div>
      </div>

      {/* Stepper progress */}
      <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6">
        <Steps
          current={getStepIndex(payment.status)}
          items={[
            { title: 'Awaiting Payment', description: `Due by ${payment.dueDate}` },
            { title: payment.status === 'CANCELLED' ? 'Cancelled / Void' : 'Cleared Payment', description: payment.status === 'CANCELLED' ? 'Invoice Cancelled' : (payment.paidAt ? `Paid on ${payment.paidAt}` : 'Cleared') },
          ]}
          status={payment.status === 'OVERDUE' ? 'error' : 'process'}
        />
      </div>

      {/* Main Grid 3:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-6 border-b border-[var(--color-border)] pb-px">
            {[
              { id: 'overview', name: 'Overview Details' },
              { id: 'preview', name: 'Invoice Statement' },
              { id: 'confirmation', name: 'Transaction Notes' },
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

          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 min-h-[350px]">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-6 text-xs border-b border-[var(--color-border)]/50 pb-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Invoice details
                    </h4>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Amount Due</span>
                      <span className="font-semibold font-mono text-[var(--color-accent)]">{payment.amount.toLocaleString('vi-VN')} VND</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Due Date</span>
                      <span className="font-semibold font-mono">{payment.dueDate}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Billing milestone</span>
                      <span className="font-semibold">{payment.milestoneName} ({payment.milestonePercentage}%)</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Client details
                    </h4>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Client Company</span>
                      <span className="font-semibold">{payment.companyName}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Billing Contact</span>
                      <span className="font-semibold">{payment.contactName}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Contact Email</span>
                      <span className="font-semibold font-mono">{payment.contactEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Contract context */}
                <div className="space-y-3 text-xs">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Linked Agreement</h4>
                  <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                        <Landmark size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-[var(--color-fg)]">{payment.contractCode} — {payment.contractTitle}</p>
                        <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">Status: ACTIVE</p>
                      </div>
                    </div>
                    <Link
                      href={`/contracts/${payment.contractId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all font-mono"
                    >
                      <span>Contract Detail</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
                  <h3 className="text-sm font-semibold text-[var(--color-fg)]">Invoice Statement Statement Preview</h3>
                  <div className="flex gap-2">
                    <Button size="small" icon={<Printer size={12} />} onClick={handlePrint}>Print</Button>
                    <Button size="small" type="primary" icon={<FileDown size={12} />}>Export PDF</Button>
                  </div>
                </div>

                {/* Mock brand invoice */}
                <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl p-8 max-w-2xl mx-auto space-y-8 shadow-sm">
                  {/* Brand Invoice Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-lg tracking-wider text-[var(--color-fg)] bg-[var(--color-fg)]/5 px-3 py-1.5 rounded-xl border border-[var(--color-border)]">
                        XANTIVATION STUDIO
                      </span>
                      <p className="text-[10px] text-[var(--color-muted-fg)] mt-2">123 Studio Way, Tech District, VN</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)]">billing@xantivation.com</p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-bold tracking-tight text-[var(--color-fg)]">INVOICE</h2>
                      <p className="text-xs font-mono text-[var(--color-muted-fg)] mt-1">{payment.invoiceNumber}</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)]">Date: {payment.createdAt}</p>
                    </div>
                  </div>

                  {/* To/From Section */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-muted-fg)] mb-1">BILLED TO</p>
                      <p className="font-bold text-[var(--color-fg)]">{payment.companyName}</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)]">{payment.contactName}</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)]">{payment.contactEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-muted-fg)] mb-1">DUE DATE</p>
                      <p className="font-bold text-[var(--color-fg)] font-mono">{payment.dueDate}</p>
                    </div>
                  </div>

                  {/* Table Line Items */}
                  <div className="border-t border-b border-[var(--color-border)] py-4">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] border-b border-[var(--color-border)]/50 pb-2">
                          <th className="pb-2">Description</th>
                          <th className="pb-2 text-right">Percentage</th>
                          <th className="pb-2 text-right">Amount (VND)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-[var(--color-fg)] font-medium">
                          <td className="py-3">
                            <span className="font-bold">{payment.milestoneName}</span>
                            <span className="text-[10px] text-[var(--color-muted-fg)] block mt-0.5">Agreement code: {payment.contractCode}</span>
                          </td>
                          <td className="py-3 text-right font-mono">{payment.milestonePercentage}%</td>
                          <td className="py-3 text-right font-mono font-bold">{payment.amount.toLocaleString('vi-VN')} VND</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Grand total & payment details */}
                  <div className="flex justify-between items-start text-xs pt-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-muted-fg)] mb-1.5">PAYMENT INSTRUCTIONS</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)] leading-relaxed">
                        Bank: Techcombank Branch HN<br />
                        Account: 19028882999018<br />
                        Recipient: XANTIVATION STUDIO CO., LTD<br />
                        Reference: {payment.invoiceNumber}
                      </p>
                    </div>
                    <div className="text-right space-y-1.5">
                      <div className="flex justify-end gap-6 text-[10px] text-[var(--color-muted-fg)]">
                        <span>Subtotal:</span>
                        <span className="font-mono">{payment.amount.toLocaleString('vi-VN')} VND</span>
                      </div>
                      <div className="flex justify-end gap-6 text-sm font-bold text-[var(--color-fg)] pt-1 border-t border-[var(--color-border)]/50">
                        <span>Total Due:</span>
                        <span className="font-mono text-[var(--color-accent)]">{payment.amount.toLocaleString('vi-VN')} VND</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'confirmation' && (
              <div className="space-y-6 text-xs">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Payment Clearing Information</h3>
                {payment.paidAt ? (
                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl space-y-2">
                    <p className="font-semibold text-green-500 flex items-center gap-1.5">
                      <CheckCircle2 size={16} />
                      <span>Payment Verified & Cleared</span>
                    </p>
                    <div className="font-mono space-y-1 text-[var(--color-muted-fg)]">
                      <p>Cleared at: {payment.paidAt}</p>
                      <p>Cleared amount: {payment.amount.toLocaleString('vi-VN')} VND</p>
                      <p>Notes: {payment.notes}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl space-y-3">
                    <p className="text-[var(--color-muted-fg)] italic">No payment clearance notes recorded yet. Verify bank transfer details and confirm payment release in the sidebar.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Invoicing panel
            </h3>

            <div className="space-y-3">
              <Button
                type="primary"
                onClick={() => setConfirmModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer bg-green-600 border-green-600 text-white hover:bg-green-700"
                disabled={payment.status === 'PAID' || payment.status === 'CANCELLED'}
              >
                <CreditCard size={14} />
                <span>Confirm Payment</span>
              </Button>

              <Button
                onClick={handleMarkOverdue}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer bg-amber-600 border-amber-600 text-white hover:bg-amber-700"
                disabled={payment.status === 'PAID' || payment.status === 'CANCELLED' || payment.status === 'OVERDUE'}
              >
                <AlertTriangle size={14} />
                <span>Mark Overdue</span>
              </Button>

              <Button
                onClick={handleCancelPayment}
                danger
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer"
                disabled={payment.status === 'PAID' || payment.status === 'CANCELLED'}
              >
                <Ban size={14} />
                <span>Cancel Invoice</span>
              </Button>
            </div>

            {/* General parameters */}
            <div className="border-t border-[var(--color-border)]/50 pt-4 space-y-3 text-xs font-mono text-[var(--color-muted-fg)]">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-bold text-[var(--color-fg)]">{payment.amount.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="flex justify-between">
                <span>Billing:</span>
                <span className="font-bold text-[var(--color-fg)]">{payment.milestonePercentage}%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Payment Confirmation Modal */}
      <Modal
        title="Record Payment Clearing"
        open={confirmModalOpen}
        onCancel={() => setConfirmModalOpen(false)}
        onOk={handleConfirmPayment}
        okText="Clear Invoice"
        cancelText="Cancel"
      >
        <div className="space-y-4 pt-4 text-xs">
          <p className="text-[var(--color-muted-fg)]">
            Verify the bank transaction history for client <strong>{payment.companyName}</strong> matching reference code <strong>{payment.invoiceNumber}</strong>.
          </p>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] block">Clearing Date *</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-2 rounded-lg text-xs outline-none focus:border-[var(--color-accent)] text-[var(--color-fg)]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] block">Clearing Notes / Transaction Reference</label>
            <textarea
              placeholder="e.g. Transaction Ref: #T-90082"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              className="w-full min-h-[80px] p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-fg)] outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
