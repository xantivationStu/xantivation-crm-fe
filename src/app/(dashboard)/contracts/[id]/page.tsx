'use client';

import React, { useState, use } from 'react';
import { Button, Steps, Progress, message, Table } from 'antd';
import { ArrowLeft, User, Calendar, Plus, PenTool, ArrowRight, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Landmark, Send, Ban } from 'lucide-react';
import Link from 'next/link';

interface PaymentScheduleRecord {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paidAt?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  milestoneName: string;
  milestonePercentage: number;
}

interface ContractRecord {
  id: string;
  code: string;
  title: string;
  contractValue: number;
  contractType: 'SERVICE_AGREEMENT' | 'NDA' | 'SOW' | 'AMENDMENT';
  signingDeadline?: string;
  docusignEnvelopeId?: string;
  status: 'DRAFT' | 'SENT' | 'SIGNED' | 'EXPIRED' | 'DECLINED' | 'VOIDED';
  signedAt?: string;
  legalNotes?: string;
  dealId: string;
  dealName: string;
  dealCode: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  payments: PaymentScheduleRecord[];
}

const mockContracts: ContractRecord[] = [
  {
    id: '1',
    code: 'HĐ-2026-00001',
    title: 'Service Agreement - Xantivation Dev - CRM Integration Deal',
    contractValue: 209000000,
    contractType: 'SERVICE_AGREEMENT',
    signingDeadline: '2026-08-01',
    docusignEnvelopeId: 'env-90df-8b21-4432',
    status: 'SIGNED',
    signedAt: '2026-07-05 14:32',
    legalNotes: 'Includes customized warranty period of 6 months instead of 3.',
    dealId: '1',
    dealCode: 'DEAL-2026-00001',
    dealName: 'CRM Integration Deal',
    companyName: 'Xantivation Dev',
    contactName: 'Phan Manh',
    contactEmail: 'manh@xantivation.com',
    contactPhone: '0988777666',
    createdAt: '2026-07-05',
    payments: [
      { id: '1', invoiceNumber: 'INV-2026-00001', amount: 104500000, dueDate: '2026-07-05', paidAt: '2026-07-05 15:00', status: 'PAID', milestoneName: 'Deposit Payment', milestonePercentage: 50 },
      { id: '2', invoiceNumber: 'INV-2026-00002', amount: 104500000, dueDate: '2026-08-05', status: 'PENDING', milestoneName: 'Final Delivery', milestonePercentage: 50 },
    ],
  },
  {
    id: '2',
    code: 'HĐ-2026-00002',
    title: 'Service Agreement - CyberCore LLC - Brand Strategy Deal',
    contractValue: 82500000,
    contractType: 'SERVICE_AGREEMENT',
    signingDeadline: '2026-08-15',
    docusignEnvelopeId: 'env-12ef-34ac-789a',
    status: 'SENT',
    legalNotes: 'Strict non-disclosure agreements signed before contract generation.',
    dealId: '2',
    dealCode: 'DEAL-2026-00002',
    dealName: 'CyberCore Brand Strategy Deal',
    companyName: 'CyberCore LLC',
    contactName: 'David Lee',
    contactEmail: 'david@cybercore.io',
    contactPhone: '0911222333',
    createdAt: '2026-07-06',
    payments: [
      { id: '3', invoiceNumber: 'INV-2026-00003', amount: 82500000, dueDate: '2026-08-15', status: 'PENDING', milestoneName: 'Advance payment', milestonePercentage: 100 },
    ],
  },
];

export default function ContractDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [contract, setContract] = useState<ContractRecord | undefined>(mockContracts.find((c) => c.id === id) || mockContracts[0]);
  const [activeTab, setActiveTab] = useState('overview');

  if (!contract) {
    return <div className="p-8 text-center text-red-500 font-bold">Contract not found</div>;
  }

  // Stepper helper
  const getStepIndex = (st: string) => {
    switch (st) {
      case 'DRAFT': return 0;
      case 'SENT': return 1;
      case 'SIGNED': return 2;
      case 'VOIDED': return 2;
      default: return 0;
    }
  };

  // Actions
  const handleSendForSignature = () => {
    setContract({
      ...contract,
      status: 'SENT',
      docusignEnvelopeId: contract.docusignEnvelopeId || `env-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`,
    });
    message.success('Contract envelope dispatched successfully via DocuSign mock API');
  };

  const handleRecordSigned = () => {
    setContract({
      ...contract,
      status: 'SIGNED',
      signedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
    message.success('Contract recorded as SIGNED.');
  };

  const handleVoidContract = () => {
    setContract({
      ...contract,
      status: 'VOIDED',
    });
    message.warning('Contract voided.');
  };

  // Calculations
  const totalPaid = contract.payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const percentPaid = Math.round((totalPaid / contract.contractValue) * 100);

  return (
    <div className="space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <div className="text-xs text-[var(--color-muted-fg)] flex items-center gap-1.5 mb-2 font-mono">
            <Link href="/contracts" className="hover:underline">Contracts</Link>
            <span>&gt;</span>
            <span className="text-[var(--color-fg)] font-semibold">{contract.code}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)] max-w-2xl truncate">
            {contract.title}
          </h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Contract Code: {contract.code} • Client Company: {contract.companyName}</p>
        </div>

        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            contract.status === 'SIGNED' ? 'bg-green-500/10 text-green-500' :
            contract.status === 'SENT' ? 'bg-blue-500/10 text-blue-500' :
            contract.status === 'VOIDED' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-500'
          }`}>
            Status: {contract.status}
          </span>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6">
        <Steps
          current={getStepIndex(contract.status)}
          items={[
            { title: 'Draft Agreement', description: 'Internal legal terms' },
            { title: 'DocuSign E-Signature', description: 'Pending recipient action' },
            { title: contract.status === 'VOIDED' ? 'Voided Agreement' : 'Execution Active', description: contract.status === 'VOIDED' ? 'Agreement Cancelled' : 'Contract Signed' },
          ]}
          status={contract.status === 'VOIDED' ? 'error' : 'process'}
        />
      </div>

      {/* Main Grid 3:1 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-6 border-b border-[var(--color-border)] pb-px">
            {[
              { id: 'overview', name: 'Overview Details' },
              { id: 'schedule', name: 'Payment Schedule' },
              { id: 'signature', name: 'Signature Tracking' },
              { id: 'deal', name: 'Related Deal' },
              { id: 'audit', name: 'Audit History' },
            ].map((tab) => (
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

          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 min-h-[350px]">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Info summary */}
                <div className="grid grid-cols-2 gap-6 text-xs border-b border-[var(--color-border)]/50 pb-6">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Contract Specifications
                    </h4>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Contract Value</span>
                      <span className="font-semibold font-mono text-[var(--color-accent)]">{contract.contractValue.toLocaleString('vi-VN')} VND</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Contract Type</span>
                      <span className="font-semibold font-mono text-xs">{contract.contractType}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Signing Deadline</span>
                      <span className="font-semibold font-mono">{contract.signingDeadline || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                      Client Legal Representative
                    </h4>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Contact Name</span>
                      <span className="font-semibold">{contract.contactName}</span>
                    </div>
                    <div className="flex justify-between border-b border-[var(--color-border)] pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Contact Email</span>
                      <span className="font-semibold font-mono">{contract.contactEmail}</span>
                    </div>
                    <div className="flex justify-between border-b border(--color-border) pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">Contact Phone</span>
                      <span className="font-semibold font-mono">{contract.contactPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Legal notes */}
                <div className="text-xs space-y-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">Legal Notes & Special Agreements</h4>
                  <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl">
                    <p className="text-[var(--color-fg)] leading-relaxed italic">{contract.legalNotes || 'No special legal terms recorded.'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-fg)]">Generated Payment Schedule</h3>
                    <p className="text-xs text-[var(--color-muted-fg)]">Invoicing schedules automatically calculated from won deal milestones.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-[var(--color-fg)]">
                      Paid: {totalPaid.toLocaleString('vi-VN')} / {contract.contractValue.toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                </div>

                <Table
                  columns={[
                    { title: 'Invoice Number', dataIndex: 'invoiceNumber', key: 'invoiceNumber', render: (val, r) => (
                      <Link href={`/payments/${r.id}`} className="font-mono text-xs font-semibold bg-[var(--color-surface)] px-2 py-0.5 rounded border border-[var(--color-border)] hover:text-[var(--color-accent)]">
                        {val}
                      </Link>
                    )},
                    { title: 'Milestone Name', dataIndex: 'milestoneName', key: 'milestoneName', render: (val, r) => (
                      <div>
                        <span className="text-xs font-semibold block">{val}</span>
                        <span className="text-[9px] text-[var(--color-muted-fg)] font-mono">{r.milestonePercentage}% of contract</span>
                      </div>
                    )},
                    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (val) => <span className="font-mono font-semibold text-xs">{(val).toLocaleString('vi-VN')} VND</span> },
                    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: (val) => <span className="font-mono text-xs text-[var(--color-muted-fg)]">{val}</span> },
                    { title: 'Status', dataIndex: 'status', key: 'status', render: (val) => {
                      let color = 'bg-gray-500/10 text-gray-500';
                      if (val === 'PAID') color = 'bg-green-500/10 text-green-500';
                      if (val === 'PENDING') color = 'bg-blue-500/10 text-blue-500';
                      if (val === 'OVERDUE') color = 'bg-red-500/10 text-red-500';
                      return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{val}</span>;
                    }},
                    { title: 'Action', dataIndex: 'id', key: 'action', render: (_, r) => (
                      <Link href={`/payments/${r.id}`} className="text-xs text-[var(--color-accent)] hover:underline flex items-center gap-1 font-semibold">
                        <span>Invoice</span>
                        <ArrowRight size={10} />
                      </Link>
                    )}
                  ]}
                  dataSource={contract.payments.map((p, i) => ({ ...p, key: i }))}
                  pagination={false}
                  size="small"
                  className="border border-[var(--color-border)] rounded-xl overflow-hidden text-xs"
                />

                {/* Progress bar visual */}
                <div className="pt-2">
                  <div className="flex justify-between items-center text-xs font-mono text-[var(--color-muted-fg)] mb-2">
                    <span>Payment collection progress:</span>
                    <span>{percentPaid}% completed</span>
                  </div>
                  <Progress percent={percentPaid} status={percentPaid === 100 ? 'success' : 'active'} />
                </div>
              </div>
            )}

            {activeTab === 'signature' && (
              <div className="space-y-6 text-xs">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">E-Signature Verification Tracking</h3>
                
                {contract.docusignEnvelopeId ? (
                  <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-[var(--color-border)]/50">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-muted-fg)]">DocuSign Envelope ID</p>
                        <p className="font-mono text-xs font-semibold text-[var(--color-fg)]">{contract.docusignEnvelopeId}</p>
                      </div>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded font-mono font-bold">
                        DOCUSIGN MOCK CONNECTED
                      </span>
                    </div>

                    <div className="relative border-l border-[var(--color-border)] ml-3 pl-6 space-y-6">
                      <div className="relative">
                        <span className="absolute -left-[30px] top-0 bg-[var(--color-border)] text-[var(--color-fg)] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">1</span>
                        <p className="font-semibold text-[var(--color-fg)]">Agreement Document Generated</p>
                        <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">{contract.createdAt} • Draft created from Deal CLOSED_WON</p>
                      </div>
                      {contract.status !== 'DRAFT' && (
                        <div className="relative">
                          <span className="absolute -left-[30px] top-0 bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">2</span>
                          <p className="font-semibold text-[var(--color-fg)]">Sent to recipient for E-Signature</p>
                          <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">Envelope status changed to SENT</p>
                        </div>
                      )}
                      {contract.status === 'SIGNED' && (
                        <div className="relative">
                          <span className="absolute -left-[30px] top-0 bg-green-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">3</span>
                          <p className="font-semibold text-[var(--color-fg)]">Digitally Signed & Validated</p>
                          <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">{contract.signedAt} • Signed by {contract.contactName}</p>
                        </div>
                      )}
                      {contract.status === 'VOIDED' && (
                        <div className="relative">
                          <span className="absolute -left-[30px] top-0 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px]">X</span>
                          <p className="font-semibold text-red-500">Contract Voided / Recalled</p>
                          <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">Marked cancelled</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--color-muted-fg)] italic">Contract is in DRAFT. Dispatched to DocuSign using the sidebar controller to begin signature tracking.</p>
                )}
              </div>
            )}

            {activeTab === 'deal' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Origin Commercial Deal</h3>
                <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-xl">
                      <Landmark size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-[var(--color-fg)]">{contract.dealCode} — {contract.dealName}</p>
                      <p className="text-[10px] text-[var(--color-muted-fg)] font-mono">Origin Deal • Amount: {contract.contractValue.toLocaleString('vi-VN')} VND</p>
                    </div>
                  </div>
                  <Link
                    href={`/deals/${contract.dealId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all"
                  >
                    <span>Manage Deal</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="text-xs space-y-4">
                <h3 className="text-sm font-semibold text-[var(--color-fg)]">Contract Audit Trail Logs</h3>
                <div className="bg-[var(--color-bg)] p-4 rounded-xl border border-[var(--color-border)] space-y-3 font-mono">
                  <div className="flex justify-between border-b border-[var(--color-border)]/50 pb-1.5">
                    <span className="text-[var(--color-muted-fg)]">[LOG 2026-07-05 14:00]</span>
                    <span className="text-[var(--color-fg)]">Contract automatically created from Deal CLOSED_WON</span>
                  </div>
                  {contract.status !== 'DRAFT' && (
                    <div className="flex justify-between border-b border-[var(--color-border)]/50 pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">[LOG 2026-07-05 14:15]</span>
                      <span className="text-[var(--color-fg)]">Mock Envelope generated and sent for signoff</span>
                    </div>
                  )}
                  {contract.status === 'SIGNED' && (
                    <div className="flex justify-between border-b border-[var(--color-border)]/50 pb-1.5">
                      <span className="text-[var(--color-muted-fg)]">[LOG {contract.signedAt}]</span>
                      <span className="text-green-500">DocuSign Connect webhook processed: status Completed</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions (1 col) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              E-Signature Actions
            </h3>

            <div className="space-y-3">
              <Button
                type="primary"
                onClick={handleSendForSignature}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer"
                disabled={contract.status !== 'DRAFT'}
              >
                <Send size={14} />
                <span>Send to Client</span>
              </Button>

              <Button
                onClick={handleRecordSigned}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer bg-green-600 border-green-600 text-white hover:bg-green-700"
                disabled={contract.status !== 'SENT'}
              >
                <PenTool size={14} />
                <span>Force Mock Sign</span>
              </Button>

              <Button
                onClick={handleVoidContract}
                danger
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl cursor-pointer"
                disabled={contract.status === 'SIGNED' || contract.status === 'VOIDED'}
              >
                <Ban size={14} />
                <span>Void Envelope</span>
              </Button>
            </div>

            {/* Contract Value Summary */}
            <div className="border-t border-[var(--color-border)]/50 pt-4 space-y-3 text-xs font-mono text-[var(--color-muted-fg)]">
              <div className="flex justify-between">
                <span>Total Value:</span>
                <span className="font-bold text-[var(--color-fg)]">{contract.contractValue.toLocaleString('vi-VN')} VND</span>
              </div>
              <div className="flex justify-between">
                <span>Invoices count:</span>
                <span className="font-bold text-[var(--color-fg)]">{contract.payments.length}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
