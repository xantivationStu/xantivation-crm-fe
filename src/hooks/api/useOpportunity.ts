import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Opportunity, CreateOpportunityDto, UpdateOpportunityDto } from '@/types/opportunity.types';
import { PaginationQuery, PaginatedResponse, BaseResponse } from '@/types/api.types';
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
      message.success('Tạo Cơ hội bán hàng thành công!');
    },
  });
}

export function useUpdateOpportunity(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: UpdateOpportunityDto) => {
      const response = await api.patch(`/opportunities/${id}`, dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunity', id] });
      message.success('Cập nhật Cơ hội thành công!');
    },
  });
}

export function useCloseLostOpportunity(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { lostReason: string }) => {
      const response = await api.patch(`/opportunities/${id}/close-lost`, dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['opportunity', id] });
      message.success('Đã cập nhật trạng thái Thất bại!');
    },
  });
}
