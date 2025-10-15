'use client';

import { useState, useMemo } from 'react';
import { usePublicAuth } from '@/contexts/PublicAuthContext';
import ClientSidebar from '@/components/ClientSidebar';
import {
  CalendarDays,
  Clock,
  Filter,
  Heart,
  User,
  X,
  Plus,
  ChevronRight,
  Phone,
  MapPin,
  FileText,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ClientConsultasPage() {
  const { clientData, pets, consultations, loading } = usePublicAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();

  // Set initial filter from URL
  useState(() => {
    const petId = searchParams.get('pet');
    if (petId) {
      setSelectedPet(petId);
    }
  });

  const filteredConsultations = useMemo(() => {
    return consultations.filter(consultation => {
      const petMatch = !selectedPet || consultation.appointment.animal.name === selectedPet ||
        consultation.appointment.animal.id === selectedPet;

      // For demo purposes, we'll consider all consultations as upcoming
      const statusMatch = !selectedStatus || selectedStatus === 'upcoming';

      return petMatch && statusMatch;
    });
  }, [consultations, selectedPet, selectedStatus]);

  const petNames = useMemo(() => {
    const names = Array.from(new Set(consultations.map(c => c.appointment.animal.name)));
    return names.sort();
  }, [consultations]);

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

  const clearFilters = () => {
    setSelectedPet('');
    setSelectedStatus('');
  };

  const activeFiltersCount = [selectedPet, selectedStatus].filter(Boolean).length;

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('pt-BR'),
      time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusBadge = (dateTime: string) => {
    const appointmentDate = new Date(dateTime);
    const now = new Date();
    const isUpcoming = appointmentDate > now;

    return {
      text: isUpcoming ? 'Agendada' : 'Realizada',
      color: isUpcoming ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
    };
  };

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
                <CalendarDays className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Consultas
                </h1>
                <p className="text-sm text-gray-500">
                  {filteredConsultations.length} de {consultations.length} consultas
                </p>
              </div>
            </div>

            {/* Mobile title */}
            <h1 className="lg:hidden text-lg font-bold text-gray-900">
              Consultas
            </h1>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline-flex text-sm text-gray-500">
                {filteredConsultations.length} de {consultations.length} consultas
              </span>

              <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {clientData?.tutor_name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'T'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {clientData?.tutor_name || 'Tutor'}
                  </p>
                  <p className="text-xs text-gray-500">Portal do Tutor</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Próximas Consultas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {consultations.filter(c => new Date(c.appointment.datetime) > new Date()).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Consultas Realizadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {consultations.filter(c => new Date(c.appointment.datetime) <= new Date()).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-emerald-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pets Atendidos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(consultations.map(c => c.appointment.animal.name)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg mb-6">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium text-gray-900">Filtrar Consultas</h2>
                  {activeFiltersCount > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Limpar filtros
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {(showFilters || activeFiltersCount > 0) && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Pet Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrar por Pet
                    </label>
                    <select
                      value={selectedPet}
                      onChange={(e) => setSelectedPet(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Todos os pets</option>
                      {petNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrar por Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Todos os status</option>
                      <option value="upcoming">Agendadas</option>
                      <option value="completed">Realizadas</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Consultations List */}
          {filteredConsultations.length > 0 ? (
            <div className="space-y-4">
              {filteredConsultations.map((consultation) => {
                const dateTime = formatDateTime(consultation.appointment.datetime);
                const status = getStatusBadge(consultation.appointment.datetime);

                return (
                  <div key={consultation.id} className="bg-white border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200 rounded-lg">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {consultation.appointment.animal.name}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          consultation.appointment.service_type === 'Ultrassom'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {consultation.appointment.service_type}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                            {dateTime.date} às {dateTime.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            Tutor: {consultation.appointment.animal.tutor.name}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Heart className="h-4 w-4 mr-2 text-gray-400" />
                            {consultation.appointment.animal.species} • {consultation.appointment.animal.id}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {new Date(consultation.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>

                      {consultation.chief_complaint && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Motivo da Consulta</h4>
                          <p className="text-sm text-gray-600">{consultation.chief_complaint}</p>
                        </div>
                      )}

                      {consultation.diagnosis && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Diagnóstico</h4>
                          <p className="text-sm text-gray-600">{consultation.diagnosis}</p>
                        </div>
                      )}

                      {consultation.treatment_plan && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Plano de Tratamento</h4>
                          <p className="text-sm text-gray-600">{consultation.treatment_plan}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>ID: {consultation.id}</span>
                          <span>Criado em: {new Date(consultation.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          {consultation.appointment.datetime > new Date().toISOString() && (
                            <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors">
                              <CalendarDays className="w-4 h-4 mr-1" />
                              Remarcar
                            </button>
                          )}
                          <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                            <FileText className="w-4 h-4 mr-1" />
                            Ver Detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarDays className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {consultations.length === 0 ? 'Nenhuma consulta encontrada' : 'Nenhuma consulta corresponde aos filtros'}
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {consultations.length === 0
                  ? 'Suas consultas aparecerão aqui assim que forem agendadas.'
                  : 'Tente ajustar os filtros para encontrar as consultas que você procura.'
                }
              </p>
              {consultations.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12 bg-emerald-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-emerald-900 mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center px-4 py-3 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors border border-emerald-200">
                <Plus className="w-5 h-5 mr-2" />
                Agendar Nova Consulta
              </button>
              <Link
                href="/client-dashboard/exames"
                className="flex items-center justify-center px-4 py-3 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors border border-emerald-200"
              >
                <FileText className="w-5 h-5 mr-2" />
                Ver Exames
              </Link>
              <Link
                href="/client-dashboard/historico"
                className="flex items-center justify-center px-4 py-3 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors border border-emerald-200"
              >
                <Clock className="w-5 h-5 mr-2" />
                Histórico Médico
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}