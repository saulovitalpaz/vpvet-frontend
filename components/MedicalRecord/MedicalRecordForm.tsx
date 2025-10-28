'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import section components
import { PatientInfoSection } from '@/components/MedicalRecord/sections/PatientInfoSection';
import { ClinicalExaminationSection } from '@/components/MedicalRecord/sections/ClinicalExaminationSection';
import { ChiefComplaintSection } from '@/components/MedicalRecord/sections/ChiefComplaintSection';
import { DiagnosticTestsSection } from '@/components/MedicalRecord/sections/DiagnosticTestsSection';
import { DiagnosisSection } from '@/components/MedicalRecord/sections/DiagnosisSection';
import { TreatmentPlanSection } from '@/components/MedicalRecord/sections/TreatmentPlanSection';
import { VaccinationSection } from '@/components/MedicalRecord/sections/VaccinationSection';
import { FollowUpSection } from '@/components/MedicalRecord/sections/FollowUpSection';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Heart,
  Activity,
  Stethoscope,
  FileText,
  Pill,
  Syringe,
  Calendar,
  AlertTriangle,
  CheckCircle,
  User,
  Dog,
  Cat,
  Thermometer,
  Weight,
  Wind,
  Gauge
} from 'lucide-react';

// Validation schema
const medicalRecordSchema = z.object({
  // Patient Information Section
  patient_info: z.object({
    temperature: z.string().optional(),
    heart_rate: z.string().optional(),
    respiratory_rate: z.string().optional(),
    weight: z.string().optional(),
    blood_pressure: z.string().optional(),
    hydration_status: z.string().optional(),
    mucous_membranes: z.string().optional(),
    capillary_refill_time: z.string().optional(),
    body_condition: z.string().optional(),
    attitude: z.string().optional(),
    posture: z.string().optional(),
    gait: z.string().optional(),
    skin_condition: z.string().optional(),
    coat_condition: z.string().optional(),
    eyes: z.string().optional(),
    ears: z.string().optional(),
    nose: z.string().optional(),
    mouth_teeth: z.string().optional(),
    lymph_nodes: z.string().optional(),
    cardiovascular_system: z.string().optional(),
    respiratory_system: z.string().optional(),
    gastrointestinal_system: z.string().optional(),
    musculoskeletal_system: z.string().optional(),
    nervous_system: z.string().optional(),
    urogenital_system: z.string().optional(),
  }),
  // Chief Complaint & History
  chief_complaint: z.string().optional(),
  present_illness: z.string().optional(),
  medical_history: z.string().optional(),
  surgical_history: z.string().optional(),
  current_medications: z.string().optional(),
  allergies: z.string().optional(),
  vaccination_history: z.string().optional(),
  diet: z.string().optional(),
  environment: z.string().optional(),
  travel_history: z.string().optional(),
  reproductive_history: z.string().optional(),
  // Diagnosis
  provisional_diagnosis: z.string().optional(),
  definitive_diagnosis: z.string().optional(),
  diagnosis_date: z.string().optional(),
  // Treatment Plan
  treatment_plan: z.string().optional(),
  emergency_treatment: z.string().optional(),
  outpatient_care: z.string().optional(),
  recommendations: z.string().optional(),
  // Follow-up & Prognosis
  prognosis: z.string().optional(),
  follow_up_date: z.string().optional(),
  follow_up_instructions: z.string().optional(),
  recheck_date: z.string().optional(),
  emergency_instructions: z.string().optional(),
  quality_of_life: z.string().optional(),
  euthanasia_consideration: z.string().optional(),
  notes: z.string().optional(),
  veterinarian_notes: z.string().optional(),
});

type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

interface MedicalRecordFormProps {
  initialData?: any;
  patientData: any;
  consultationData?: any;
  isEditing: boolean;
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

export function MedicalRecordForm({
  initialData,
  patientData,
  consultationData,
  isEditing,
  onSave,
  isSaving
}: MedicalRecordFormProps) {
  const [activeTab, setActiveTab] = useState('patient-info');
  const [formData, setFormData] = useState<MedicalRecordFormData>({
    patient_info: {},
    chief_complaint: '',
    present_illness: '',
    medical_history: '',
    surgical_history: '',
    current_medications: '',
    allergies: '',
    vaccination_history: '',
    diet: '',
    environment: '',
    travel_history: '',
    reproductive_history: '',
    provisional_diagnosis: '',
    definitive_diagnosis: '',
    diagnosis_date: new Date().toISOString().split('T')[0],
    treatment_plan: '',
    emergency_treatment: '',
    outpatient_care: '',
    recommendations: '',
    prognosis: '',
    follow_up_date: '',
    follow_up_instructions: '',
    recheck_date: '',
    emergency_instructions: '',
    quality_of_life: '',
    euthanasia_consideration: '',
    notes: '',
    veterinarian_notes: '',
  });

  const [medications, setMedications] = useState<Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>>(initialData?.medications || []);

  const [procedures, setProcedures] = useState<Array<{
    name: string;
    date: string;
    description?: string;
  }>>(initialData?.procedures || []);

  const [vaccinations, setVaccinations] = useState<Array<{
    vaccine: string;
    date: string;
    next_due?: string;
    veterinarian?: string;
    batch_number?: string;
  }>>(initialData?.vaccinations || []);

  const [labTests, setLabTests] = useState<Array<{
    type: string;
    result: string;
    interpretation?: string;
    date: string;
  }>>(initialData?.laboratory_tests || []);

  const [imaging, setImaging] = useState<Array<{
    type: string;
    result: string;
    interpretation?: string;
    date: string;
  }>>(initialData?.imaging || []);

  const [otherDiagnostics, setOtherDiagnostics] = useState<Array<{
    type: string;
    result: string;
    interpretation?: string;
    date: string;
  }>>(initialData?.other_diagnostics || []);

  const [differentialDiagnoses, setDifferentialDiagnoses] = useState<string[]>(
    initialData?.differential_diagnoses || []
  );

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        patient_info: {
          ...formData.patient_info,
          ...initialData.patient_info
        }
      });
    }
  }, [initialData]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePatientInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      patient_info: {
        ...prev.patient_info,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    const completeData = {
      ...formData,
      medications,
      procedures,
      vaccinations,
      laboratory_tests: labTests,
      imaging,
      other_diagnostics: otherDiagnostics,
      differential_diagnoses: differentialDiagnoses,
    };

    await onSave(completeData);
  };

  const getSpeciesIcon = (species: string) => {
    const normalizedSpecies = species?.toLowerCase();
    if (normalizedSpecies === 'canine') {
      return Dog;
    } else if (normalizedSpecies === 'feline') {
      return Cat;
    }
    return User;
  };

  const tabs = [
    { id: 'patient-info', label: 'Informações do Paciente', icon: Heart },
    { id: 'clinical-exam', label: 'Exame Clínico', icon: Stethoscope },
    { id: 'chief-complaint', label: 'Queixa & História', icon: AlertTriangle },
    { id: 'diagnostics', label: 'Exames Diagnósticos', icon: Activity },
    { id: 'diagnosis', label: 'Diagnóstico', icon: FileText },
    { id: 'treatment', label: 'Tratamento', icon: Pill },
    { id: 'vaccination', label: 'Vacinação', icon: Syringe },
    { id: 'followup', label: 'Acompanhamento', icon: Calendar },
  ];

  return (
    <ErrorBoundary>
      <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
          {/* Patient Information Section */}
          {activeTab === 'patient-info' && (
            <PatientInfoSection
              data={formData.patient_info}
              onChange={handlePatientInfoChange}
              isEditing={isEditing}
              patientData={patientData}
            />
          )}

          {/* Clinical Examination Section */}
          {activeTab === 'clinical-exam' && (
            <ClinicalExaminationSection
              data={formData.patient_info}
              onChange={handlePatientInfoChange}
              isEditing={isEditing}
            />
          )}

          {/* Chief Complaint & History Section */}
          {activeTab === 'chief-complaint' && (
            <ChiefComplaintSection
              data={formData}
              onChange={handleFieldChange}
              isEditing={isEditing}
              consultationData={consultationData}
            />
          )}

          {/* Diagnostic Tests Section */}
          {activeTab === 'diagnostics' && (
            <DiagnosticTestsSection
              labTests={labTests}
              imaging={imaging}
              otherDiagnostics={otherDiagnostics}
              setLabTests={setLabTests}
              setImaging={setImaging}
              setOtherDiagnostics={setOtherDiagnostics}
              isEditing={isEditing}
            />
          )}

          {/* Diagnosis Section */}
          {activeTab === 'diagnosis' && (
            <DiagnosisSection
              data={formData}
              differentialDiagnoses={differentialDiagnoses}
              setDifferentialDiagnoses={setDifferentialDiagnoses}
              onChange={handleFieldChange}
              isEditing={isEditing}
            />
          )}

          {/* Treatment Plan Section */}
          {activeTab === 'treatment' && (
            <TreatmentPlanSection
              data={formData}
              medications={medications}
              procedures={procedures}
              setMedications={setMedications}
              setProcedures={setProcedures}
              onChange={handleFieldChange}
              isEditing={isEditing}
            />
          )}

          {/* Vaccination Section */}
          {activeTab === 'vaccination' && (
            <VaccinationSection
              vaccinations={vaccinations}
              setVaccinations={setVaccinations}
              isEditing={isEditing}
            />
          )}

          {/* Follow-up Section */}
          {activeTab === 'followup' && (
            <FollowUpSection
              data={formData}
              onChange={handleFieldChange}
              isEditing={isEditing}
            />
          )}
        </div>

      {/* Save Button (Fixed at bottom when editing) */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 lg:left-64">
          <div className="max-w-4xl mx-auto flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Salvar Prontuário
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
    </ErrorBoundary>
  );
}