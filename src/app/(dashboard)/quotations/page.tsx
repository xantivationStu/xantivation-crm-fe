'use client';

import React, { useState } from 'react';
import { Button, Modal, Select, message } from 'antd';
import { Plus, Download } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import { FloatingInput } from '@/components/FloatingInput';

interface QuotationItemRecord {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface QuotationRecord {
  id: string;
  code: string;
  version: number;
  validUntil: string;
  totalAmount: number;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
  status: string;
  opportunityName: string;
  companyName: string;
  items: QuotationItemRecord[];
}

const mockQuotations: QuotationRecord[] = [
  {
    id: '1',
    code: 'QUO-2026-00001',
    version: 1,
    validUntil: '2026-09-30',
    totalAmount: 20000,
    vatRate: 10,
    vatAmount: 2000,
    grandTotal: 22000,
    status: 'SENT',
    opportunityName: 'CRM Integration Contract',
    companyName: 'Xantivation Dev',
    items: [
      { description: 'Next.js Frontend Shell', quantity: 1, unitPrice: 12000 },
      { description: 'NestJS Backend API core', quantity: 1, unitPrice: 8000 },
    ],
  },
  {
    id: '2',
    code: 'QUO-2026-00002',
    version: 2,
    validUntil: '2026-08-15',
    totalAmount: 10000,
    vatRate: 10,
    vatAmount: 1000,
    grandTotal: 11000,
    status: 'ACCEPTED',
    opportunityName: 'Cloud Migration Consultancy',
    companyName: 'CyberCore LLC',
    items: [
      { description: 'AWS Architecture Assessment', quantity: 1, unitPrice: 10000 },
    ],
  },
];

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'EXPIRED', label: 'Expired' },
];

export default function Quotations() {
  const [quotations, setQuotations] = useState<QuotationRecord[]>(mockQuotations);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<QuotationRecord | null>(null);

  // Form states
  const [opportunityName, setOpportunityName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [vatRate, setVatRate] = useState('10');

  // Multi-item creation state
  const [items, setItems] = useState<QuotationItemRecord[]>([
    { description: 'Initial Service Line', quantity: 1, unitPrice: 1000 },
  ]);

  const handleDownloadPdf = (rec: QuotationRecord) => {
    message.loading(`Generating PDF for ${rec.code}...`);
    setTimeout(() => {
      message.success(`PDF exported successfully for ${rec.code}`);
    }, 1000);
  };

  const columns: ColumnProps<QuotationRecord>[] = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (val, rec) => (
        <div>
          <span className="font-mono text-xs font-semibold bg-[var(--color-surface)] px-2 py-1 rounded-lg border border-[var(--color-border)]">
            {val}
          </span>
          <span className="text-[10px] font-mono text-[var(--color-muted-fg)] ml-2">v{rec.version}</span>
        </div>
      ),
    },
    {
      title: 'Opportunity / Client',
      dataIndex: 'opportunityName',
      key: 'opportunityName',
      render: (val, rec) => (
        <div>
          <p className="font-semibold text-[var(--color-fg)]">{val}</p>
          <p className="text-xs text-[var(--color-muted-fg)]">{rec.companyName}</p>
        </div>
      ),
    },
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      render: (total: number) => <span className="font-mono text-sm font-semibold">${total.toLocaleString()}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'bg-gray-500/10 text-gray-500';
        if (status === 'ACCEPTED') color = 'bg-green-500/10 text-green-500';
        if (status === 'REJECTED') color = 'bg-red-500/10 text-red-500';
        if (status === 'SENT') color = 'bg-blue-500/10 text-blue-500';
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{status}</span>;
      },
    },
    { title: 'Valid Until', dataIndex: 'validUntil', key: 'validUntil', render: (val) => <span className="font-mono text-xs text-[var(--color-muted-fg)]">{val}</span> },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'download',
      render: (_, rec) => (
        <button
          onClick={() => handleDownloadPdf(rec)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-muted-fg)] hover:text-[var(--color-fg)] transition-all cursor-pointer"
        >
          <Download size={12} />
          <span>PDF</span>
        </button>
      ),
    },
  ];

  const handleOpenCreate = () => {
    setEditingQuotation(null);
    setOpportunityName('');
    setCompanyName('');
    setValidUntil('');
    setStatus('DRAFT');
    setVatRate('10');
    setItems([{ description: '', quantity: 1, unitPrice: 0 }]);
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: QuotationRecord) => {
    setEditingQuotation(rec);
    setOpportunityName(rec.opportunityName);
    setCompanyName(rec.companyName);
    setValidUntil(rec.validUntil);
    setStatus(rec.status);
    setVatRate(String(rec.vatRate));
    setItems(rec.items);
    setModalOpen(true);
  };

  const handleItemChange = (index: number, key: keyof QuotationItemRecord, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [key]: value };
    setItems(updated);
  };

  const handleAddItemRow = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    let subtotal = 0;
    const itemEntities = items.map((item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      subtotal += quantity * unitPrice;
      return {
        description: item.description,
        quantity,
        unitPrice,
      };
    });

    const rateVal = Number(vatRate) || 0;
    const vatVal = subtotal * (rateVal / 100);
    const grandVal = subtotal + vatVal;

    if (editingQuotation) {
      setQuotations(
        quotations.map((q) =>
          q.id === editingQuotation.id
            ? {
                ...q,
                opportunityName,
                companyName,
                validUntil,
                status,
                vatRate: rateVal,
                totalAmount: subtotal,
                vatAmount: vatVal,
                grandTotal: grandVal,
                items: itemEntities,
                version: q.version + 1,
              }
            : q,
        ),
      );
      message.success('Quotation updated successfully (Version incremented)');
    } else {
      const year = new Date().getFullYear();
      const code = `QUO-${year}-${String(quotations.length + 1).padStart(5, '0')}`;
      const newQuotation: QuotationRecord = {
        id: String(quotations.length + 1),
        code,
        version: 1,
        validUntil,
        totalAmount: subtotal,
        vatRate: rateVal,
        vatAmount: vatVal,
        grandTotal: grandVal,
        status,
        opportunityName,
        companyName,
        items: itemEntities,
      };
      setQuotations([...quotations, newQuotation]);
      message.success('Quotation created successfully');
    }
    setModalOpen(false);
  };

  const handleDelete = (rec: QuotationRecord) => {
    setQuotations(quotations.filter((q) => q.id !== rec.id));
    message.success('Quotation deleted successfully');
  };

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">Quotations</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Draft proposals, customize line items, calculate VAT rates, and download PDF proposals.</p>
        </div>
        <Button
          type="primary"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 h-10 px-4 rounded-xl cursor-pointer"
        >
          <Plus size={16} />
          <span>New Quotation</span>
        </Button>
      </div>

      {/* Main Table */}
      <SharedTable
        columns={columns}
        dataSource={quotations}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingQuotation ? 'Edit Quotation' : 'Create Quotation'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={700}
      >
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput label="Opportunity Name" value={opportunityName} onChange={setOpportunityName} required />
            <FloatingInput label="Client Company" value={companyName} onChange={setCompanyName} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput label="Valid Until (YYYY-MM-DD)" value={validUntil} onChange={setValidUntil} required />
            <FloatingInput label="VAT Rate (%)" type="number" value={vatRate} onChange={setVatRate} />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
              Status
            </label>
            <Select
              value={status}
              onChange={setStatus}
              options={statusOptions}
              className="w-full h-11"
            />
          </div>

          {/* Items Configuration segment */}
          <div className="pt-4 border-t border-[var(--color-border)]/50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)]">
                Line Items Calculation
              </h4>
              <Button size="small" type="dashed" onClick={handleAddItemRow} className="cursor-pointer">
                + Add Item Line
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center bg-[var(--color-bg)] p-3 rounded-xl border border-[var(--color-border)]">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full bg-transparent border-b border-[var(--color-border)] outline-none py-1 text-sm text-[var(--color-fg)]"
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                      className="w-full bg-transparent border-b border-[var(--color-border)] outline-none py-1 text-sm text-[var(--color-fg)]"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                      className="w-full bg-transparent border-b border-[var(--color-border)] outline-none py-1 text-sm text-[var(--color-fg)]"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      onClick={() => handleRemoveItemRow(idx)}
                      className="text-red-500 hover:text-red-600 text-xs font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
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
