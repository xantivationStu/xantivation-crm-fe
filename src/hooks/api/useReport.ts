import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { ReportSummary, PipelineReport, SalesForecastReport, PaymentReport } from '@/types/report.types';
import { BaseResponse } from '@/types/api.types';

export function useReportSummary(filters?: { startDate?: string; endDate?: string; ownerId?: string }) {
  return useQuery<BaseResponse<ReportSummary>>({
    queryKey: ['report-summary', filters],
    queryFn: async () => {
      const response = await api.get('/reports/summary', { params: filters });
      return response.data;
    },
  });
}

export function usePipelineReport(filters?: { startDate?: string; endDate?: string }) {
  return useQuery<BaseResponse<PipelineReport>>({
    queryKey: ['pipeline-report', filters],
    queryFn: async () => {
      const response = await api.get('/reports/pipeline', { params: filters });
      return response.data;
    },
  });
}

export function useSalesForecast(filters?: { horizon?: number }) {
  return useQuery<BaseResponse<SalesForecastReport>>({
    queryKey: ['sales-forecast', filters],
    queryFn: async () => {
      const response = await api.get('/reports/sales-forecast', { params: filters });
      return response.data;
    },
  });
}

export function usePaymentReport(filters?: { period?: string }) {
  return useQuery<BaseResponse<PaymentReport>>({
    queryKey: ['payment-report', filters],
    queryFn: async () => {
      const response = await api.get('/reports/payment', { params: filters });
      return response.data;
    },
  });
}
