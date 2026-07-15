'use client';

import React, { useState, use } from 'react';
import { Button, Steps, Select, Modal, Progress, message } from 'antd';
import { User, Briefcase, Mail, Phone, Calendar, Plus, ArrowRight, UserCheck, FileText, AlertTriangle, Trash2, Landmark, HelpCircle, CheckCircle2 } from 'lucide-react';
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
  createdAt: string;
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
    createdAt: '2026-07-01',
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
    createdAt: '2026-07-02',
  },
];

const mockQuotations = [
  { id: '1', code: 'QTN-2026-00001', version: 1, grandTotal: 250000000, status: 'ACCEPTED', validUntil: '2026-09-30', owner: 'System Admin' },
];

export default function OpportunityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [opp, setOpp] = useState<OpportunityRecord | undefined>(mockOpps.find(o => o.id === id) || mockOpps[0]);
  const [activeSubTab, setActiveSubTab] = useState('overview');

  // Modal control
  const [lostModalOpen, setLostModalOpen] = useState(false);
  const [lostReason, setLostReason] = useState('');

  if (!opp) {
    return <div className="p-8 text-center text-red-500 font-bold">Opportunity not found</div>;
  }

  const handleStageChange = (newStage: any) => {
    if (newStage === 'LOST') {
      setLostReason('');
      setLostModalOpen(true);
      return;
    }

    let prob = 10;
    if (newStage === 'WON') prob = 100;
    else if (newStage === 'NEGOTIATION') prob = 80;
    else if (newStage === 'PROPOSAL') prob = 50;
    else if (newStage === 'QUALIFICATION') prob = 20;

    setOpp({ ...opp, stage: newStage, probability: prob });
    message.success(`Stage transitioned to ${newStage}`);
  };

  const handleConfirmLost = () => {
    if (!lostReason.trim()) {
      message.error('Please enter a reason for losing this opportunity');
      return;
    }
    setOpp({ ...opp, stage: 'LOST', probability: 0, lostReason });
    setLostModalOpen(false);
    message.success('Opportunity marked as CLOSED LOST');
  };

  // Convert stage list to index for visual Stepper
  const stagesOrder = ['QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'WON'];
  const currentStep = stagesOrder.indexOf(opp.stage === 'LOST' ? 'WON' : opp.stage);

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Title */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <div className="text-xs text-[var(--color-muted-fg)] flex items-center gap-1.5 mb-2 font-mono">
            <Link href="/opportunities" className="hover:underline">Opportunities</Link>
            <span>&gt;</span>
            <span className="text-[var(--color-fg)] font-semibold">{opp.code}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">
            {opp.name}
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Deal Code: {opp.code} • {opp.serviceInterest}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            opp.stage === 'WON' ? 'bg-green-500/10 text-green-500' :
            opp.stage === 'LOST' ? 'bg-red-500/10 text-red-500' :
            'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
          }`}>
            Stage: {opp.stage}
          </span>
        </div>
      </div>

      {/* Visual Stage Progress Stepper */}
      {opp.stage !== 'LOST' ? (
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] p-6 rounded-2xl">
          <Steps
            current={currentStep}
            items={[
              { title: 'Qualification', description: '20% Probability' },
              { title: 'Proposal', description: '50% Probability' },
              { title: 'Negotiation', description: '80% Probability' },
              { title: 'Closed Won', description: '100% Probability' },
            ]}
          />
        </div>
      ) : (
        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle className="text-red-500 shrink-0" size={20} />
          <div className="text-xs text-red-800 font-mono">
            <span className="font-bold uppercase block">CLOSED LOST</span>
            <span>Reason: {opp.lostReason}</span>
          </div>
        </div>
      )}

      {/* Main Layout 3:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Content (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sub Navigation */}
          <div className="flex gap-6 border-b border-[var(--color-border)] pb-px">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'progress', name: 'Stage Progress' },
              { id: 'quotations', name: 'Quotations' },
              { id: 'deal', name: 'Related Deal' },
              { id: 'activity', name: 'Activity Log' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'border-transparent text-[var(--color-muted-fg)] hover:text-[var(--color-fg)]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Sub Tab Bodies */}
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 min-h-[300px]">
            {activeSubTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Deal Parameters
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Estimated Amount</span>
                        <span className="font-semibold font-mono">{opp.amount.toLocaleString('vi-VN')} VND</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Probability Suggestion</span>
                        <span className="font-semibold font-mono">{opp.probability}%</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Target Close Date</span>
                        <span className="font-semibold font-mono">{opp.closeDate}</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Service Interest</span>
                        <span className="font-semibold">{opp.serviceInterest}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Customer Relations
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Account Customer</span>
                        <Link href={`/customers/accounts/${opp.companyId}`} className="font-semibold text-[var(--color-accent)] hover:underline">
                          {opp.companyName}
                        </Link>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-muted-fg)]">Primary Contact</span>
                        <Link href={`/customers/contacts/${opp.contactId}`} className="font-semibold text-[var(--color-accent)] hover:underline">
                          {opp.contactName}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-[var(--color-border)]/50">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                    Opportunity Scope Description
                  </h3>
                  <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-fg)] whitespace-pre-wrap">
                    {opp.description || 'No description provided.'}
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'progress' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Stage transition history</h3>
                <div className="relative border-l border-[var(--color-border)] ml-3 pl-6 space-y-6 text-xs">
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 bg-[var(--color-accent)] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">1</span>
                    <p className="font-semibold text-[var(--color-fg)]">QUALIFICATION stage reached</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">{opp.createdAt} • System auto-qualify from converter</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 bg-[var(--color-accent)] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">2</span>
                    <p className="font-semibold text-[var(--color-fg)]">PROPOSAL stage reached</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">{opp.createdAt} • Transitioned by {opp.assignedTo}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'quotations' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-[var(--color-fg)]">Associated Quotations</h3>
                  <Button type="primary" onClick={() => message.success('Quotation draft workflow initiated')} className="flex items-center gap-1.5 h-9 px-4 rounded-xl cursor-pointer">
                    <Plus size={14} />
                    <span>Create Quotation</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockQuotations.map(q => (
                    <div key={q.id} className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-1">
                        <Link href={`/quotations/${q.id}`} className="font-mono font-semibold text-[var(--color-accent)] hover:underline">
                          {q.code} (v{q.version})
                        </Link>
                        <p className="text-[10px] text-[var(--color-muted-fg)]">Valid until: {q.validUntil} • Owner: {q.owner}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold font-mono">{q.grandTotal.toLocaleString('vi-VN')} VND</span>
                        <span className="px-2 py-0.5 rounded-full font-bold bg-green-500/10 text-green-500 uppercase tracking-wider text-[9px]">
                          {q.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === 'deal' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Linked Commercial Deal</h3>
                <div className="p-6 bg-[var(--color-surface)]/20 border border-[var(--color-border)]/50 rounded-2xl flex flex-col gap-3 justify-center min-h-[160px] text-center text-[var(--color-muted-fg)] text-xs font-mono">
                  <FileText size={32} className="mx-auto text-[var(--color-accent)]/50" />
                  <span>No deal is associated yet. A deal is automatically generated when a linked quotation is marked ACCEPTED.</span>
                </div>
              </div>
            )}

            {activeSubTab === 'activity' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Timeline logs</h3>
                <div className="p-6 bg-[var(--color-surface)]/20 border border-[var(--color-border)]/50 rounded-2xl flex flex-col gap-3 justify-center min-h-[160px] text-center text-[var(--color-muted-fg)] text-xs font-mono">
                  <HelpCircle size={32} className="mx-auto text-[var(--color-accent)]/50" />
                  <span>No customer-facing timeline logs registered.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Actions (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Deal Control Panel
            </h3>

            {/* Change Stage */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Sales Stage Setting
              </label>
              <Select
                value={opp.stage}
                onChange={handleStageChange}
                options={[
                  { value: 'QUALIFICATION', label: 'Qualification' },
                  { value: 'PROPOSAL', label: 'Proposal' },
                  { value: 'NEGOTIATION', label: 'Negotiation' },
                  { value: 'WON', label: 'Closed Won' },
                  { value: 'LOST', label: 'Closed Lost' },
                ]}
                className="w-full h-10"
              />
            </div>

            {/* Change Owner */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Assigned Owner
              </label>
              <Select
                value={opp.assignedTo}
                onChange={(val) => {
                  setOpp({ ...opp, assignedTo: val });
                  message.success(`Assigned owner set to ${val}`);
                }}
                options={[
                  { value: 'System Admin', label: 'System Admin' },
                  { value: 'Jane Smith', label: 'Jane Smith' },
                ]}
                className="w-full h-10"
              />
            </div>

            {/* Delete Option */}
            <div className="pt-4 border-t border-[var(--color-border)]/50">
              <Button danger className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer">
                <Trash2 size={16} />
                <span>Delete Opportunity</span>
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Closed Lost Reason Modal */}
      <Modal
        title="Mark Opportunity as Closed Lost"
        open={lostModalOpen}
        onCancel={() => setLostModalOpen(false)}
        onOk={handleConfirmLost}
        okText="Confirm Close Lost"
        cancelText="Cancel"
      >
        <div className="space-y-4 pt-4">
          <p className="text-xs text-[var(--color-muted-fg)]">To close this opportunity as lost, please provide a valid reason.</p>
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
