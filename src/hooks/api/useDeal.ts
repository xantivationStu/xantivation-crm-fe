import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Deal, ConfigureMilestonesDto, SubmitReviewDto } from '@/types/deal.types';
import { PaginationQuery, PaginatedResponse, BaseResponse } from '@/types/api.types';
import i18n from '@/lib/i18n';
import { message } from 'antd';

export function useDeals(query?: PaginationQuery) {
  return useQuery<PaginatedResponse<Deal>>({
    queryKey: ['deals', query],
    queryFn: async () => {
      const response = await api.get('/deals', { params: query });
      return response.data;
    },
  });
}

export function useDeal(id: string) {
  return useQuery<BaseResponse<Deal>>({
    queryKey: ['deal', id],
    queryFn: async () => {
      const response = await api.get(`/deals/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useConfigureMilestones() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; dto: ConfigureMilestonesDto }) => {
      const response = await api.patch(`/deals/${payload.id}/milestones`, payload.dto);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal', variables.id] });
      message.success(i18n.t('hooks.deal.milestoneSaved'));
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || i18n.t('hooks.deal.milestoneFailed'));
    },
  });
}

export function useSubmitDealReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; dto: SubmitReviewDto }) => {
      const response = await api.patch(`/deals/${payload.id}/submit-review`, payload.dto);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal', variables.id] });
      message.success(i18n.t('hooks.deal.approvalSent'));
    },
  });
}

export function useApproveDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/deals/${id}/approve`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal', id] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      message.success(i18n.t('hooks.deal.approvedWithContract'));
    },
  });
}
