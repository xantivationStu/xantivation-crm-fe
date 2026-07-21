import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Customer, Contact, CreateCustomerDto, CreateContactDto } from '@/types/customer.types';
import { PaginationQuery, PaginatedResponse, BaseResponse } from '@/types/api.types';
import i18n from '@/lib/i18n';
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
      message.success(i18n.t('hooks.customer.createdSuccess'));
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
      message.success(i18n.t('hooks.customer.contactCreated'));
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
      message.success(i18n.t('hooks.customer.primaryContactSet'));
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
      message.success(i18n.t('hooks.customer.updatedSuccess'));
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || i18n.t('hooks.customer.updateFailed'));
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
      message.success(i18n.t('hooks.customer.deletedSuccess'));
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || i18n.t('hooks.customer.deletionFailed'));
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
      message.success(i18n.t('hooks.customer.contactUpdated'));
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || i18n.t('hooks.customer.contactUpdateFailed'));
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
      message.success(i18n.t('hooks.customer.contactDeleted'));
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || i18n.t('hooks.customer.contactDeletionFailed'));
    },
  });
}
