// Client-side providers for Redux
'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect } from 'react';
import { initializeAuth } from '@/lib/features/authSlice';
import { initializeCart } from '@/lib/features/cartSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth and cart state from localStorage on client side
    store.dispatch(initializeAuth());
    store.dispatch(initializeCart());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

