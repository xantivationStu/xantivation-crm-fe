'use client';

import React, { useState } from 'react';
import { Button, Modal, Progress, message } from 'antd';
import { Plus } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import { FloatingInput } from '@/components/FloatingInput';

interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  bantScore: number;
  status: string;
}

const mockLeads: LeadRecord[] = [
  { id: '1', name: 'Alice Smith', email: 'alice@company.com', phone: '+1234567890', company: 'Acme Corp', bantScore: 75, status: 'NEW' },
  { id: '2', name: 'John Miller', email: 'john@miller.io', phone: '+1987654321', company: 'Miller Tech', bantScore: 50, status: 'CONTACTED' },
  { id: '3', name: 'Sarah Connor', email: 'sarah@skynet.com', phone: '+15559876', company: 'Skynet Inc', bantScore: 100, status: 'QUALIFIED' },
];

export default function Leads() {
  const [leads, setLeads] = useState<LeadRecord[]>(mockLeads);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadRecord | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [budgetApproved, setBudgetApproved] = useState(false);
  const [authorityMarker, setAuthorityMarker] = useState(false);
  const [need, setNeed] = useState('');
  const [timeline, setTimeline] = useState('');

  const columns: ColumnProps<LeadRecord>[] = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (val, rec) => (
      <div>
        <p className="font-semibold text-[var(--color-fg)]">{val}</p>
        <p className="text-xs text-[var(--color-muted-fg)]">{rec.company}</p>
      </div>
    )},
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'BANT Score',
      dataIndex: 'bantScore',
      key: 'bantScore',
      render: (score: number) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress percent={score} size="small" strokeColor="#4F46E5" showInfo={false} />
          <span className="text-xs font-mono font-semibold">{score}%</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'bg-gray-500/10 text-gray-500';
        if (status === 'QUALIFIED') color = 'bg-green-500/10 text-green-500';
        if (status === 'CONTACTED') color = 'bg-blue-500/10 text-blue-500';
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
      },
    },
  ];

  const handleOpenCreate = () => {
    setEditingLead(null);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setBudgetApproved(false);
    setAuthorityMarker(false);
    setNeed('');
    setTimeline('');
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: LeadRecord) => {
    setEditingLead(rec);
    setName(rec.name);
    setEmail(rec.email);
    setPhone(rec.phone);
    setCompany(rec.company);
    setBudgetApproved(rec.bantScore >= 50);
    setAuthorityMarker(rec.bantScore >= 75);
    setNeed(rec.bantScore >= 25 ? 'Configured need' : '');
    setTimeline(rec.bantScore % 50 === 0 ? 'Urgent' : '');
    setModalOpen(true);
  };

  const handleSave = () => {
    let score = 0;
    if (budgetApproved) score += 25;
    if (authorityMarker) score += 25;
    if (need.trim() !== '') score += 25;
    if (timeline.trim() !== '') score += 25;

    if (editingLead) {
      setLeads(leads.map(l => l.id === editingLead.id ? { ...l, name, email, phone, company, bantScore: score } : l));
      message.success('Lead updated successfully');
    } else {
      const newLead: LeadRecord = {
        id: String(leads.length + 1),
        name,
        email,
        phone,
        company,
        bantScore: score,
        status: 'NEW',
      };
      setLeads([...leads, newLead]);
      message.success('Lead created successfully');
    }
    setModalOpen(false);
  };

  const handleDelete = (rec: LeadRecord) => {
    setLeads(leads.filter(l => l.id !== rec.id));
    message.success('Lead deleted successfully');
  };

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">Leads</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Manage prospects and qualify them with BANT scores.</p>
        </div>
        <Button
          type="primary"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 h-10 px-4 rounded-xl cursor-pointer"
        >
          <Plus size={16} />
          <span>New Lead</span>
        </Button>
      </div>

      {/* Main Table */}
      <SharedTable
        columns={columns}
        dataSource={leads}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingLead ? 'Edit Lead' : 'Create Lead'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <div className="space-y-6 pt-4">
          <FloatingInput label="Full Name" value={name} onChange={setName} required />
          <FloatingInput label="Email Address" type="email" value={email} onChange={setEmail} required />
          <FloatingInput label="Phone Number" value={phone} onChange={setPhone} />
          <FloatingInput label="Company Name" value={company} onChange={setCompany} />

          {/* BANT Qualification segment */}
          <div className="pt-4 border-t border-[var(--color-border)]/50">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)] mb-4">
              BANT Qualification
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={budgetApproved}
                  onChange={(e) => setBudgetApproved(e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--color-accent)] cursor-pointer"
                />
                <span className="text-sm text-[var(--color-fg)] select-none">Budget Approved</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={authorityMarker}
                  onChange={(e) => setAuthorityMarker(e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--color-accent)] cursor-pointer"
                />
                <span className="text-sm text-[var(--color-fg)] select-none">Authority Confirmed</span>
              </label>
            </div>
            <div className="space-y-4 mt-2">
              <FloatingInput label="Describe Need" value={need} onChange={setNeed} />
              <FloatingInput label="Timeline / Deadline" value={timeline} onChange={setTimeline} />
            </div>
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
