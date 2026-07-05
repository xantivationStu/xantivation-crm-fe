'use client';

import React, { useState } from 'react';
import { Button, Modal, Select, message } from 'antd';
import { Plus, CreditCard, AlertTriangle } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import { FloatingInput } from '@/components/FloatingInput';

interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paidAt: string;
  status: string;
  clientName: string;
  contractTitle: string;
}

const mockPayments: PaymentRecord[] = [
  { id: '1', invoiceNumber: 'INV-2026-00001', amount: 5000, dueDate: '2026-07-04', paidAt: '-', status: 'OVERDUE', clientName: 'Xantivation Dev', contractTitle: 'SaaS Agreement - Xantivation Dev' },
  { id: '2', invoiceNumber: 'INV-2026-00002', amount: 15000, dueDate: '2026-08-30', paidAt: '-', status: 'PENDING', clientName: 'CyberCore LLC', contractTitle: 'Consultancy Agreement - CyberCore LLC' },
  { id: '3', invoiceNumber: 'INV-2026-00003', amount: 2000, dueDate: '2026-06-30', paidAt: '2026-06-28 10:15', status: 'PAID', clientName: 'Xantivation Dev', contractTitle: 'SaaS Agreement - Xantivation Dev' },
];

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function Payments() {
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null);

  // Form states
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [clientName, setClientName] = useState('');
  const [contractTitle, setContractTitle] = useState('');

  const handleSimulatePayment = (rec: PaymentRecord) => {
    message.loading(`Processing payment for ${rec.invoiceNumber}...`);
    setTimeout(() => {
      setPayments(
        payments.map((p) =>
          p.id === rec.id
            ? { ...p, status: 'PAID', paidAt: new Date().toISOString().replace('T', ' ').substring(0, 16) }
            : p,
        ),
      );
      message.success(`Invoice ${rec.invoiceNumber} paid successfully.`);
    }, 1500);
  };

  const columns: ColumnProps<PaymentRecord>[] = [
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (val, rec) => (
        <div>
          <span className="font-mono text-xs font-semibold bg-[var(--color-surface)] px-2 py-1 rounded-lg border border-[var(--color-border)]">
            {val}
          </span>
          {rec.status === 'OVERDUE' && (
            <span className="text-[10px] text-red-500 font-semibold ml-2 inline-flex items-center gap-0.5">
              <AlertTriangle size={10} /> Overdue
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Client / Contract',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (val, rec) => (
        <div>
          <p className="font-semibold text-[var(--color-fg)]">{val}</p>
          <p className="text-xs text-[var(--color-muted-fg)]">{rec.contractTitle}</p>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <span className="font-mono text-sm font-semibold">${amount.toLocaleString()}</span>,
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
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
      },
    },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: (val) => <span className="font-mono text-xs text-[var(--color-muted-fg)]">{val}</span> },
    { title: 'Paid At', dataIndex: 'paidAt', key: 'paidAt', render: (val) => <span className="font-mono text-xs text-[var(--color-muted-fg)]">{val}</span> },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'pay',
      render: (_, rec) => (rec.status === 'PENDING' || rec.status === 'OVERDUE') && (
        <button
          onClick={() => handleSimulatePayment(rec)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white transition-all cursor-pointer"
        >
          <CreditCard size={12} />
          <span>Pay</span>
        </button>
      ),
    },
  ];

  const handleOpenCreate = () => {
    setEditingPayment(null);
    setAmount('');
    setDueDate('');
    setStatus('PENDING');
    setClientName('');
    setContractTitle('');
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: PaymentRecord) => {
    setEditingPayment(rec);
    setAmount(String(rec.amount));
    setDueDate(rec.dueDate);
    setStatus(rec.status);
    setClientName(rec.clientName);
    setContractTitle(rec.contractTitle);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingPayment) {
      setPayments(
        payments.map((p) =>
          p.id === editingPayment.id
            ? { ...p, amount: Number(amount), dueDate, status, clientName, contractTitle }
            : p,
        ),
      );
      message.success('Payment term updated successfully');
    } else {
      const year = new Date().getFullYear();
      const invoiceNumber = `INV-${year}-${String(payments.length + 1).padStart(5, '0')}`;
      const newPayment: PaymentRecord = {
        id: String(payments.length + 1),
        invoiceNumber,
        amount: Number(amount),
        dueDate,
        paidAt: '-',
        status,
        clientName,
        contractTitle,
      };
      setPayments([...payments, newPayment]);
      message.success('Payment term created successfully');
    }
    setModalOpen(false);
  };

  const handleDelete = (rec: PaymentRecord) => {
    setPayments(payments.filter((p) => p.id !== rec.id));
    message.success('Payment term deleted successfully');
  };

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">Payments</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Manage invoicing schedules, track due dates, and process customer payments.</p>
        </div>
        <Button
          type="primary"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 h-10 px-4 rounded-xl cursor-pointer"
        >
          <Plus size={16} />
          <span>New Payment</span>
        </Button>
      </div>

      {/* Main Table */}
      <SharedTable
        columns={columns}
        dataSource={payments}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingPayment ? 'Edit Payment Term' : 'Create Payment Term'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <div className="space-y-6 pt-4">
          <FloatingInput label="Billing Amount ($)" type="number" value={amount} onChange={setAmount} required />
          <FloatingInput label="Due Date (YYYY-MM-DD)" value={dueDate} onChange={setDueDate} required />
          <FloatingInput label="Client Name" value={clientName} onChange={setClientName} required />
          <FloatingInput label="Contract Title Reference" value={contractTitle} onChange={setContractTitle} required />

          {/* Status selection */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Payment Status
            </label>
            <Select
              value={status}
              onChange={setStatus}
              options={statusOptions}
              className="w-full h-11"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => setModalOpen(false)} className="rounded-xl cursor-pointer">
              Cancel
            </Button>
            <Button type="primary" onClick={handleSave} className="rounded-xl cursor-pointer">
              Save changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
