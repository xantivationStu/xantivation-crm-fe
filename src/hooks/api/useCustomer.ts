import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Customer, Contact, CreateCustomerDto, CreateContactDto } from '@/types/customer.types';
import { PaginationQuery, PaginatedResponse, BaseResponse } from '@/types/api.types';
import { message } from 'antd';

export function useCustomers(query?: PaginationQuery) {
  return useQuery<BaseResponse<Customer[]>>({
    queryKey: ['customers', query],
    queryFn: async () => {
      const response = await api.get('/customers', { params: query });
      return response.data;
    },
  });
}

export function useCustomer(id: string) {
  return useQuery<BaseResponse<Customer>>({
    queryKey: ['customer', id],
    queryFn: async () => {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useContacts(query?: PaginationQuery) {
  return useQuery<BaseResponse<Contact[]>>({
    queryKey: ['contacts', query],
    queryFn: async () => {
      const response = await api.get('/customers/contacts', { params: query });
      return response.data;
    },
  });
}

export function useContact(id: string) {
  return useQuery<BaseResponse<Contact>>({
    queryKey: ['contact', id],
    queryFn: async () => {
      const response = await api.get(`/customers/contacts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateCustomerDto) => {
      const response = await api.post('/customers', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      message.success('Tạo Khách hàng thành công!');
    },
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateContactDto) => {
      const response = await api.post('/customers/contacts', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['customer'] });
      message.success('Tạo Liên hệ thành công!');
    },
  });
}

export function useSetPrimaryContact(accountId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contactId: string) => {
      const response = await api.patch(`/customers/contacts/${contactId}/set-primary`, { accountId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['customer', accountId] });
      message.success('Đã đặt liên hệ chính!');
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: Partial<CreateCustomerDto> }) => {
      const response = await api.patch(`/customers/${id}`, dto);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
      message.success('Cập nhật Khách hàng thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật Khách hàng thất bại!');
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      message.success('Xóa Khách hàng thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Xóa Khách hàng thất bại!');
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: any }) => {
      const response = await api.patch(`/customers/contacts/${id}`, dto);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['customer'] });
      message.success('Cập nhật Liên hệ thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật Liên hệ thất bại!');
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/customers/contacts/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['customer'] });
      message.success('Xóa Liên hệ thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Xóa Liên hệ thất bại!');
    },
  });
}
