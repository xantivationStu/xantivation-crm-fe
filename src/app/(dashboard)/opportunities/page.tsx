'use client';

import React, { useState } from 'react';
import { Button, Modal, Progress, Select, message } from 'antd';
import { Plus } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import { FloatingInput } from '@/components/FloatingInput';

interface OpportunityRecord {
  id: string;
  name: string;
  amount: number;
  stage: string;
  probability: number;
  closeDate: string;
  companyName: string;
}

const mockOpps: OpportunityRecord[] = [
  { id: '1', name: 'CRM Integration Contract', amount: 25000, stage: 'PROPOSAL', probability: 50, closeDate: '2026-10-15', companyName: 'Xantivation Dev' },
  { id: '2', name: 'Cloud Migration Consultancy', amount: 12000, stage: 'NEGOTIATION', probability: 80, closeDate: '2026-08-30', companyName: 'CyberCore LLC' },
  { id: '3', name: 'Automated Invoicing Engine', amount: 8500, stage: 'WON', probability: 100, closeDate: '2026-06-20', companyName: 'CyberCore LLC' },
];

const stageOptions = [
  { value: 'PROSPECTING', label: 'Prospecting (10%)' },
  { value: 'QUALIFICATION', label: 'Qualification (20%)' },
  { value: 'PROPOSAL', label: 'Proposal (50%)' },
  { value: 'NEGOTIATION', label: 'Negotiation (80%)' },
  { value: 'WON', label: 'Closed Won (100%)' },
  { value: 'LOST', label: 'Closed Lost (0%)' },
];

export default function Opportunities() {
  const [opps, setOpps] = useState<OpportunityRecord[]>(mockOpps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<OpportunityRecord | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState('PROSPECTING');
  const [closeDate, setCloseDate] = useState('');
  const [companyName, setCompanyName] = useState('');

  const columns: ColumnProps<OpportunityRecord>[] = [
    {
      title: 'Opportunity Name',
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
      title: 'Probability',
      dataIndex: 'probability',
      key: 'probability',
      render: (prob: number) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress percent={prob} size="small" strokeColor="#4F46E5" showInfo={false} />
          <span className="text-xs font-mono font-semibold">{prob}%</span>
        </div>
      ),
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => {
        let color = 'bg-gray-500/10 text-gray-500';
        if (stage === 'WON') color = 'bg-green-500/10 text-green-500';
        if (stage === 'LOST') color = 'bg-red-500/10 text-red-500';
        if (stage === 'NEGOTIATION') color = 'bg-orange-500/10 text-orange-500';
        if (stage === 'PROPOSAL') color = 'bg-blue-500/10 text-blue-500';
        if (stage === 'QUALIFICATION') color = 'bg-purple-500/10 text-purple-500';
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{stage}</span>;
      },
    },
    { title: 'Close Date', dataIndex: 'closeDate', key: 'closeDate', render: (val) => <span className="font-mono text-xs text-[var(--color-muted-fg)]">{val}</span> },
  ];

  const handleOpenCreate = () => {
    setEditingOpp(null);
    setName('');
    setAmount('');
    setStage('PROSPECTING');
    setCloseDate('');
    setCompanyName('');
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: OpportunityRecord) => {
    setEditingOpp(rec);
    setName(rec.name);
    setAmount(String(rec.amount));
    setStage(rec.stage);
    setCloseDate(rec.closeDate);
    setCompanyName(rec.companyName);
    setModalOpen(true);
  };

  const handleStageChange = (newStage: string) => {
    setStage(newStage);
  };

  const handleSave = () => {
    let prob = 10;
    if (stage === 'WON') prob = 100;
    else if (stage === 'LOST') prob = 0;
    else if (stage === 'NEGOTIATION') prob = 80;
    else if (stage === 'PROPOSAL') prob = 50;
    else if (stage === 'QUALIFICATION') prob = 20;

    if (editingOpp) {
      setOpps(
        opps.map((o) =>
          o.id === editingOpp.id
            ? { ...o, name, amount: Number(amount), stage, probability: prob, closeDate, companyName }
            : o,
        ),
      );
      message.success('Opportunity updated successfully');
    } else {
      const newOpp: OpportunityRecord = {
        id: String(opps.length + 1),
        name,
        amount: Number(amount),
        stage,
        probability: prob,
        closeDate,
        companyName,
      };
      setOpps([...opps, newOpp]);
      message.success('Opportunity created successfully');
    }
    setModalOpen(false);
  };

  const handleDelete = (rec: OpportunityRecord) => {
    setOpps(opps.filter((o) => o.id !== rec.id));
    message.success('Opportunity deleted successfully');
  };

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">Opportunities</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Track deals, stages, close dates, and probability conversion.</p>
        </div>
        <Button
          type="primary"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 h-10 px-4 rounded-xl cursor-pointer"
        >
          <Plus size={16} />
          <span>New Opportunity</span>
        </Button>
      </div>

      {/* Main Table */}
      <SharedTable
        columns={columns}
        dataSource={opps}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingOpp ? 'Edit Opportunity' : 'Create Opportunity'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <div className="space-y-6 pt-4">
          <FloatingInput label="Opportunity Title" value={name} onChange={setName} required />
          <FloatingInput label="Estimated Amount ($)" type="number" value={amount} onChange={setAmount} required />
          <FloatingInput label="Target Customer Company" value={companyName} onChange={setCompanyName} required />
          <FloatingInput label="Target Close Date (YYYY-MM-DD)" value={closeDate} onChange={setCloseDate} required />

          {/* Stage selection */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Sales Stage
            </label>
            <Select
              value={stage}
              onChange={handleStageChange}
              options={stageOptions}
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
