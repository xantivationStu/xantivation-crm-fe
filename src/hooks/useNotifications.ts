import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import { Notification } from '@/types/notification.types';
import { message } from 'antd';

export function useNotifications() {
  const { accessToken, isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    // Establish EventSource subscription
    const sseUrl = `${API_URL}/notifications/stream?token=${accessToken}`;
    
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(sseUrl);

      eventSource.onmessage = (event) => {
        try {
          const parsed: Notification = JSON.parse(event.data);
          addNotification(parsed);
          
          // Trigger in-app UI Toast alert
          message.info(parsed.title + ': ' + parsed.message);
        } catch {
          // Ignore parse errors for raw events
        }
      };

      eventSource.onerror = () => {
        // Silently close on error to prevent constant connection error spam on console
        eventSource?.close();
      };
    } catch {
      // Ignore initial setup errors
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isAuthenticated, accessToken, addNotification]);
}
