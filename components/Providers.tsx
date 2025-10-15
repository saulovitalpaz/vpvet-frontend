'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/contexts/AuthContext';
import { PublicAuthProvider } from '@/contexts/PublicAuthContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PublicAuthProvider>{children}</PublicAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
