import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { AiConversation, AiMessage, AiUsageMetrics, KnowledgeDocument, MemoryItem } from '@/types/ai-hub.types';
import { BaseResponse } from '@/types/api.types';
import { message } from 'antd';

export function useAiConversations() {
  return useQuery<BaseResponse<AiConversation[]>>({
    queryKey: ['ai-conversations'],
    queryFn: async () => {
      const response = await api.get('/integrations/ai-hub/conversations');
      return response.data;
    },
  });
}

export function useAiConversationMessages(conversationId: string) {
  return useQuery<BaseResponse<AiMessage[]>>({
    queryKey: ['ai-messages', conversationId],
    queryFn: async () => {
      const response = await api.get(`/integrations/ai-hub/conversations/${conversationId}/messages`);
      return response.data;
    },
    enabled: !!conversationId,
  });
}

export function useCreateAiConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { title: string; agentType: string; contextEntityId?: string; contextEntityType?: string }) => {
      const response = await api.post('/integrations/ai-hub/conversations', dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
    },
  });
}

export function useAiUsageMetrics() {
  return useQuery<BaseResponse<AiUsageMetrics>>({
    queryKey: ['ai-usage-metrics'],
    queryFn: async () => {
      const response = await api.get('/integrations/ai-hub/usage');
      return response.data;
    },
  });
}

export function useKnowledgeDocuments() {
  return useQuery<BaseResponse<KnowledgeDocument[]>>({
    queryKey: ['knowledge-documents'],
    queryFn: async () => {
      const response = await api.get('/integrations/ai-hub/knowledge');
      return response.data;
    },
  });
}

export function useUploadKnowledgeDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/integrations/ai-hub/knowledge/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-documents'] });
      message.success('Đã tải lên tài liệu RAG!');
    },
    onError: () => {
      message.error('Tải lên tài liệu thất bại!');
    },
  });
}

export function useMemoryItems() {
  return useQuery<BaseResponse<MemoryItem[]>>({
    queryKey: ['ai-memory-items'],
    queryFn: async () => {
      const response = await api.get('/integrations/ai-hub/memory');
      return response.data;
    },
  });
}

export function useDeleteMemoryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/integrations/ai-hub/memory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-memory-items'] });
      message.success('Đã quên thông tin ghi nhớ!');
    },
  });
}
