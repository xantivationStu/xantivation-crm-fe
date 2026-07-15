import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Lead, CreateLeadDto, UpdateLeadDto, LeadActivity } from '@/types/lead.types';
import { PaginationQuery, PaginatedResponse, BaseResponse } from '@/types/api.types';
import { message } from 'antd';

export function useLeads(query?: PaginationQuery) {
  return useQuery<BaseResponse<Lead[]>>({
    queryKey: ['leads', query],
    queryFn: async () => {
      const response = await api.get('/leads', { params: query });
      return response.data;
    },
  });
}

export function useLead(id: string) {
  return useQuery<BaseResponse<Lead>>({
    queryKey: ['lead', id],
    queryFn: async () => {
      const response = await api.get(`/leads/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useLeadActivities(leadId: string) {
  return useQuery<BaseResponse<LeadActivity[]>>({
    queryKey: ['lead-activities', leadId],
    queryFn: async () => {
      const response = await api.get(`/leads/${leadId}/activities`);
      return response.data;
    },
    enabled: !!leadId,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateLeadDto) => {
      const response = await api.post('/leads', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      message.success('Tạo Lead thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Tạo Lead thất bại!');
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: UpdateLeadDto }) => {
      const response = await api.patch(`/leads/${id}`, dto);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', variables.id] });
      message.success('Cập nhật Lead thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật Lead thất bại!');
    },
  });
}

export function useConvertLead(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { opportunityName?: string; expectedCloseDate?: string; amount?: number }) => {
      const response = await api.post(`/leads/${id}/convert`, dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      message.success('Chuyển đổi Lead thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Chuyển đổi Lead thất bại!');
    },
  });
}

export function useAddLeadActivity(leadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE'; notes: string }) => {
      const response = await api.post(`/leads/${leadId}/activities`, dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-activities', leadId] });
      message.success('Ghi chú hoạt động thành công!');
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/leads/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      message.success('Xóa Lead thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Xóa Lead thất bại!');
    },
  });
}
