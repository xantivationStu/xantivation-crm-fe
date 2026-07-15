'use client';

import React, { useState } from 'react';
import { Card, Table, Select, Skeleton } from 'antd';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { usePipelineReport } from '@/hooks/api/useReport';
import { formatVND, getStatusColor } from '@/lib/utils';
import { Filter, PieChart, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PipelineReport() {
  const [period, setPeriod] = useState('30d');
  const { data, isLoading } = usePipelineReport();

  const report = data?.data;

  const funnelColors = [
    '#4F46E5', // Prospecting
    '#6366F1', // Qualification
    '#818CF8', // Proposal
    '#A5B4FC', // Negotiation
    '#10B981', // Won
    '#EF4444', // Lost
  ];

  const tableColumns = [
    {
      title: 'Sales Stage',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => (
        <span className="font-semibold text-[var(--color-fg)]">{stage}</span>
      ),
    },
    {
      title: 'Số lượng Cơ hội',
      dataIndex: 'count',
      key: 'count',
      align: 'center' as const,
      render: (val: number) => <span className="font-mono">{val}</span>,
    },
    {
      title: 'Tổng Giá trị (VND)',
      dataIndex: 'totalValue',
      key: 'totalValue',
      render: (val: number) => <span className="font-mono font-semibold">{formatVND(val)}</span>,
    },
    {
      title: 'Thời gian TB (Ngày)',
      dataIndex: 'avgDaysInStage',
      key: 'avgDaysInStage',
      align: 'center' as const,
      render: (val: number) => <span className="font-mono">{val} ngày</span>,
    },
    {
      title: 'Xác suất TB (%)',
      dataIndex: 'winRate',
      key: 'winRate',
      align: 'center' as const,
      render: (val: number) => <span className="font-mono text-emerald-500 font-semibold">{val}%</span>,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">Báo cáo Pipeline</h1>
          <p className="text-sm text-[var(--color-muted-fg)]">Phân tích hiệu suất phễu bán hàng và tỷ lệ chuyển đổi chốt deal.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-[var(--color-bg-tint)] border border-[var(--color-border)] px-4 py-2 rounded-xl">
          <Filter size={14} className="text-[var(--color-muted-fg)]" />
          <span className="text-xs text-[var(--color-muted-fg)] font-mono">Thời gian:</span>
          <Select
            value={period}
            onChange={setPeriod}
            bordered={false}
            dropdownStyle={{ minWidth: 120 }}
            options={[
              { value: '7d', label: '7 ngày qua' },
              { value: '30d', label: '30 ngày qua' },
              { value: '90d', label: '90 ngày qua' },
              { value: 'ytd', label: 'Năm nay (YTD)' },
            ]}
            className="text-xs text-[var(--color-fg)] font-semibold"
          />
        </div>
      </div>

      {/* Conversion rates metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 flex items-center gap-4 hover-action">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted-fg)]">Chuyển đổi Lead → Customer</p>
            <h2 className="text-2xl font-bold text-[var(--color-fg)] mt-1">
              {isLoading ? <Skeleton.Input active size="small" style={{ width: 60 }} /> : `${report?.conversionRates?.leadToCustomer}%`}
            </h2>
          </div>
        </div>

        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 flex items-center gap-4 hover-action">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted-fg)]">Tỷ lệ Chốt (Proposal → Won)</p>
            <h2 className="text-2xl font-bold text-[var(--color-fg)] mt-1">
              {isLoading ? <Skeleton.Input active size="small" style={{ width: 60 }} /> : `${report?.conversionRates?.proposalToWon}%`}
            </h2>
          </div>
        </div>

        <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 flex items-center gap-4 hover-action">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <PieChart size={20} />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted-fg)]">Đạt chuẩn (Qualified Rate)</p>
            <h2 className="text-2xl font-bold text-[var(--color-fg)] mt-1">
              {isLoading ? <Skeleton.Input active size="small" style={{ width: 60 }} /> : `${report?.conversionRates?.qualifiedRate}%`}
            </h2>
          </div>
        </div>
      </div>

      {/* Funnel Chart */}
      <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6">
        <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--color-muted-fg)] mb-6">Giá trị Pipeline theo Giai đoạn (VND)</h3>
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={report?.funnel}
                layout="vertical"
                margin={{ left: 20, right: 30, top: 10, bottom: 10 }}
              >
                <XAxis type="number" stroke="var(--color-muted-fg)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="stage" type="category" stroke="var(--color-muted-fg)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value: any) => [formatVND(Number(value)), 'Tổng Giá trị']}
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-tint)',
                    borderColor: 'var(--color-border)',
                    borderRadius: '12px',
                    color: 'var(--color-fg)'
                  }}
                />
                <Bar dataKey="totalValue" radius={[0, 4, 4, 0]} barSize={20}>
                  {report?.funnel?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={funnelColors[index % funnelColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Stages breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Card className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl">
          <h3 className="text-sm font-mono uppercase tracking-wider text-[var(--color-muted-fg)] mb-6">Bảng chi tiết các bước trong phễu</h3>
          <Table
            dataSource={report?.breakdown}
            columns={tableColumns}
            rowKey="stage"
            pagination={false}
            loading={isLoading}
            className="border-none"
          />
        </Card>
      </motion.div>
    </div>
  );
}
