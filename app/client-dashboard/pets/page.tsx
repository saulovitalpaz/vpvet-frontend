'use client';

import { useState } from 'react';
import { usePublicAuth } from '@/contexts/PublicAuthContext';
import ClientSidebar from '@/components/ClientSidebar';
import {
  Heart,
  Plus,
  Pencil,
  Trash2,
  Camera,
  Calendar,
  Info,
  Menu
} from 'lucide-react';
import Link from 'next/link';

export default function MeusPetsPage() {
  const { clientData, pets, loading } = usePublicAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);

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

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return 'Idade não informada';

    const birth = new Date(birthDate);
    const today = new Date();
    const ageInDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    if (ageInDays < 30) {
      return `${ageInDays} dias`;
    } else if (ageInDays < 365) {
      const months = Math.floor(ageInDays / 30);
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(ageInDays / 365);
      const remainingMonths = Math.floor((ageInDays % 365) / 30);
      if (remainingMonths === 0) {
        return `${years} ${years === 1 ? 'ano' : 'anos'}`;
      }
      return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
    }
  };

  const getSpeciesDisplay = (species: string) => {
    const speciesMap: { [key: string]: string } = {
      'canine': 'Cão',
      'feline': 'Gato',
      'avian': 'Ave',
      'reptile': 'Réptil',
      'rodent': 'Roedor',
      'other': 'Outro'
    };
    return speciesMap[species.toLowerCase()] || species;
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
                <Heart className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Meus Pets
                </h1>
                <p className="text-sm text-gray-500">
                  Gerencie as informações dos seus pets
                </p>
              </div>
            </div>

            {/* Mobile title */}
            <h1 className="lg:hidden text-lg font-bold text-gray-900">
              Meus Pets
            </h1>

            <div className="flex items-center gap-2 sm:gap-4">
              <button className="inline-flex items-center px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Pet
              </button>

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
          <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Total de Pets</h2>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{pets.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Pets cadastrados</p>
                </div>
                <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-emerald-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Pets Grid */}
          {pets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200 rounded-lg overflow-hidden"
                >
                  {/* Pet Photo */}
                  <div className="h-48 bg-gray-50 relative">
                    {pet.photo_url ? (
                      <img
                        src={pet.photo_url}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    <button
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      title="Alterar foto"
                    >
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  {/* Pet Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                        <p className="text-sm text-gray-500">
                          {getSpeciesDisplay(pet.species)}{pet.breed ? ` • ${pet.breed}` : ''}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Editar informações"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Remover pet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Idade: {calculateAge(pet.birth_date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Info className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Tutor: {pet.tutor_name}</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href={`/client-dashboard/consultas?pet=${pet.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
                      >
                        Consultas
                      </Link>
                      <Link
                        href={`/client-dashboard/exames?pet=${pet.id}`}
                        className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
                      >
                        Exames
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-emerald-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pet cadastrado</h2>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                Comece adicionando seu primeiro pet para gerenciar informações, consultas e exames facilmente.
              </p>
              <button className="inline-flex items-center px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Pet
              </button>
            </div>
          )}

          {/* Tips Section */}
          {pets.length > 0 && (
            <div className="mt-12 bg-emerald-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-emerald-900 mb-4">Dicas para cuidar dos seus pets</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-sm text-emerald-800">
                  <h4 className="font-medium mb-1">📅 Consultas Regulares</h4>
                  <p>Mantenha as vacinas e check-ups em dia para a saúde do seu pet.</p>
                </div>
                <div className="text-sm text-emerald-800">
                  <h4 className="font-medium mb-1">📋 Histórico Completo</h4>
                  <p>Guarde todos os exames e resultados para acompanhar a evolução.</p>
                </div>
                <div className="text-sm text-emerald-800">
                  <h4 className="font-medium mb-1">🔔 Lembretes</h4>
                  <p>Cadastre datas importantes e receba notificações automáticas.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}