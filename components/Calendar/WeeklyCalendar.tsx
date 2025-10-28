'use client';

import { useMemo } from 'react';
import { TimeSlot as TimeSlotType } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { format, addMinutes, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn, formatTime } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface WeeklyCalendarProps {
  slotsByDay: { [key: string]: TimeSlotType[] };
  weekDays: Date[];
  onSlotClick: (slot: TimeSlotType) => void;
}

interface TimeCellProps {
  timeSlot: TimeSlotType | null;
  onClick: () => void;
  isToday: boolean;
  timeLabel: string;
  isFirstSlot?: boolean;
  isLastSlot?: boolean;
}

function TimeCell({ timeSlot, onClick, isToday, timeLabel, isFirstSlot, isLastSlot }: TimeCellProps) {
  const { user } = useAuth();

  // Create a default available slot if timeSlot is null
  const effectiveSlot = timeSlot || {
    datetime: new Date().toISOString(), // This won't be used for display
    available: true,
    appointment: null
  };

  const canSeeDetails =
    effectiveSlot.appointment &&
    (user?.is_dr_saulo || effectiveSlot.appointment.clinic.id === user?.clinic?.id);

  const time = timeSlot ? formatTime(timeSlot.datetime) : timeLabel;

  // Calculate duration display for the first slot of an appointment
  const getDurationDisplay = () => {
    if (!effectiveSlot.appointment?.duration_minutes) return null;
    const minutes = effectiveSlot.appointment.duration_minutes;
    if (minutes === 30) return '30 min';
    if (minutes === 60) return '1h';
    if (minutes === 90) return '1h 30min';
    if (minutes === 120) return '2h';
    if (minutes === 150) return '2h 30min';
    if (minutes === 180) return '3h';
    return `${minutes} min`;
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full min-h-[70px] h-auto transition-all duration-200 text-left group relative',
        'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-400',
        'hover:z-10',
        {
          'bg-white hover:bg-primary-50/40': effectiveSlot.available,
          'bg-red-50 hover:bg-red-100/50': !effectiveSlot.available && canSeeDetails,
          'bg-gray-100/60 cursor-not-allowed': !effectiveSlot.available && !canSeeDetails,
        }
      )}
    >
      <div className="p-2 flex flex-col justify-between min-h-[70px] h-auto">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 flex-shrink-0">
            <Clock className={cn(
              "w-3 h-3",
              effectiveSlot.available ? "text-gray-400" : "text-red-500"
            )} />
            <span className={cn(
              "text-xs font-medium",
              effectiveSlot.available ? "text-gray-700" : "text-red-700"
            )}>
              {time}
            </span>
          </div>
          <div className={cn(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            effectiveSlot.available ? "bg-emerald-500" : "bg-red-600"
          )} />
        </div>

        {!effectiveSlot.available && canSeeDetails && effectiveSlot.appointment && (
          <div className="space-y-0.5 mt-1 flex-shrink-0">
            <div className="flex items-center justify-between gap-1">
              <div className="text-xs font-medium text-red-800 truncate">
                {effectiveSlot.appointment.service_type}
              </div>
              {isFirstSlot && getDurationDisplay() && (
                <div className="text-xs text-red-600 font-medium">
                  {getDurationDisplay()}
                </div>
              )}
            </div>
            {effectiveSlot.appointment.animal && (
              <div className="text-xs text-gray-600 truncate">
                <span className="font-medium">{effectiveSlot.appointment.animal.name}</span>
              </div>
            )}
            {effectiveSlot.appointment.clinic && (
              <div className="text-xs text-gray-500 truncate">
                {effectiveSlot.appointment.clinic.name}
              </div>
            )}
            {/* Visual indicator for multi-slot appointments */}
            {isFirstSlot && effectiveSlot.appointment.duration_minutes && effectiveSlot.appointment.duration_minutes > 30 && (
              <div className="text-xs text-red-500 italic">
                ↕ {Math.floor(effectiveSlot.appointment.duration_minutes / 30) - 1} mais
              </div>
            )}
            {isLastSlot && effectiveSlot.appointment.duration_minutes && effectiveSlot.appointment.duration_minutes > 30 && (
              <div className="text-xs text-red-500 italic">
                ↧ Final
              </div>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

export function WeeklyCalendar({ slotsByDay, weekDays, onSlotClick }: WeeklyCalendarProps) {
  // Generate time slots from 8:00 AM to 6:00 PM with 30-minute intervals
  const timeSlots = useMemo(() => {
    const slots: Date[] = [];
    const baseDate = new Date();

    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 18 && minute > 0) break; // Stop at 6:00 PM
        const slotTime = setMinutes(setHours(baseDate, hour), minute);
        slots.push(slotTime);
      }
    }
    return slots;
  }, []);

  // Create a map of all time slots for each day and handle multi-slot appointments
  const weeklyGrid = useMemo(() => {
    const grid: { [dayKey: string]: { [timeKey: string]: TimeSlotType | null } } = {};

    // First, map all available slots
    weekDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      grid[dayKey] = {};

      timeSlots.forEach(timeSlot => {
        const timeKey = format(timeSlot, 'HH:mm');
        const slotDateTime = new Date(day);
        slotDateTime.setHours(timeSlot.getHours(), timeSlot.getMinutes(), 0, 0);

        // Find matching slot in API data
        const matchingSlot = slotsByDay[dayKey]?.find(apiSlot => {
          const apiDateTime = new Date(apiSlot.datetime);
          return apiDateTime.getTime() === slotDateTime.getTime();
        });

        grid[dayKey][timeKey] = matchingSlot || null;
      });
    });

    // Then, block consecutive slots for appointments with duration > 30 minutes
    weekDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');

      slotsByDay[dayKey]?.forEach(slot => {
        if (slot.appointment && slot.appointment.duration_minutes && slot.appointment.duration_minutes > 30) {
          const slotDateTime = new Date(slot.datetime);
          const durationMinutes = slot.appointment.duration_minutes;

          // Calculate how many 30-minute slots this appointment occupies
          const slotsToBlock = Math.floor(durationMinutes / 30);

          // Block consecutive slots starting from the appointment start time
          for (let i = 1; i < slotsToBlock; i++) {
            const nextSlotTime = new Date(slotDateTime.getTime() + (i * 30 * 60 * 1000));
            const nextTimeKey = format(nextSlotTime, 'HH:mm');

            if (grid[dayKey][nextTimeKey]) {
              // Mark this slot as occupied by the same appointment
              grid[dayKey][nextTimeKey] = {
                ...grid[dayKey][nextTimeKey],
                available: false,
                appointment: slot.appointment
              };
            }
          }
        }
      });
    });

    return grid;
  }, [weekDays, timeSlots, slotsByDay]);

  const todayKey = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full border-collapse table-fixed" style={{ tableLayout: 'fixed' }}>
        <colgroup>
          {weekDays.map((day, index) => (
            <col key={index} style={{ width: '14.285714%' }} />
          ))}
        </colgroup>
        {/* Day Headers */}
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {weekDays.map(day => {
              const dayKey = format(day, 'yyyy-MM-dd');
              const isToday = dayKey === todayKey;

              return (
                <th
                  key={dayKey}
                  className={cn(
                    "p-3 border-r border-gray-200 text-center font-normal overflow-hidden",
                    isToday && "bg-emerald-50"
                  )}
                >
                  <div className="space-y-1">
                    <div className={cn(
                      "text-xs font-semibold uppercase tracking-wider truncate",
                      isToday ? "text-emerald-700" : "text-gray-600"
                    )}>
                      {format(day, 'EEE', { locale: ptBR })}
                    </div>
                    <div className={cn(
                      "text-sm font-bold truncate",
                      isToday ? "text-emerald-800" : "text-gray-900"
                    )}>
                      {format(day, 'dd/MM')}
                    </div>
                    {isToday && (
                      <div className="inline-flex px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                        Hoje
                      </div>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Time Grid */}
        <tbody className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {timeSlots.map(timeSlot => {
            const timeKey = format(timeSlot, 'HH:mm');
            const timeLabel = format(timeSlot, 'HH:mm');

            return (
              <tr key={timeKey} className="border-b border-gray-100">
                {weekDays.map(day => {
                  const dayKey = format(day, 'yyyy-MM-dd');
                  const isToday = dayKey === todayKey;
                  const slot = weeklyGrid[dayKey]?.[timeKey];

                  // Determine if this is the first or last slot of a multi-slot appointment
                  const isFirstSlot = slot?.appointment &&
                    (() => {
                      const slotTime = new Date(slot.datetime);
                      const prevTimeKey = format(new Date(slotTime.getTime() - 30 * 60 * 1000), 'HH:mm');
                      const prevSlot = weeklyGrid[dayKey]?.[prevTimeKey];
                      return !prevSlot?.appointment || prevSlot?.appointment?.id !== slot.appointment.id;
                    })();

                  const isLastSlot = slot?.appointment &&
                    (() => {
                      const slotTime = new Date(slot.datetime);
                      const nextTimeKey = format(new Date(slotTime.getTime() + 30 * 60 * 1000), 'HH:mm');
                      const nextSlot = weeklyGrid[dayKey]?.[nextTimeKey];
                      return !nextSlot?.appointment || nextSlot?.appointment?.id !== slot.appointment.id;
                    })();

                  return (
                    <td
                      key={`${dayKey}-${timeKey}`}
                      className={cn(
                        "border-r border-gray-200 last:border-r-0 p-0 align-top overflow-hidden",
                        slot?.appointment && !isFirstSlot && "bg-red-100"
                      )}
                      style={{ width: '14.285714%' }}
                    >
                      <TimeCell
                        timeSlot={slot}
                        onClick={() => slot && onSlotClick(slot)}
                        isToday={isToday}
                        timeLabel={timeLabel}
                        isFirstSlot={isFirstSlot}
                        isLastSlot={isLastSlot}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}