'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { TimeSlot } from '@/lib/types';

interface UseCalendarDataProps {
  data?: { slots: TimeSlot[] };
  weekDays: Date[];
  selectedDayIndex?: number;
  isMobile?: boolean;
}

export function useCalendarData({ data, weekDays, selectedDayIndex = 0, isMobile = false }: UseCalendarDataProps) {
  // Memoize slots grouping to prevent unnecessary recalculations
  const slotsByDay = useMemo(() => {
    const grouped: { [key: string]: TimeSlot[] } = {};
    data?.slots?.forEach((slot: TimeSlot) => {
      const day = format(new Date(slot.datetime), 'yyyy-MM-dd');
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(slot);
    });
    return grouped;
  }, [data?.slots]);

  // For mobile, only compute slots for the selected day
  const currentDaySlots = useMemo(() => {
    if (!isMobile) return null;

    const selectedDay = weekDays[selectedDayIndex];
    const dayKey = format(selectedDay, 'yyyy-MM-dd');
    return slotsByDay[dayKey] || [];
  }, [isMobile, selectedDayIndex, weekDays, slotsByDay]);

  // Performance metrics for monitoring
  const slotCounts = useMemo(() => {
    return Object.keys(slotsByDay).reduce((acc, dayKey) => {
      acc[dayKey] = slotsByDay[dayKey].length;
      return acc;
    }, {} as { [key: string]: number });
  }, [slotsByDay]);

  // Find today's index for auto-selection
  const todayIndex = useMemo(() => {
    return weekDays.findIndex(day =>
      format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    );
  }, [weekDays]);

  return {
    slotsByDay,
    currentDaySlots,
    slotCounts,
    todayIndex,
    totalSlots: data?.slots?.length || 0,
  };
}