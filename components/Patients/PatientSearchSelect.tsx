'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Patient } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PatientSearchSelectProps {
  onSelect: (patientId: string) => void;
  selectedId?: string;
}

export function PatientSearchSelect({ onSelect, selectedId }: PatientSearchSelectProps) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ['patients', debouncedSearch],
    queryFn: async () => {
      const response = await api.get('/patients', {
        params: { search: debouncedSearch, limit: 10 },
      });
      return response.data;
    },
    enabled: debouncedSearch.length >= 3,
  });

  const patients: Patient[] = data?.patients || [];
  const selectedPatient = patients.find((p) => p.id === selectedId);

  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Digite nome do pet ou CPF do tutor (mín. 3 caracteres)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {selectedPatient && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="font-medium">{selectedPatient.name}</div>
          <div className="text-sm text-gray-600">
            Tutor: {selectedPatient.tutor.name} - {selectedPatient.tutor.phone}
          </div>
        </div>
      )}

      {isLoading && debouncedSearch.length >= 3 && (
        <div className="text-sm text-gray-600">Buscando...</div>
      )}

      {!selectedId && debouncedSearch.length >= 3 && patients.length > 0 && (
        <div className="border rounded-md max-h-60 overflow-y-auto">
          {patients.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => onSelect(patient.id)}
              className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0"
            >
              <div className="font-medium">{patient.name}</div>
              <div className="text-sm text-gray-600">
                {patient.species} - Tutor: {patient.tutor.name}
              </div>
              <div className="text-xs text-gray-500">{patient.tutor.phone}</div>
            </button>
          ))}
        </div>
      )}

      {!selectedId && debouncedSearch.length >= 3 && patients.length === 0 && !isLoading && (
        <div className="p-4 bg-gray-50 rounded-md text-center">
          <p className="text-sm text-gray-600 mb-2">Nenhum paciente encontrado</p>
          <Link href="/pacientes/novo">
            <Button type="button" variant="outline" size="sm">
              Cadastrar Novo Paciente
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
