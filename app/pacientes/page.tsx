'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Patient } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Search, Plus, Users as UsersIcon, Menu, Dog, Cat } from 'lucide-react';

function PacientesContent() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['patients', search],
    queryFn: async () => {
      const response = await api.get('/patients', {
        params: { search: search || undefined, limit: 50 },
      });
      return response.data;
    },
  });

  const patients: Patient[] = data?.patients || [];

  const getSpeciesLabel = (species: string) => {
    const speciesMap: { [key: string]: string } = {
      'canine': 'Canino',
      'feline': 'Felino',
      'other': 'Outro'
    };
    return speciesMap[species.toLowerCase()] || species;
  };

  const getSpeciesIcon = (species: string) => {
    const normalizedSpecies = species?.toLowerCase();
    if (normalizedSpecies === 'canine') {
      return Dog;
    } else if (normalizedSpecies === 'feline') {
      return Cat;
    }
    return UsersIcon; // fallback to user icon for other species
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex relative">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 relative z-10">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 h-[76px] relative z-20">
          <div className="flex items-center justify-between h-full">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Pacientes</h1>
                <p className="text-sm text-gray-500">Gerencie o cadastro de pacientes</p>
              </div>
            </div>

            {/* Mobile title */}
            <h1 className="lg:hidden text-lg font-bold text-gray-900">
              Pacientes
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

        {/* Page Content */}
        <div className="p-4 sm:p-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Pacientes</h2>
              <p className="mt-1 text-sm text-gray-600">Visualize e gerencie todos os pacientes cadastrados</p>
            </div>
            <Link href="/pacientes/novo">
              <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                <Plus className="mr-2 h-4 w-4" />
                Novo Paciente
              </Button>
            </Link>
          </div>

          {/* Search */}
          <Card className="mb-6 border border-gray-200/60 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar por nome do pet, tutor ou CPF..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Patients List */}
          {isLoading ? (
            <Card className="border border-gray-200/60 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando pacientes...</p>
              </CardContent>
            </Card>
          ) : patients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {patients.map((patient) => (
                <Link key={patient.id} href={`/pacientes/${patient.id}`}>
                  <Card className="h-[280px] flex flex-col border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        {/* Patient Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center flex-shrink-0">
                          {(() => {
                            const AnimalIcon = getSpeciesIcon(patient.species);
                            return <AnimalIcon className="w-6 h-6 text-emerald-600" />;
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                            {patient.name}
                          </CardTitle>
                          <Badge variant="secondary" className="mt-1.5">
                            {getSpeciesLabel(patient.species)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between pt-0">
                      <div className="space-y-2 text-sm">
                        {patient.breed && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-gray-400">•</span>
                            <span>{patient.breed}</span>
                          </div>
                        )}
                        {patient.age_years && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-gray-400">•</span>
                            <span>{patient.age_years} anos</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-3 mt-3 border-t border-gray-200/60">
                        <div className="font-medium text-sm text-gray-900 truncate">
                          {patient.tutor.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate mt-0.5">
                          {patient.tutor.phone}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border border-gray-200/60 shadow-sm">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-base font-semibold text-gray-900 mb-1">
                  {search ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                </p>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  {search ? 'Tente buscar com outros termos' : 'Comece adicionando o primeiro paciente'}
                </p>
                <Link href="/pacientes/novo">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar Primeiro Paciente
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PacientesPage() {
  return (
    <ProtectedRoute>
      <PacientesContent />
    </ProtectedRoute>
  );
}
