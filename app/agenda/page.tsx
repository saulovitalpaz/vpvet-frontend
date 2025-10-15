'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar } from '@/components/Calendar/Calendar';
import { AppointmentForm } from '@/components/Forms/AppointmentForm';
import { AppointmentDetailsModal } from '@/components/Appointments/AppointmentDetailsModal';
import { TimeSlot } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar as CalendarIcon, Menu, CheckCircle2 } from 'lucide-react';

function AgendaContent() {
  const { user } = useAuth();

  // Mock user for testing
  const mockUser = {
    name: "Dr. Saulo Vital",
    email: "saulo@vpvet.com"
  };
  const currentUser = user || mockUser;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot);
    } else if (slot.appointment) {
      // Show appointment details for occupied slots
      setSelectedAppointmentId(slot.appointment.id);
    }
  };

  const handleFormSuccess = () => {
    setSelectedSlot(null);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const handleFormCancel = () => {
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 flex relative">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative z-10">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 h-[76px] relative z-20">
          <div className="flex items-center justify-between h-full">
            {/* Mobile menu button - Hide on tablet and desktop */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            {/* Desktop title area - Show on desktop only */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Agenda de Dr. Saulo</h1>
                <p className="text-sm text-gray-500">Visualize e gerencie os horários disponíveis</p>
              </div>
            </div>

            {/* Tablet title - Show on tablet only */}
            <h1 className="hidden md:block lg:hidden text-xl font-bold text-gray-900">
              Agenda
            </h1>

            {/* Mobile title - Show on mobile only */}
            <h1 className="md:hidden text-lg font-bold text-gray-900">
              Agenda
            </h1>

            <div className="flex items-center gap-2 sm:gap-4">
              <NotificationDropdown />
              <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {currentUser?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'SV'}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900">
                    Dr. {currentUser?.name?.startsWith('Dr.') ? currentUser.name.split(' ').slice(1).join(' ') : (currentUser?.name || 'Saulo Vital')}
                  </p>
                  <p className="text-xs text-gray-500">Sistema</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-8">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-6 px-1">
            <span className="text-sm font-semibold text-gray-700 mr-2">Status:</span>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-gray-700">Disponível</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium text-gray-700">Ocupado</span>
            </div>
          </div>

          {showSuccessMessage && (
            <Alert className="mb-6 bg-success-50 border-success-200 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-success-600" />
              <AlertDescription className="text-success-800 font-medium ml-2">
                Agendamento criado com sucesso!
              </AlertDescription>
            </Alert>
          )}

          <Calendar onSlotClick={handleSlotClick} />
        </div>
      </main>

      {/* Appointment Form Dialog */}
      <Dialog open={selectedSlot !== null} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-gray-700" />
              </div>
              Novo Agendamento
            </DialogTitle>
          </DialogHeader>
          {selectedSlot && (
            <AppointmentForm
              selectedSlot={selectedSlot}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Appointment Details Modal */}
      {selectedAppointmentId && (
        <AppointmentDetailsModal
          appointmentId={selectedAppointmentId}
          isOpen={selectedAppointmentId !== null}
          onClose={() => setSelectedAppointmentId(null)}
          onDeleted={() => {
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 5000);
          }}
        />
      )}
    </div>
  );
}

export default function AgendaPage() {
  return (
    <ProtectedRoute>
      <AgendaContent />
    </ProtectedRoute>
  );
}
