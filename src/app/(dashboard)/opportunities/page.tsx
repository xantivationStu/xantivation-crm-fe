'use client';

import React, { useState } from 'react';
import { Button, Modal, Progress, Select, message, Tag, Drawer } from 'antd';
import { Plus, Search, Layers, List, ChevronRight, CheckCircle2, XCircle, AlertCircle, SlidersHorizontal } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import { FloatingInput } from '@/components/FloatingInput';
import Link from 'next/link';

interface OpportunityRecord {
  id: string;
  code: string;
  name: string;
  amount: number;
  stage: 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
  probability: number;
  closeDate: string;
  companyId: string;
  companyName: string;
  contactId: string;
  contactName: string;
  serviceInterest: 'WEBSITE' | 'APP_MVP' | 'BRANDING' | 'UI_UX' | 'SOCIAL_KIT' | 'MAINTENANCE' | 'CUSTOM';
  description: string;
  assignedTo: string;
  lostReason?: string;
}

const mockOpps: OpportunityRecord[] = [
  {
    id: '1',
    code: 'OPP-2026-00001',
    name: 'CRM Integration Contract',
    amount: 250000000,
    stage: 'PROPOSAL',
    probability: 50,
    closeDate: '2026-10-15',
    companyId: '1',
    companyName: 'Xantivation Dev',
    contactId: '1',
    contactName: 'John Doe',
    serviceInterest: 'CUSTOM',
    description: 'Integrate custom NestJS CRM with Next.js client portal.',
    assignedTo: 'System Admin',
  },
  {
    id: '2',
    code: 'OPP-2026-00002',
    name: 'Brand Identity Redesign',
    amount: 75000000,
    stage: 'NEGOTIATION',
    probability: 80,
    closeDate: '2026-08-30',
    companyId: '2',
    companyName: 'CyberCore LLC',
    contactId: '2',
    contactName: 'Bruce Wayne',
    serviceInterest: 'BRANDING',
    description: 'Redesign brand logo, visual system and standard social kit guidelines.',
    assignedTo: 'Jane Smith',
  },
];

const mockAccounts = [
  { id: '1', name: 'Xantivation Dev', status: 'ACTIVE', primaryContactId: '1', primaryContactName: 'John Doe' },
  { id: '2', name: 'CyberCore LLC', status: 'ACTIVE', primaryContactId: '2', primaryContactName: 'Bruce Wayne' },
];

const mockContacts = [
  { id: '1', name: 'John Doe', companyId: '1', isPrimary: true },
  { id: '2', name: 'Bruce Wayne', companyId: '2', isPrimary: true },
  { id: '3', name: 'Alfred Pennyworth', companyId: '2', isPrimary: false },
];

const serviceOptions = [
  { value: 'WEBSITE', label: 'Website Development' },
  { value: 'APP_MVP', label: 'Mobile App / MVP Build' },
  { value: 'BRANDING', label: 'Brand Guidelines' },
  { value: 'UI_UX', label: 'UI/UX Design UI Kit' },
  { value: 'SOCIAL_KIT', label: 'Social Media Kit' },
  { value: 'MAINTENANCE', label: 'Maintenance & Operations' },
  { value: 'CUSTOM', label: 'Custom Studio Services' },
];

const stages: ('QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST')[] = [
  'QUALIFICATION',
  'PROPOSAL',
  'NEGOTIATION',
  'WON',
  'LOST',
];

export default function Opportunities() {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [opps, setOpps] = useState<OpportunityRecord[]>(mockOpps);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('ALL');
  const [filterInterest, setFilterInterest] = useState('ALL');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Modal Open states
  const [modalOpen, setModalOpen] = useState(false);
  const [lostModalOpen, setLostModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<OpportunityRecord | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState<'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION'>('QUALIFICATION');
  const [probability, setProbability] = useState<number>(20);
  const [closeDate, setCloseDate] = useState('');
  const [companyId, setCompanyId] = useState('1');
  const [contactId, setContactId] = useState('1');
  const [serviceInterest, setServiceInterest] = useState<'WEBSITE' | 'APP_MVP' | 'BRANDING' | 'UI_UX' | 'SOCIAL_KIT' | 'MAINTENANCE' | 'CUSTOM'>('WEBSITE');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('System Admin');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Lost drag state
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);
  const [lostReason, setLostReason] = useState('');

  // Handle stage change auto-suggest probability
  const handleStageChange = (val: 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION') => {
    setStage(val);
    if (val === 'QUALIFICATION') setProbability(20);
    else if (val === 'PROPOSAL') setProbability(50);
    else if (val === 'NEGOTIATION') setProbability(75);
  };

  // Handle company change auto-load associated contacts and auto-select primary contact
  const handleCompanyChange = (val: string) => {
    setCompanyId(val);
    const relatedContacts = mockContacts.filter(c => c.companyId === val);
    const primary = relatedContacts.find(c => c.isPrimary) || relatedContacts[0];
    if (primary) {
      setContactId(primary.id);
    } else {
      setContactId('');
    }
  };

  const handleOpenCreate = () => {
    setEditingOpp(null);
    setName('');
    setAmount('');
    setStage('QUALIFICATION');
    setProbability(20);
    setCloseDate('');
    setCompanyId(mockAccounts[0]?.id || '');
    setContactId(mockAccounts[0]?.primaryContactId || '');
    setServiceInterest('WEBSITE');
    setDescription('');
    setAssignedTo('System Admin');
    setErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: OpportunityRecord) => {
    setEditingOpp(rec);
    setName(rec.name);
    setAmount(String(rec.amount));
    setStage(rec.stage as any);
    setProbability(rec.probability);
    setCloseDate(rec.closeDate);
    setCompanyId(rec.companyId);
    setContactId(rec.contactId);
    setServiceInterest(rec.serviceInterest);
    setDescription(rec.description);
    setAssignedTo(rec.assignedTo);
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Opportunity name is required';
    if (!amount || Number(amount) < 0) newErrors.amount = 'Please enter a valid amount';
    if (!closeDate) newErrors.closeDate = 'Expected close date is required';
    else if (new Date(closeDate) < new Date(new Date().setHours(0,0,0,0))) {
      newErrors.closeDate = 'Expected close date must be in the future';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const company = mockAccounts.find(a => a.id === companyId);
    const contact = mockContacts.find(c => c.id === contactId);

    if (editingOpp) {
      setOpps(opps.map(o => o.id === editingOpp.id ? {
        ...o,
        name,
        amount: Number(amount),
        stage: stage as any,
        probability,
        closeDate,
        companyId,
        companyName: company ? company.name : '',
        contactId,
        contactName: contact ? contact.name : '',
        serviceInterest,
        description,
        assignedTo,
      } : o));
      message.success('Opportunity updated successfully');
    } else {
      const year = new Date().getFullYear();
      const code = `OPP-${year}-${String(opps.length + 1).padStart(5, '0')}`;
      const newOpp: OpportunityRecord = {
        id: String(opps.length + 1),
        code,
        name,
        amount: Number(amount),
        stage: stage as any,
        probability,
        closeDate,
        companyId,
        companyName: company ? company.name : '',
        contactId,
        contactName: contact ? contact.name : '',
        serviceInterest,
        description,
        assignedTo,
      };
      setOpps([...opps, newOpp]);
      message.success('Opportunity created successfully');
    }
    setModalOpen(false);
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedOppId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: typeof stages[number]) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedOppId;
    if (!id) return;

    if (targetStage === 'LOST') {
      setDraggedOppId(id);
      setLostReason('');
      setLostModalOpen(true);
      return;
    }

    let prob = 10;
    if (targetStage === 'WON') prob = 100;
    else if (targetStage === 'NEGOTIATION') prob = 80;
    else if (targetStage === 'PROPOSAL') prob = 50;
    else if (targetStage === 'QUALIFICATION') prob = 20;

    setOpps(opps.map(o => o.id === id ? { ...o, stage: targetStage, probability: prob } : o));
    message.success(`Moved opportunity to ${targetStage}`);
    setDraggedOppId(null);
  };

  const handleSaveLost = () => {
    if (!lostReason.trim()) {
      message.error('Please enter a reason for losing this opportunity');
      return;
    }
    setOpps(opps.map(o => o.id === draggedOppId ? { ...o, stage: 'LOST', probability: 0, lostReason } : o));
    message.success('Opportunity marked as CLOSED LOST');
    setLostModalOpen(false);
    setDraggedOppId(null);
  };

  // Filter Opps
  const filteredOpps = opps.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === 'ALL' || o.stage === filterStage;
    const matchesInterest = filterInterest === 'ALL' || o.serviceInterest === filterInterest;
    return matchesSearch && matchesStage && matchesInterest;
  });

  // Table Columns
  const tableColumns: ColumnProps<OpportunityRecord>[] = [
    {
      title: 'Opp Code',
      dataIndex: 'code',
      key: 'code',
      render: (val, rec) => (
        <Link href={`/opportunities/${rec.id}`} className="font-mono text-xs font-semibold bg-[var(--color-surface)] px-2.5 py-1 rounded-lg border border-[var(--color-border)] hover:text-[var(--color-accent)] transition-colors">
          {val}
        </Link>
      ),
    },
    {
      title: 'Opportunity Name',
      dataIndex: 'name',
      key: 'name',
      render: (val, rec) => (
        <div>
          <Link href={`/opportunities/${rec.id}`} className="font-semibold text-[var(--color-fg)] hover:underline block">
            {val}
          </Link>
          <span className="text-[10px] text-[var(--color-muted-fg)] font-mono">{rec.serviceInterest}</span>
        </div>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (val, rec) => (
        <Link href={`/customers/accounts/${rec.companyId}`} className="text-xs font-semibold text-[var(--color-accent)] hover:underline">
          {val}
        </Link>
      ),
    },
    {
      title: 'Estimated Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (val) => <span className="font-mono font-semibold text-xs text-[var(--color-fg)]">{val.toLocaleString('vi-VN')} VND</span>,
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (st) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
          st === 'WON' ? 'bg-green-500/10 text-green-500' :
          st === 'LOST' ? 'bg-red-500/10 text-red-500' :
          st === 'NEGOTIATION' ? 'bg-amber-500/10 text-amber-600' :
          st === 'PROPOSAL' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
        }`}>{st}</span>
      ),
    },
    {
      title: 'Probability',
      dataIndex: 'probability',
      key: 'probability',
      render: (val) => (
        <div className="flex items-center gap-2 min-w-[80px]">
          <Progress percent={val} size="small" showInfo={false} strokeColor="var(--color-accent)" />
          <span className="text-xs font-semibold font-mono">{val}%</span>
        </div>
      ),
    },
    {
      title: 'Target Close',
      dataIndex: 'closeDate',
      key: 'closeDate',
      render: (val) => <span className="text-xs font-mono text-[var(--color-muted-fg)]">{val}</span>,
    },
  ];

  const activeFiltersCount =
    (filterStage !== 'ALL' ? 1 : 0) + (filterInterest !== 'ALL' ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-fg)]">Opportunities</h1>
          <p className="text-sm text-[var(--color-muted-fg)] mt-1">Track deals pipelines, estimations, and drag-and-drop sales stages.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-xl px-3 py-2 w-full md:w-64">
            <Search size={15} className="text-[var(--color-muted-fg)]" />
            <input
              type="text"
              placeholder="Search deals, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-[var(--color-fg)] placeholder-[var(--color-muted-fg)] w-full"
            />
          </div>

          {/* Toggle View Mode */}
          <div className="bg-[var(--color-bg-tint)] p-1 rounded-xl border border-[var(--color-border)] flex h-10 items-center">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-[var(--color-surface)] text-[var(--color-fg)] shadow-sm' : 'text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
              }`}
            >
              <Layers size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-[var(--color-surface)] text-[var(--color-fg)] shadow-sm' : 'text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
              }`}
            >
              <List size={16} />
            </button>
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

          <Button
            type="primary"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 h-10 px-4 rounded-xl cursor-pointer"
          >
            <Plus size={16} />
            <span>New Opportunity</span>
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
                  setFilterStage('ALL');
                  setFilterInterest('ALL');
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
              Opportunity Stage
            </label>
            <Select
              value={filterStage}
              onChange={setFilterStage}
              className="w-full h-11"
              options={[
                { value: 'ALL', label: 'All Stages' },
                { value: 'QUALIFICATION', label: 'Qualification' },
                { value: 'PROPOSAL', label: 'Proposal' },
                { value: 'NEGOTIATION', label: 'Negotiation' },
                { value: 'WON', label: 'Won' },
                { value: 'LOST', label: 'Lost' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Service Interest
            </label>
            <Select
              value={filterInterest}
              onChange={setFilterInterest}
              className="w-full h-11"
              options={[
                { value: 'ALL', label: 'All Service Interests' },
                ...serviceOptions,
              ]}
            />
          </div>
        </div>
      </Drawer>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto min-h-[500px]">
          {stages.map(st => {
            const stageOpps = filteredOpps.filter(o => o.stage === st);
            const stageTotal = stageOpps.reduce((sum, o) => sum + o.amount, 0);

            return (
              <div
                key={st}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, st)}
                className="bg-[var(--color-bg-tint)] rounded-2xl p-3 flex flex-col min-h-[450px] border border-[var(--color-border)]"
              >
                {/* Column Header */}
                <div className="mb-4 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold tracking-wider uppercase text-[var(--color-fg)]">
                      {st === 'QUALIFICATION' ? 'Qualification' :
                       st === 'PROPOSAL' ? 'Proposal' :
                       st === 'NEGOTIATION' ? 'Negotiation' :
                       st === 'WON' ? 'Closed Won' : 'Closed Lost'}
                    </span>
                    <span className="text-[10px] bg-[var(--color-surface)] text-[var(--color-muted-fg)] font-semibold font-mono px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                      {stageOpps.length}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[var(--color-muted-fg)] font-semibold">
                    {stageTotal.toLocaleString('vi-VN')} VND
                  </p>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
                  {stageOpps.map(opp => (
                    <div
                      key={opp.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, opp.id)}
                      className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-xl p-4 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all space-y-3 group relative"
                    >
                      <div>
                        <Link href={`/opportunities/${opp.id}`} className="font-semibold text-xs text-[var(--color-fg)] hover:underline block mb-0.5">
                          {opp.name}
                        </Link>
                        <span className="text-[10px] text-[var(--color-muted-fg)] font-semibold">{opp.companyName}</span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-[var(--color-muted-fg)] font-mono">
                        <span>{opp.closeDate}</span>
                        <span className="font-semibold text-[var(--color-fg)]">{opp.amount.toLocaleString('vi-VN')} VND</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Progress percent={opp.probability} size="small" showInfo={false} strokeColor="var(--color-accent)" className="m-0" />
                        <span className="text-[10px] font-mono font-semibold">{opp.probability}%</span>
                      </div>

                      {opp.lostReason && (
                        <div className="text-[10px] text-red-500 bg-red-500/5 p-1.5 rounded-lg border border-red-500/10 flex items-start gap-1 font-mono">
                          <AlertCircle size={10} className="shrink-0 mt-0.5" />
                          <span>{opp.lostReason}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {stageOpps.length === 0 && (
                    <div className="h-28 border border-dashed border-[var(--color-border)] rounded-xl flex items-center justify-center text-[10px] text-[var(--color-muted-fg)]">
                      Drag here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
          <SharedTable
            columns={tableColumns}
            dataSource={filteredOpps}
            onEdit={handleOpenEdit}
            onDelete={(rec) => {
              setOpps(opps.filter(o => o.id !== rec.id));
              message.success('Opportunity deleted successfully');
            }}
          />
        </div>
      )}

      {/* Create / Edit Opportunity Modal */}
      <Modal
        title={editingOpp ? 'Edit Opportunity' : 'Create Opportunity'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <div className="space-y-6 pt-4">
          <FloatingInput label="Opportunity Title" value={name} onChange={setName} required />
          {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FloatingInput label="Estimated Amount (VND)" type="number" value={amount} onChange={setAmount} required />
              {errors.amount && <p className="text-red-500 text-[10px] mt-1">{errors.amount}</p>}
            </div>
            <div>
              <FloatingInput label="Target Close Date (YYYY-MM-DD)" type="date" value={closeDate} onChange={setCloseDate} required />
              {errors.closeDate && <p className="text-red-500 text-[10px] mt-1">{errors.closeDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Associated Customer Account
              </label>
              <Select
                value={companyId}
                onChange={handleCompanyChange}
                options={mockAccounts.map(a => ({ value: a.id, label: a.name }))}
                className="w-full h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Representative Contact
              </label>
              <Select
                value={contactId}
                onChange={setContactId}
                options={mockContacts.filter(c => c.companyId === companyId).map(c => ({ value: c.id, label: c.name }))}
                className="w-full h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text(--color-muted-fg)">
                Sales Stage
              </label>
              <Select
                value={stage}
                onChange={handleStageChange}
                options={[
                  { value: 'QUALIFICATION', label: 'Qualification (20%)' },
                  { value: 'PROPOSAL', label: 'Proposal (50%)' },
                  { value: 'NEGOTIATION', label: 'Negotiation (75%)' },
                ]}
                className="w-full h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Service Interest
              </label>
              <Select
                value={serviceInterest}
                onChange={setServiceInterest}
                options={serviceOptions}
                className="w-full h-11"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Scope Description
            </label>
            <textarea
              placeholder="Describe scope, notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-fg)] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={() => setModalOpen(false)} className="rounded-xl">Cancel</Button>
            <Button type="primary" onClick={handleSave} className="rounded-xl">Save changes</Button>
          </div>
        </div>
      </Modal>

      {/* Closed Lost Reason Modal */}
      <Modal
        title="Mark Opportunity as Closed Lost"
        open={lostModalOpen}
        onCancel={() => { setLostModalOpen(false); setDraggedOppId(null); }}
        onOk={handleSaveLost}
        okText="Confirm Close Lost"
        cancelText="Cancel"
      >
        <div className="space-y-4 pt-4">
          <p className="text-xs text-[var(--color-muted-fg)]">To close this opportunity as lost, please provide a valid reason (e.g. Budget limitation, Competitor won, Scope change).</p>
          <textarea
            placeholder="Reason for loss..."
            value={lostReason}
            onChange={(e) => setLostReason(e.target.value)}
            className="w-full min-h-[100px] p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-fg)] focus:outline-none"
          />
        </div>
      </Modal>
    </div>
  );
}
