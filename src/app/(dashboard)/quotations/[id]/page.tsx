'use client';

import React, { useState, use } from 'react';
import { Button, message, Table } from 'antd';
import { ArrowLeft, Download, Eye, Send, FileText, CheckCircle2, History, Copy, Clock, DollarSign } from 'lucide-react';
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
  createdAt: string;
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
    createdAt: '2026-07-01',
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
    createdAt: '2026-07-03',
    items: [
      { itemName: 'AWS Architecture Assessment', description: 'Assessment of current security issues', fixedPrice: 75000000, estimatedEffort: '1 week', deliverables: 'Detailed PDF report' },
    ],
  },
];

export default function QuotationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [quotation, setQuotation] = useState<QuotationRecord | undefined>(mockQuotations.find(q => q.id === id) || mockQuotations[0]);
  const handleDownloadPdf = (rec: QuotationRecord) => {
    message.loading(`Generating PDF for ${rec.code}...`);
    setTimeout(() => {
      message.success(`PDF exported successfully for ${rec.code}`);
    }, 1000);
  };

  const [activeTab, setActiveTab] = useState('overview');

  if (!quotation) {
    return <div className="p-8 text-center text-red-500 font-bold">Quotation not found</div>;
  }

  const handleSendToClient = () => {
    setQuotation({ ...quotation, status: 'SENT' });
    message.success('Quotation status updated to SENT (sent email notification to client)');
  };

  const handleCloneNewVersion = () => {
    const nextVersion = quotation.version + 1;
    message.loading(`Cloning quotation ${quotation.code} to version ${nextVersion}...`);
    setTimeout(() => {
      setQuotation({
        ...quotation,
        version: nextVersion,
        status: 'DRAFT',
      });
      message.success(`Successfully cloned to ${quotation.code} v${nextVersion} (Draft status)`);
    }, 1000);
  };

  const handleAcceptManual = () => {
    setQuotation({ ...quotation, status: 'ACCEPTED' });
    message.success('Quotation manually marked as ACCEPTED. A related Deal is auto-created.');
  };

  // Scope Items columns
  const itemColumns = [
    {
      title: 'Item / Module Name',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (val: string, item: QuotationItemRecord) => (
        <div>
          <p className="font-semibold text-xs text-[var(--color-fg)]">{val}</p>
          {item.description && <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5">{item.description}</p>}
        </div>
      ),
    },
    {
      title: 'Estimated Effort',
      dataIndex: 'estimatedEffort',
      key: 'estimatedEffort',
      render: (val: string) => <span className="text-xs font-mono text-[var(--color-muted-fg)]">{val || 'N/A'}</span>,
    },
    {
      title: 'Deliverables',
      dataIndex: 'deliverables',
      key: 'deliverables',
      render: (val: string) => <span className="text-xs text-[var(--color-muted-fg)]">{val || 'N/A'}</span>,
    },
    {
      title: 'Fixed Price',
      dataIndex: 'fixedPrice',
      key: 'fixedPrice',
      render: (val: number) => <span className="font-mono font-semibold text-xs text-[var(--color-fg)]">{(val).toLocaleString('vi-VN')} VND</span>,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumbs & Header */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <div className="text-xs text-[var(--color-muted-fg)] flex items-center gap-1.5 mb-2 font-mono">
            <Link href="/quotations" className="hover:underline">Quotations</Link>
            <span>&gt;</span>
            <span className="text-[var(--color-fg)] font-semibold">{quotation.code}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">
            {quotation.projectName}
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Quote: {quotation.code} v{quotation.version} • Owner: {quotation.owner}</p>
        </div>

        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            quotation.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' :
            quotation.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
            quotation.status === 'REVIEW' ? 'bg-amber-500/10 text-amber-600' :
            'bg-blue-500/10 text-blue-500'
          }`}>
            Status: {quotation.status}
          </span>
        </div>
      </div>

      {/* Main Content layout 3:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Tabs (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sub Navigation Tabs */}
          <div className="flex gap-6 border-b border-[var(--color-border)] pb-px">
            {[
              { id: 'overview', name: 'Overview Details' },
              { id: 'pdf', name: 'PDF Preview template' },
              { id: 'review', name: 'Review History' },
              { id: 'versions', name: 'Version Logs' },
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
                {/* General parameters */}
                <div className="grid grid-cols-2 gap-6 text-xs border-b border-[var(--color-border)]/50 pb-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Proposal Specs
                    </h4>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Project Name</span>
                      <span className="font-semibold">{quotation.projectName}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Service Class</span>
                      <span className="font-semibold font-mono">{quotation.serviceType}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Package Tier</span>
                      <span className="font-semibold font-mono text-[var(--color-accent)]">{quotation.packageType}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Validity & Client
                    </h4>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Client Account</span>
                      <span className="font-semibold">{quotation.companyName}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Valid Until</span>
                      <span className="font-semibold font-mono text-red-500">{quotation.validUntil}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Proposal Created</span>
                      <span className="font-semibold font-mono">{quotation.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Scope Items Table */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                    Workpackages Work Scope
                  </h4>
                  <Table
                    columns={itemColumns}
                    dataSource={quotation.items.map((item, idx) => ({ ...item, key: idx }))}
                    pagination={false}
                    className="border border-[var(--color-border)] rounded-xl overflow-hidden text-xs"
                    size="small"
                  />
                </div>

                {/* Calculations Summary */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[var(--color-border)]/50">
                  <div className="space-y-3 text-xs">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Terms Specifications
                    </h4>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Timeline</span>
                      <span className="font-semibold">{quotation.timeline || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Revisions Limit</span>
                      <span className="font-semibold">{quotation.revisionLimit} times</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Payment Terms</span>
                      <span className="font-semibold">{quotation.paymentTerms || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)] space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted-fg)]">Subtotal Amount:</span>
                      <span>{quotation.totalAmount.toLocaleString('vi-VN')} VND</span>
                    </div>
                    {quotation.adjustmentType && (
                      <div className="flex justify-between text-indigo-500 font-semibold">
                        <span>Adjustment ({quotation.adjustmentType}):</span>
                        <span>{quotation.adjustmentType === 'DISCOUNT' ? '-' : '+'}{quotation.adjustmentAmount.toLocaleString('vi-VN')} VND</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[var(--color-muted-fg)]">VAT ({quotation.vatRate}%):</span>
                      <span>{quotation.vatAmount.toLocaleString('vi-VN')} VND</span>
                    </div>
                    <div className="flex justify-between border-t border-[var(--color-border)] pt-2 text-sm font-bold text-[var(--color-accent)]">
                      <span>Grand Total:</span>
                      <span>{quotation.grandTotal.toLocaleString('vi-VN')} VND</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pdf' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Studio Branded Template Preview</h3>
                  <Button type="primary" onClick={() => handleDownloadPdf(quotation)} className="flex items-center gap-1.5 h-9 px-4 rounded-xl cursor-pointer">
                    <Download size={14} />
                    <span>Download PDF document</span>
                  </Button>
                </div>

                {/* Mock PDF Shell */}
                <div className="border border-[var(--color-border)] bg-white rounded-xl p-8 max-w-2xl mx-auto shadow-sm text-black font-sans space-y-6">
                  {/* Brand header */}
                  <div className="flex justify-between items-start border-b-2 border-black pb-4">
                    <div>
                      <h1 className="text-xl font-bold uppercase tracking-wide">Xantivation Studio</h1>
                      <p className="text-[10px] text-gray-500">Creative Dev & Strategy Consultancy</p>
                    </div>
                    <div className="text-right text-xs">
                      <h2 className="font-bold text-gray-700">PROPOSAL ESTIMATE</h2>
                      <p className="font-mono text-[10px]">Code: {quotation.code}</p>
                      <p className="font-mono text-[10px]">Version: {quotation.version}</p>
                    </div>
                  </div>

                  {/* Proposal Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-[10px]">
                    <div>
                      <p className="text-gray-400 font-bold uppercase">Prepared for:</p>
                      <p className="font-bold text-gray-800">{quotation.companyName}</p>
                      <p className="text-gray-600 mt-1">Opportunity Link: {quotation.opportunityName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase">Estimate Valid Until:</p>
                      <p className="font-bold text-red-600">{quotation.validUntil}</p>
                      <p className="text-gray-600 mt-1">Date Created: {quotation.createdAt}</p>
                    </div>
                  </div>

                  {/* PDF Items */}
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="border-b border-gray-300 font-bold uppercase text-gray-500">
                        <th className="py-2">Item Workpackage</th>
                        <th className="py-2">Timeline</th>
                        <th className="py-2 text-right">Fixed Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotation.items.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-100 text-gray-700">
                          <td className="py-2.5">
                            <p className="font-bold text-gray-900">{item.itemName}</p>
                            <p className="text-[9px] text-gray-500">{item.description}</p>
                          </td>
                          <td className="py-2.5 font-mono">{item.estimatedEffort || 'N/A'}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-gray-900">{item.fixedPrice.toLocaleString('vi-VN')} VND</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Price breakdown */}
                  <div className="flex justify-end pt-4">
                    <div className="w-64 space-y-1.5 text-[10px] font-mono border-t border-gray-300 pt-3">
                      <div className="flex justify-between text-gray-500">
                        <span>Subtotal:</span>
                        <span>{quotation.totalAmount.toLocaleString('vi-VN')} VND</span>
                      </div>
                      {quotation.adjustmentType && (
                        <div className="flex justify-between text-indigo-600">
                          <span>Adjustment ({quotation.adjustmentType}):</span>
                          <span>{quotation.adjustmentType === 'DISCOUNT' ? '-' : '+'}{quotation.adjustmentAmount.toLocaleString('vi-VN')} VND</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-500">
                        <span>VAT ({quotation.vatRate}%):</span>
                        <span>{quotation.vatAmount.toLocaleString('vi-VN')} VND</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-black border-t border-gray-900 pt-1.5">
                        <span>Grand Total:</span>
                        <span>{quotation.grandTotal.toLocaleString('vi-VN')} VND</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Internal Review logs</h3>
                <div className="relative border-l border-[var(--color-border)] ml-3 pl-6 space-y-6 text-xs">
                  <div className="relative">
                    <span className="absolute -left-[30px] top-0 bg-[var(--color-border)] text-[var(--color-fg)] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">1</span>
                    <p className="font-semibold text-[var(--color-fg)]">Quotation Drafted</p>
                    <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">{quotation.createdAt} • Created by {quotation.owner}</p>
                  </div>
                  {quotation.status === 'SENT' && (
                    <div className="relative">
                      <span className="absolute -left-[30px] top-0 bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">2</span>
                      <p className="font-semibold text-[var(--color-fg)]">Sent to Client Account</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">{new Date().toISOString().split('T')[0]} • Status changed to SENT</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'versions' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Version History Logs</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex justify-between items-center text-xs font-mono">
                    <div>
                      <span className="font-bold text-[var(--color-accent)]">{quotation.code} v1</span>
                      <span className="text-[10px] text-[var(--color-muted-fg)] ml-2">({quotation.createdAt})</span>
                    </div>
                    <span className="text-[var(--color-muted-fg)]">Subtotal: {quotation.totalAmount.toLocaleString('vi-VN')} VND</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Panel (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Proposal Control Panel
            </h3>

            {/* Actions list */}
            <div className="space-y-3">
              <Button
                type="primary"
                onClick={handleSendToClient}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer"
                disabled={quotation.status !== 'DRAFT'}
              >
                <Send size={14} />
                <span>Send to Client</span>
              </Button>

              <Button
                onClick={handleCloneNewVersion}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer"
              >
                <Copy size={14} />
                <span>Clone New Version</span>
              </Button>

              <Button
                onClick={handleAcceptManual}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer bg-green-600 border-green-600 text-white hover:bg-green-700"
                disabled={quotation.status === 'ACCEPTED'}
              >
                <CheckCircle2 size={14} />
                <span>Accept (Manual)</span>
              </Button>
            </div>

            {/* Spec breakdown */}
            <div className="border-t border-[var(--color-border)]/50 pt-4 space-y-3 text-xs font-mono text-[var(--color-muted-fg)]">
              <div className="flex justify-between">
                <span>Total Workpackages:</span>
                <span className="font-bold text-[var(--color-fg)]">{quotation.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Grand Total:</span>
                <span className="font-bold text-[var(--color-fg)]">{quotation.grandTotal.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
