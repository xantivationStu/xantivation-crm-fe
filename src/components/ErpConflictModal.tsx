'use client';

import React from 'react';
import { Modal, Button, Table, Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import type { ColumnsType } from 'antd/es/table';

export interface DuplicateRecord {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: 'lead' | 'customer';
  erpId?: string;
}

interface ErpConflictModalProps {
  open: boolean;
  onClose: () => void;
  duplicates: DuplicateRecord[];
  onResolve: (resolutions: Record<string, 'link' | 'ignore'>) => void;
  isSubmitting?: boolean;
}

export default function ErpConflictModal({
  open,
  onClose,
  duplicates,
  onResolve,
  isSubmitting = false,
}: ErpConflictModalProps) {
  const { t } = useTranslation();
  const [resolutions, setResolutions] = React.useState<Record<string, 'link' | 'ignore'>>({});

  React.useEffect(() => {
    // Default all resolutions to 'link' (recommended)
    const initial: Record<string, 'link' | 'ignore'> = {};
    duplicates.forEach((d) => {
      initial[d.id] = 'link';
    });
    setResolutions(initial);
  }, [duplicates]);

  const handleOptionChange = (id: string, option: 'link' | 'ignore') => {
    setResolutions((prev) => ({
      ...prev,
      [id]: option,
    }));
  };

  const handleConfirm = () => {
    onResolve(resolutions);
  };

  const columns: ColumnsType<DuplicateRecord> = [
    {
      title: t('erp.recordName'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <span className="font-semibold text-xs text-[var(--color-fg)]">{text}</span>
          <div className="flex gap-2 mt-1">
            <Badge
              status={record.type === 'customer' ? 'processing' : 'warning'}
              text={record.type === 'customer' ? t('erp.customer') : t('erp.opportunity')}
              className="text-[10px]"
            />
          </div>
        </div>
      ),
    },
    {
      title: t('erp.contactInfo'),
      key: 'contact',
      render: (_, record) => (
        <div className="text-[11px] text-[var(--color-muted-fg)] space-y-0.5">
          {record.email && <div>Email: {record.email}</div>}
          {record.phone && <div>Phone: {record.phone}</div>}
        </div>
      ),
    },
    {
      title: t('erp.recommendedAction'),
      key: 'action',
      render: (_, record) => {
        const option = resolutions[record.id] || 'link';
        return (
          <div className="flex gap-2 flex-wrap">
            <Button
              size="small"
              type={option === 'link' ? 'primary' : 'default'}
              onClick={() => handleOptionChange(record.id, 'link')}
              className="text-xs rounded-lg"
            >
              {t('erp.linkRecommended')}
            </Button>
            <Button
              size="small"
              type={option === 'ignore' ? 'dashed' : 'default'}
              danger={option === 'ignore'}
              onClick={() => handleOptionChange(record.id, 'ignore')}
              className="text-xs rounded-lg"
            >
              {t('erp.skip')}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Modal
      title={
        <div className="text-sm font-bold text-[var(--color-fg)] mb-2">
          ERP Data Duplicate Resolution
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isSubmitting} className="rounded-lg">
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          loading={isSubmitting}
          className="rounded-lg"
        >
          Confirm Resolution
        </Button>,
      ]}
      width={700}
      className="custom-modal"
    >
      <div className="space-y-4 my-4">
        <p className="text-xs text-[var(--color-muted-fg)] leading-relaxed">
          The system detected matching information (Email or Phone) between CRM and ERP databases.
          Please choose Link to merge or Skip to keep them separate.
        </p>

        <Table
          dataSource={duplicates}
          columns={columns}
          rowKey="id"
          pagination={false}
          size="small"
          className="border border-[var(--color-border)] rounded-xl overflow-hidden"
        />
      </div>
    </Modal>
  );
}
