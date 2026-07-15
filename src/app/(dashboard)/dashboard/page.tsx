'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { UserRole } from '@/types/auth.types';
import { Skeleton } from 'antd';
import SalesDashboard from '@/components/dashboard/SalesDashboard';
import ManagerDashboard from '@/components/dashboard/ManagerDashboard';
import AccountantDashboard from '@/components/dashboard/AccountantDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton.Input active size="large" style={{ width: 200 }} />
          <Skeleton.Input active size="small" style={{ width: 350, marginTop: 8 }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3)
            .fill(null)
            .map((_, idx) => (
              <div key={idx} className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 h-28 flex flex-col justify-between">
                <Skeleton.Input active size="small" style={{ width: 120 }} />
                <Skeleton.Input active size="default" style={{ width: 80 }} />
              </div>
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 h-80">
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
          <div className="bg-[var(--color-bg-tint)] border border-[var(--color-border)] rounded-2xl p-6 h-80">
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        </div>
      </div>
    );
  }

  // Headings based on role
  const headings = {
    [UserRole.SALES_REP]: {
      title: 'Bảng làm việc của tôi',
      subtitle: 'Theo dõi leads hôm nay, báo giá sắp hết hạn và phễu cơ hội cá nhân.',
    },
    [UserRole.SALES_MANAGER]: {
      title: 'Bảng quản trị kinh doanh',
      subtitle: 'Giám sát chỉ số phễu, nguồn lead, dự báo và xếp hạng sales team.',
    },
    [UserRole.ACCOUNTANT]: {
      title: 'Bảng điều khiển tài chính',
      subtitle: 'Theo dõi các đợt thanh toán sắp đến hạn, quá hạn và biểu đồ dòng tiền.',
    },
    [UserRole.ADMIN]: {
      title: 'Bảng điều trị hệ thống',
      subtitle: 'Giám sát hoạt động của người dùng, kiểm soát AI và trạng thái kết nối tích hợp.',
    },
  };

  const currentHeading = headings[user.role] || {
    title: 'Dashboard',
    subtitle: 'Chỉ số hoạt động chung hệ thống.',
  };

  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.SALES_REP:
        return <SalesDashboard />;
      case UserRole.SALES_MANAGER:
        return <ManagerDashboard />;
      case UserRole.ACCOUNTANT:
        return <AccountantDashboard />;
      case UserRole.ADMIN:
        return <AdminDashboard />;
      default:
        return <SalesDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-fg)]">
          {currentHeading.title}
        </h1>
        <p className="text-sm text-[var(--color-muted-fg)]">
          Chào mừng trở lại, {`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}. {currentHeading.subtitle}
        </p>
      </div>

      {/* Main dashboard content */}
      {renderDashboard()}
    </div>
  );
}
