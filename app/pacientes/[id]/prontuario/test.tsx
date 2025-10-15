'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { SimpleMedicalRecord } from '@/components/MedicalRecord/SimpleMedicalRecord';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Monitor, Smartphone, Tablet } from 'lucide-react';
import Link from 'next/link';

function TestMedicalRecordContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const isMobile = viewMode === 'mobile';
  const isTablet = viewMode === 'tablet';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/pacientes/1`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              </Link>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teste de Prontuário</h1>
                <p className="text-sm text-gray-500">Teste de responsividade</p>
              </div>
            </div>

            {/* View Mode Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                className="gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tablet')}
                className="gap-2"
              >
                <Tablet className="w-4 h-4" />
                Tablet
              </Button>
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                className="gap-2"
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </Button>
            </div>
          </div>
        </header>

        {/* Content Container with Responsive Classes */}
        <div className="p-4 sm:p-8">
          <Card className="mb-6 border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Modo de Visualização: <span className="text-emerald-600">{viewMode.toUpperCase()}</span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Testando como o prontuário se adapta a diferentes tamanhos de tela
                  </p>
                </div>
                <div className="text-sm text-gray-400">
                  {isMobile && '360px - 414px'}
                  {isTablet && '768px - 1023px'}
                  {viewMode === 'desktop' && '1024px+'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsive Container */}
          <div className={`${isMobile ? 'max-w-sm mx-auto' : isTablet ? 'max-w-2xl mx-auto' : 'w-full'}`}>
            <SimpleMedicalRecord isMobile={isMobile} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TestMedicalRecordPage() {
  return (
    <ProtectedRoute>
      <TestMedicalRecordContent />
    </ProtectedRoute>
  );
}