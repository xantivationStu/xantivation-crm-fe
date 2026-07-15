'use client';

import React from 'react';
import { Tag, Empty } from 'antd';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  useDashboardMetrics,
  useDashboardOverduePayments,
  useDashboardUpcomingPayments,
  useDashboardCashFlow
} from '@/hooks/api/useDashboard';
import { formatVND, formatDate } from '@/lib/utils';
import { FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function AccountantDashboard() {
  const { data: metricsData, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: overdueData, isLoading: overdueLoading } = useDashboardOverduePayments();
  const { data: upcomingData, isLoading: upcomingLoading } = useDashboardUpcomingPayments();
  const { data: cashFlowData, isLoading: cashFlowLoading } = useDashboardCashFlow();

  const metrics = metricsData?.data;
  const overdue = overdueData?.data || [];
  const upcoming = upcomingData?.data || [];
  const cashFlow = cashFlowData?.data || [];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } }
  };

  if (metricsLoading || overdueLoading || upcomingLoading || cashFlowLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(null).map((_, idx) => (
            <div key={idx} className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 h-28 flex flex-col justify-between shimmer-skeleton">
              <div className="h-3.5 bg-[var(--color-surface)] w-28 rounded-md"></div>
              <div className="h-7 bg-[var(--color-surface)] w-40 rounded-md"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 h-[400px] shimmer-skeleton"></div>
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 h-[400px] shimmer-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 hover-action flex flex-col justify-between h-28 border-l-4 border-l-rose-500">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-500">Tổng nợ Quá hạn</span>
            <AlertTriangle size={16} className="text-rose-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-rose-500">
            <AnimatedCounter value={metrics?.overduePayments ?? 0} formatter={(v) => formatVND(v)} />
          </h2>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 hover-action flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted-fg)]">Doanh thu Hợp đồng Active</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-fg)]">
            <AnimatedCounter value={metrics?.contractValue ?? 0} formatter={(v) => formatVND(v)} />
          </h2>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 hover-action flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-muted-fg)]">Hợp đồng Đã ký</span>
            <FileText size={16} className="text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-fg)]">
            <AnimatedCounter value={metrics?.activeContracts ?? 0} />
          </h2>
        </motion.div>
      </div>

      {/* Bento Grid: Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 hover-action">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted-fg)] mb-6">Dòng tiền Kế hoạch vs Thực tế hàng tháng</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlow} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#818CF8" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" stroke="var(--color-muted-fg)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-fg)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: 'var(--color-surface)', opacity: 0.15 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="custom-recharts-tooltip space-y-1">
                          <p className="text-xs font-semibold text-[var(--color-fg)] mb-1">{payload[0].payload.period}</p>
                          {payload.map((p, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.fill === 'url(#plannedGrad)' ? '#818CF8' : '#10B981' }}></span>
                              <span className="text-[10px] text-[var(--color-muted-fg)]">{p.name}:</span>
                              <span className="text-[10px] font-mono text-[var(--color-fg)] font-semibold">{formatVND(Number(p.value))}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Bar name="Dự thu kế hoạch" dataKey="planned" fill="url(#plannedGrad)" radius={[4, 4, 0, 0]} />
                <Bar name="Thực thu thực tế" dataKey="actual" fill="url(#actualGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Invoice issuance alerts */}
        <motion.div variants={itemVariants} className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 hover-action">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted-fg)] mb-6">Yêu cầu phát hành hóa đơn</h3>
          <div className="space-y-3">
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-3 flex flex-col justify-between hover:border-[var(--color-accent)]/20 transition-all duration-200">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-indigo-500">CON-2026-0004</span>
                <Tag color="orange">Pending</Tag>
              </div>
              <p className="text-xs font-semibold text-[var(--color-fg)] mt-1 truncate">CyberCore LLC</p>
              <div className="flex justify-between items-center mt-2 text-[10px] text-[var(--color-muted-fg)]">
                <span>Mốc: Tạm ứng đợt 1 (30%)</span>
                <span className="font-mono text-indigo-500 font-semibold">{formatVND(105000000)}</span>
              </div>
            </div>
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-3 flex flex-col justify-between hover:border-[var(--color-accent)]/20 transition-all duration-200">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-indigo-500">CON-2026-0009</span>
                <Tag color="orange">Pending</Tag>
              </div>
              <p className="text-xs font-semibold text-[var(--color-fg)] mt-1 truncate">Alpha Tech</p>
              <div className="flex justify-between items-center mt-2 text-[10px] text-[var(--color-muted-fg)]">
                <span>Mốc: Bàn giao UI Design</span>
                <span className="font-mono text-indigo-500 font-semibold">{formatVND(72000000)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Overdue vs Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue payments list */}
        <motion.div variants={itemVariants} className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 hover-action">
          <h3 className="text-xs font-mono uppercase tracking-wider text-rose-500 mb-6 flex items-center gap-1.5">
            <AlertTriangle size={14} /> Danh sách Hóa đơn trễ hạn
          </h3>
          {overdue.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có hóa đơn trễ hạn" />
          ) : (
            <div className="space-y-3">
              {overdue.map((o, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[var(--color-bg)] border border-[var(--color-border)] p-3 rounded-xl hover:border-rose-500/20 transition-all duration-200">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-fg)]">{o.invoiceCode} - {o.account}</h4>
                    <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5">{o.milestone} • Hạn: {formatDate(o.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-rose-500">{formatVND(o.amount)}</p>
                    <span className="text-[9px] font-semibold text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded-full border border-rose-500/10">Trễ {o.daysOverdue} ngày</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upcoming payments list */}
        <motion.div variants={itemVariants} className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 hover-action">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted-fg)] mb-6">
            Các đợt thu tiền sắp tới (7 ngày)
          </h3>
          {upcoming.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có đợt thu tiền nào trong 7 ngày tới" />
          ) : (
            <div className="space-y-3">
              {upcoming.map((u, idx) => (
                <div key={idx} className="flex justify-between items-center bg-[var(--color-bg)] border border-[var(--color-border)] p-3 rounded-xl hover:border-emerald-500/20 transition-all duration-200">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--color-fg)]">{u.invoiceCode} - {u.account}</h4>
                    <p className="text-[10px] text-[var(--color-muted-fg)] mt-0.5">{u.milestone} • Hạn: {formatDate(u.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-emerald-500">{formatVND(u.amount)}</p>
                    <span className="text-[9px] text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10 font-semibold">Sắp đến hạn</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
