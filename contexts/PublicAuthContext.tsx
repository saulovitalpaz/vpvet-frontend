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
      // For development, use mock client data directly
      if (process.env.NODE_ENV === 'development') {
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
            photo_url: null,
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
            photo_url: null,
            created_at: '2023-01-15T00:00:00Z'
          }
        ];

        setClientData(mockClient);
        setPets(mockPets);
        setConsultations([]);
        setExamResults([{
          id: 'exam-123',
          animal_name: 'Rex',
          exam_type: 'Ultrassonografia Abdominal',
          exam_date: new Date().toISOString(),
          findings: 'Fígado e rins com aparência normal. Vesícula biliar sem alterações significativas.',
          impression: 'Sem evidências de alterações patológicas significativas.',
          veterinarian: 'Dr. Saulo Vital Paz',
          pdf_url: '#'
        }]);

        if (typeof window !== 'undefined') {
          localStorage.setItem('clientData', JSON.stringify(mockClient));
          localStorage.setItem('clientSession', 'true');
        }

        return true;
      } else {
        // In production, we should use the public results endpoint instead of client login
        // The system is designed to not have persistent client sessions
        setError('Acesso de cliente não disponível. Use a busca de resultados pública.');
        return false;
      }
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
      console.log('Refreshing client data...');
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

          // Load mock data for development
          if (process.env.NODE_ENV === 'development') {
            const mockPets: Pet[] = [
              {
                id: '1',
                name: 'Rex',
                species: 'canine',
                breed: 'Golden Retriever',
                birth_date: '2020-05-15',
                tutor_cpf: parsed.tutor_cpf,
                tutor_name: parsed.tutor_name,
                photo_url: null,
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
                photo_url: null,
                created_at: '2023-01-15T00:00:00Z'
              }
            ];

            setPets(mockPets);
            setConsultations([]);
            setExamResults([{
              id: 'exam-123',
              animal_name: 'Rex',
              exam_type: 'Ultrassonografia Abdominal',
              exam_date: new Date().toISOString(),
              findings: 'Fígado e rins com aparência normal. Vesícula biliar sem alterações significativas.',
              impression: 'Sem evidências de alterações patológicas significativas.',
              veterinarian: 'Dr. Saulo Vital Paz',
              pdf_url: '#'
            }]);
          }
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