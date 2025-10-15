'use client';

import { useState, useEffect } from 'react';
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
import { MedicalRecordForm } from '@/components/MedicalRecord/MedicalRecordForm';
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Clock,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Stethoscope,
  Camera,
  Activity
} from 'lucide-react';
import Link from 'next/link';

interface ConsultationData {
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

interface MedicalRecordData {
  id?: string;
  patient_id: string;
  appointment_id?: string;
  created_at?: string;
  updated_at?: string;
  // Patient Information
  patient_info: {
    temperature?: string;
    heart_rate?: string;
    respiratory_rate?: string;
    weight?: string;
    blood_pressure?: string;
    hydration_status?: string;
    mucous_membranes?: string;
    capillary_refill_time?: string;
    body_condition?: string;
    attitude?: string;
    posture?: string;
    gait?: string;
    skin_condition?: string;
    coat_condition?: string;
    eyes?: string;
    ears?: string;
    nose?: string;
    mouth_teeth?: string;
    lymph_nodes?: string;
    cardiovascular_system?: string;
    respiratory_system?: string;
    gastrointestinal_system?: string;
    musculoskeletal_system?: string;
    nervous_system?: string;
    urogenital_system?: string;
  };
  // Chief Complaint & History
  chief_complaint?: string;
  present_illness?: string;
  medical_history?: string;
  surgical_history?: string;
  current_medications?: string;
  allergies?: string;
  vaccination_history?: string;
  diet?: string;
  environment?: string;
  travel_history?: string;
  reproductive_history?: string;
  // Diagnostic Tests & Results
  physical_exam?: string;
  laboratory_tests?: Array<{
    type: string;
    result: string;
    interpretation?: string;
    date: string;
  }>;
  imaging?: Array<{
    type: string;
    result: string;
    interpretation?: string;
    date: string;
  }>;
  other_diagnostics?: Array<{
    type: string;
    result: string;
    interpretation?: string;
    date: string;
  }>;
  // Diagnosis
  provisional_diagnosis?: string;
  definitive_diagnosis?: string;
  differential_diagnoses?: string[];
  diagnosis_date?: string;
  // Treatment Plan
  treatment_plan?: string;
  emergency_treatment?: string;
  outpatient_care?: string;
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  procedures?: Array<{
    name: string;
    date: string;
    description?: string;
  }>;
  recommendations?: string;
  // Vaccination History
  vaccinations?: Array<{
    vaccine: string;
    date: string;
    next_due?: string;
    veterinarian?: string;
    batch_number?: string;
  }>;
  // Follow-up & Prognosis
  prognosis?: string;
  follow_up_date?: string;
  follow_up_instructions?: string;
  recheck_date?: string;
  emergency_instructions?: string;
  quality_of_life?: string;
  euthanasia_consideration?: string;
  notes?: string;
  veterinarian_notes?: string;
}

function ConsultationMedicalRecordContent() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const consultationId = params.id as string;

  const { data: consultation, isLoading: consultationLoading } = useQuery({
    queryKey: ['consultation', consultationId],
    queryFn: async () => {
      const response = await api.get(`/consultations/${consultationId}`);
      return response.data.consultation as ConsultationData;
    },
  });

  const { data: existingRecord, isLoading: recordLoading, error: recordError } = useQuery({
    queryKey: ['medical-record', consultationId],
    queryFn: async () => {
      const response = await api.get(`/consultations/${consultationId}/medical-record`);
      return response.data.medical_record as MedicalRecordData;
    },
    enabled: !!consultationId,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: MedicalRecordData) => {
      const payload = {
        appointment_id: consultationId,
        patient_id: consultation?.appointment.animal.id,
        ...data
      };

      if (existingRecord?.id) {
        return api.put(`/medical-records/${existingRecord.id}`, payload);
      } else {
        return api.post('/medical-records', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-record', consultationId] });
      setIsEditing(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    },
    onError: () => {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    },
  });

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

  const handleSave = async (data: MedicalRecordData) => {
    setIsSaving(true);
    try {
      await saveMutation.mutateAsync(data);
    } finally {
      setIsSaving(false);
    }
  };

  if (consultationLoading || recordLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando prontuário...</p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Consulta não encontrada</p>
            <Link href="/consultas">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Voltar para Consultas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/consultas/${consultationId}`}>
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
                  <h1 className="text-2xl font-bold text-gray-900">Prontuário da Consulta</h1>
                  <p className="text-sm text-gray-500">
                    {consultation.appointment.animal.name} - {new Date(consultation.appointment.datetime).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Save Status */}
              {saveStatus === 'success' && (
                <div className="hidden sm:flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Salvo com sucesso</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="hidden sm:flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Erro ao salvar</span>
                </div>
              )}

              {/* Action Buttons */}
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{consultation.appointment.animal.name}</h2>
                <p className="text-xs text-gray-500">
                  {new Date(consultation.appointment.datetime).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Prontuário
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8">
          {/* Consultation Quick Info */}
          <Card className="mb-6 border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-6">
                {/* Patient Info */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Paciente</p>
                      <p className="text-sm font-semibold text-gray-900">{consultation.appointment.animal.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tutor</p>
                      <p className="text-sm font-semibold text-gray-900">{consultation.appointment.animal.tutor.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Data</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(consultation.appointment.datetime).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo</p>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                        {getServiceTypeIcon(consultation.appointment.service_type)}
                        {getServiceTypeLabel(consultation.appointment.service_type)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Record Form */}
          <MedicalRecordForm
            initialData={existingRecord}
            patientData={consultation.appointment.animal}
            consultationData={consultation}
            isEditing={isEditing}
            onSave={handleSave}
            isSaving={isSaving}
          />

          {/* No Record Message */}
          {!existingRecord && !isEditing && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum prontuário encontrado</h3>
                <p className="text-gray-600 mb-6">
                  Esta consulta ainda não possui um prontuário médico registrado.
                </p>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4" />
                  Criar Prontuário
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ConsultationMedicalRecordPage() {
  return (
    <ProtectedRoute>
      <ConsultationMedicalRecordContent />
    </ProtectedRoute>
  );
}