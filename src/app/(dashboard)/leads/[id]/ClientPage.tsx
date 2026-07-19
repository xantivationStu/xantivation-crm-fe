'use client';

import React, { useState, use } from 'react';
import { Button, Steps, Select, Modal, Progress, message, Spin } from 'antd';
import { useLead, useConvertLead, useAddLeadActivity, useLeadActivities, useUpdateLead, useDeleteLead, useAutoQualifyLead } from '@/hooks/api/useLead';
import { User, Briefcase, Mail, Phone, Calendar, Plus, ArrowRight, UserCheck, Bot, FileText, AlertTriangle, Trash2 } from 'lucide-react';
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

const mockLeads: LeadRecord[] = [
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

interface ActivityItem {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE';
  description: string;
  createdAt: string;
}

export default function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const { data: leadResponse, isLoading: isLeadLoading } = useLead(id);
  const { data: activitiesResponse } = useLeadActivities(id);
  const convertMutation = useConvertLead(id);
  const addActivityMutation = useAddLeadActivity(id);
  const updateMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();
  const autoQualifyMutation = useAutoQualifyLead(id);
  
  const rawLead = leadResponse?.data;
  const lead = rawLead ? {
    id: rawLead.id,
    leadCode: rawLead.leadCode,
    firstName: rawLead.firstName || '',
    lastName: rawLead.lastName || rawLead.name || '',
    company: rawLead.companyName || rawLead.company || '',
    email: rawLead.email || '',
    phone: rawLead.phone || '',
    source: rawLead.source,
    status: rawLead.status,
    owner: rawLead.assignedTo?.name || rawLead.owner?.name || 'System Admin',
    createdAt: rawLead.createdAt ? rawLead.createdAt.substring(0, 10) : '',
    bantScore: Number(rawLead.bantScore) || 0,
    budget: Number(rawLead.budget) || 0,
    serviceInterest: rawLead.serviceInterest || 'WEBSITE',
    need: rawLead.need || '',
    timeline: rawLead.timeline || '',
    aiScore: rawLead.aiScore !== undefined && rawLead.aiScore !== null ? Number(rawLead.aiScore) : null,
    aiScoreData: rawLead.aiScoreData || null,
    aiScoredAt: rawLead.aiScoredAt || null,
  } : undefined;

  const rawActivities = activitiesResponse?.data || [];
  const activities = rawActivities.map((act: any) => ({
    id: act.id,
    type: act.type,
    description: act.description,
    createdAt: act.createdAt ? act.createdAt.replace('T', ' ').substring(0, 16) : '',
  }));

  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [actType, setActType] = useState<'CALL' | 'EMAIL' | 'MEETING' | 'NOTE'>('NOTE');
  const [actDescription, setActDescription] = useState('');

  // Conversion Wizard State
  const [convertStep, setConvertStep] = useState(0);
  const [clientType, setClientType] = useState('BUSINESS');
  const [companyName, setCompanyName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [opportunityAmount, setOpportunityAmount] = useState('');
  const [expectedCloseDate, setExpectedCloseDate] = useState('2026-09-30');
  const [serviceInterest, setServiceInterest] = useState('WEBSITE');

  // Duplicate Check Modal State
  const [duplicateWarningOpen, setDuplicateWarningOpen] = useState(false);
  const [duplicateContact, setDuplicateContact] = useState<any>(null);

  React.useEffect(() => {
    if (lead) {
      setCompanyName(lead.company || '');
      setOpportunityAmount(String(lead.budget || ''));
      setServiceInterest(lead.serviceInterest || 'WEBSITE');
    }
  }, [lead]);

  if (isLeadLoading) {
    return (
      <div className="p-12 flex justify-center items-center h-96">
        <Spin size="large" tip="Đang tải thông tin Lead..." />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Lead not found
      </div>
    );
  }

  const handleAddActivity = () => {
    if (!actDescription.trim()) return;
    addActivityMutation.mutate(
      { type: actType, notes: actDescription },
      {
        onSuccess: () => {
          setActDescription('');
          setActivityModalOpen(false);
        },
      }
    );
  };

  const handleConvertSubmit = (linkContactId?: string, forceCreate?: boolean) => {
    const payload: any = {
      clientType,
      companyName,
      taxCode,
      opportunityAmount: Number(opportunityAmount) || 0,
      expectedCloseDate,
      serviceInterest,
    };
    if (linkContactId) {
      payload.linkContactId = linkContactId;
    }
    if (forceCreate) {
      payload.forceCreate = true;
    }

    const hide = message.loading('Converting prospect into Customer Account and Opportunity...', 0);
    convertMutation.mutate(payload, {
      onSuccess: (res: any) => {
        hide();
        if (res.data?.isDuplicate) {
          setDuplicateContact(res.data.duplicateRecord);
          setDuplicateWarningOpen(true);
        } else {
          message.success('Lead converted successfully!');
          setConvertStep(2);
          setDuplicateWarningOpen(false);
        }
      },
      onError: (err: any) => {
        hide();
        message.error(err.response?.data?.message || 'Chuyển đổi Lead thất bại!');
      }
    });
  };

  const handleAutoQualify = () => {
    const hide = message.loading('Analyzing lead using AI BANT scoring model...', 0);
    autoQualifyMutation.mutate(undefined, {
      onSuccess: () => {
        hide();
      },
      onError: () => {
        hide();
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Title */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <div className="text-xs text-[var(--color-muted-fg)] flex items-center gap-1.5 mb-2 font-mono">
            <Link href="/leads" className="hover:underline">Leads</Link>
            <span>&gt;</span>
            <span className="text-[var(--color-fg)] font-semibold">{lead.leadCode}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">
            {lead.firstName} {lead.lastName}
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Ref Code: {lead.leadCode} • From {lead.source}</p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            lead.status === 'QUALIFIED' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
          }`}>
            Status: {lead.status}
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Side: Sub Tabs & Content (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sub Navigation */}
          <div className="flex border-b border-[var(--color-border)] gap-6 pb-px">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'activity', name: 'Activity Log' },
              { id: 'convert', name: 'Convert' },
              { id: 'ai-insights', name: 'AI Insights' },
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
              <div className="space-y-8">
                {/* Contact Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Contact Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-sm">
                        <User size={16} className="text-[var(--color-muted-fg)]" />
                        <span className="text-[var(--color-fg)] font-medium">
                          {lead.firstName} {lead.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm">
                        <Mail size={16} className="text-[var(--color-muted-fg)]" />
                        <span className="text-[var(--color-fg)] font-mono">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm">
                        <Phone size={16} className="text-[var(--color-muted-fg)]" />
                        <span className="text-[var(--color-fg)] font-mono">{lead.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Company Info
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-sm">
                        <Briefcase size={16} className="text-[var(--color-muted-fg)]" />
                        <span className="text-[var(--color-fg)] font-medium">{lead.company}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm">
                        <Calendar size={16} className="text-[var(--color-muted-fg)]" />
                        <span className="text-[var(--color-muted-fg)]">Created: {lead.createdAt}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BANT summary */}
                <div className="pt-6 border-t border-[var(--color-border)]/50 space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                    BANT Parameters
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs bg-[var(--color-surface)]/30 p-4 border border-[var(--color-border)]/50 rounded-xl">
                    <div>
                      <p className="text-[10px] uppercase font-mono text-[var(--color-muted-fg)] mb-1">Budget Approved</p>
                      <span className={`font-semibold ${lead.bantScore >= 50 ? 'text-green-500' : 'text-gray-500'}`}>
                        {lead.bantScore >= 50 ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono text-[var(--color-muted-fg)] mb-1">Authority Confirmed</p>
                      <span className={`font-semibold ${lead.bantScore >= 75 ? 'text-green-500' : 'text-gray-500'}`}>
                        {lead.bantScore >= 75 ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono text-[var(--color-muted-fg)] mb-1">Stated Need</p>
                      <span className="font-semibold text-[var(--color-fg)] truncate block">{lead.need || 'None'}</span>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-mono text-[var(--color-muted-fg)] mb-1">Target Timeline</p>
                      <span className="font-semibold text-[var(--color-fg)]">{lead.timeline || 'None'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'activity' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-[var(--color-fg)]">Interaction Timeline</h3>
                  <Button type="primary" onClick={() => setActivityModalOpen(true)} className="flex items-center gap-2 h-9 px-4 rounded-xl cursor-pointer">
                    <Plus size={14} />
                    <span>Add Activity</span>
                  </Button>
                </div>

                <div className="space-y-6 pt-4 border-l-2 border-[var(--color-border)] ml-3 pl-6">
                  {activities.map((act) => (
                    <div key={act.id} className="relative space-y-1">
                      <span className="absolute -left-[31px] top-0 bg-[var(--color-accent)] text-white p-1 rounded-full text-[8px] font-bold w-4 h-4 flex items-center justify-center">
                        {act.type[0]}
                      </span>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs text-[var(--color-fg)]">{act.type} Logged</span>
                        <span className="text-[10px] font-mono text-[var(--color-muted-fg)]">{act.createdAt}</span>
                      </div>
                      <p className="text-xs text-[var(--color-muted-fg)]">{act.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSubTab === 'convert' && (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Lead Conversion Wizard</h3>

                <Steps
                  current={convertStep}
                  items={[
                    { title: 'Customer Profile' },
                    { title: 'Opportunity Scope' },
                    { title: 'Completed' },
                  ]}
                  className="pb-4"
                />

                {convertStep === 0 && (
                  <div className="space-y-6 pt-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                        Client Type
                      </label>
                      <Select
                        value={clientType}
                        onChange={setClientType}
                        options={[
                          { value: 'BUSINESS', label: 'Business (B2B)' },
                          { value: 'INDIVIDUAL', label: 'Individual (B2C)' },
                        ]}
                        className="w-full h-11"
                      />
                    </div>
                    {clientType === 'BUSINESS' && (
                      <>
                        <FloatingInput label="Company Account Name" value={companyName} onChange={setCompanyName} required />
                        <FloatingInput label="Tax Code (optional)" value={taxCode} onChange={setTaxCode} />
                      </>
                    )}
                    <div className="flex justify-end pt-4">
                      <Button type="primary" onClick={() => setConvertStep(1)} className="flex items-center gap-1.5 h-10 px-5 rounded-xl cursor-pointer">
                        <span>Next</span>
                        <ArrowRight size={14} />
                      </Button>
                    </div>
                  </div>
                )}

                {convertStep === 1 && (
                  <div className="space-y-6 pt-4">
                    <FloatingInput label="Opportunity Estimated Amount ($)" type="number" value={opportunityAmount} onChange={setOpportunityAmount} required />
                    <FloatingInput label="Expected Close Date (YYYY-MM-DD)" value={expectedCloseDate} onChange={setExpectedCloseDate} required />

                    <div className="flex flex-col gap-2 pt-2">
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
                          { value: 'CUSTOM', label: 'Custom Requirement' },
                        ]}
                        className="w-full h-11"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button onClick={() => setConvertStep(0)} className="rounded-xl">Back</Button>
                      <Button type="primary" onClick={() => handleConvertSubmit()} className="flex items-center gap-2 h-10 px-5 rounded-xl cursor-pointer">
                        <UserCheck size={16} />
                        <span>Convert Lead</span>
                      </Button>
                    </div>
                  </div>
                )}

                {convertStep === 2 && (
                  <div className="pt-6 text-center space-y-4">
                    <div className="p-3 bg-green-500/10 text-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                      <UserCheck size={24} />
                    </div>
                    <h4 className="font-bold text-lg text-[var(--color-fg)]">Lead Converted Successfully!</h4>
                    <p className="text-xs text-[var(--color-muted-fg)] max-w-sm mx-auto">
                      Lead has been migrated. Check matching records in Customers and Opportunities sections.
                    </p>
                    <div className="pt-4 flex justify-center gap-3">
                      <Link href="/customers">
                        <Button className="rounded-xl">Go to Customers</Button>
                      </Link>
                      <Link href="/opportunities">
                        <Button type="primary" className="rounded-xl">Go to Opportunities</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'ai-insights' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-[var(--color-fg)]">AI BANT Score Insights</h3>
                  <Button 
                    type="primary" 
                    onClick={handleAutoQualify} 
                    loading={autoQualifyMutation.isPending}
                    className="flex items-center gap-2 h-9 px-4 rounded-xl cursor-pointer bg-[var(--color-accent)]"
                  >
                    <Bot size={14} />
                    <span>Auto-Qualify</span>
                  </Button>
                </div>

                {lead.aiScore !== null ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-4">
                    <div className="space-y-4 text-xs">
                      <div className="flex justify-between items-center">
                        <span>Overall AI Quality Score</span>
                        <span className="font-mono font-bold text-base text-[var(--color-accent)]">{lead.aiScore * 10}%</span>
                      </div>
                      <Progress percent={lead.aiScore * 10} status="active" strokeColor="#4F46E5" />

                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                          <p className="text-[10px] text-[var(--color-muted-fg)] font-mono uppercase">Budget</p>
                          <p className="text-sm font-bold text-[var(--color-fg)] mt-1">{lead.aiScoreData?.budget || 0}/10</p>
                        </div>
                        <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                          <p className="text-[10px] text-[var(--color-muted-fg)] font-mono uppercase">Authority</p>
                          <p className="text-sm font-bold text-[var(--color-fg)] mt-1">{lead.aiScoreData?.authority || 0}/10</p>
                        </div>
                        <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                          <p className="text-[10px] text-[var(--color-muted-fg)] font-mono uppercase">Need</p>
                          <p className="text-sm font-bold text-[var(--color-fg)] mt-1">{lead.aiScoreData?.need || 0}/10</p>
                        </div>
                        <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                          <p className="text-[10px] text-[var(--color-muted-fg)] font-mono uppercase">Timeline</p>
                          <p className="text-sm font-bold text-[var(--color-fg)] mt-1">{lead.aiScoreData?.timeline || 0}/10</p>
                        </div>
                      </div>

                      <div className="p-4 bg-[var(--color-surface)]/50 border border-[var(--color-border)] rounded-xl space-y-2 mt-4 font-sans">
                        <p className="font-semibold text-[var(--color-fg)] flex items-center gap-1.5">
                          <Bot size={12} className="text-[var(--color-accent)]" />
                          <span>AI Recommendation</span>
                        </p>
                        <p className="text-[11px] text-[var(--color-muted-fg)] leading-relaxed">
                          {lead.aiScoreData?.recommendation || 'No recommendation provided.'}
                        </p>
                        {lead.aiScoredAt && (
                          <p className="text-[9px] text-[var(--color-muted-fg)] font-mono pt-1">
                            Evaluated at: {new Date(lead.aiScoredAt).toLocaleString('vi-VN')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-5 bg-[var(--color-surface)]/20 border border-[var(--color-border)]/50 rounded-2xl flex flex-col gap-3 justify-center min-h-[160px] text-center text-[var(--color-muted-fg)] text-xs font-mono">
                      <FileText size={32} className="mx-auto text-[var(--color-accent)]/50" />
                      <span>FAISS Vector Database Matches: 3 similar deals</span>
                      <span className="text-[10px] text-[var(--color-muted-fg)]">Ready to convert to Opportunity if score &ge; 7.</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3 bg-[var(--color-surface)]/10 border border-dashed border-[var(--color-border)] rounded-xl">
                    <Bot size={40} className="mx-auto text-[var(--color-muted-fg)]/40" />
                    <p className="text-xs text-[var(--color-muted-fg)]">Lead này chưa được đánh giá tự động bằng AI.</p>
                    <Button onClick={handleAutoQualify} loading={autoQualifyMutation.isPending} className="h-9 px-4 rounded-xl cursor-pointer">
                      Đánh giá ngay
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sidebar Actions (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Lead Control Panel
            </h3>

            {/* Change Status */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Lead Status
              </label>
              <Select
                value={lead.status}
                onChange={(val) => {
                  updateMutation.mutate({ id, dto: { status: val as any } });
                }}
                options={[
                  { value: 'NEW', label: 'New' },
                  { value: 'CONTACTED', label: 'Contacted' },
                  { value: 'QUALIFIED', label: 'Qualified' },
                  { value: 'UNQUALIFIED', label: 'Unqualified' },
                ]}
                className="w-full h-10"
              />
            </div>

            {/* Change Owner */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Lead Owner
              </label>
              <Select
                value={lead.owner}
                onChange={(val) => {
                  updateMutation.mutate({ id, dto: { assignedToId: val } });
                }}
                options={[
                  { value: 'System Admin', label: 'System Admin' },
                  { value: 'Jane Smith', label: 'Jane Smith' },
                  { value: 'John Doe', label: 'John Doe' },
                ]}
                className="w-full h-10"
              />
            </div>

            {/* Delete Option */}
            <div className="pt-4 border-t border-[var(--color-border)]/50">
              <Button
                danger
                onClick={() => {
                  Modal.confirm({
                    title: 'Xác nhận xóa Lead',
                    content: 'Bạn có chắc chắn muốn xóa lead này? Hành động này không thể hoàn tác.',
                    okText: 'Xóa',
                    cancelText: 'Hủy',
                    okButtonProps: { danger: true },
                    onOk: () => {
                      deleteLeadMutation.mutate(id, {
                        onSuccess: () => {
                          window.location.href = '/leads';
                        },
                      });
                    },
                  });
                }}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Delete Lead</span>
              </Button>
            </div>
          </div>
        </div>

      </div>

      {/* Activity Creation Modal */}
      <Modal
        title="Log Interaction Activity"
        open={activityModalOpen}
        onCancel={() => setActivityModalOpen(false)}
        onOk={handleAddActivity}
        okText="Log Activity"
        cancelText="Cancel"
      >
        <div className="space-y-4 pt-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Activity Type</label>
            <Select
              value={actType}
              onChange={setActType}
              options={[
                { value: 'NOTE', label: 'Internal Note' },
                { value: 'CALL', label: 'Phone Call' },
                { value: 'EMAIL', label: 'Email Outbox' },
                { value: 'MEETING', label: 'Client Meeting' },
              ]}
              className="h-10"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Description Details</label>
            <textarea
              value={actDescription}
              onChange={(e) => setActDescription(e.target.value)}
              className="w-full h-24 p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-xs text-[var(--color-fg)] focus:outline-none"
              placeholder="Record details of conversation..."
            />
          </div>
        </div>
      </Modal>

      {/* Duplicate Warning Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-amber-500 font-bold">
            <AlertTriangle size={18} />
            <span>Phát hiện Liên hệ trùng lặp</span>
          </div>
        }
        open={duplicateWarningOpen}
        onCancel={() => setDuplicateWarningOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setDuplicateWarningOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="force"
            onClick={() => handleConvertSubmit(undefined, true)}
            loading={convertMutation.isPending}
          >
            Bỏ qua trùng & Tạo mới
          </Button>,
          <Button
            key="link"
            type="primary"
            onClick={() => handleConvertSubmit(duplicateContact?.id)}
            loading={convertMutation.isPending}
          >
            Liên kết với Contact cũ
          </Button>,
        ]}
      >
        <div className="space-y-3 pt-2 text-xs">
          <p className="text-[var(--color-muted-fg)] leading-relaxed">
            Hệ thống phát hiện thông tin liên hệ của Lead trùng khớp với một liên hệ đã tồn tại trong database:
          </p>
          <div className="p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl space-y-1.5 font-mono text-[11px]">
            <p><strong>Tên:</strong> {duplicateContact?.name}</p>
            <p><strong>Email:</strong> {duplicateContact?.email}</p>
            <p><strong>Phone:</strong> {duplicateContact?.phone}</p>
            <p><strong>Khách hàng (Account):</strong> {duplicateContact?.customerName || 'N/A'}</p>
          </div>
          <p className="text-[var(--color-muted-fg)]">
            Bạn muốn <strong>Liên kết</strong> (gán Cơ hội mới vào Khách hàng và liên hệ cũ) hay <strong>Tạo mới</strong> một Khách hàng và liên hệ riêng biệt?
          </p>
        </div>
      </Modal>
    </div>
  );
}
