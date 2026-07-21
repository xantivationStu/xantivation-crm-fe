import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/services/api';
import { LoginDto, RegisterDto } from '@/types/auth.types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { message } from 'antd';
import i18n from '@/lib/i18n';

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const login = async (dto: LoginDto) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', dto);
      const { user: loggedUser, tokens } = response.data.data;
      setAuth(loggedUser, tokens);
      message.success(i18n.t('hooks.auth.loginSuccess'));
      router.push('/dashboard');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || i18n.t('hooks.auth.loginFailed');
      message.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (dto: RegisterDto) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', dto);
      const { user: registeredUser, tokens } = response.data.data;
      setAuth(registeredUser, tokens);
      message.success(i18n.t('hooks.auth.registerSuccess'));
      router.push('/dashboard');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || i18n.t('hooks.auth.registerFailed');
      message.error(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout API failures
    } finally {
      storeLogout();
      message.success(i18n.t('header.logoutSuccess'));
      router.push('/login');
      setLoading(false);
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };
}
