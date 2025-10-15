'use client';

import { TimeSlot as TimeSlotType } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { cn, formatTime } from '@/lib/utils';
import { Clock, User } from 'lucide-react';

interface TimeSlotProps {
  slot: TimeSlotType;
  onClick: () => void;
}

export function TimeSlot({ slot, onClick }: TimeSlotProps) {
  const { user } = useAuth();

  const canSeeDetails =
    slot.appointment &&
    (user?.is_dr_saulo || slot.appointment.clinic.id === user?.clinic?.id);

  const time = formatTime(slot.datetime);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full px-2 sm:px-4 py-3 sm:py-4 rounded-xl transition-all duration-200 text-left group relative',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        'active:scale-[0.98] touch-manipulation',
        {
          // Available slot - Modern minimal style
          'bg-white border border-gray-200 hover:border-primary-400 hover:bg-primary-50/30 hover:shadow-sm focus:ring-primary-400':
            slot.available,
          // Occupied slot - Subdued but clickable
          'bg-gray-50/50 border border-gray-200/60 hover:border-gray-300 hover:bg-gray-100/50 cursor-pointer':
            !slot.available && canSeeDetails,
          // Occupied slot - Not clickable (no permission)
          'bg-gray-50/50 border border-gray-200/60 cursor-not-allowed opacity-80':
            !slot.available && !canSeeDetails,
        }
      )}
    >
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {/* Time Display */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className={cn(
            "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            slot.available
              ? "bg-primary-50 text-primary-600 group-hover:bg-primary-100"
              : "bg-gray-100 text-gray-500"
          )}>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className={cn(
              "font-bold text-sm sm:text-base leading-none truncate block",
              slot.available ? "text-gray-900" : "text-gray-600"
            )}>
              {time}
            </span>
            {!slot.available && canSeeDetails && (
              <div className="text-xs text-gray-500 mt-1 truncate">
                {slot.appointment?.service_type}
              </div>
            )}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <span className={cn(
            "text-xs sm:text-sm font-medium hidden sm:inline",
            slot.available ? "text-primary-700 group-hover:opacity-0 transition-opacity" : "text-red-600"
          )}>
            {slot.available ? "Disponível" : "Ocupado"}
          </span>
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
               style={{ backgroundColor: slot.available ? 'var(--primary)' : 'var(--danger)' }}>
          </div>
        </div>
      </div>

      {/* Hover Action Indicator (Available slots only) */}
      {slot.available && (
        <div className="absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="text-xs sm:text-sm font-medium text-primary-600 flex items-center gap-1">
            <span className="hidden sm:inline">Agendar</span>
            <span className="text-sm sm:text-lg">→</span>
          </div>
        </div>
      )}

      {/* Appointment Details for Occupied Slots */}
      {!slot.available && canSeeDetails && slot.appointment && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/80 space-y-2 sm:space-y-3">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                {slot.appointment.service_type}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
                {slot.appointment.clinic.name}
              </div>
              {slot.appointment.animal && (
                <div className="text-xs text-gray-500 mt-1 truncate">
                  {slot.appointment.animal.name}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </button>
  );
}