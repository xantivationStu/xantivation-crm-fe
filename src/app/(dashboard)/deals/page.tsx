'use client';

import React, { useState } from 'react';
import { Button, Modal, Select, Switch, message } from 'antd';
import { Plus, CheckCircle, ShieldAlert } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import { FloatingInput } from '@/components/FloatingInput';

interface DealRecord {
  id: string;
  name: string;
  amount: number;
  stage: string;
  accountingApproved: boolean;
  opportunityName: string;
  companyName: string;
}

const mockDeals: DealRecord[] = [
  { id: '1', name: 'CRM Integration Deal', amount: 22000, stage: 'ACCOUNTING_CHECK', accountingApproved: false, opportunityName: 'CRM Integration Contract', companyName: 'Xantivation Dev' },
  { id: '2', name: 'Cloud Migration Consultancy Deal', amount: 11000, stage: 'SIGNING', accountingApproved: true, opportunityName: 'Cloud Migration Consultancy', companyName: 'CyberCore LLC' },
];

const stageOptions = [
  { value: 'ACCOUNTING_CHECK', label: 'Accounting Check' },
  { value: 'SIGNING', label: 'Signing' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function Deals() {
  const [deals, setDeals] = useState<DealRecord[]>(mockDeals);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<DealRecord | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState('ACCOUNTING_CHECK');
  const [accountingApproved, setAccountingApproved] = useState(false);
  const [opportunityName, setOpportunityName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const columns: ColumnProps<DealRecord>[] = [
    {
      title: 'Deal Name',
      dataIndex: 'name',
      key: 'name',
      render: (val, rec) => (
        <div>
          <p className="font-semibold text-[var(--color-fg)]">{val}</p>
          <p className="text-xs text-[var(--color-muted-fg)]">{rec.companyName}</p>
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
      title: 'Accounting Gate',
      dataIndex: 'accountingApproved',
      key: 'accountingApproved',
      render: (approved: boolean) => (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
          approved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
        }`}>
          {approved ? <CheckCircle size={12} /> : <ShieldAlert size={12} />}
          {approved ? 'Approved' : 'Pending Review'}
        </span>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => {
        let color = 'bg-gray-500/10 text-gray-500';
        if (stage === 'COMPLETED') color = 'bg-green-500/10 text-green-500';
        if (stage === 'CANCELLED') color = 'bg-red-500/10 text-red-500';
        if (stage === 'SIGNING') color = 'bg-blue-500/10 text-blue-500';
        if (stage === 'ACCOUNTING_CHECK') color = 'bg-amber-500/10 text-amber-500';
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{stage}</span>;
      },
    },
  ];

  const handleOpenCreate = () => {
    setEditingDeal(null);
    setName('');
    setAmount('');
    setStage('ACCOUNTING_CHECK');
    setAccountingApproved(false);
    setOpportunityName('');
    setCompanyName('');
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: DealRecord) => {
    setEditingDeal(rec);
    setName(rec.name);
    setAmount(String(rec.amount));
    setStage(rec.stage);
    setAccountingApproved(rec.accountingApproved);
    setOpportunityName(rec.opportunityName);
    setCompanyName(rec.companyName);
    setModalOpen(true);
  };

  const handleSave = () => {
    if ((stage === 'SIGNING' || stage === 'COMPLETED') && !accountingApproved) {
      message.error('Cannot transition stage to signing/completed without accounting approval.');
      return;
    }

    if (editingDeal) {
      setDeals(
        deals.map((d) =>
          d.id === editingDeal.id
            ? { ...d, name, amount: Number(amount), stage, accountingApproved, opportunityName, companyName }
            : d,
        ),
      );
      message.success('Deal updated successfully');
    } else {
      const newDeal: DealRecord = {
        id: String(deals.length + 1),
        name,
        amount: Number(amount),
        stage,
        accountingApproved,
        opportunityName,
        companyName,
      };
      setDeals([...deals, newDeal]);
      message.success('Deal created successfully');
    }
    setModalOpen(false);
  };

  const handleDelete = (rec: DealRecord) => {
    setDeals(deals.filter((d) => d.id !== rec.id));
    message.success('Deal deleted successfully');
  };

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">Deals</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Manage deal progression, enforce accounting check gates, and prepare contracts.</p>
        </div>
        <Button
          type="primary"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 h-10 px-4 rounded-xl cursor-pointer"
        >
          <Plus size={16} />
          <span>New Deal</span>
        </Button>
      </div>

      {/* Main Table */}
      <SharedTable
        columns={columns}
        dataSource={deals}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingDeal ? 'Edit Deal' : 'Create Deal'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <div className="space-y-6 pt-4">
          <FloatingInput label="Deal Name" value={name} onChange={setName} required />
          <FloatingInput label="Deal Value ($)" type="number" value={amount} onChange={setAmount} required />
          <FloatingInput label="Opportunity Context" value={opportunityName} onChange={setOpportunityName} required />
          <FloatingInput label="Client Company" value={companyName} onChange={setCompanyName} required />

          {/* Stage selection */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Deal Progression Stage
            </label>
            <Select
              value={stage}
              onChange={setStage}
              options={stageOptions}
              className="w-full h-11"
            />
          </div>

          {/* Accounting approved toggle */}
          <div className="flex items-center justify-between p-4 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
            <div>
              <p className="text-sm font-semibold text-[var(--color-fg)]">Accounting Approved Gate</p>
              <p className="text-xs text-[var(--color-muted-fg)]">Authorize this deal to transition into signing or completed stages.</p>
            </div>
            <Switch
              checked={accountingApproved}
              onChange={setAccountingApproved}
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
