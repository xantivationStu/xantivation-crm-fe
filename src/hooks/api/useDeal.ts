import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Deal, ConfigureMilestonesDto, SubmitReviewDto } from '@/types/deal.types';
import { PaginationQuery, PaginatedResponse, BaseResponse } from '@/types/api.types';
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

export function useConfigureMilestones(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: ConfigureMilestonesDto) => {
      const response = await api.patch(`/deals/${id}/milestones`, dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal', id] });
      message.success('Đã lưu cấu hình mốc thanh toán!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cấu hình mốc thanh toán thất bại!');
    },
  });
}

export function useSubmitDealReview(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: SubmitReviewDto) => {
      const response = await api.patch(`/deals/${id}/submit-review`, dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal', id] });
      message.success('Đã gửi phê duyệt nội bộ!');
    },
  });
}

export function useApproveDeal(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.post(`/deals/${id}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal', id] });
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      message.success('Đã phê duyệt thương vụ! Hợp đồng và hóa đơn đã được tự động tạo.');
    },
  });
}
