'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Clock,
  Phone,
  Mail,
  Heart,
  Activity,
  Download,
  Edit,
  Share2,
  AlertCircle,
  CheckCircle,
  Camera,
  Stethoscope,
  Dog,
  Cat
} from 'lucide-react';

interface ConsultationDetails {
  id: string;
  appointment_id: string;
  chief_complaint?: string;
  diagnosis?: string;
  treatment_plan?: string;
  prognosis?: string;
  notes?: string;
  recommendations?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
  appointment: {
    id: string;
    datetime: string;
    service_type: string;
    status: string;
    animal: {
      id: string;
      name: string;
      species: string;
      breed?: string;
      age?: string;
      weight?: string;
      gender?: string;
      tutor: {
        id: string;
        name: string;
        email?: string;
        phone?: string;
        address?: string;
      };
    };
  };
  images?: Array<{
    id: string;
    url: string;
    type: string;
    description?: string;
    created_at: string;
  }>;
  vital_signs?: {
    temperature?: string;
    heart_rate?: string;
    respiratory_rate?: string;
    weight?: string;
    blood_pressure?: string;
  };
}

function ConsultationDetailContent() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const consultationId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ['consultation', consultationId],
    queryFn: async () => {
      if (!consultationId) return null;
      const response = await api.get(`/consultations/${consultationId}`);
      return response.data;
    },
    enabled: !!consultationId,
  });

  const consultation: ConsultationDetails = data?.consultation;

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

  const getServiceTypeIcon = (serviceType: string) => {
    if (serviceType?.includes('ultrasound')) return <Camera className="w-4 h-4" />;
    if (serviceType?.includes('xray') || serviceType?.includes('radiography')) return <Activity className="w-4 h-4" />;
    return <Stethoscope className="w-4 h-4" />;
  };

  const getServiceTypeLabel = (serviceType: string) => {
    const serviceMap: { [key: string]: string } = {
      'ultrasound_cardiac': 'Ultrassom Cardíaco',
      'ultrasound_abdominal': 'Ultrassom Abdominal',
      'xray_thoracic': 'Radiografia Torácica',
      'xray_abdominal': 'Radiografia Abdominal',
      'ultrasound_musculoskeletal': 'Ultrassom Musculoesquelético',
      'xray_musculoskeletal': 'Radiografia Musculoesquelética'
    };
    return serviceMap[serviceType] || serviceType;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-900 mb-2">Consulta não encontrada</p>
              <p className="text-sm text-gray-500 mb-4">A consulta que você está procurando não existe ou foi removida.</p>
              <Button onClick={() => router.push('/consultas')} className="bg-emerald-600 hover:bg-emerald-700">
                Voltar para Consultas
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64 relative z-10">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 h-[76px] relative z-20">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              <Link href="/consultas">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              </Link>

              <div className="hidden lg:flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Consulta Detalhada</h1>
                  <p className="text-sm text-gray-500">
                    {consultation.appointment.animal.name} - {new Date(consultation.appointment.datetime).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            <h1 className="lg:hidden text-lg font-bold text-gray-900">
              Consulta
            </h1>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <Link href={`/consultas/${consultationId}/prontuario`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Prontuário
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
              </div>

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
          {/* Patient Summary Card */}
          <Card className="mb-6 border border-gray-200/60 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-6">
                {/* Patient Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center">
                      {(() => {
                        const AnimalIcon = getSpeciesIcon(consultation.appointment.animal.species);
                        return <AnimalIcon className="w-8 h-8 text-emerald-600" />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{consultation.appointment.animal.name}</h2>
                      <p className="text-gray-500">Tutor: {consultation.appointment.animal.tutor.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Espécie</p>
                      <p className="text-sm font-semibold text-gray-900">{getSpeciesLabel(consultation.appointment.animal.species)}</p>
                    </div>
                    {consultation.appointment.animal.breed && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Raça</p>
                        <p className="text-sm font-semibold text-gray-900">{consultation.appointment.animal.breed}</p>
                      </div>
                    )}
                    {consultation.appointment.animal.age && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Idade</p>
                        <p className="text-sm font-semibold text-gray-900">{consultation.appointment.animal.age}</p>
                      </div>
                    )}
                    {consultation.appointment.animal.weight && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Peso</p>
                        <p className="text-sm font-semibold text-gray-900">{consultation.appointment.animal.weight}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Consultation Info */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <Badge className="gap-2 bg-emerald-100 text-emerald-800 border-emerald-200">
                      {getServiceTypeIcon(consultation.appointment.service_type)}
                      {getServiceTypeLabel(consultation.appointment.service_type)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {new Date(consultation.appointment.datetime).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(consultation.appointment.datetime).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="clinical" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="clinical">Avaliação Clínica</TabsTrigger>
              <TabsTrigger value="images">Imagens</TabsTrigger>
              <TabsTrigger value="treatment">Tratamento</TabsTrigger>
              <TabsTrigger value="followup">Acompanhamento</TabsTrigger>
            </TabsList>

            {/* Clinical Assessment Tab */}
            <TabsContent value="clinical" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chief Complaint */}
                {consultation.chief_complaint && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        Queixa Principal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{consultation.chief_complaint}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Diagnosis */}
                {consultation.diagnosis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        Diagnóstico
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{consultation.diagnosis}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Vital Signs */}
                {consultation.vital_signs && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Sinais Vitais
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {consultation.vital_signs.temperature && (
                          <div>
                            <p className="text-xs font-medium text-gray-500">Temperatura</p>
                            <p className="text-sm font-semibold text-gray-900">{consultation.vital_signs.temperature}°C</p>
                          </div>
                        )}
                        {consultation.vital_signs.heart_rate && (
                          <div>
                            <p className="text-xs font-medium text-gray-500">Frequência Cardíaca</p>
                            <p className="text-sm font-semibold text-gray-900">{consultation.vital_signs.heart_rate} bpm</p>
                          </div>
                        )}
                        {consultation.vital_signs.respiratory_rate && (
                          <div>
                            <p className="text-xs font-medium text-gray-500">Frequência Respiratória</p>
                            <p className="text-sm font-semibold text-gray-900">{consultation.vital_signs.respiratory_rate} rpm</p>
                          </div>
                        )}
                        {consultation.vital_signs.weight && (
                          <div>
                            <p className="text-xs font-medium text-gray-500">Peso</p>
                            <p className="text-sm font-semibold text-gray-900">{consultation.vital_signs.weight} kg</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Notes */}
                {consultation.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Observações Adicionais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{consultation.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="w-5 h-5 text-blue-500" />
                    Imagens do Exame
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {consultation.images && consultation.images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {consultation.images.map((image) => (
                        <div key={image.id} className="border rounded-lg overflow-hidden">
                          <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            <Camera className="w-12 h-12 text-gray-400" />
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium text-gray-900">
                              {image.description || 'Imagem do exame'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(image.created_at).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma imagem disponível para esta consulta</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Treatment Tab */}
            <TabsContent value="treatment" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Treatment Plan */}
                {consultation.treatment_plan && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Plano de Tratamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{consultation.treatment_plan}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Prognosis */}
                {consultation.prognosis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Prognóstico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{consultation.prognosis}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {consultation.recommendations && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Recomendações</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{consultation.recommendations}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Follow-up Tab */}
            <TabsContent value="followup" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Acompanhamento</CardTitle>
                </CardHeader>
                <CardContent>
                  {consultation.follow_up_date ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Próxima Consulta</p>
                          <p className="text-sm text-gray-600">
                            {new Date(consultation.follow_up_date).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Nenhum acompanhamento agendado</p>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Agendar Acompanhamento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tutor Contact Info */}
              {consultation.appointment.animal.tutor && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações de Contato do Tutor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {consultation.appointment.animal.tutor.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Email</p>
                            <p className="text-sm text-gray-900">{consultation.appointment.animal.tutor.email}</p>
                          </div>
                        </div>
                      )}
                      {consultation.appointment.animal.tutor.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Telefone</p>
                            <p className="text-sm text-gray-900">{consultation.appointment.animal.tutor.phone}</p>
                          </div>
                        </div>
                      )}
                      {consultation.appointment.animal.tutor.address && (
                        <div className="flex items-center gap-3 md:col-span-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Endereço</p>
                            <p className="text-sm text-gray-900">{consultation.appointment.animal.tutor.address}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default function ConsultationDetailPage() {
  return (
    <ProtectedRoute>
      <ConsultationDetailContent />
    </ProtectedRoute>
  );
}