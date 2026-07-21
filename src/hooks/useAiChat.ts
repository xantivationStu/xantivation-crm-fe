import { useState, useCallback } from 'react';
import { useAiHubStore } from '@/stores/ai-hub.store';
import { aiChatService } from '@/services/ai-chat.service';
import i18n from '@/lib/i18n';
import { AiMessage, AiAgentType, AgentStatus } from '@/types/ai-hub.types';

export function useAiChat() {
  const { activeConversation, activeAgent, setAgentStatus } = useAiHubStore();
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [streamingText, setStreamingText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback(
    async (prompt: string, currentAgent: AiAgentType = activeAgent) => {
      if (!prompt.trim() || isSending) return;

      setIsSending(true);
      setAgentStatus(AgentStatus.THINKING);

      const userMsg: AiMessage = {
        id: Math.random().toString(),
        role: 'user',
        content: prompt,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setStreamingText('');

      const cleanUp = aiChatService.connectStream(prompt, currentAgent, {
        onChunk: (chunk) => {
          setAgentStatus(AgentStatus.EXECUTING);
          setStreamingText(chunk);
        },
        onComplete: (fullMessage) => {
          const assistantMsg: AiMessage = {
            id: Math.random().toString(),
            role: 'assistant',
            content: fullMessage,
            agentType: currentAgent,
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setStreamingText('');
          setIsSending(false);
          setAgentStatus(AgentStatus.ONLINE);
        },
        onError: (err) => {
          console.error('SSE Error:', err);
          const errorMsg: AiMessage = {
            id: Math.random().toString(),
            role: 'assistant',
            content: i18n.t('hooks.aiChat.connectionError'),
            agentType: currentAgent,
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMsg]);
          setStreamingText('');
          setIsSending(false);
          setAgentStatus(AgentStatus.ONLINE);
        },
      });

      return cleanUp;
    },
    [activeAgent, isSending, setAgentStatus]
  );

  return {
    messages,
    setMessages,
    streamingText,
    isSending,
    sendMessage,
  };
}
