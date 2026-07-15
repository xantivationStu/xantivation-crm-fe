'use client';

import React, { useState } from 'react';
import { Button, Modal, Select, message, Tag, Drawer } from 'antd';
import { Plus, Download, Search, FileText, Check, AlertCircle, SlidersHorizontal } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import { FloatingInput } from '@/components/FloatingInput';
import Link from 'next/link';

interface QuotationItemRecord {
  itemName: string;
  description?: string;
  fixedPrice: number;
  estimatedEffort?: string;
  deliverables?: string;
}

interface QuotationRecord {
  id: string;
  code: string;
  version: number;
  projectName: string;
  serviceType: 'WEBSITE' | 'APP_MVP' | 'BRANDING' | 'UI_UX' | 'SOCIAL_KIT' | 'MAINTENANCE' | 'CUSTOM';
  packageType: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'CUSTOM';
  validUntil: string;
  totalAmount: number;
  adjustmentType?: 'DISCOUNT' | 'RUSH_FEE' | 'OTHER';
  adjustmentAmount: number;
  adjustmentReason?: string;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
  status: 'DRAFT' | 'REVIEW' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  opportunityId: string;
  opportunityName: string;
  companyName: string;
  timeline?: string;
  revisionLimit: number;
  paymentTerms?: string;
  termsConditions?: string;
  notes?: string;
  owner: string;
  items: QuotationItemRecord[];
}

const mockQuotations: QuotationRecord[] = [
  {
    id: '1',
    code: 'QUO-2026-00001',
    version: 1,
    projectName: 'CRM Integration Project',
    serviceType: 'CUSTOM',
    packageType: 'CUSTOM',
    validUntil: '2026-09-30',
    totalAmount: 200000000,
    adjustmentType: 'DISCOUNT',
    adjustmentAmount: 10000000,
    adjustmentReason: 'Loyalty client discount',
    vatRate: 10,
    vatAmount: 19000000,
    grandTotal: 209000000,
    status: 'SENT',
    opportunityId: '1',
    opportunityName: 'CRM Integration Contract',
    companyName: 'Xantivation Dev',
    timeline: '4-6 weeks after contract signing',
    revisionLimit: 3,
    paymentTerms: '50% upfront, 50% on final delivery',
    termsConditions: 'Standard service terms apply.',
    notes: 'Internal project notes.',
    owner: 'System Admin',
    items: [
      { itemName: 'Next.js Frontend Shell', description: 'Dashboard views and charts', fixedPrice: 120000000, estimatedEffort: '3 weeks', deliverables: 'Source code files' },
      { itemName: 'NestJS Backend API core', description: 'REST APIs and DB migration schema', fixedPrice: 80000000, estimatedEffort: '2 weeks', deliverables: 'Backend source files' },
    ],
  },
  {
    id: '2',
    code: 'QUO-2026-00002',
    version: 2,
    projectName: 'CyberCore Brand Strategy',
    serviceType: 'BRANDING',
    packageType: 'PREMIUM',
    validUntil: '2026-08-15',
    totalAmount: 75000000,
    adjustmentAmount: 0,
    vatRate: 10,
    vatAmount: 7500000,
    grandTotal: 82500000,
    status: 'ACCEPTED',
    opportunityId: '2',
    opportunityName: 'Brand Identity Redesign',
    companyName: 'CyberCore LLC',
    timeline: '3 weeks',
    revisionLimit: 5,
    paymentTerms: '100% advance payment',
    notes: 'VIP client priority',
    owner: 'Jane Smith',
    items: [
      { itemName: 'AWS Architecture Assessment', description: 'Assessment of current security issues', fixedPrice: 75000000, estimatedEffort: '1 week', deliverables: 'Detailed PDF report' },
    ],
  },
];

const mockOpportunities = [
  { id: '1', name: 'CRM Integration Contract', companyName: 'Xantivation Dev' },
  { id: '2', name: 'Brand Identity Redesign', companyName: 'CyberCore LLC' },
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

const packageOptions = [
  { value: 'BASIC', label: 'Basic' },
  { value: 'STANDARD', label: 'Standard' },
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'CUSTOM', label: 'Custom package' },
];

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'REVIEW', label: 'Review Required' },
  { value: 'SENT', label: 'Sent to Client' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'EXPIRED', label: 'Expired' },
];

export default function Quotations() {
  const [quotations, setQuotations] = useState<QuotationRecord[]>(mockQuotations);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<QuotationRecord | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterService, setFilterService] = useState('ALL');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Form states
  const [opportunityId, setOpportunityId] = useState('1');
  const [projectName, setProjectName] = useState('');
  const [serviceType, setServiceType] = useState<'WEBSITE' | 'APP_MVP' | 'BRANDING' | 'UI_UX' | 'SOCIAL_KIT' | 'MAINTENANCE' | 'CUSTOM'>('WEBSITE');
  const [packageType, setPackageType] = useState<'BASIC' | 'STANDARD' | 'PREMIUM' | 'CUSTOM'>('STANDARD');
  const [validUntil, setValidUntil] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'REVIEW' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'>('DRAFT');

  // Pricing adjustments
  const [adjustmentType, setAdjustmentType] = useState<'DISCOUNT' | 'RUSH_FEE' | 'OTHER' | undefined>(undefined);
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [vatRate, setVatRate] = useState('10');

  // Terms and conditions
  const [timeline, setTimeline] = useState('');
  const [revisionLimit, setRevisionLimit] = useState<number>(3);
  const [paymentTerms, setPaymentTerms] = useState('');
  const [termsConditions, setTermsConditions] = useState('');
  const [notes, setNotes] = useState('');

  // Scope Items list
  const [items, setItems] = useState<QuotationItemRecord[]>([
    { itemName: '', description: '', fixedPrice: 0, estimatedEffort: '', deliverables: '' },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDownloadPdf = (rec: QuotationRecord) => {
    message.loading(`Generating PDF for ${rec.code}...`);
    setTimeout(() => {
      message.success(`PDF exported successfully for ${rec.code}`);
    }, 1000);
  };

  const handleOpenCreate = () => {
    setEditingQuotation(null);
    setOpportunityId('1');
    setProjectName('');
    setServiceType('WEBSITE');
    setPackageType('STANDARD');
    setValidUntil('');
    setStatus('DRAFT');
    setAdjustmentType(undefined);
    setAdjustmentAmount('');
    setAdjustmentReason('');
    setVatRate('10');
    setTimeline('');
    setRevisionLimit(3);
    setPaymentTerms('');
    setTermsConditions('');
    setNotes('');
    setItems([{ itemName: '', description: '', fixedPrice: 0, estimatedEffort: '', deliverables: '' }]);
    setErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: QuotationRecord) => {
    setEditingQuotation(rec);
    setOpportunityId(rec.opportunityId);
    setProjectName(rec.projectName);
    setServiceType(rec.serviceType);
    setPackageType(rec.packageType);
    setValidUntil(rec.validUntil);
    setStatus(rec.status);
    setAdjustmentType(rec.adjustmentType);
    setAdjustmentAmount(rec.adjustmentAmount ? String(rec.adjustmentAmount) : '');
    setAdjustmentReason(rec.adjustmentReason || '');
    setVatRate(String(rec.vatRate));
    setTimeline(rec.timeline || '');
    setRevisionLimit(rec.revisionLimit);
    setPaymentTerms(rec.paymentTerms || '');
    setTermsConditions(rec.termsConditions || '');
    setNotes(rec.notes || '');
    setItems(rec.items);
    setErrors({});
    setModalOpen(true);
  };

  const handleAddItemRow = () => {
    setItems([...items, { itemName: '', description: '', fixedPrice: 0, estimatedEffort: '', deliverables: '' }]);
  };

  const handleRemoveItemRow = (idx: number) => {
    setItems(items.filter((_, index) => index !== idx));
  };

  const handleItemFieldChange = (idx: number, field: keyof QuotationItemRecord, val: any) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: val };
    setItems(updated);
  };

  // Live Pricing Calculations
  const calculatePricing = () => {
    const subtotal = items.reduce((sum, item) => sum + (Number(item.fixedPrice) || 0), 0);
    const adjAmount = Number(adjustmentAmount) || 0;
    
    let adjustedSubtotal = subtotal;
    if (adjustmentType === 'DISCOUNT') {
      adjustedSubtotal = subtotal - Math.abs(adjAmount);
    } else if (adjustmentType === 'RUSH_FEE' || adjustmentType === 'OTHER') {
      adjustedSubtotal = subtotal + Math.abs(adjAmount);
    }

    const rateVal = Number(vatRate) || 0;
    const vatVal = adjustedSubtotal * (rateVal / 100);
    const grandVal = adjustedSubtotal + vatVal;

    return { subtotal, vatVal, grandVal };
  };

  const { subtotal, vatVal, grandVal } = calculatePricing();

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!projectName.trim()) newErrors.projectName = 'Project Name is required';
    if (!validUntil) newErrors.validUntil = 'Validity date is required';
    else if (new Date(validUntil) < new Date(new Date().setHours(0,0,0,0))) {
      newErrors.validUntil = 'Validity date must be in the future';
    }

    if (items.length === 0 || items.some(item => !item.itemName.trim() || Number(item.fixedPrice) <= 0)) {
      newErrors.items = 'All scope items must have a name and a price greater than 0';
    }

    if (adjustmentType && (!adjustmentAmount || Number(adjustmentAmount) <= 0)) {
      newErrors.adjustmentAmount = 'Adjustment amount is required and must be greater than 0';
    }
    if (adjustmentType && !adjustmentReason.trim()) {
      newErrors.adjustmentReason = 'A reason for price adjustment is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      message.error('Please resolve validation errors before saving');
      return;
    }

    const currentOpp = mockOpportunities.find(o => o.id === opportunityId);
    
    // Auto Manager Review Rule: If grandTotal > 50,000,000 and status is DRAFT/SENT but adjusting DISCOUNT, trigger review
    let resolvedStatus = status;
    if (grandVal > 50000000 && adjustmentType === 'DISCOUNT' && status === 'DRAFT') {
      resolvedStatus = 'REVIEW';
      message.info('Grand total exceeds 50,000,000 VND with discount. Submitted for Manager Review.');
    }

    if (editingQuotation) {
      setQuotations(
        quotations.map(q =>
          q.id === editingQuotation.id
            ? {
                ...q,
                projectName,
                opportunityId,
                opportunityName: currentOpp?.name || '',
                companyName: currentOpp?.companyName || '',
                serviceType,
                packageType,
                validUntil,
                totalAmount: subtotal,
                adjustmentType,
                adjustmentAmount: Number(adjustmentAmount) || 0,
                adjustmentReason,
                vatRate: Number(vatRate) || 0,
                vatAmount: vatVal,
                grandTotal: grandVal,
                status: resolvedStatus,
                timeline,
                revisionLimit,
                paymentTerms,
                termsConditions,
                notes,
                items,
                version: q.version + 1,
              }
            : q,
        ),
      );
      message.success('Quotation version incremented successfully');
    } else {
      const year = new Date().getFullYear();
      const code = `QUO-${year}-${String(quotations.length + 1).padStart(5, '0')}`;
      const newQuotation: QuotationRecord = {
        id: String(quotations.length + 1),
        code,
        version: 1,
        projectName,
        opportunityId,
        opportunityName: currentOpp?.name || '',
        companyName: currentOpp?.companyName || '',
        serviceType,
        packageType,
        validUntil,
        totalAmount: subtotal,
        adjustmentType,
        adjustmentAmount: Number(adjustmentAmount) || 0,
        adjustmentReason,
        vatRate: Number(vatRate) || 0,
        vatAmount: vatVal,
        grandTotal: grandVal,
        status: resolvedStatus,
        timeline,
        revisionLimit,
        paymentTerms,
        termsConditions,
        notes,
        owner: 'System Admin',
        items,
      };
      setQuotations([...quotations, newQuotation]);
      message.success('Quotation drafted successfully');
    }
    setModalOpen(false);
  };

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = q.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || q.status === filterStatus;
    const matchesService = filterService === 'ALL' || q.serviceType === filterService;
    return matchesSearch && matchesStatus && matchesService;
  });

  const columns: ColumnProps<QuotationRecord>[] = [
    {
      title: 'Quote Code',
      dataIndex: 'code',
      key: 'code',
      render: (val, rec) => (
        <Link href={`/quotations/${rec.id}`} className="font-mono text-xs font-semibold bg-[var(--color-surface)] px-2.5 py-1 rounded-lg border border-[var(--color-border)] hover:text-[var(--color-accent)] transition-colors">
          {val} v{rec.version}
        </Link>
      ),
    },
    {
      title: 'Project Name & Client',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (val, rec) => (
        <div>
          <Link href={`/quotations/${rec.id}`} className="font-semibold text-[var(--color-fg)] hover:underline block mb-0.5">
            {val}
          </Link>
          <span className="text-[10px] text-[var(--color-muted-fg)]">{rec.companyName}</span>
        </div>
      ),
    },
    {
      title: 'Service & Package',
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (val, rec) => (
        <div className="flex gap-2 items-center">
          <span className="text-[10px] bg-[var(--color-surface)] px-2 py-0.5 rounded border border-[var(--color-border)] font-mono text-[var(--color-muted-fg)]">{val}</span>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded font-bold font-mono">{rec.packageType}</span>
        </div>
      ),
    },
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (val) => <span className="font-mono font-semibold text-xs text-[var(--color-fg)]">{val.toLocaleString('vi-VN')} VND</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
          st === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' :
          st === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
          st === 'REVIEW' ? 'bg-amber-500/10 text-amber-600' :
          st === 'SENT' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'
        }`}>{st}</span>
      ),
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (val) => <span className="text-xs font-mono text-[var(--color-muted-fg)]">{val}</span>,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      render: (val) => <span className="text-xs font-semibold">{val}</span>,
    },
    {
      title: 'PDF Export',
      dataIndex: 'id',
      key: 'pdf',
      render: (_, rec) => (
        <button
          onClick={() => handleDownloadPdf(rec)}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all cursor-pointer font-mono"
        >
          <Download size={10} />
          <span>PDF</span>
        </button>
      ),
    },
  ];

  const activeFiltersCount =
    (filterStatus !== 'ALL' ? 1 : 0) + (filterService !== 'ALL' ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-fg)]">Quotations</h1>
          <p className="text-sm text-[var(--color-muted-fg)] mt-1">Draft proposals, customize line items, calculate VAT rates, and download PDF proposals.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-xl px-3 py-2 w-full md:w-64">
            <Search size={15} className="text-[var(--color-muted-fg)]" />
            <input
              type="text"
              placeholder="Search quotations..."
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

          {/* New Quotation Button */}
          <Button
            type="primary"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 h-10 px-4 rounded-xl cursor-pointer"
          >
            <Plus size={16} />
            <span>New Quotation</span>
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
                  setFilterService('ALL');
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
              Quotation Status
            </label>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              className="w-full h-11"
              options={[
                { value: 'ALL', label: 'All Statuses' },
                ...statusOptions,
              ]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Service Type
            </label>
            <Select
              value={filterService}
              onChange={setFilterService}
              className="w-full h-11"
              options={[
                { value: 'ALL', label: 'All Services' },
                ...serviceOptions,
              ]}
            />
          </div>
        </div>
      </Drawer>

      {/* Unified Table Container Canvas */}
      <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
        <SharedTable
          columns={columns}
          dataSource={filteredQuotations}
          onEdit={handleOpenEdit}
          onDelete={(rec) => {
            setQuotations(quotations.filter(q => q.id !== rec.id));
            message.success('Quotation deleted successfully');
          }}
        />
      </div>

      {/* Overhauled Detailed Quotation Modal */}
      <Modal
        title={editingQuotation ? `Edit Quotation v${editingQuotation.version + 1}` : 'Create Quotation'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={850}
      >
        <div className="space-y-8 pt-4 overflow-y-auto max-h-[75vh] pr-2">
          {/* Section 1: Header */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] border-b border-[var(--color-border)] pb-1.5">
              1. General Header
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  Sales Opportunity Link
                </label>
                <Select
                  value={opportunityId}
                  onChange={setOpportunityId}
                  options={mockOpportunities.map(o => ({ value: o.id, label: `${o.name} (${o.companyName})` }))}
                  className="w-full h-11"
                />
              </div>
              <FloatingInput label="Project Name / Proposal Name" value={projectName} onChange={setProjectName} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  Service Interest Type
                </label>
                <Select
                  value={serviceType}
                  onChange={setServiceType}
                  options={serviceOptions}
                  className="w-full h-11"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  Scope Tier Package
                </label>
                <Select
                  value={packageType}
                  onChange={setPackageType}
                  options={packageOptions}
                  className="w-full h-11"
                />
              </div>
            </div>
            {errors.projectName && <p className="text-red-500 text-[10px] mt-0.5">{errors.projectName}</p>}
          </div>

          {/* Section 2: Scope Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-1.5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)]">
                2. Scope Items & Workpackages
              </h3>
              <Button size="small" type="dashed" onClick={handleAddItemRow} className="cursor-pointer">
                + Add Item
              </Button>
            </div>
            
            {errors.items && <p className="text-red-500 text-[10px] my-1">{errors.items}</p>}

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)] space-y-3 relative group">
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-6">
                      <input
                        type="text"
                        placeholder="Item / Module name *"
                        value={item.itemName}
                        onChange={(e) => handleItemFieldChange(idx, 'itemName', e.target.value)}
                        className="w-full bg-transparent border-b border-[var(--color-border)] outline-none py-1 text-xs font-semibold text-[var(--color-fg)]"
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Price (VND) *"
                        value={item.fixedPrice || ''}
                        onChange={(e) => handleItemFieldChange(idx, 'fixedPrice', Number(e.target.value))}
                        className="w-full bg-transparent border-b border-[var(--color-border)] outline-none py-1 text-xs text-[var(--color-fg)] font-mono"
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        placeholder="Effort (e.g. 2 weeks)"
                        value={item.estimatedEffort || ''}
                        onChange={(e) => handleItemFieldChange(idx, 'estimatedEffort', e.target.value)}
                        className="w-full bg-transparent border-b border-[var(--color-border)] outline-none py-1 text-xs text-[var(--color-fg)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <textarea
                      placeholder="Detailed Description..."
                      value={item.description || ''}
                      onChange={(e) => handleItemFieldChange(idx, 'description', e.target.value)}
                      className="w-full min-h-[60px] p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[11px] text-[var(--color-fg)] outline-none"
                    />
                    <textarea
                      placeholder="Deliverables..."
                      value={item.deliverables || ''}
                      onChange={(e) => handleItemFieldChange(idx, 'deliverables', e.target.value)}
                      className="w-full min-h-[60px] p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[11px] text-[var(--color-fg)] outline-none"
                    />
                  </div>

                  {items.length > 1 && (
                    <button
                      onClick={() => handleRemoveItemRow(idx)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-600 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      Delete Row
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Price Summary */}
          <div className="space-y-4 bg-[var(--color-bg-tint)] p-4 rounded-xl border border-[var(--color-border)]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] border-b border-[var(--color-border)] pb-1.5">
              3. Price & Adjustments Summary
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  Adjustment Type
                </label>
                <Select
                  value={adjustmentType}
                  onChange={(val) => {
                    setAdjustmentType(val);
                    if (!val) {
                      setAdjustmentAmount('');
                      setAdjustmentReason('');
                    }
                  }}
                  options={[
                    { value: undefined, label: 'No adjustments' },
                    { value: 'DISCOUNT', label: 'Discount (Discount Amount)' },
                    { value: 'RUSH_FEE', label: 'Rush Fee (Premium Charge)' },
                    { value: 'OTHER', label: 'Other Surcharges' },
                  ]}
                  className="w-full h-11"
                  allowClear
                />
              </div>

              <div>
                <FloatingInput
                  label="Adjustment Amount (VND)"
                  type="number"
                  value={adjustmentAmount}
                  onChange={setAdjustmentAmount}
                  disabled={!adjustmentType}
                />
                {errors.adjustmentAmount && <p className="text-red-500 text-[10px] mt-0.5">{errors.adjustmentAmount}</p>}
              </div>

              <FloatingInput
                label="VAT Rate (%)"
                type="number"
                value={vatRate}
                onChange={setVatRate}
              />
            </div>

            {adjustmentType && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  Adjustment Reason *
                </label>
                <textarea
                  placeholder="Why is this discount/surcharge applied?"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-fg)] outline-none"
                  required
                />
                {errors.adjustmentReason && <p className="text-red-500 text-[10px] mt-0.5">{errors.adjustmentReason}</p>}
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-[var(--color-border)] space-y-2 text-xs font-mono text-[var(--color-fg)]">
              <div className="flex justify-between">
                <span>Subtotal Workpackages Amount:</span>
                <span>{subtotal.toLocaleString('vi-VN')} VND</span>
              </div>
              {adjustmentType && (
                <div className="flex justify-between text-indigo-500 font-semibold">
                  <span>Adjustment ({adjustmentType}):</span>
                  <span>{adjustmentType === 'DISCOUNT' ? '-' : '+'}{ (Number(adjustmentAmount) || 0).toLocaleString('vi-VN') } VND</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>VAT Calculated Amount ({vatRate}%):</span>
                <span>{vatVal.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-[var(--color-border)] pt-2 text-[var(--color-accent)]">
                <span>Grand Total Amount (VNĐ):</span>
                <span>{grandVal.toLocaleString('vi-VN')} VND</span>
              </div>
            </div>
          </div>

          {/* Section 4: Terms & Conditions */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-accent)] border-b border-[var(--color-border)] pb-1.5">
              4. Terms, Validity & Private Notes
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <FloatingInput label="Project Timeline (e.g. 4-6 weeks)" value={timeline} onChange={setTimeline} />
              <FloatingInput label="Revision limit count" type="number" value={String(revisionLimit)} onChange={(v) => setRevisionLimit(Number(v) || 3)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  Payment Terms
                </label>
                <textarea
                  placeholder="e.g. 50% upfront, 50% on delivery"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full min-h-[80px] p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-fg)] outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  Terms & Conditions
                </label>
                <textarea
                  placeholder="e.g. Deliverable formats, source access..."
                  value={termsConditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  className="w-full min-h-[80px] p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-fg)] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FloatingInput label="Valid Until Date (YYYY-MM-DD) *" type="date" value={validUntil} onChange={setValidUntil} required />
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                  Internal Private Notes (Notes)
                </label>
                <textarea
                  placeholder="Internal notes only, hidden from client..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[85px] p-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-fg)] outline-none"
                />
              </div>
            </div>
            {errors.validUntil && <p className="text-red-500 text-[10px] mt-0.5">{errors.validUntil}</p>}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]/50">
            <Button onClick={() => setModalOpen(false)} className="rounded-xl cursor-pointer">
              Cancel
            </Button>
            <Button type="primary" onClick={handleSave} className="rounded-xl cursor-pointer">
              {editingQuotation ? 'Save Changes & Update Version' : 'Save draft quotation'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
