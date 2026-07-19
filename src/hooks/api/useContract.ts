import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Contract, PaymentSchedule, StartSigningDto, UpdatePaymentDto } from '@/types/contract.types';
import { PaginationQuery, PaginatedResponse, BaseResponse } from '@/types/api.types';
import { message } from 'antd';

export function useContracts(query?: PaginationQuery) {
  return useQuery<PaginatedResponse<Contract>>({
    queryKey: ['contracts', query],
    queryFn: async () => {
      const response = await api.get('/contracts', { params: query });
      return response.data;
    },
  });
}

export function useContract(id: string) {
  return useQuery<BaseResponse<Contract>>({
    queryKey: ['contract', id],
    queryFn: async () => {
      const response = await api.get(`/contracts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function usePayments(query?: PaginationQuery) {
  return useQuery<PaginatedResponse<PaymentSchedule>>({
    queryKey: ['payments', query],
    queryFn: async () => {
      const response = await api.get('/payments', { params: query });
      return response.data;
    },
  });
}

export function usePayment(id: string) {
  return useQuery<BaseResponse<PaymentSchedule>>({
    queryKey: ['payment', id],
    queryFn: async () => {
      const response = await api.get(`/payments/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useStartContractSigning() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; dto: StartSigningDto }) => {
      const response = await api.post(`/contracts/${payload.id}/send`, payload.dto);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', variables.id] });
      message.success('Đã gửi yêu cầu ký số DocuSign!');
    },
  });
}

export function useForceSignContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/contracts/${id}/sign`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
      message.success('Đã xác nhận ký hợp đồng thủ công!');
    },
  });
}

export function useVoidContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.patch(`/contracts/${id}/void`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
      message.success('Đã hủy hợp đồng!');
    },
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/payments/${id}/confirm`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', id] });
      queryClient.invalidateQueries({ queryKey: ['contract'] });
      message.success('Xác nhận thanh toán thành công!');
    },
  });
}
