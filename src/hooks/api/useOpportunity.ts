import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Opportunity, CreateOpportunityDto, UpdateOpportunityDto } from '@/types/opportunity.types';
import { PaginationQuery, PaginatedResponse, BaseResponse } from '@/types/api.types';
import i18n from '@/lib/i18n';
import { message } from 'antd';

export function useOpportunities(query?: PaginationQuery) {
  return useQuery<PaginatedResponse<Opportunity>>({
    queryKey: ['opportunities', query],
    queryFn: async () => {
      const response = await api.get('/opportunities', { params: query });
      return response.data;
    },
  });
}

export function useOpportunity(id: string) {
  return useQuery<BaseResponse<Opportunity>>({
    queryKey: ['opportunity', id],
    queryFn: async () => {
      const response = await api.get(`/opportunities/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateOpportunityDto) => {
      const response = await api.post('/opportunities', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      message.success(i18n.t('hooks.opportunity.createdSuccess'));
    },
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; dto: UpdateOpportunityDto }) => {
      const response = await api.patch(`/opportunities/${payload.id}`, payload.dto);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunity', variables.id] });
      message.success(i18n.t('hooks.opportunity.updatedSuccess'));
    },
  });
}

export function useCloseLostOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; lostReason: string }) => {
      const response = await api.patch(`/opportunities/${payload.id}/close-lost`, { lostReason: payload.lostReason });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunity', variables.id] });
      message.success(i18n.t('hooks.opportunity.closedLost'));
    },
  });
}

export function useDeleteOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/opportunities/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      message.success(i18n.t('hooks.opportunity.deletedSuccess'));
    },
  });
}
