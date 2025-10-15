'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Menu,
  Bell,
  Calendar,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Dog,
  Cat,
  Activity,
  Heart,
  Syringe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Weight,
  ChevronRight,
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import Link from 'next/link';

interface PatientDetail {
  id: string;
  name: string;
  species: string;
  breed?: string;
  birth_date?: string;
  age_years?: number;
  sex?: string;
  weight?: number;
  is_neutered?: boolean;
  microchip?: string;
  notes?: string;
  tutor: {
    id: string;
    name: string;
    phone: string;
    cpf: string;
    email?: string;
    address?: string;
  };
}

interface Consultation {
  id: string;
  appointment_id: string;
  chief_complaint?: string;
  diagnosis?: string;
  treatment_plan?: string;
  created_at: string;
  appointment: {
    datetime: string;
    service_type: string;
  };
}

function PatientDetailContent() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const patientId = params.id as string;

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      const response = await api.get(`/patients/animals/${patientId}`);
      return response.data.animal as PatientDetail;
    },
  });

  const { data: consultationsData } = useQuery({
    queryKey: ['consultations', patientId],
    queryFn: async () => {
      const response = await api.get(`/patients/animals/${patientId}/consultations`);
      return response.data.consultations as Consultation[];
    },
    enabled: !!patientId,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return api.delete(`/patients/animals/${patientId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      router.push('/pacientes');
    },
  });

  const getSpeciesIcon = (species: string) => {
    const normalizedSpecies = species?.toLowerCase();
    if (normalizedSpecies === 'canine') {
      return Dog;
    } else if (normalizedSpecies === 'feline') {
      return Cat;
    }
    return User; // fallback to user icon for other species
  };

  const getHealthStatus = (patient: PatientDetail, consultations: Consultation[]) => {
    if (!consultations || consultations.length === 0) {
      return { status: 'new', label: 'Novo Paciente', color: 'bg-blue-100 text-blue-800', icon: User };
    }

    const lastConsultation = consultations[0];
    const daysSinceLastVisit = Math.floor((Date.now() - new Date(lastConsultation.appointment.datetime).getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastVisit < 30) {
      return { status: 'healthy', label: 'Em Dia', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    } else if (daysSinceLastVisit < 180) {
      return { status: 'checkup', label: 'Revisão Recomendada', color: 'bg-amber-100 text-amber-800', icon: Clock };
    } else {
      return { status: 'overdue', label: 'Revisão Pendente', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    }
  };

  const getSpeciesLabel = (species: string) => {
    const speciesMap: { [key: string]: string } = {
      'canine': 'Canino',
      'feline': 'Felino',
      'other': 'Outro'
    };
    return speciesMap[species?.toLowerCase()] || species;
  };

  const getSexLabel = (sex: string) => {
    const sexMap: { [key: string]: string } = {
      'male': 'Macho',
      'female': 'Fêmea'
    };
    return sexMap[sex?.toLowerCase()] || sex;
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Paciente não encontrado</p>
            <Link href="/pacientes">
              <Button className="mt-4">Voltar para Pacientes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const consultations = consultationsData || [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/pacientes">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              </Link>
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                {(() => {
                  const AnimalIcon = getSpeciesIcon(patient.species);
                  return <AnimalIcon className="w-6 h-6 text-emerald-600" />;
                })()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <p className="text-sm text-gray-500">Detalhes do Paciente</p>
              </div>
            </div>

            <h1 className="lg:hidden text-lg font-bold text-gray-900">{patient.name}</h1>

            <div className="flex items-center gap-2 sm:gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center">
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

        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
          {/* Action Buttons */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <Link href={`/pacientes/${patientId}/prontuario`} className="flex-1 sm:flex-initial">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2">
                <FileText className="w-4 h-4" />
                Ver Prontuário
              </Button>
            </Link>
            <Link href={`/pacientes/${patientId}/editar`} className="flex-1 sm:flex-initial">
              <Button className="w-full bg-primary-600 hover:bg-primary-700 gap-2">
                <Edit className="w-4 h-4" />
                Editar Paciente
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertDescription>
                <div className="space-y-3">
                  <p className="font-semibold text-red-900">
                    Tem certeza que deseja excluir este paciente?
                  </p>
                  <p className="text-sm text-red-800">
                    Esta ação não pode ser desfeita. Todos os dados do paciente serão permanentemente removidos.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? 'Excluindo...' : 'Confirmar Exclusão'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Patient Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Animal Information */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                      {(() => {
                        const AnimalIcon = getSpeciesIcon(patient.species);
                        return <AnimalIcon className="w-5 h-5 text-emerald-600" />;
                      })()}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">Dados Clínicos</CardTitle>
                      <p className="text-sm text-gray-500 mt-0.5">Informações essenciais do paciente</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nome</p>
                      <p className="text-base font-semibold text-gray-900">{patient.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Espécie</p>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                        {getSpeciesLabel(patient.species)}
                      </Badge>
                    </div>
                    {patient.breed && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Raça</p>
                        <p className="text-base text-gray-900">{patient.breed}</p>
                      </div>
                    )}
                    {patient.sex && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sexo</p>
                        <p className="text-base text-gray-900">{getSexLabel(patient.sex)}</p>
                      </div>
                    )}
                    {patient.age_years !== undefined && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Idade</p>
                        <p className="text-base text-gray-900">{patient.age_years} anos</p>
                      </div>
                    )}
                    {patient.weight && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Peso</p>
                        <p className="text-base text-gray-900">{patient.weight} kg</p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Castração</p>
                      <Badge className={patient.is_neutered ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200"}>
                        {patient.is_neutered ? 'Sim' : 'Não'}
                      </Badge>
                    </div>
                    {patient.microchip && (
                      <div className="space-y-1 lg:col-span-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Microchip</p>
                        <p className="text-base text-gray-900 font-mono">{patient.microchip}</p>
                      </div>
                    )}
                  </div>
                  {patient.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600 font-medium mb-2">Observações</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{patient.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Consultation History */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">Histórico Clínico</CardTitle>
                      <p className="text-sm text-gray-500 mt-0.5">{consultations.length} consulta{consultations.length !== 1 ? 's' : ''} registrada{consultations.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {consultations.length > 0 ? (
                    <div className="space-y-3">
                      {consultations.map((consultation, index) => (
                        <div
                          key={consultation.id}
                          className="relative border-l-2 border-emerald-200 pl-6 py-4 hover:bg-gray-50/50 rounded-r-lg transition-colors"
                        >
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-6 w-3 h-3 bg-emerald-500 rounded-full -translate-x-1/2 border-2 border-white shadow-sm"></div>

                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <Calendar className="w-4 h-4 text-emerald-600" />
                                  <span className="font-semibold text-gray-900">
                                    {new Date(consultation.appointment.datetime).toLocaleDateString('pt-BR', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </span>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(consultation.appointment.datetime).toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-xs font-medium">
                                  {consultation.appointment.service_type}
                                </Badge>
                              </div>
                            </div>

                            {/* Medical Information */}
                            <div className="space-y-2 ml-7">
                              {consultation.chief_complaint && (
                                <div className="bg-amber-50/50 border border-amber-200/60 rounded-lg p-3">
                                  <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">Queixa Principal</p>
                                  <p className="text-sm text-amber-900 leading-relaxed">{consultation.chief_complaint}</p>
                                </div>
                              )}
                              {consultation.diagnosis && (
                                <div className="bg-blue-50/50 border border-blue-200/60 rounded-lg p-3">
                                  <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide mb-1">Diagnóstico</p>
                                  <p className="text-sm text-blue-900 leading-relaxed">{consultation.diagnosis}</p>
                                </div>
                              )}

                              {consultation.treatment_plan && (
                                <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-lg p-3">
                                  <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-1">Tratamento</p>
                                  <p className="text-sm text-emerald-900 leading-relaxed">{consultation.treatment_plan}</p>
                                </div>
                              )}

                              <div className="pt-2">
                                <Link href={`/consultas/${consultation.id}`}>
                                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-0 h-auto font-medium">
                                    Ver detalhes completos →
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>Nenhuma consulta registrada</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Tutor Info */}
            <div>
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações do Tutor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">Nome</p>
                      <p className="text-gray-900 font-semibold">{patient.tutor.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium">Telefone</p>
                        <p className="text-gray-900">{patient.tutor.phone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium mb-1">CPF</p>
                      <p className="text-gray-900 font-mono">{patient.tutor.cpf}</p>
                    </div>
                    {patient.tutor.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Email</p>
                          <p className="text-gray-900 break-all">{patient.tutor.email}</p>
                        </div>
                      </div>
                    )}
                    {patient.tutor.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">Endereço</p>
                          <p className="text-gray-900">{patient.tutor.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PatientDetailPage() {
  return (
    <ProtectedRoute>
      <PatientDetailContent />
    </ProtectedRoute>
  );
}
