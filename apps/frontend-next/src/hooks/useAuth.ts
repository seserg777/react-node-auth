// Custom hook for authentication functionality (Next.js)
'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/features/authSlice';
import type { RootState } from '@/lib/store';

export const useAuth = () => {
  const { user, isAuthenticated, loading, error, systemMessage } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    systemMessage,
    handleLogout
  };
};

