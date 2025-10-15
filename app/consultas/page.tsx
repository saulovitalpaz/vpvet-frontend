'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Search, FileText, Menu, Calendar, User, Dog, Cat } from 'lucide-react';

interface Consultation {
  id: string;
  appointment_id: string;
  chief_complaint?: string;
  diagnosis?: string;
  treatment_plan?: string;
  prognosis?: string;
  created_at: string;
  appointment: {
    datetime: string;
    service_type: string;
    animal: {
      id: string;
      name: string;
      species: string;
      tutor: {
        name: string;
      };
    };
  };
}

function ConsultasContent() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['consultations', search],
    queryFn: async () => {
      const response = await api.get('/consultations', {
        params: { search: search || undefined },
      });
      return response.data;
    },
  });

  const consultations: Consultation[] = data?.consultations || [];

  const getSpeciesLabel = (species: string) => {
    const speciesMap: { [key: string]: string } = {
      'canine': 'Canino',
      'feline': 'Felino',
      'other': 'Outro'
    };
    return speciesMap[species?.toLowerCase()] || species;
  };

  const getSpeciesIcon = (species: string) => {
    const normalizedSpecies = species?.toLowerCase();
    if (normalizedSpecies === 'canine') {
      return Dog;
    } else if (normalizedSpecies === 'feline') {
      return Cat;
    }
    return User; // fallback to user icon for other species
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 relative z-10">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 h-[76px] relative z-20">
          <div className="flex items-center justify-between h-full">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Consultas</h1>
                <p className="text-sm text-gray-500">Histórico de consultas realizadas</p>
              </div>
            </div>

            <h1 className="lg:hidden text-lg font-bold text-gray-900">
              Consultas
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
                    Dr. {user?.name?.startsWith('Dr.') ? user.name.split(' ').slice(1).join(' ') : (user?.name || 'Saulo Vital')}
                  </p>
                  <p className="text-xs text-gray-500">Sistema</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Consultas</h2>
              <p className="mt-1 text-sm text-gray-600">Visualize todas as consultas realizadas</p>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-6 border border-gray-200/60 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar por nome do paciente, tutor ou diagnóstico..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Consultations List */}
          {isLoading ? (
            <Card className="border border-gray-200/60 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando consultas...</p>
              </CardContent>
            </Card>
          ) : consultations.length > 0 ? (
            <div className="space-y-8">
              {consultations.map((consultation) => (
                <Link key={consultation.id} href={`/consultas/${consultation.id}`} className="block">
                  <Card className="border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer mb-8">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-6">
                        {/* Left Column - Primary Info */}
                        <div className="flex-1 space-y-4">

                          {/* Patient Header */}
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center flex-shrink-0">
                              {(() => {
                                const AnimalIcon = getSpeciesIcon(consultation.appointment.animal.species);
                                return <AnimalIcon className="w-5 h-5 text-emerald-600" />;
                              })()}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                                {consultation.appointment.animal.name}
                              </h3>
                              <p className="text-sm text-gray-500 mt-0.5">
                                Tutor: {consultation.appointment.animal.tutor.name}
                              </p>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs font-medium">
                              {getSpeciesLabel(consultation.appointment.animal.species)}
                            </Badge>
                            <Badge variant="outline" className="text-xs font-medium border-gray-300">
                              {consultation.appointment.service_type}
                            </Badge>
                          </div>

                          {/* Medical Information */}
                          {consultation.chief_complaint && (
                            <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Queixa Principal
                              </p>
                              <p className="text-sm text-gray-900 leading-relaxed">
                                {consultation.chief_complaint}
                              </p>
                            </div>
                          )}

                          {consultation.diagnosis && (
                            <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                Diagnóstico
                              </p>
                              <p className="text-sm text-gray-900 leading-relaxed">
                                {consultation.diagnosis}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right Column - Date/Time */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-gray-900 font-medium">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">
                                {new Date(consultation.appointment.datetime).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 mt-1 block">
                              {new Date(consultation.appointment.datetime).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border border-gray-200/60 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-base font-semibold text-gray-900 mb-2">
                  {search ? 'Nenhuma consulta encontrada' : 'Nenhuma consulta registrada'}
                </p>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  {search ? 'Tente buscar com outros termos' : 'As consultas aparecerão aqui após serem realizadas'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ConsultasPage() {
  return (
    <ProtectedRoute>
      <ConsultasContent />
    </ProtectedRoute>
  );
}
