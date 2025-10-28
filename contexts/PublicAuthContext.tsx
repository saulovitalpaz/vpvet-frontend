'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface ExamResult {
  id: string;
  animal_name: string;
  exam_type: string;
  exam_date: string;
  findings: string;
  impression: string;
  pdf_url?: string;
  veterinarian: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  birth_date?: string;
  tutor_cpf: string;
  tutor_name: string;
  photo_url?: string;
  created_at: string;
}

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
        cpf: string;
      };
    };
  };
}

interface PublicAuthContextType {
  // Client session data
  clientData: {
    tutor_cpf: string;
    tutor_name: string;
    email?: string;
    phone?: string;
  } | null;
  pets: Pet[];
  consultations: Consultation[];
  examResults: ExamResult[];

  // Original public result data
  resultData: ExamResult | null;
  loading: boolean;
  error: string | null;

  // Actions
  searchResult: (cpf: string, code: string) => Promise<void>;
  loginClient: (cpf: string, code: string) => Promise<boolean>;
  logoutClient: () => void;
  clearResult: () => void;
  refreshData: () => Promise<void>;
}

const PublicAuthContext = createContext<PublicAuthContextType>({} as PublicAuthContextType);

export function PublicAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Client session state
  const [clientData, setClientData] = useState<{
    tutor_cpf: string;
    tutor_name: string;
    email?: string;
    phone?: string;
  } | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);

  // Original public result state
  const [resultData, setResultData] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchResult = async (cpf: string, code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/public/results', {
        cpf: cpf.replace(/\D/g, ''), // Remove formatting
        access_code: code.toUpperCase(),
      });
      setResultData(response.data.exam);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Nenhum resultado encontrado com estes dados. Verifique o CPF e código de acesso.');
      } else {
        setError('Erro ao consultar resultados. Tente novamente mais tarde.');
      }
      setResultData(null);
    } finally {
      setLoading(false);
    }
  };

  const loginClient = async (cpf: string, code: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Use mock client data for both development and production
      // In a real production environment, this would call an API endpoint
      const mockClient = {
        tutor_cpf: cpf.replace(/\D/g, ''),
        tutor_name: 'João Silva',
        email: 'joao.silva@email.com',
        phone: '(11) 98765-4321',
      };

      const mockPets: Pet[] = [
        {
          id: '1',
          name: 'Rex',
          species: 'canine',
          breed: 'Golden Retriever',
          birth_date: '2020-05-15',
          tutor_cpf: cpf.replace(/\D/g, ''),
          tutor_name: 'João Silva',
          photo_url: undefined,
          created_at: '2023-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Luna',
          species: 'feline',
          breed: 'Siamese',
          birth_date: '2019-08-20',
          tutor_cpf: cpf.replace(/\D/g, ''),
          tutor_name: 'João Silva',
          photo_url: undefined,
          created_at: '2023-01-15T00:00:00Z'
        }
      ];

      const mockConsultations: Consultation[] = [
        {
          id: 'consult-1',
          appointment_id: 'apt-1',
          chief_complaint: 'Exame de rotina',
          diagnosis: 'Sem alterações significativas',
          treatment_plan: 'Continuar acompanhamento regular',
          prognosis: 'Bom',
          created_at: '2024-01-15T00:00:00Z',
          appointment: {
            datetime: '2024-01-15T10:00:00Z',
            service_type: 'Consulta de rotina',
            animal: {
              id: '1',
              name: 'Rex',
              species: 'canine',
              tutor: {
                name: 'João Silva',
                cpf: cpf.replace(/\D/g, '')
              }
            }
          }
        }
      ];

      const mockExamResults: ExamResult[] = [
        {
          id: 'exam-123',
          animal_name: 'Rex',
          exam_type: 'Ultrassonografia Abdominal',
          exam_date: new Date().toISOString(),
          findings: 'Fígado e rins com aparência normal. Vesícula biliar sem alterações significativas.',
          impression: 'Sem evidências de alterações patológicas significativas.',
          veterinarian: 'Dr. Saulo Vital Paz',
          pdf_url: '#'
        },
        {
          id: 'exam-124',
          animal_name: 'Luna',
          exam_type: 'Radiografia Torácica',
          exam_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          findings: 'Coração e pulmões dentro dos limites da normalidade. Sem evidências de alterações patológicas.',
          impression: 'Exame normal sem alterações dignas de nota.',
          veterinarian: 'Dra. Maria Oliveira',
          pdf_url: '#'
        }
      ];

      setClientData(mockClient);
      setPets(mockPets);
      setConsultations(mockConsultations);
      setExamResults(mockExamResults);

      if (typeof window !== 'undefined') {
        localStorage.setItem('clientData', JSON.stringify(mockClient));
        localStorage.setItem('clientSession', 'true');
      }

      return true;
    } catch (error) {
      console.error('Error during client login:', error);
      setError('Erro ao fazer login. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logoutClient = () => {
    setClientData(null);
    setPets([]);
    setConsultations([]);
    setExamResults([]);
    setResultData(null);

    // Clear session
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clientData');
      localStorage.removeItem('clientSession');
    }

    router.push('/');
  };

  const clearResult = () => {
    setResultData(null);
    setError(null);
  };

  const refreshData = async () => {
    if (!clientData) return;

    setLoading(true);
    try {
      // In a real app, this would fetch fresh data from the API
      // For now, we'll keep the mock data
      // In production, this would fetch fresh data from the API
    } finally {
      setLoading(false);
    }
  };

  // Check for existing client session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedClientData = localStorage.getItem('clientData');
      const hasSession = localStorage.getItem('clientSession');

      if (savedClientData && hasSession) {
        try {
          const parsed = JSON.parse(savedClientData);
          setClientData(parsed);

          // Load mock data for both development and production
          const mockPets: Pet[] = [
            {
              id: '1',
              name: 'Rex',
              species: 'canine',
              breed: 'Golden Retriever',
              birth_date: '2020-05-15',
              tutor_cpf: parsed.tutor_cpf,
              tutor_name: parsed.tutor_name,
              photo_url: undefined,
              created_at: '2023-01-01T00:00:00Z'
            },
            {
              id: '2',
              name: 'Luna',
              species: 'feline',
              breed: 'Siamese',
              birth_date: '2019-08-20',
              tutor_cpf: parsed.tutor_cpf,
              tutor_name: parsed.tutor_name,
              photo_url: undefined,
              created_at: '2023-01-15T00:00:00Z'
            }
          ];

          const mockConsultations: Consultation[] = [
            {
              id: 'consult-1',
              appointment_id: 'apt-1',
              chief_complaint: 'Exame de rotina',
              diagnosis: 'Sem alterações significativas',
              treatment_plan: 'Continuar acompanhamento regular',
              prognosis: 'Bom',
              created_at: '2024-01-15T00:00:00Z',
              appointment: {
                datetime: '2024-01-15T10:00:00Z',
                service_type: 'Consulta de rotina',
                animal: {
                  id: '1',
                  name: 'Rex',
                  species: 'canine',
                  tutor: {
                    name: parsed.tutor_name,
                    cpf: parsed.tutor_cpf
                  }
                }
              }
            }
          ];

          const mockExamResults: ExamResult[] = [
            {
              id: 'exam-123',
              animal_name: 'Rex',
              exam_type: 'Ultrassonografia Abdominal',
              exam_date: new Date().toISOString(),
              findings: 'Fígado e rins com aparência normal. Vesícula biliar sem alterações significativas.',
              impression: 'Sem evidências de alterações patológicas significativas.',
              veterinarian: 'Dr. Saulo Vital Paz',
              pdf_url: '#'
            },
            {
              id: 'exam-124',
              animal_name: 'Luna',
              exam_type: 'Radiografia Torácica',
              exam_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              findings: 'Coração e pulmões dentro dos limites da normalidade. Sem evidências de alterações patológicas.',
              impression: 'Exame normal sem alterações dignas de nota.',
              veterinarian: 'Dra. Maria Oliveira',
              pdf_url: '#'
            }
          ];

          setPets(mockPets);
          setConsultations(mockConsultations);
          setExamResults(mockExamResults);
        } catch (error) {
          console.error('Error parsing saved client data:', error);
          // Clear corrupted session
          localStorage.removeItem('clientData');
          localStorage.removeItem('clientSession');
        }
      }
    }
  }, []);

  return (
    <PublicAuthContext.Provider value={{
      clientData,
      pets,
      consultations,
      examResults,
      resultData,
      loading,
      error,
      searchResult,
      loginClient,
      logoutClient,
      clearResult,
      refreshData
    }}>
      {children}
    </PublicAuthContext.Provider>
  );
}

export const usePublicAuth = () => {
  const context = useContext(PublicAuthContext);
  if (!context) {
    throw new Error('usePublicAuth must be used within a PublicAuthProvider');
  }
  return context;
};