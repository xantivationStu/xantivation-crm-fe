'use client';

import React, { useState } from 'react';
import { Button, Modal, Select, message } from 'antd';
import { Plus, PenTool } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import { FloatingInput } from '@/components/FloatingInput';

interface ContractRecord {
  id: string;
  title: string;
  docusignEnvelopeId: string;
  status: string;
  signedAt: string;
  dealName: string;
  companyName: string;
}

const mockContracts: ContractRecord[] = [
  { id: '1', title: 'SaaS Agreement - Xantivation Dev', docusignEnvelopeId: 'env-90df-8b21-4432', status: 'SIGNED', signedAt: '2026-07-05 14:32', dealName: 'CRM Integration Deal', companyName: 'Xantivation Dev' },
  { id: '2', title: 'Consultancy Agreement - CyberCore LLC', docusignEnvelopeId: 'env-12ef-34ac-789a', status: 'SENT', signedAt: '-', dealName: 'Cloud Migration Consultancy Deal', companyName: 'CyberCore LLC' },
];

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'SIGNED', label: 'Signed' },
  { value: 'DECLINED', label: 'Declined' },
  { value: 'VOIDED', label: 'Voided' },
];

export default function Contracts() {
  const [contracts, setContracts] = useState<ContractRecord[]>(mockContracts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractRecord | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [docusignEnvelopeId, setDocusignEnvelopeId] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [dealName, setDealName] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleDocuSignSign = (rec: ContractRecord) => {
    message.loading(`Connecting to DocuSign Envelope: ${rec.docusignEnvelopeId}...`);
    setTimeout(() => {
      setContracts(contracts.map(c => c.id === rec.id ? { ...c, status: 'SIGNED', signedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) } : c));
      message.success('Contract signed successfully via DocuSign Connect Webhook.');
    }, 1500);
  };

  const columns: ColumnProps<ContractRecord>[] = [
    {
      title: 'Contract Title',
      dataIndex: 'title',
      key: 'title',
      render: (val, rec) => (
        <div>
          <p className="font-semibold text-[var(--color-fg)]">{val}</p>
          <p className="text-xs text-[var(--color-muted-fg)]">{rec.companyName}</p>
        </div>
      ),
    },
    {
      title: 'Envelope ID',
      dataIndex: 'docusignEnvelopeId',
      key: 'docusignEnvelopeId',
      render: (val) => <span className="font-mono text-xs text-[var(--color-muted-fg)]">{val}</span>,
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
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
      },
    },
    { title: 'Signed At', dataIndex: 'signedAt', key: 'signedAt', render: (val) => <span className="font-mono text-xs text-[var(--color-muted-fg)]">{val}</span> },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'sign',
      render: (_, rec) => rec.status === 'SENT' && (
        <button
          onClick={() => handleDocuSignSign(rec)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white transition-all cursor-pointer"
        >
          <PenTool size={12} />
          <span>Sign</span>
        </button>
      ),
    },
  ];

  const handleOpenCreate = () => {
    setEditingContract(null);
    setTitle('');
    setDocusignEnvelopeId('');
    setStatus('DRAFT');
    setDealName('');
    setCompanyName('');
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: ContractRecord) => {
    setEditingContract(rec);
    setTitle(rec.title);
    setDocusignEnvelopeId(rec.docusignEnvelopeId);
    setStatus(rec.status);
    setDealName(rec.dealName);
    setCompanyName(rec.companyName);
    setModalOpen(true);
  };

  const handleSave = () => {
    const envelope = docusignEnvelopeId || `env-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`;

    if (editingContract) {
      setContracts(
        contracts.map((c) =>
          c.id === editingContract.id
            ? { ...c, title, docusignEnvelopeId: envelope, status, dealName, companyName }
            : c,
        ),
      );
      message.success('Contract updated successfully');
    } else {
      const newContract: ContractRecord = {
        id: String(contracts.length + 1),
        title,
        docusignEnvelopeId: envelope,
        status,
        signedAt: '-',
        dealName,
        companyName,
      };
      setContracts([...contracts, newContract]);
      message.success('Contract drafted successfully');
    }
    setModalOpen(false);
  };

  const handleDelete = (rec: ContractRecord) => {
    setContracts(contracts.filter((c) => c.id !== rec.id));
    message.success('Contract deleted successfully');
  };

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">Contracts</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Manage electronic signature envelopes, track real-time DocuSign updates, and sign agreements.</p>
        </div>
        <Button
          type="primary"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 h-10 px-4 rounded-xl cursor-pointer"
        >
          <Plus size={16} />
          <span>New Contract</span>
        </Button>
      </div>

      {/* Main Table */}
      <SharedTable
        columns={columns}
        dataSource={contracts}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingContract ? 'Edit Contract' : 'Draft Contract'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <div className="space-y-6 pt-4">
          <FloatingInput label="Contract Title" value={title} onChange={setTitle} required />
          <FloatingInput label="Deal Reference" value={dealName} onChange={setDealName} required />
          <FloatingInput label="Client Company" value={companyName} onChange={setCompanyName} required />
          <FloatingInput label="DocuSign Envelope ID (Optional)" value={docusignEnvelopeId} onChange={setDocusignEnvelopeId} />

          {/* Status selection */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Envelope Status
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
