'use client';

import { useState } from 'react';
import { usePublicAuth } from '@/contexts/PublicAuthContext';
import ClientSidebar from '@/components/ClientSidebar';
import {
  Heart,
  CalendarDays,
  FileText,
  Clock,
  Plus,
  ChevronRight,
  Menu
} from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard() {
  const { clientData, pets, consultations, examResults, loading } = usePublicAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">Você precisa estar autenticado para acessar esta página.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Meus Pets',
      value: pets.length.toString(),
      icon: Heart,
      href: '/client-dashboard/pets',
      color: 'bg-blue-500'
    },
    {
      name: 'Consultas',
      value: consultations.length.toString(),
      icon: CalendarDays,
      href: '/client-dashboard/consultas',
      color: 'bg-green-500'
    },
    {
      name: 'Exames',
      value: examResults.length.toString(),
      icon: FileText,
      href: '/client-dashboard/exames',
      color: 'bg-purple-500'
    },
    {
      name: 'Histórico',
      value: '0',
      icon: Clock,
      href: '/client-dashboard/historico',
      color: 'bg-orange-500'
    }
  ];

  const upcomingConsultations = consultations.slice(0, 3);
  const recentExams = examResults.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex relative">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ClientSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-0 relative z-10">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-[76px] relative z-20">
          <div className="flex items-center justify-between h-full">
            {/* Mobile menu button - Hide on tablet and desktop */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Bem-vindo(a), {clientData.tutor_name.split(' ')[0]}!
                </h1>
                <p className="text-sm text-gray-500">
                  Área do Tutor
                </p>
              </div>
            </div>

            {/* Mobile title */}
            <h1 className="lg:hidden text-lg font-bold text-gray-900">
              Portal do Tutor
            </h1>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {clientData.tutor_name.split(' ').map(n => n[0]).join('').substring(0, 2) || 'TV'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {clientData.tutor_name}
                  </p>
                  <p className="text-xs text-gray-500">Tutor</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Meus Pets */}
              <Link href="/client-dashboard/pets" className="group">
                <div className="h-full bg-white border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200 rounded-lg">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                        <Heart className="w-5 h-5 text-emerald-700" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <h3 className="font-semibold text-base text-gray-900 mb-0.5">Meus Pets</h3>
                    <p className="text-sm text-gray-500">{pets.length} pets cadastrados</p>
                  </div>
                </div>
              </Link>

              {/* Consultas */}
              <Link href="/client-dashboard/consultas" className="group">
                <div className="h-full bg-white border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200 rounded-lg">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                        <CalendarDays className="w-5 h-5 text-emerald-700" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <h3 className="font-semibold text-base text-gray-900 mb-0.5">Consultas</h3>
                    <p className="text-sm text-gray-500">{consultations.length} consultas</p>
                  </div>
                </div>
              </Link>

              {/* Exames */}
              <Link href="/client-dashboard/exames" className="group">
                <div className="h-full bg-white border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200 rounded-lg">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                        <FileText className="w-5 h-5 text-emerald-700" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <h3 className="font-semibold text-base text-gray-900 mb-0.5">Exames</h3>
                    <p className="text-sm text-gray-500">{examResults.length} exames</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Today's Overview */}
          <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg">
            <div className="border-b border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Visão Geral
                </h2>
              </div>
            </div>

            <div className="p-8">
              {pets.length > 0 || consultations.length > 0 || examResults.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Pets */}
                  {pets.length > 0 && (
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Meus Pets</h3>
                      <div className="space-y-3">
                        {pets.slice(0, 3).map((pet) => (
                          <div key={pet.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Heart className="w-5 h-5 text-emerald-700" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{pet.name}</p>
                                <p className="text-sm text-gray-500">{pet.species} • {pet.breed}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/client-dashboard/pets"
                        className="inline-flex items-center gap-1 mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Ver todos
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}

                  {/* Recent Activity */}
                  {(consultations.length > 0 || examResults.length > 0) && (
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Atividade Recente</h3>
                      <div className="space-y-3">
                        {consultations.slice(0, 2).map((consultation) => (
                          <div key={consultation.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-3">
                              <CalendarDays className="w-5 h-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">Consulta: {consultation.appointment.animal.name}</p>
                                <p className="text-sm text-gray-500">{consultation.appointment.service_type}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(consultation.appointment.datetime).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {examResults.slice(0, 2).map((exam) => (
                          <div key={exam.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-3">
                              <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">Exame: {exam.animal_name}</p>
                                <p className="text-sm text-gray-500">{exam.exam_type}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(exam.exam_date).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/client-dashboard/historico"
                        className="inline-flex items-center gap-1 mt-4 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Ver histórico completo
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16">
                  <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-7 h-7 text-emerald-700" />
                  </div>
                  <p className="text-base font-semibold text-gray-900 mb-1">
                    Bem-vindo ao seu portal!
                  </p>
                  <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                    Comece adicionando seus pets para gerenciar consultas, exames e manter um histórico completo de saúde.
                  </p>
                  <Link
                    href="/client-dashboard/pets"
                    className="inline-flex items-center px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Cadastrar Primeiro Pet
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}