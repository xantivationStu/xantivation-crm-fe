import { useAuthStore } from '@/stores/auth.store';
import { hasPermission, canAccessRoute, Permission } from '@/lib/permissions';

export function usePermission() {
  const { user } = useAuthStore();
  
  const checkPermission = (permission: Permission): boolean => {
    if (!user || !user.role) return false;
    return hasPermission(user.role, permission);
  };

  const checkRouteAccess = (path: string): boolean => {
    if (!user || !user.role) return false;
    return canAccessRoute(user.role, path);
  };

  return {
    role: user?.role || null,
    hasPermission: checkPermission,
    canAccessRoute: checkRouteAccess,
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'SALES_MANAGER',
    isRep: user?.role === 'SALES_REP',
    isAccountant: user?.role === 'ACCOUNTANT',
  };
}
