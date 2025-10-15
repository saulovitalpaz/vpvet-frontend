'use client';

import { useState, useMemo } from 'react';
import { usePublicAuth } from '@/contexts/PublicAuthContext';
import ClientSidebar from '@/components/ClientSidebar';
import {
  FileText,
  Filter,
  Download,
  Calendar,
  Heart,
  User,
  X,
  ChevronDown,
  Eye,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ClientExamesPage() {
  const { clientData, pets, examResults, loading } = usePublicAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [selectedExamType, setSelectedExamType] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();

  // Set initial filter from URL
  useState(() => {
    const petId = searchParams.get('pet');
    if (petId) {
      setSelectedPet(petId);
    }
  });

  const filteredExams = useMemo(() => {
    return examResults.filter(exam => {
      const petMatch = !selectedPet || exam.animal_name.toLowerCase().includes(selectedPet.toLowerCase()) ||
        pets.find(pet => pet.id === selectedPet && pet.name === exam.animal_name);
      const typeMatch = !selectedExamType || exam.exam_type.toLowerCase().includes(selectedExamType.toLowerCase());
      return petMatch && typeMatch;
    });
  }, [examResults, selectedPet, selectedExamType, pets]);

  const examTypes = useMemo(() => {
    const types = Array.from(new Set(examResults.map(exam => exam.exam_type)));
    return types.sort();
  }, [examResults]);

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
    setSelectedExamType('');
  };

  const activeFiltersCount = [selectedPet, selectedExamType].filter(Boolean).length;

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
                <FileText className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Exames
                </h1>
                <p className="text-sm text-gray-500">
                  {filteredExams.length} de {examResults.length} exames
                </p>
              </div>
            </div>

            {/* Mobile title */}
            <h1 className="lg:hidden text-lg font-bold text-gray-900">
              Exames
            </h1>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden sm:inline-flex text-sm text-gray-500">
                {filteredExams.length} de {examResults.length} exames
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
          {/* Filters */}
          <div className="bg-white border border-gray-200/60 shadow-sm rounded-lg mb-6">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium text-gray-900">Filtrar Exames</h2>
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
                      {pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Exam Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filtrar por Tipo de Exame
                    </label>
                    <select
                      value={selectedExamType}
                      onChange={(e) => setSelectedExamType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Todos os tipos</option>
                      {examTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Exams List */}
          {filteredExams.length > 0 ? (
            <div className="space-y-4">
              {filteredExams.map((exam) => (
                <div key={exam.id} className="bg-white border border-gray-200/60 hover:border-gray-300 hover:shadow-sm transition-all duration-200 rounded-lg">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{exam.animal_name}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {exam.exam_type}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {new Date(exam.exam_date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            {exam.veterinarian}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Principais Achados</h4>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {exam.findings}
                          </p>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Impressão Diagnóstica</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {exam.impression}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <FileText className="w-4 h-4" />
                            <span>ID: {exam.id}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Ver Detalhes
                            </button>

                            {exam.pdf_url && (
                              <a
                                href={exam.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Baixar PDF
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {examResults.length === 0 ? 'Nenhum exame encontrado' : 'Nenhum exame corresponde aos filtros'}
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {examResults.length === 0
                  ? 'Seus exames aparecerão aqui assim que forem disponibilizados pela clínica.'
                  : 'Tente ajustar os filtros para encontrar os exames que você procura.'
                }
              </p>
              {examResults.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}

          {/* Tips Section */}
          {examResults.length > 0 && (
            <div className="mt-12 bg-emerald-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-emerald-900 mb-4">Sobre seus exames</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-sm text-emerald-800">
                  <h4 className="font-medium mb-1">📋 Acesso Rápido</h4>
                  <p>Todos os exames ficam disponíveis por 90 dias após a realização.</p>
                </div>
                <div className="text-sm text-emerald-800">
                  <h4 className="font-medium mb-1">📥 Downloads</h4>
                  <p>Baixe os laudos completos em PDF para guardar ou compartilhar com outros veterinários.</p>
                </div>
                <div className="text-sm text-emerald-800">
                  <h4 className="font-medium mb-1">🔒 Privacidade</h4>
                  <p>Seus resultados são confidenciais e acessíveis apenas com suas credenciais.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}