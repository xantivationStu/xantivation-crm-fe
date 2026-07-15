import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { BaseResponse } from '@/types/api.types';

export interface DashboardMetrics {
  totalLeads: number;
  newLeadsToday: number;
  activeOpportunities: number;
  pipelineValue: number;
  activeContracts: number;
  contractValue: number;
  overduePayments: number;
  revenueForecast30Days: number;
}

export interface FunnelStageData {
  stage: string;
  count: number;
  value: number;
}

export interface RevenueForecastPoint {
  date: string;
  forecast: number;
  actual?: number;
}

export interface LeadSourceData {
  name: string;
  value: number;
}

export interface TopPerformer {
  name: string;
  email: string;
  wonAmount: number;
  count: number;
}

export interface CompactLead {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  status: string;
  source: string;
  createdAt: string;
}

export interface ExpiringQuotation {
  id: string;
  code: string;
  projectName: string;
  grandTotal: number;
  validUntil: string;
}

export interface OverduePayment {
  id: string;
  invoiceCode: string;
  account: string;
  milestone: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
}

export interface UpcomingPayment {
  id: string;
  invoiceCode: string;
  account: string;
  milestone: string;
  amount: number;
  dueDate: string;
}

export interface CashFlowPoint {
  period: string;
  planned: number;
  actual: number;
}

export interface SystemOverview {
  leads: number;
  customers: number;
  opportunities: number;
  contracts: number;
}

export interface AuditLogItem {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

export interface IntegrationStatusItem {
  name: string;
  status: string;
  url: string;
}

export function useDashboardMetrics() {
  return useQuery<BaseResponse<DashboardMetrics>>({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const response = await api.get('/dashboard/metrics');
      return response.data;
    },
  });
}

export function useDashboardPipelineFunnel() {
  return useQuery<BaseResponse<FunnelStageData[]>>({
    queryKey: ['dashboard-pipeline-funnel'],
    queryFn: async () => {
      const response = await api.get('/dashboard/pipeline-funnel');
      return response.data;
    },
  });
}

export function useDashboardRevenueForecast() {
  return useQuery<BaseResponse<RevenueForecastPoint[]>>({
    queryKey: ['dashboard-revenue-forecast'],
    queryFn: async () => {
      const response = await api.get('/dashboard/revenue-forecast');
      return response.data;
    },
  });
}

export function useDashboardLeadSources() {
  return useQuery<BaseResponse<LeadSourceData[]>>({
    queryKey: ['dashboard-lead-sources'],
    queryFn: async () => {
      const response = await api.get('/dashboard/lead-sources');
      return response.data;
    },
  });
}

export function useDashboardTopPerformers() {
  return useQuery<BaseResponse<TopPerformer[]>>({
    queryKey: ['dashboard-top-performers'],
    queryFn: async () => {
      const response = await api.get('/dashboard/top-performers');
      return response.data;
    },
  });
}

export function useDashboardMyLeads() {
  return useQuery<BaseResponse<CompactLead[]>>({
    queryKey: ['dashboard-my-leads'],
    queryFn: async () => {
      const response = await api.get('/dashboard/my-leads');
      return response.data;
    },
  });
}

export function useDashboardExpiringQuotations() {
  return useQuery<BaseResponse<ExpiringQuotation[]>>({
    queryKey: ['dashboard-expiring-quotations'],
    queryFn: async () => {
      const response = await api.get('/dashboard/expiring-quotations');
      return response.data;
    },
  });
}

export function useDashboardOverduePayments() {
  return useQuery<BaseResponse<OverduePayment[]>>({
    queryKey: ['dashboard-overdue-payments'],
    queryFn: async () => {
      const response = await api.get('/dashboard/overdue-payments');
      return response.data;
    },
  });
}

export function useDashboardUpcomingPayments() {
  return useQuery<BaseResponse<UpcomingPayment[]>>({
    queryKey: ['dashboard-upcoming-payments'],
    queryFn: async () => {
      const response = await api.get('/dashboard/upcoming-payments');
      return response.data;
    },
  });
}

export function useDashboardCashFlow() {
  return useQuery<BaseResponse<CashFlowPoint[]>>({
    queryKey: ['dashboard-cash-flow'],
    queryFn: async () => {
      const response = await api.get('/dashboard/cash-flow');
      return response.data;
    },
  });
}

export function useDashboardSystemOverview() {
  return useQuery<BaseResponse<SystemOverview>>({
    queryKey: ['dashboard-system-overview'],
    queryFn: async () => {
      const response = await api.get('/dashboard/system-overview');
      return response.data;
    },
  });
}

export function useDashboardRecentAuditLogs() {
  return useQuery<BaseResponse<AuditLogItem[]>>({
    queryKey: ['dashboard-recent-audit-logs'],
    queryFn: async () => {
      const response = await api.get('/dashboard/recent-audit-logs');
      return response.data;
    },
  });
}

export function useDashboardIntegrationStatus() {
  return useQuery<BaseResponse<IntegrationStatusItem[]>>({
    queryKey: ['dashboard-integration-status'],
    queryFn: async () => {
      const response = await api.get('/dashboard/integration-status');
      return response.data;
    },
  });
}
