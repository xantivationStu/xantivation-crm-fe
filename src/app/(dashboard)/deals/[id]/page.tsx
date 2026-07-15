'use client';

import React, { useState, use } from 'react';
import { Button, Steps, Select, Modal, Progress, message, Table } from 'antd';
import { ArrowLeft, User, Calendar, Plus, Trash2, ArrowRight, UserCheck, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Landmark } from 'lucide-react';
import Link from 'next/link';

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

interface DealRecord {
  id: string;
  code: string;
  name: string;
  amount: number;
  stage: 'DRAFT' | 'INTERNAL_REVIEW' | 'CUSTOMER_REVIEW' | 'CLOSED_WON' | 'CLOSED_LOST';
  expectedStart?: string;
  paymentTerms?: string;
  timeline?: string;
  reviewNotes?: string;
  assignedToName: string;
  opportunityId: string;
  opportunityName: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  milestones: DealMilestoneRecord[];
  scopes: ScopeItemRecord[];
}

const mockDeals: DealRecord[] = [
  {
    id: '1',
    code: 'DEAL-2026-00001',
    name: 'CRM Integration Deal',
    amount: 209000000,
    stage: 'DRAFT',
    expectedStart: '2026-09-30',
    paymentTerms: '50% upfront, 50% on final delivery',
    timeline: '4-6 weeks after contract signing',
    reviewNotes: '',
    assignedToName: 'System Admin',
    opportunityId: '1',
    opportunityName: 'CRM Integration Contract',
    companyName: 'Xantivation Dev',
    contactName: 'Phan Manh',
    contactEmail: 'manh@xantivation.com',
    contactPhone: '0988777666',
    createdAt: '2026-07-06',
    milestones: [],
    scopes: [
      { itemName: 'Next.js Frontend Shell', description: 'Dashboard views and charts', fixedPrice: 120000000, estimatedEffort: '3 weeks', deliverables: 'Source code files' },
      { itemName: 'NestJS Backend API core', description: 'REST APIs and DB migration schema', fixedPrice: 80000000, estimatedEffort: '2 weeks', deliverables: 'Backend source files' },
    ],
  },
  {
    id: '2',
    code: 'DEAL-2026-00002',
    name: 'CyberCore Brand Strategy Deal',
    amount: 82500000,
    stage: 'CLOSED_WON',
    expectedStart: '2026-08-15',
    paymentTerms: '100% advance payment',
    timeline: '3 weeks',
    reviewNotes: 'Approved by accounting and manager.',
    assignedToName: 'Jane Smith',
    opportunityId: '2',
    opportunityName: 'Brand Identity Redesign',
    companyName: 'CyberCore LLC',
    contactName: 'David Lee',
    contactEmail: 'david@cybercore.io',
    contactPhone: '0911222333',
    createdAt: '2026-07-05',
    milestones: [
      { milestoneName: 'Initial Deposit Payment', percentage: 100, amount: 82500000, dueDate: '2026-08-15', acceptanceCondition: 'Sign contract and kick-off project' },
    ],
    scopes: [
      { itemName: 'AWS Architecture Assessment', description: 'Assessment of current security issues', fixedPrice: 75000000, estimatedEffort: '1 week', deliverables: 'Detailed PDF report' },
    ],
  },
];

export default function DealDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [deal, setDeal] = useState<DealRecord | undefined>(mockDeals.find(d => d.id === id) || mockDeals[0]);
  const [activeTab, setActiveTab] = useState('overview');

  // Milestone configuration state (local copy for editing)
  const [milestones, setMilestones] = useState<DealMilestoneRecord[]>(
    deal?.milestones && deal.milestones.length > 0
      ? deal.milestones
      : [{ milestoneName: 'Kick-off Payment', percentage: 50, amount: Math.round((deal?.amount || 0) * 0.5), dueDate: '', acceptanceCondition: '' }]
  );

  const [reviewNotes, setReviewNotes] = useState('');
  const [notesModalOpen, setNotesModalOpen] = useState(false);

  if (!deal) {
    return <div className="p-8 text-center text-red-500 font-bold">Deal not found</div>;
  }

  // Visual Stepper indices
  const getStepIndex = (st: string) => {
    switch (st) {
      case 'DRAFT': return 0;
      case 'INTERNAL_REVIEW': return 1;
      case 'CUSTOMER_REVIEW': return 2;
      case 'CLOSED_WON': return 3;
      case 'CLOSED_LOST': return 3;
      default: return 0;
    }
  };

  const handleAddMilestoneRow = () => {
    const totalCurrentPercentage = milestones.reduce((sum, m) => sum + m.percentage, 0);
    const remaining = Math.max(0, 100 - totalCurrentPercentage);
    setMilestones([
      ...milestones,
      {
        milestoneName: '',
        percentage: remaining,
        amount: Math.round(deal.amount * (remaining / 100)),
        dueDate: '',
        acceptanceCondition: '',
      },
    ]);
  };

  const handleRemoveMilestoneRow = (idx: number) => {
    setMilestones(milestones.filter((_, index) => index !== idx));
  };

  const handleMilestoneFieldChange = (idx: number, field: keyof DealMilestoneRecord, val: any) => {
    const updated = [...milestones];
    
    if (field === 'percentage') {
      const percentage = Math.min(100, Math.max(0, Number(val) || 0));
      updated[idx] = {
        ...updated[idx],
        percentage,
        amount: Math.round(deal.amount * (percentage / 100)),
      };
    } else {
      updated[idx] = {
        ...updated[idx],
        [field]: val,
      };
    }

    setMilestones(updated);
  };

  // Save/Configure Milestones
  const handleSaveMilestones = () => {
    if (milestones.length === 0) {
      message.error('At least one payment milestone is required');
      return;
    }

    // Validation 1: Total percentage must equal 100%
    const totalPercentage = milestones.reduce((sum, m) => sum + m.percentage, 0);
    if (totalPercentage !== 100) {
      message.error(`Total milestone percentage must equal 100%. Currently: ${totalPercentage}%`);
      return;
    }

    // Validation 2: Sequential and future due dates
    for (let i = 0; i < milestones.length; i++) {
      const m = milestones[i];
      if (!m.milestoneName.trim()) {
        message.error(`Milestone name at row ${i + 1} is required`);
        return;
      }
      if (!m.dueDate) {
        message.error(`Due date for milestone "${m.milestoneName}" is required`);
        return;
      }

      const mDate = new Date(m.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (mDate < today) {
        message.error(`Due date for milestone "${m.milestoneName}" cannot be in the past`);
        return;
      }

      if (i > 0) {
        const prev = milestones[i - 1];
        if (prev.dueDate) {
          const prevDate = new Date(prev.dueDate);
          if (mDate < prevDate) {
            message.error(`Due dates must be sequential. "${m.milestoneName}" is set before "${prev.milestoneName}"`);
            return;
          }
        }
      }
    }

    // Apply Rounding Rule: Difference due to rounding added/subtracted to the last milestone
    const updated = [...milestones];
    const totalExceptLast = updated.slice(0, -1).reduce((sum, m) => sum + m.amount, 0);
    updated[updated.length - 1].amount = deal.amount - totalExceptLast;

    setMilestones(updated);
    setDeal({ ...deal, milestones: updated });
    message.success('Milestones configured and validated successfully.');
  };

  const handleOpenSubmitReview = () => {
    if (deal.milestones.length === 0) {
      message.error('Please configure and save payment milestones first.');
      return;
    }
    setReviewNotes('');
    setNotesModalOpen(true);
  };

  const handleConfirmSubmitReview = () => {
    setDeal({
      ...deal,
      stage: 'INTERNAL_REVIEW',
      reviewNotes,
    });
    setNotesModalOpen(false);
    message.success('Deal submitted for Internal Review successfully');
  };

  const handleApproveDeal = () => {
    if (deal.stage === 'INTERNAL_REVIEW') {
      setDeal({ ...deal, stage: 'CUSTOMER_REVIEW' });
      message.success('Deal approved by Internal Accounting check. Transitioned to CUSTOMER_REVIEW.');
    } else if (deal.stage === 'CUSTOMER_REVIEW') {
      setDeal({ ...deal, stage: 'CLOSED_WON' });
      message.success('Deal accepted by Client. Transitioned to CLOSED_WON (Related Contract is automatically generated).');
    }
  };

  const handleCloseLost = () => {
    setDeal({ ...deal, stage: 'CLOSED_LOST' });
    message.warning('Deal marked as CLOSED_LOST.');
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <div className="text-xs text-[var(--color-muted-fg)] flex items-center gap-1.5 mb-2 font-mono">
            <Link href="/deals" className="hover:underline">Deals</Link>
            <span>&gt;</span>
            <span className="text-[var(--color-fg)] font-semibold">{deal.code}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">
            {deal.name}
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Deal Code: {deal.code} • Client Company: {deal.companyName}</p>
        </div>

        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            deal.stage === 'CLOSED_WON' ? 'bg-green-500/10 text-green-500' :
            deal.stage === 'CLOSED_LOST' ? 'bg-red-500/10 text-red-500' :
            deal.stage === 'INTERNAL_REVIEW' ? 'bg-amber-500/10 text-amber-600' :
            deal.stage === 'CUSTOMER_REVIEW' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'
          }`}>
            Stage: {deal.stage}
          </span>
        </div>
      </div>

      {/* Stepper Progression */}
      <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6">
        <Steps
          current={getStepIndex(deal.stage)}
          items={[
            { title: 'Draft Config', description: 'Milestones Setup' },
            { title: 'Accounting Check', description: 'Internal Review' },
            { title: 'Customer Review', description: 'Client Sign-off' },
            { title: deal.stage === 'CLOSED_LOST' ? 'Closed Lost' : 'Closed Won', description: deal.stage === 'CLOSED_LOST' ? 'Cancelled' : 'Contract Active' },
          ]}
          status={deal.stage === 'CLOSED_LOST' ? 'error' : 'process'}
        />
      </div>

      {/* Main Grid 3:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Tabs (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex gap-6 border-b border-[var(--color-border)] pb-px">
            {[
              { id: 'overview', name: 'Overview Details' },
              { id: 'scope', name: 'Scope Snapshot' },
              { id: 'milestones', name: 'Payment Milestones' },
              { id: 'review', name: 'Internal Review' },
              { id: 'contract', name: 'Related Contract' },
            ].map(tab => (
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

          {/* Tab Body */}
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 min-h-[350px]">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-6 text-xs border-b border-[var(--color-border)]/50 pb-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Deal specifications
                    </h4>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Deal Value Amount</span>
                      <span className="font-semibold font-mono text-[var(--color-accent)]">{deal.amount.toLocaleString('vi-VN')} VND</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Sales Opportunity</span>
                      <span className="font-semibold">{deal.opportunityName}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Owner Rep</span>
                      <span className="font-semibold">{deal.assignedToName}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Client Contact Info
                    </h4>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Contact Name</span>
                      <span className="font-semibold">{deal.contactName}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Contact Email</span>
                      <span className="font-semibold font-mono">{deal.contactEmail}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Contact Phone</span>
                      <span className="font-semibold font-mono">{deal.contactPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Terms and conditions inherited */}
                <div className="grid grid-cols-2 gap-6 text-xs">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Timeline & expected start</h4>
                    <div className="bg-[var(--color-bg)] p-3 rounded-xl border border-[var(--color-border)] space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-muted-fg)]">Expected start:</span>
                        <span className="font-semibold">{deal.expectedStart || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-muted-fg)]">Proposed timeline:</span>
                        <span className="font-semibold">{deal.timeline || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Payment Terms inherited</h4>
                    <div className="bg-[var(--color-bg)] p-3 rounded-xl border border-[var(--color-border)]">
                      <p className="text-[var(--color-fg)] font-semibold">{deal.paymentTerms || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scope' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">
                  Scope Items Snapshot (Read-only for Contract Reference)
                </h3>
                
                <Table
                  columns={[
                    { title: 'Item Module Name', dataIndex: 'itemName', key: 'itemName', render: (val, r) => (
                      <div>
                        <p className="font-bold text-xs">{val}</p>
                        {r.description && <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5">{r.description}</p>}
                      </div>
                    )},
                    { title: 'Timeline Effort', dataIndex: 'estimatedEffort', key: 'estimatedEffort', render: (val) => <span className="text-xs font-mono">{val || 'N/A'}</span> },
                    { title: 'Deliverables', dataIndex: 'deliverables', key: 'deliverables', render: (val) => <span className="text-xs text-[var(--color-muted-fg)]">{val || 'N/A'}</span> },
                    { title: 'Amount Price', dataIndex: 'fixedPrice', key: 'fixedPrice', render: (val) => <span className="text-xs font-mono font-bold">{(val).toLocaleString('vi-VN')} VND</span> },
                  ]}
                  dataSource={deal.scopes.map((s, idx) => ({ ...s, key: idx }))}
                  pagination={false}
                  className="border border-[var(--color-border)] rounded-xl overflow-hidden text-xs"
                  size="small"
                />
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2.5">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-fg)]">Configure Payment Milestones</h3>
                    <p className="text-xs text-[var(--color-muted-fg)]">Structure how billing is distributed across project milestones.</p>
                  </div>
                  {deal.stage === 'DRAFT' && (
                    <Button size="small" type="dashed" onClick={handleAddMilestoneRow}>
                      + Add Milestone
                    </Button>
                  )}
                </div>

                {/* Milestone config editor */}
                <div className="space-y-4">
                  {milestones.map((m, idx) => (
                    <div key={idx} className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)] space-y-3 relative group">
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-5">
                          <label className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] block mb-1">Milestone Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Deposit Payment"
                            value={m.milestoneName}
                            onChange={(e) => handleMilestoneFieldChange(idx, 'milestoneName', e.target.value)}
                            disabled={deal.stage !== 'DRAFT'}
                            className="w-full bg-transparent border-b border-[var(--color-border)] outline-none py-1 text-xs font-semibold text-[var(--color-fg)]"
                            required
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] block mb-1">Percentage (%) *</label>
                          <input
                            type="number"
                            placeholder="50"
                            value={m.percentage || ''}
                            onChange={(e) => handleMilestoneFieldChange(idx, 'percentage', e.target.value)}
                            disabled={deal.stage !== 'DRAFT'}
                            className="w-full bg-transparent border-b border-[var(--color-border)] outline-none py-1 text-xs text-[var(--color-fg)] font-mono font-bold"
                            required
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] block mb-1">Calculated Amount</label>
                          <span className="text-xs font-mono font-bold block py-1.5">
                            {m.amount.toLocaleString('vi-VN')} VND
                          </span>
                        </div>

                        <div className="col-span-3">
                          <label className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)] block mb-1">Due Date *</label>
                          <input
                            type="date"
                            value={m.dueDate}
                            onChange={(e) => handleMilestoneFieldChange(idx, 'dueDate', e.target.value)}
                            disabled={deal.stage !== 'DRAFT'}
                            className="w-full bg-transparent border-b border-[var(--color-border)] outline-none py-1 text-xs text-[var(--color-fg)] font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Acceptance Condition Details</label>
                        <input
                          type="text"
                          placeholder="What needs to be delivered to trigger payment release?"
                          value={m.acceptanceCondition || ''}
                          onChange={(e) => handleMilestoneFieldChange(idx, 'acceptanceCondition', e.target.value)}
                          disabled={deal.stage !== 'DRAFT'}
                          className="w-full bg-transparent border-b border-[var(--color-border)] outline-none py-1 text-xs text-[var(--color-fg)] placeholder-[var(--color-muted-fg)]/60"
                        />
                      </div>

                      {deal.stage === 'DRAFT' && milestones.length > 1 && (
                        <button
                          onClick={() => handleRemoveMilestoneRow(idx)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-600 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          Delete Row
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Progress bar visual */}
                <div className="pt-4 border-t border-[var(--color-border)]/50 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-mono text-[var(--color-muted-fg)] mb-1.5">
                      Milestone Percentage Sum: {milestones.reduce((s, m) => s + m.percentage, 0)}% / 100%
                    </p>
                    <Progress
                      percent={milestones.reduce((s, m) => s + m.percentage, 0)}
                      status={milestones.reduce((s, m) => s + m.percentage, 0) === 100 ? 'success' : 'active'}
                      showInfo={false}
                    />
                  </div>
                  {deal.stage === 'DRAFT' && (
                    <Button type="primary" onClick={handleSaveMilestones} className="rounded-xl">
                      Validate & Save Milestones
                    </Button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="space-y-6 text-xs">
                <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2.5">
                  <h3 className="text-sm font-semibold text-[var(--color-fg)]">Accounting Gate Review</h3>
                  {deal.stage === 'INTERNAL_REVIEW' && (
                    <div className="flex gap-2">
                      <Button
                        type="primary"
                        onClick={handleApproveDeal}
                        className="flex items-center gap-1.5 bg-green-600 border-green-600 text-white hover:bg-green-700 h-9"
                      >
                        <ShieldCheck size={14} />
                        <span>Approve gate</span>
                      </Button>
                      <Button onClick={handleCloseLost} danger className="h-9">
                        Reject
                      </Button>
                    </div>
                  )}
                </div>

                {deal.reviewNotes && (
                  <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl space-y-1.5">
                    <p className="font-semibold text-[var(--color-fg)]">Submission Review Notes:</p>
                    <p className="text-[var(--color-muted-fg)]">{deal.reviewNotes}</p>
                  </div>
                )}

                <div className="relative border-l border-[var(--color-border)] ml-3 pl-6 space-y-6">
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 bg-[var(--color-border)] text-[var(--color-fg)] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">1</span>
                    <p className="font-semibold text-[var(--color-fg)]">Deal Auto-generated</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">{deal.createdAt} • Triggered from Quotation accept</p>
                  </div>
                  {deal.stage !== 'DRAFT' && (
                    <div className="relative">
                      <span className="absolute -left-[30px] top-0 bg-amber-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">2</span>
                      <p className="font-semibold text-[var(--color-fg)]">Submitted for Internal Accounting Check</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">Stage changed to INTERNAL_REVIEW</p>
                    </div>
                  )}
                  {(deal.stage === 'CUSTOMER_REVIEW' || deal.stage === 'CLOSED_WON') && (
                    <div className="relative">
                      <span className="absolute -left-[30px] top-0 bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">3</span>
                      <p className="font-semibold text-[var(--color-fg)]">Accounting Approved Gate Passed</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">Stage transitioned to CUSTOMER_REVIEW</p>
                    </div>
                  )}
                  {deal.stage === 'CLOSED_WON' && (
                    <div className="relative">
                      <span className="absolute -left-[30px] top-0 bg-green-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">4</span>
                      <p className="font-semibold text-[var(--color-fg)]">Deal Closed Won</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">Customer signed contract. Deal Active.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'contract' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Related Legal Contract</h3>
                {deal.stage === 'CLOSED_WON' ? (
                  <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                        <Landmark size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-[var(--color-fg)]">HĐ-{deal.name.replace(' Deal', '')}-{deal.companyName}</p>
                        <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">Status: ACTIVE • Contract Value: {deal.amount.toLocaleString('vi-VN')} VND</p>
                      </div>
                    </div>
                    <Link
                      href={`/contracts`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all"
                    >
                      <span>View contract</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--color-muted-fg)] italic">Contract is automatically generated once the deal status transitions to CLOSED_WON.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Deal Control Panel
            </h3>

            <div className="space-y-3">
              <Button
                type="primary"
                onClick={handleOpenSubmitReview}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer"
                disabled={deal.stage !== 'DRAFT'}
              >
                <CheckCircle2 size={14} />
                <span>Submit Review</span>
              </Button>

              {deal.stage === 'CUSTOMER_REVIEW' && (
                <Button
                  onClick={handleApproveDeal}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer bg-green-600 border-green-600 text-white hover:bg-green-700"
                >
                  <UserCheck size={14} />
                  <span>Accept (CLOSED_WON)</span>
                </Button>
              )}

              <Button
                onClick={handleCloseLost}
                danger
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer"
                disabled={deal.stage === 'CLOSED_WON' || deal.stage === 'CLOSED_LOST'}
              >
                <AlertTriangle size={14} />
                <span>Close Lost</span>
              </Button>
            </div>

            {/* General parameters */}
            <div className="border-t border-[var(--color-border)]/50 pt-4 space-y-3 text-xs font-mono text-[var(--color-muted-fg)]">
              <div className="flex justify-between">
                <span>Value:</span>
                <span className="font-bold text-[var(--color-fg)]">{deal.amount.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="flex justify-between">
                <span>Timeline:</span>
                <span className="font-bold text-[var(--color-fg)]">{deal.timeline || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Review Notes Input Modal */}
      <Modal
        title="Submit Deal for Accounting Check"
        open={notesModalOpen}
        onCancel={() => setNotesModalOpen(false)}
        onOk={handleConfirmSubmitReview}
        okText="Submit for Review"
        cancelText="Cancel"
      >
        <div className="space-y-4 pt-4">
          <p className="text-xs text-[var(--color-muted-fg)]">
            Specify details or notes for the accounting team before they verify the payment milestones distribution.
          </p>
          <textarea
            placeholder="Add internal review notes..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="w-full min-h-[100px] p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-fg)] outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
      </Modal>
    </div>
  );
}
