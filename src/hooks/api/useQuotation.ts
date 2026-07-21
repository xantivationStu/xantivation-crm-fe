import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Quotation, CreateQuotationDto } from '@/types/quotation.types';
import { PaginationQuery, PaginatedResponse, BaseResponse } from '@/types/api.types';
import i18n from '@/lib/i18n';
import { message } from 'antd';

export function useQuotations(query?: PaginationQuery) {
  return useQuery<PaginatedResponse<Quotation>>({
    queryKey: ['quotations', query],
    queryFn: async () => {
      const response = await api.get('/quotations', { params: query });
      return response.data;
    },
  });
}

export function useQuotation(id: string) {
  return useQuery<BaseResponse<Quotation>>({
    queryKey: ['quotation', id],
    queryFn: async () => {
      const response = await api.get(`/quotations/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateQuotationDto) => {
      const response = await api.post('/quotations', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      message.success(i18n.t('hooks.quotation.createdSuccess'));
    },
  });
}

export function useCloneQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/quotations/${id}/clone`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation', id] });
      message.success(i18n.t('hooks.quotation.duplicatedSuccess'));
    },
  });
}

export function useUpdateQuotationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; status: string }) => {
      const response = await api.patch(`/quotations/${payload.id}/status`, { status: payload.status });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      message.success(i18n.t('hooks.quotation.statusUpdated'));
    },
  });
}

export function useUpdateQuotation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; dto: any }) => {
      const response = await api.patch(`/quotations/${payload.id}`, payload.dto);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation', variables.id] });
      message.success(i18n.t('hooks.quotation.updatedSuccess'));
    },
  });
}
