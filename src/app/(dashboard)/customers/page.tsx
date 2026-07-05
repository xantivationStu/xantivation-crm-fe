'use client';

import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { Plus } from 'lucide-react';
import SharedTable from '@/components/SharedTable';
import type { ColumnProps } from '@/components/SharedTable';
import { FloatingInput } from '@/components/FloatingInput';

interface Contact {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface CustomerRecord {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contacts: Contact[];
}

const mockCustomers: CustomerRecord[] = [
  {
    id: '1',
    code: 'ACC-2026-00001',
    name: 'Xantivation Dev',
    email: 'contact@xantivation.dev',
    phone: '+84987654321',
    address: 'Hanoi, Vietnam',
    contacts: [
      { name: 'John Doe', email: 'john@xantivation.dev', phone: '+84987654321', role: 'CTO' },
    ],
  },
  {
    id: '2',
    code: 'ACC-2026-00002',
    name: 'CyberCore LLC',
    email: 'hello@cybercore.io',
    phone: '+15550199',
    address: 'California, US',
    contacts: [
      { name: 'Bruce Wayne', email: 'bruce@cybercore.io', phone: '+15550199', role: 'Founder' },
      { name: 'Alfred Pennyworth', email: 'alfred@cybercore.io', phone: '+15550200', role: 'COO' },
    ],
  },
];

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(mockCustomers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');

  const columns: ColumnProps<CustomerRecord>[] = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (val) => <span className="font-mono text-xs font-semibold bg-[var(--color-surface)] px-2 py-1 rounded-lg border border-[var(--color-border)]">{val}</span>,
    },
    { title: 'Company Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Contacts',
      dataIndex: 'contacts',
      key: 'contacts',
      render: (contacts: Contact[]) => (
        <span className="text-xs text-[var(--color-muted-fg)] font-medium">
          {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'}
        </span>
      ),
    },
  ];

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setContactName('');
    setContactRole('');
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: CustomerRecord) => {
    setEditingCustomer(rec);
    setName(rec.name);
    setEmail(rec.email);
    setPhone(rec.phone);
    setAddress(rec.address);
    if (rec.contacts && rec.contacts.length > 0) {
      setContactName(rec.contacts[0].name);
      setContactRole(rec.contacts[0].role);
    } else {
      setContactName('');
      setContactRole('');
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    const contactsList: Contact[] = [];
    if (contactName.trim() !== '') {
      contactsList.push({
        name: contactName,
        email: email,
        phone: phone,
        role: contactRole || 'Representative',
      });
    }

    if (editingCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id
            ? { ...c, name, email, phone, address, contacts: contactsList }
            : c,
        ),
      );
      message.success('Customer updated successfully');
    } else {
      const year = new Date().getFullYear();
      const code = `ACC-${year}-${String(customers.length + 1).padStart(5, '0')}`;
      const newCustomer: CustomerRecord = {
        id: String(customers.length + 1),
        code,
        name,
        email,
        phone,
        address,
        contacts: contactsList,
      };
      setCustomers([...customers, newCustomer]);
      message.success('Customer created successfully');
    }
    setModalOpen(false);
  };

  const handleDelete = (rec: CustomerRecord) => {
    setCustomers(customers.filter((c) => c.id !== rec.id));
    message.success('Customer deleted successfully');
  };

  return (
    <div className="space-y-8">
      {/* Title & Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">Customers</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">View accounts and key customer contacts.</p>
        </div>
        <Button
          type="primary"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 h-10 px-4 rounded-xl cursor-pointer"
        >
          <Plus size={16} />
          <span>New Customer</span>
        </Button>
      </div>

      {/* Main Table */}
      <SharedTable
        columns={columns}
        dataSource={customers}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <Modal
        title={editingCustomer ? 'Edit Customer' : 'Create Customer'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <div className="space-y-6 pt-4">
          <FloatingInput label="Company Name" value={name} onChange={setName} required />
          <FloatingInput label="Email Address" type="email" value={email} onChange={setEmail} required />
          <FloatingInput label="Phone Number" value={phone} onChange={setPhone} />
          <FloatingInput label="Office Address" value={address} onChange={setAddress} />

          {/* Contact Representative segment */}
          <div className="pt-4 border-t border-[var(--color-border)]/50">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[var(--color-muted-fg)] mb-4">
              Primary Contact Person
            </h4>
            <FloatingInput label="Contact Name" value={contactName} onChange={setContactName} />
            <FloatingInput label="Job Title / Role" value={contactRole} onChange={setContactRole} />
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
