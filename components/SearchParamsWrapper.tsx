'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface SearchParamsWrapperProps {
  children: React.ReactNode;
}

export default function SearchParamsWrapper({ children }: SearchParamsWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}