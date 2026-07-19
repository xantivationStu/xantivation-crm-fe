import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { BaseResponse } from '@/types/api.types';

export interface ErpConfigDto {
  url: string;
  db: string;
  username: string;
  password?: string;
}

export function useTestErpConnection() {
  return useMutation<BaseResponse<any>, Error, ErpConfigDto>({
    mutationFn: async (config: ErpConfigDto) => {
      const response = await api.post('/integrations/erp/test-connection', config);
      return response.data;
    },
  });
}

export function useSyncCustomers() {
  const queryClient = useQueryClient();
  return useMutation<BaseResponse<any>, Error, any | undefined>({
    mutationFn: async (config?: any) => {
      const response = await api.post('/customers/erp-sync', config || {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useSyncLeads() {
  const queryClient = useQueryClient();
  return useMutation<BaseResponse<any>, Error, any | undefined>({
    mutationFn: async (config?: any) => {
      const response = await api.post('/leads/erp-sync', config || {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useSyncQuotations() {
  const queryClient = useQueryClient();
  return useMutation<BaseResponse<any>, Error, any | undefined>({
    mutationFn: async (config?: any) => {
      const response = await api.post('/quotations/erp-sync', config || {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
}

export function useSyncPayments() {
  const queryClient = useQueryClient();
  return useMutation<BaseResponse<any>, Error, any | undefined>({
    mutationFn: async (config?: any) => {
      const response = await api.post('/payments/erp-sync', config || {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useSyncOpportunities() {
  const queryClient = useQueryClient();
  return useMutation<BaseResponse<any>, Error, any | undefined>({
    mutationFn: async (config?: any) => {
      const response = await api.post('/opportunities/erp-sync', config || {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useSyncMeetings() {
  const queryClient = useQueryClient();
  return useMutation<BaseResponse<any>, Error, any | undefined>({
    mutationFn: async (config?: any) => {
      const response = await api.post('/meetings/erp-sync', config || {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

export function useSyncSalesTeams() {
  const queryClient = useQueryClient();
  return useMutation<BaseResponse<any>, Error, any | undefined>({
    mutationFn: async (config?: any) => {
      const response = await api.post('/sales-teams/erp-sync', config || {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-teams'] });
    },
  });
}

export function useSyncUtm() {
  return useMutation<BaseResponse<any>, Error, void>({
    mutationFn: async () => {
      const response = await api.post('/integrations/erp/sync-utm');
      return response.data;
    },
  });
}

export function useSyncActivities() {
  const queryClient = useQueryClient();
  return useMutation<BaseResponse<any>, Error, any | undefined>({
    mutationFn: async (config?: any) => {
      const response = await api.post('/meetings/sync-activities', config || {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}
