import { useAuthStore } from '@/stores/auth.store';
import { api } from '@/services/api';
import { LoginDto, RegisterDto } from '@/types/auth.types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { message } from 'antd';

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
      message.success('Đăng nhập thành công!');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại!';
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
      message.success('Đăng ký tài khoản thành công!');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Đăng ký thất bại!';
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
      message.success('Đăng xuất thành công!');
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
