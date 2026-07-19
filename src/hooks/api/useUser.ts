import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { BaseResponse } from '@/types/api.types';
import { UserRole } from '@/types/auth.types';
import { message } from 'antd';

export interface UserProfileDto {
  name: string;
  email: string;
  password?: string;
  region?: string;
}

export interface UserAdminCreateDto {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  region?: string;
}

export interface UserAdminUpdateDto extends Partial<UserAdminCreateDto> {}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region?: string;
  createdAt: string;
  updatedAt: string;
}

export function useUsers() {
  return useQuery<BaseResponse<SystemUser[]>>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: UserAdminCreateDto) => {
      const response = await api.post('/users', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Tạo nhân viên mới thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Tạo nhân viên thất bại!');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; dto: UserAdminUpdateDto }) => {
      const response = await api.patch(`/users/${payload.id}`, payload.dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Cập nhật nhân viên thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật nhân viên thất bại!');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Xóa nhân viên thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Xóa nhân viên thất bại!');
    },
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (payload: { id: string; dto: UserProfileDto }) => {
      const response = await api.patch(`/users/${payload.id}`, payload.dto);
      return response.data;
    },
    onSuccess: () => {
      message.success('Cập nhật thông tin cá nhân thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật thông tin thất bại!');
    },
  });
}

export function useSalesTeams() {
  return useQuery<BaseResponse<any[]>>({
    queryKey: ['sales-teams'],
    queryFn: async () => {
      const response = await api.get('/sales-teams');
      return response.data;
    },
  });
}

export function useCreateSalesTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post('/sales-teams', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-teams'] });
      message.success('Tạo đội ngũ bán hàng thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Tạo đội ngũ thất bại!');
    },
  });
}

export function useUpdateSalesTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; data: any }) => {
      const response = await api.patch(`/sales-teams/${payload.id}`, payload.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-teams'] });
      message.success('Cập nhật đội ngũ thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật đội ngũ thất bại!');
    },
  });
}

export function useDeleteSalesTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/sales-teams/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-teams'] });
      message.success('Xóa đội ngũ thành công!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Xóa đội ngũ thất bại!');
    },
  });
}
