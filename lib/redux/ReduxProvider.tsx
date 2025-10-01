"use client";

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { initializeAuth } from './slices/authSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth state from localStorage on mount
    store.dispatch(initializeAuth());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
