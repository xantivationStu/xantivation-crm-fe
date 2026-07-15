import { UserRole } from '@/types/auth.types';

export type Permission =
  | 'VIEW_DASHBOARD'
  | 'MANAGE_LEADS'
  | 'MANAGE_CUSTOMERS'
  | 'MANAGE_OPPORTUNITIES'
  | 'MANAGE_QUOTATIONS'
  | 'APPROVE_QUOTATIONS'
  | 'MANAGE_DEALS'
  | 'APPROVE_DEALS'
  | 'MANAGE_CONTRACTS'
  | 'MANAGE_PAYMENTS'
  | 'VIEW_REPORTS'
  | 'VIEW_AUDIT_LOGS'
  | 'MANAGE_USERS'
  | 'MANAGE_AI_GOVERNANCE'
  | 'USE_AI_HUB';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    'VIEW_DASHBOARD',
    'MANAGE_LEADS',
    'MANAGE_CUSTOMERS',
    'MANAGE_OPPORTUNITIES',
    'MANAGE_QUOTATIONS',
    'APPROVE_QUOTATIONS',
    'MANAGE_DEALS',
    'APPROVE_DEALS',
    'MANAGE_CONTRACTS',
    'MANAGE_PAYMENTS',
    'VIEW_REPORTS',
    'VIEW_AUDIT_LOGS',
    'MANAGE_USERS',
    'MANAGE_AI_GOVERNANCE',
    'USE_AI_HUB',
  ],
  [UserRole.SALES_MANAGER]: [
    'VIEW_DASHBOARD',
    'MANAGE_LEADS',
    'MANAGE_CUSTOMERS',
    'MANAGE_OPPORTUNITIES',
    'MANAGE_QUOTATIONS',
    'APPROVE_QUOTATIONS',
    'MANAGE_DEALS',
    'APPROVE_DEALS',
    'MANAGE_CONTRACTS',
    'VIEW_REPORTS',
    'USE_AI_HUB',
  ],
  [UserRole.SALES_REP]: [
    'VIEW_DASHBOARD',
    'MANAGE_LEADS',
    'MANAGE_CUSTOMERS',
    'MANAGE_OPPORTUNITIES',
    'MANAGE_QUOTATIONS',
    'MANAGE_DEALS',
    'USE_AI_HUB',
  ],
  [UserRole.ACCOUNTANT]: [
    'VIEW_DASHBOARD',
    'MANAGE_CONTRACTS',
    'MANAGE_PAYMENTS',
    'VIEW_REPORTS',
    'USE_AI_HUB',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

export function canAccessRoute(role: UserRole, path: string): boolean {
  if (role === UserRole.ADMIN) return true;
  
  if (path.startsWith('/settings/users') || path.startsWith('/settings/ai-governance') || path.startsWith('/audit-logs')) {
    return hasPermission(role, 'MANAGE_USERS') || hasPermission(role, 'VIEW_AUDIT_LOGS');
  }
  
  if (path.startsWith('/reports')) {
    return hasPermission(role, 'VIEW_REPORTS');
  }
  
  if (path.startsWith('/payments') || path.startsWith('/contracts')) {
    return hasPermission(role, 'MANAGE_CONTRACTS') || hasPermission(role, 'MANAGE_PAYMENTS');
  }

  if (path.startsWith('/leads') || path.startsWith('/customers') || path.startsWith('/opportunities') || path.startsWith('/quotations') || path.startsWith('/deals')) {
    return hasPermission(role, 'MANAGE_LEADS') || hasPermission(role, 'MANAGE_CUSTOMERS') || hasPermission(role, 'MANAGE_OPPORTUNITIES');
  }
  
  return true;
}
