import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { BaseResponse } from '@/types/api.types';

export function useMeetings() {
  return useQuery<BaseResponse<any[]>, Error>({
    queryKey: ['meetings'],
    queryFn: async () => {
      const response = await api.get('/meetings');
      return response.data;
    },
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  return useMutation<BaseResponse<any>, Error, any>({
    mutationFn: async (payload: any) => {
      const response = await api.post('/meetings', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  return useMutation<BaseResponse<any>, Error, { id: string; payload: any }>({
    mutationFn: async ({ id, payload }) => {
      const response = await api.patch(`/meetings/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  return useMutation<BaseResponse<any>, Error, string>({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/meetings/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
  });
}
