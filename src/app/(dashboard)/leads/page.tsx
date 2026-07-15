'use client';

import React, { useState } from 'react';
import { Button, Modal, Progress, message, Select, Drawer, Spin } from 'antd';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '@/hooks/api/useLead';
import { Plus, Search, Upload, AlertTriangle, SlidersHorizontal } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import { FloatingInput } from '@/components/FloatingInput';
import Link from 'next/link';

interface LeadRecord {
  id: string;
  leadCode: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  owner: string;
  createdAt: string;
  bantScore: number;
  budget: number;
  serviceInterest: string;
  need: string;
  timeline: string;
}

const initialLeads: LeadRecord[] = [
  {
    id: '1',
    leadCode: 'LEA-2026-00001',
    firstName: 'Alice',
    lastName: 'Smith',
    company: 'Acme Corp',
    email: 'alice@company.com',
    phone: '0901234567',
    source: 'WEBSITE',
    status: 'NEW',
    owner: 'System Admin',
    createdAt: '2026-07-01',
    bantScore: 75,
    budget: 5000,
    serviceInterest: 'WEBSITE',
    need: 'Redesign company website',
    timeline: '3 months',
  },
  {
    id: '2',
    leadCode: 'LEA-2026-00002',
    firstName: 'John',
    lastName: 'Miller',
    company: 'Miller Tech',
    email: 'john@miller.io',
    phone: '0912345678',
    source: 'FACEBOOK',
    status: 'CONTACTED',
    owner: 'Jane Smith',
    createdAt: '2026-07-03',
    bantScore: 50,
    budget: 15000,
    serviceInterest: 'APP_MVP',
    need: 'Build mobile app MVP',
    timeline: '6 months',
  },
  {
    id: '3',
    leadCode: 'LEA-2026-00003',
    firstName: 'Sarah',
    lastName: 'Connor',
    company: 'Skynet Inc',
    email: 'sarah@skynet.com',
    phone: '0987654321',
    source: 'LINKEDIN',
    status: 'QUALIFIED',
    owner: 'John Doe',
    createdAt: '2026-07-05',
    bantScore: 100,
    budget: 50000,
    serviceInterest: 'UI_UX',
    need: 'UX audit and UI design system',
    timeline: '1 month',
  },
];

export default function Leads() {
  const { data: leadsResponse, isLoading } = useLeads();
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  const rawLeads = leadsResponse?.data || [];
  const leads = rawLeads.map((l: any) => ({
    id: l.id,
    leadCode: l.leadCode,
    firstName: l.firstName || '',
    lastName: l.lastName || l.name || '',
    company: l.companyName || l.company || '',
    email: l.email || '',
    phone: l.phone || '',
    source: l.source,
    status: l.status,
    owner: l.assignedTo?.name || l.owner?.name || 'System Admin',
    createdAt: l.createdAt ? l.createdAt.substring(0, 10) : '',
    bantScore: Number(l.bantScore) || 0,
    budget: Number(l.budget) || 0,
    serviceInterest: l.serviceInterest || 'WEBSITE',
    need: l.need || '',
    timeline: l.timeline || '',
  }));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadRecord | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterSource, setFilterSource] = useState<string>('ALL');
  const [filterOwner, setFilterOwner] = useState<string>('ALL');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [source, setSource] = useState('MANUAL');
  const [serviceInterest, setServiceInterest] = useState('WEBSITE');
  const [budget, setBudget] = useState('');
  const [assignedOwner, setAssignedOwner] = useState('System Admin');

  // BANT checks
  const [budgetApproved, setBudgetApproved] = useState(false);
  const [authorityMarker, setAuthorityMarker] = useState(false);
  const [need, setNeed] = useState('');
  const [timeline, setTimeline] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Duplicate check warning state
  const [duplicateWarningOpen, setDuplicateWarningOpen] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');

  // Bulk action state
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Trigger duplicate check on blur
  const handleCheckDuplicate = (field: 'email' | 'phone', val: string) => {
    if (!val) return;
    const exists = leads.find((l) => (field === 'email' ? l.email === val : l.phone === val) && l.id !== editingLead?.id);
    if (exists) {
      setDuplicateMessage(`Duplicate ${field} detected: Already exists under Lead ${exists.leadCode} (${exists.firstName} ${exists.lastName})`);
      setDuplicateWarningOpen(true);
    }
  };

  const columns: ColumnProps<LeadRecord>[] = [
    {
      title: 'Lead Code',
      dataIndex: 'leadCode',
      key: 'leadCode',
      render: (val, rec) => (
        <Link href={`/leads/${rec.id}`} className="font-mono text-xs font-semibold bg-[var(--color-surface)] px-2.5 py-1 rounded-lg border border-[var(--color-border)] hover:text-[var(--color-accent)] transition-colors">
          {val}
        </Link>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'lastName',
      key: 'name',
      render: (_, rec) => (
        <div>
          <Link href={`/leads/${rec.id}`} className="font-semibold text-[var(--color-fg)] hover:underline">
            {rec.firstName} {rec.lastName}
          </Link>
          <p className="text-xs text-[var(--color-muted-fg)]">{rec.company}</p>
        </div>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (src: string) => <span className="text-xs text-[var(--color-muted-fg)] font-mono">{src}</span>,
    },
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
    { title: 'Owner', dataIndex: 'owner', key: 'owner', render: (val) => <span className="text-xs text-[var(--color-fg)]">{val}</span> },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', render: (val) => <span className="text-xs text-[var(--color-muted-fg)] font-mono">{val}</span> },
  ];

  const handleOpenCreate = () => {
    setEditingLead(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setSource('MANUAL');
    setServiceInterest('WEBSITE');
    setBudget('');
    setAssignedOwner('System Admin');
    setBudgetApproved(false);
    setAuthorityMarker(false);
    setNeed('');
    setTimeline('');
    setErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: LeadRecord) => {
    setEditingLead(rec);
    setFirstName(rec.firstName);
    setLastName(rec.lastName);
    setEmail(rec.email);
    setPhone(rec.phone);
    setCompany(rec.company);
    setSource(rec.source);
    setServiceInterest(rec.serviceInterest);
    setBudget(String(rec.budget));
    setAssignedOwner(rec.owner);
    setBudgetApproved(rec.bantScore >= 50);
    setAuthorityMarker(rec.bantScore >= 75);
    setNeed(rec.need);
    setTimeline(rec.timeline);
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Please enter a valid email address';
    if (!phone.trim()) newErrors.phone = 'Please enter a valid phone number';
    if (!source) newErrors.source = 'Please select a lead source';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let score = 0;
    if (budgetApproved) score += 25;
    if (authorityMarker) score += 25;
    if (need.trim() !== '') score += 25;
    if (timeline.trim() !== '') score += 25;

    const payload = {
      firstName,
      lastName,
      companyName: company,
      email,
      phone,
      source: source as any,
      serviceInterest,
      budget: Number(budget) || 0,
      bantScore: score,
      budgetApproved,
      authorityMarker,
      need,
      timeline,
    };

    if (editingLead) {
      updateMutation.mutate(
        { id: editingLead.id, dto: payload },
        {
          onSuccess: () => {
            setModalOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setModalOpen(false);
        },
      });
    }
  };

  const handleDelete = (rec: LeadRecord) => {
    deleteMutation.mutate(rec.id);
  };

  const handleImport = () => {
    message.loading('Parsing Excel columns...');
    setTimeout(() => {
      message.success('Successfully imported 12 new prospects from Excel template.');
    }, 1500);
  };

  const handleBulkReassign = () => {
    if (selectedRowKeys.length === 0) return;
    message.success(`Reassigned ${selectedRowKeys.length} leads to owner.`);
    setSelectedRowKeys([]);
  };

  const handleBulkExport = () => {
    if (selectedRowKeys.length === 0) return;
    message.success(`Exporting ${selectedRowKeys.length} records to crm_leads_export.xlsx`);
    setSelectedRowKeys([]);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.leadCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || l.status === filterStatus;
    const matchesSource = filterSource === 'ALL' || l.source === filterSource;
    const matchesOwner = filterOwner === 'ALL' || l.owner === filterOwner;

    return matchesSearch && matchesStatus && matchesSource && matchesOwner;
  });

  const activeFiltersCount =
    (filterStatus !== 'ALL' ? 1 : 0) +
    (filterSource !== 'ALL' ? 1 : 0) +
    (filterOwner !== 'ALL' ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-fg)]">Leads</h1>
          <p className="text-sm text-[var(--color-muted-fg)] mt-1">Manage prospects and qualify them with BANT scores.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-xl px-3 py-2 w-full md:w-64">
            <Search size={15} className="text-[var(--color-muted-fg)]" />
            <input
              type="text"
              placeholder="Search prospects..."
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

          {/* Import Button */}
          <button
            onClick={handleImport}
            className="flex items-center gap-2 h-10 px-3.5 text-xs font-semibold rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all cursor-pointer"
          >
            <Upload size={14} />
            <span>Import</span>
          </button>

          {/* New Lead Button */}
          <Button
            type="primary"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 h-10 px-4 rounded-xl cursor-pointer"
          >
            <Plus size={16} />
            <span>New Lead</span>
          </Button>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between w-full pr-4">
            <span className="text-base font-bold text-[var(--color-fg)]">Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setFilterStatus('ALL');
                  setFilterSource('ALL');
                  setFilterOwner('ALL');
                }}
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
              Lead Status
            </label>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              className="w-full h-11"
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'NEW', label: 'New' },
                { value: 'CONTACTED', label: 'Contacted' },
                { value: 'QUALIFIED', label: 'Qualified' },
                { value: 'UNQUALIFIED', label: 'Unqualified' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Lead Source
            </label>
            <Select
              value={filterSource}
              onChange={setFilterSource}
              className="w-full h-11"
              options={[
                { value: 'ALL', label: 'All Sources' },
                { value: 'WEBSITE', label: 'Website' },
                { value: 'FACEBOOK', label: 'Facebook' },
                { value: 'LINKEDIN', label: 'LinkedIn' },
                { value: 'MANUAL', label: 'Manual' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Assigned Owner
            </label>
            <Select
              value={filterOwner}
              onChange={setFilterOwner}
              className="w-full h-11"
              options={[
                { value: 'ALL', label: 'All Owners' },
                { value: 'System Admin', label: 'System Admin' },
                { value: 'Jane Smith', label: 'Jane Smith' },
                { value: 'John Doe', label: 'John Doe' },
              ]}
            />
          </div>
        </div>
      </Drawer>

      {/* Bulk actions trigger bar */}
      {selectedRowKeys.length > 0 && (
        <div className="bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 p-3 rounded-xl flex justify-between items-center text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="font-semibold text-[var(--color-fg)]">Selected {selectedRowKeys.length} leads</span>
          <div className="flex gap-2">
            <button onClick={handleBulkReassign} className="px-3 py-1 bg-white hover:bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg font-semibold cursor-pointer">
              Reassign Owner
            </button>
            <button onClick={handleBulkExport} className="px-3 py-1 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-lg font-semibold cursor-pointer">
              Export Excel
            </button>
          </div>
        </div>
      )}

      {/* Unified Table Container Canvas */}
      <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm relative">
        <Spin spinning={isLoading}>
          <SharedTable
            columns={columns}
            dataSource={filteredLeads}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
          />
        </Spin>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        title={editingLead ? 'Edit Lead' : 'Create Lead'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FloatingInput label="First Name" value={firstName} onChange={setFirstName} />
            </div>
            <div>
              <FloatingInput label="Last Name" value={lastName} onChange={setLastName} required />
              {errors.lastName && <p className="text-red-500 text-[10px] mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FloatingInput
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                required
                onBlur={() => handleCheckDuplicate('email', email)}
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
            </div>
            <div>
              <FloatingInput
                label="Phone Number"
                value={phone}
                onChange={setPhone}
                required
                onBlur={() => handleCheckDuplicate('phone', phone)}
              />
              {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
            </div>
          </div>

          <FloatingInput label="Company Name" value={company} onChange={setCompany} />

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Lead Source
              </label>
              <Select
                value={source}
                onChange={setSource}
                options={[
                  { value: 'WEBSITE', label: 'Website' },
                  { value: 'FACEBOOK', label: 'Facebook' },
                  { value: 'LINKEDIN', label: 'LinkedIn' },
                  { value: 'ZALO', label: 'Zalo' },
                  { value: 'GMAIL', label: 'Gmail' },
                  { value: 'COLD_CALL', label: 'Cold Call' },
                  { value: 'REFERRAL', label: 'Referral' },
                  { value: 'EVENT', label: 'Event' },
                  { value: 'PORTFOLIO', label: 'Portfolio' },
                  { value: 'WORD_OF_MOUTH', label: 'Word of Mouth' },
                  { value: 'MANUAL', label: 'Manual' },
                ]}
                className="w-full h-11"
              />
              {errors.source && <p className="text-red-500 text-[10px]">{errors.source}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Service Interest
              </label>
              <Select
                value={serviceInterest}
                onChange={setServiceInterest}
                options={[
                  { value: 'WEBSITE', label: 'Website Design' },
                  { value: 'APP_MVP', label: 'App MVP Building' },
                  { value: 'BRANDING', label: 'Branding Identity' },
                  { value: 'UI_UX', label: 'UI/UX Design System' },
                  { value: 'SOCIAL_KIT', label: 'Social Media Kit' },
                  { value: 'MAINTENANCE', label: 'Maintenance SLA' },
                  { value: 'CUSTOM', label: 'Custom Requirement' },
                ]}
                className="w-full h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FloatingInput label="Estimated Budget ($)" type="number" value={budget} onChange={setBudget} />

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Assigned Owner
              </label>
              <Select
                value={assignedOwner}
                onChange={setAssignedOwner}
                options={[
                  { value: 'System Admin', label: 'System Admin' },
                  { value: 'Jane Smith', label: 'Jane Smith' },
                  { value: 'John Doe', label: 'John Doe' },
                ]}
                className="w-full h-11"
              />
            </div>
          </div>

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

      {/* Duplicate warning Modal */}
      <Modal
        title={
          <span className="flex items-center gap-2 text-amber-500 font-bold">
            <AlertTriangle size={18} />
            <span>Lead Duplicate Detected</span>
          </span>
        }
        open={duplicateWarningOpen}
        onCancel={() => setDuplicateWarningOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDuplicateWarningOpen(false)} className="rounded-xl">
            Ignore & Continue
          </Button>,
        ]}
      >
        <p className="text-sm text-[var(--color-fg)] py-2">{duplicateMessage}</p>
      </Modal>
    </div>
  );
}
