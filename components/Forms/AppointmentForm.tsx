'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TimeSlot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PatientSearchSelect } from '../Patients/PatientSearchSelect';

const appointmentSchema = z.object({
  animal_id: z.string().min(1, 'Selecione um paciente'),
  datetime: z.string(),
  service_type: z.string().min(1, 'Selecione o tipo de exame'),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  selectedSlot: TimeSlot;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AppointmentForm({ selectedSlot, onSuccess, onCancel }: AppointmentFormProps) {
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      datetime: selectedSlot.datetime,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: AppointmentFormData) => api.post('/appointments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      onSuccess();
    },
  });

  const onSubmit = (data: AppointmentFormData) => {
    mutation.mutate(data);
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId);
    setValue('animal_id', patientId);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Data/Hora</Label>
        <Input type="text" value={new Date(selectedSlot.datetime).toLocaleString('pt-BR')} disabled />
      </div>

      <div className="space-y-2">
        <Label>Paciente *</Label>
        <input type="hidden" {...register('animal_id')} />
        <PatientSearchSelect onSelect={handlePatientSelect} selectedId={selectedPatient} />
        {errors.animal_id && <p className="text-sm text-red-600">{errors.animal_id.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="service_type">Tipo de Exame *</Label>
        <Select id="service_type" {...register('service_type')}>
          <option value="">Selecione...</option>
          <option value="Ultrassom Abdominal">Ultrassom Abdominal</option>
          <option value="Ultrassom Obstétrico">Ultrassom Obstétrico</option>
          <option value="Ecocardiograma">Ecocardiograma</option>
          <option value="Raio-X Torácico">Raio-X Torácico</option>
          <option value="Raio-X Abdominal">Raio-X Abdominal</option>
          <option value="Raio-X Ortopédico">Raio-X Ortopédico</option>
          <option value="Tomografia">Tomografia</option>
        </Select>
        {errors.service_type && <p className="text-sm text-red-600">{errors.service_type.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" {...register('notes')} placeholder="Informações adicionais..." rows={3} />
      </div>

      {mutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {(mutation.error as any)?.response?.status === 409
              ? `Horário já ocupado. ${
                  (mutation.error as any)?.response?.data?.next_available
                    ? `Próximo horário disponível: ${new Date((mutation.error as any).response.data.next_available).toLocaleTimeString('pt-BR')}`
                    : 'Tente outro horário.'
                }`
              : 'Erro ao criar agendamento. Tente novamente.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={mutation.isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Agendando...' : 'Confirmar Agendamento'}
        </Button>
      </div>
    </form>
  );
}
