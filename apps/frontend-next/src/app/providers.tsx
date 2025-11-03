// Client-side providers for Redux
'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect } from 'react';
import { initializeAuth } from '@/lib/features/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth state from localStorage on client side
    store.dispatch(initializeAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

