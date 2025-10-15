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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            Detalhes do Agendamento
          </DialogTitle>
        </DialogHeader>

        {showDeleteConfirm ? (
          <div className="space-y-4">
            <Alert variant="destructive">
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
            <div className="space-y-4">
              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Data</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {format(appointmentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Horário</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {format(appointmentDate, 'HH:mm')}
                  </p>
                </div>
              </div>

              {/* Patient Info */}
              {data.animal && (
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Paciente</span>
                  </div>
                  <p className="text-base font-semibold text-gray-900">{data.animal.name}</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Espécie:</span> {data.animal.species}
                      {data.animal.breed && ` - ${data.animal.breed}`}
                    </p>
                    {data.animal.tutor && (
                      <p>
                        <span className="font-medium">Tutor:</span> {data.animal.tutor.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Service Type */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Tipo de Exame</span>
                </div>
                <p className="text-base font-semibold text-gray-900">{data.service_type}</p>
              </div>

              {/* Notes */}
              {data.notes && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">Observações</span>
                  <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">{data.notes}</p>
                </div>
              )}

              {/* Clinic */}
              {data.clinic && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-600">Clínica</span>
                  <p className="text-sm text-gray-900">{data.clinic.name}</p>
                </div>
              )}

              {deleteMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Erro ao excluir agendamento. Tente novamente.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
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
