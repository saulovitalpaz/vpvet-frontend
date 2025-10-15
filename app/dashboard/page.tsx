'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Calendar, Users, FileText, Clock, CheckCircle2, ChevronRight, Menu, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

function DashboardContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex relative">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative z-10">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 h-[76px] relative z-20">
          <div className="flex items-center justify-between h-full">
            {/* Mobile menu button - Hide on tablet and desktop */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Bem-vindo de volta, Dr. {user?.name?.replace('Dr. ', '').split(' ')[0] || 'Saulo'}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Mobile title */}
            <h1 className="lg:hidden text-lg font-bold text-gray-900">
              Dashboard
            </h1>

            <div className="flex items-center gap-2 sm:gap-4">
              <NotificationDropdown />
              <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'SV'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name || 'Dr. Saulo Vital'}
                  </p>
                  <p className="text-xs text-gray-500">Sistema</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">

          
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Agenda */}
              <Link href="/agenda" className="group">
                <Card className="h-full bg-white border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                        <Calendar className="w-5 h-5 text-emerald-700" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <h3 className="font-semibold text-base text-gray-900 mb-0.5">Agenda</h3>
                    <p className="text-sm text-gray-500">Gerenciar horários</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Pacientes */}
              <Link href="/pacientes" className="group">
                <Card className="h-full bg-white border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                        <Users className="w-5 h-5 text-emerald-700" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <h3 className="font-semibold text-base text-gray-900 mb-0.5">Pacientes</h3>
                    <p className="text-sm text-gray-500">Cadastro completo</p>
                  </CardContent>
                </Card>
              </Link>

              {/* Consultas */}
              <Link href="/consultas" className="group">
                <Card className="h-full bg-white border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                        <FileText className="w-5 h-5 text-emerald-700" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <h3 className="font-semibold text-base text-gray-900 mb-0.5">Consultas</h3>
                    <p className="text-sm text-gray-500">Laudos e resultados</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Today's Appointments */}
          <Card className="bg-white border border-gray-200/60 shadow-sm">
            <CardHeader className="border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Agendamentos de Hoje
                  </CardTitle>
                </div>
                <Link href="/agenda">
                  <Button
                    variant="link"
                    className="text-emerald-600 hover:text-emerald-700 gap-1"
                  >
                    Ver todos
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {/* Empty State */}
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-7 h-7 text-emerald-700" />
                </div>
                <p className="text-base font-semibold text-gray-900 mb-1">
                  Nenhum agendamento para hoje
                </p>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  Sua agenda está livre. Os próximos agendamentos aparecerão aqui.
                </p>
                <Link href="/agenda">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2">
                    Criar Agendamento
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
