import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { PaginationQuery, PaginatedResponse } from '@/types/api.types';

export interface AuditLog {
  id: string;
  timestamp: string;
  entityName: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATE_CHANGE';
  userEmail: string;
  ipAddress?: string;
  oldValues?: any;
  newValues?: any;
}

export function useAuditLogs(query?: PaginationQuery) {
  return useQuery<PaginatedResponse<AuditLog>>({
    queryKey: ['audit-logs', query],
    queryFn: async () => {
      const response = await api.get('/audit-logs', { params: query });
      return response.data;
    },
  });
}
