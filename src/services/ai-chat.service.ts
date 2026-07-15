import { AiAgentType } from '@/types/ai-hub.types';

interface SseCallbacks {
  onChunk: (chunk: string) => void;
  onStepChange?: (stepIndex: number, logs?: string) => void;
  onComplete: (fullMessage: string) => void;
  onError: (error: any) => void;
}

export const aiChatService = {
  connectStream(
    prompt: string,
    agent: AiAgentType,
    callbacks: SseCallbacks
  ): () => void {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    
    // Construct target SSE endpoint URL
    const sseUrl = `${API_URL}/integrations/ai-hub/chat?prompt=${encodeURIComponent(prompt)}&agent=${agent.toLowerCase()}`;
    
    let eventSource: EventSource | null = null;
    let accumulatedText = '';
    
    try {
      eventSource = new EventSource(sseUrl);
      
      eventSource.onmessage = (event) => {
        try {
          if (event.data === '[DONE]') {
            callbacks.onComplete(accumulatedText);
            eventSource?.close();
            return;
          }

          // Parse JSON if possible
          const parsed = JSON.parse(event.data);
          
          if (parsed.step) {
            callbacks.onStepChange?.(parsed.step, parsed.logs);
          }
          
          if (parsed.content) {
            accumulatedText += parsed.content;
            callbacks.onChunk(accumulatedText);
          }
        } catch {
          // Fallback if data is raw text
          if (event.data) {
            accumulatedText += event.data;
            callbacks.onChunk(accumulatedText);
          }
        }
      };

      eventSource.onerror = (error) => {
        callbacks.onError(error);
        eventSource?.close();
      };
      
    } catch (err) {
      callbacks.onError(err);
    }

    // Return cleanup close function
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  },
};
