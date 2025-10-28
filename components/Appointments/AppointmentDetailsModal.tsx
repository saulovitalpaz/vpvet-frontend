'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, User, FileText, Trash2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface AppointmentDetailsModalProps {
  appointmentId: string;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export function AppointmentDetailsModal({ appointmentId, isOpen, onClose, onDeleted }: AppointmentDetailsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      const response = await api.get(`/appointments/${appointmentId}`);
      return response.data.appointment;
    },
    enabled: isOpen && !!appointmentId,
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/appointments/${appointmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
      onDeleted?.();
      onClose();
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) {
    return null;
  }

  const appointmentDate = new Date(data.datetime);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white border border-gray-200/60 shadow-sm">
        <DialogHeader className="border-b border-gray-100 pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            Detalhes do Agendamento
          </DialogTitle>
        </DialogHeader>

        {showDeleteConfirm ? (
          <div className="space-y-4">
            <Alert variant="error">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription className="ml-2">
                Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Excluindo...' : 'Confirmar Exclusão'}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 space-y-4">
              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Data</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {format(appointmentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Horário</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {format(appointmentDate, 'HH:mm')}
                  </p>
                </div>
              </div>

              {/* Patient Info */}
              {data.animal && (
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Paciente</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">{data.animal.name}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">Espécie:</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{data.animal.species}</span>
                      {data.animal.breed && <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{data.animal.breed}</span>}
                    </div>
                    {data.animal.tutor && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Tutor:</span>
                        <span className="text-gray-700">{data.animal.tutor.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Service Type and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Tipo de Exame</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{data.service_type}</p>
                </div>
                {data.duration_minutes && (
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">Duração</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {data.duration_minutes === 30 ? '30 minutos' :
                       data.duration_minutes === 60 ? '1 hora' :
                       data.duration_minutes === 90 ? '1 hora e 30 minutos' :
                       data.duration_minutes === 120 ? '2 horas' :
                       data.duration_minutes === 150 ? '2 horas e 30 minutos' :
                       data.duration_minutes === 180 ? '3 horas' :
                       `${data.duration_minutes} minutos`}
                    </p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {data.notes && (
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wide">Observações</span>
                  </div>
                  <p className="text-gray-900 text-sm bg-gray-50 rounded p-3 border border-gray-100">{data.notes}</p>
                </div>
              )}

              {/* Clinic */}
              {data.clinic && (
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-600">Clínica</span>
                  <p className="text-base font-semibold text-gray-900 mt-1">{data.clinic.name}</p>
                </div>
              )}

              {deleteMutation.isError && (
                <Alert variant="error">
                  <AlertDescription>
                    Erro ao excluir agendamento. Tente novamente.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4 px-6 pb-6 border-t border-gray-100">
              <Button
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
