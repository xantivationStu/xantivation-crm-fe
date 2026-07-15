import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { ChatwootConversation, ChatwootMessage } from '@/types/conversation.types';
import { BaseResponse } from '@/types/api.types';

export function useConversations(status: 'open' | 'pending' | 'resolved' = 'open') {
  return useQuery<BaseResponse<ChatwootConversation[]>>({
    queryKey: ['conversations', status],
    queryFn: async () => {
      const response = await api.get('/integrations/chatwoot/conversations', { params: { status } });
      return response.data;
    },
  });
}

export function useConversationMessages(conversationId: number) {
  return useQuery<BaseResponse<ChatwootMessage[]>>({
    queryKey: ['conversation-messages', conversationId],
    queryFn: async () => {
      const response = await api.get(`/integrations/chatwoot/conversations/${conversationId}/messages`);
      return response.data;
    },
    enabled: !!conversationId,
  });
}

export function useSendConversationMessage(conversationId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { content: string; messageType?: 'incoming' | 'outgoing' }) => {
      const response = await api.post(`/integrations/chatwoot/conversations/${conversationId}/messages`, dto);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation-messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export interface ContactMatchResponse {
  matched: boolean;
  type?: 'lead' | 'customer';
  profile?: any;
}

export function useMatchConversationContact(params: { email?: string; phone?: string }) {
  return useQuery<BaseResponse<ContactMatchResponse>>({
    queryKey: ['match-contact', params],
    queryFn: async () => {
      const response = await api.get('/integrations/chatwoot/match', { params });
      return response.data;
    },
    enabled: !!(params.email || params.phone),
  });
}
