import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { BaseResponse } from '@/types/api.types';
import {
  LlmProvider,
  ApiKey,
  LlmModel,
  Agent,
  AgentExecutionLog,
  CreateProviderDto,
  CreateApiKeyDto,
  CreateModelDto,
  CreateAgentDto,
} from '@/types/ai-settings.types';
import { message } from 'antd';

// === Providers Hooks ===
export function useProviders() {
  return useQuery<BaseResponse<LlmProvider[]>>({
    queryKey: ['llm-providers'],
    queryFn: async () => {
      const response = await api.get('/ai-settings/providers');
      return response.data;
    },
  });
}

export function useCreateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateProviderDto) => {
      const response = await api.post('/ai-settings/providers', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['llm-providers'] });
      message.success('Đã thêm nhà cung cấp LLM mới');
    },
  });
}

export function useUpdateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateProviderDto> }) => {
      const response = await api.patch(`/ai-settings/providers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['llm-providers'] });
      message.success('Đã cập nhật nhà cung cấp LLM');
    },
  });
}

export function useDeleteProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/ai-settings/providers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['llm-providers'] });
      message.success('Đã xóa nhà cung cấp LLM');
    },
  });
}

export function useTestProviderConnection() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/ai-settings/providers/${id}/test`);
      return response.data;
    },
  });
}

export function useFetchModelsFromProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/ai-settings/providers/${id}/fetch-models`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['llm-models'] });
      queryClient.invalidateQueries({ queryKey: ['llm-providers'] });
      message.success('Đã tự động quét và cập nhật danh sách model!');
    },
  });
}

// === API Keys Hooks ===
export function useApiKeys() {
  return useQuery<BaseResponse<ApiKey[]>>({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const response = await api.get('/ai-settings/api-keys');
      return response.data;
    },
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateApiKeyDto) => {
      const response = await api.post('/ai-settings/api-keys', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      message.success('Đã lưu API Key thành công (encrypted)');
    },
  });
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateApiKeyDto> }) => {
      const response = await api.patch(`/ai-settings/api-keys/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      message.success('Đã cập nhật API Key');
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/ai-settings/api-keys/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      message.success('Đã xóa API Key');
    },
  });
}

// === Models Hooks ===
export function useModels() {
  return useQuery<BaseResponse<LlmModel[]>>({
    queryKey: ['llm-models'],
    queryFn: async () => {
      const response = await api.get('/ai-settings/models');
      return response.data;
    },
  });
}

export function useCreateModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateModelDto) => {
      const response = await api.post('/ai-settings/models', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['llm-models'] });
      message.success('Đã thêm mô hình LLM');
    },
  });
}

export function useDeleteModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/ai-settings/models/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['llm-models'] });
      message.success('Đã xóa mô hình LLM');
    },
  });
}

// === Agents Hooks ===
export function useAgents() {
  return useQuery<BaseResponse<Agent[]>>({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await api.get('/ai-settings/agents');
      return response.data;
    },
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateAgentDto) => {
      const response = await api.post('/ai-settings/agents', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      message.success('Đã tạo AI Agent mới');
    },
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAgentDto> }) => {
      const response = await api.patch(`/ai-settings/agents/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      message.success('Đã cập nhật AI Agent');
    },
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/ai-settings/agents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      message.success('Đã xóa AI Agent');
    },
  });
}

// === Execution Logs Hooks ===
export function useExecutionLogs(page = 1, limit = 20) {
  return useQuery<BaseResponse<{ data: AgentExecutionLog[]; total: number }>>({
    queryKey: ['execution-logs', page, limit],
    queryFn: async () => {
      const response = await api.get(`/ai-settings/execution-logs?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
}
