'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { TimeSlot as TimeSlotType } from '@/lib/types';
import { TimeSlot } from './TimeSlot';
import { DaySelector } from './DaySelector';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarProps {
  onSlotClick: (slot: TimeSlotType) => void;
}

// Custom hook for responsive detection
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
}

export function Calendar({ onSlotClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const isMobile = useMediaQuery('(max-width: 1023px)');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // Sunday

  const { data, isLoading, error } = useQuery({
    queryKey: ['availability', format(weekStart, 'yyyy-MM-dd'), format(weekEnd, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await api.get('/appointments/availability', {
        params: {
          start_date: format(weekStart, 'yyyy-MM-dd'),
          end_date: format(weekEnd, 'yyyy-MM-dd'),
        },
      });
      return response.data;
    },
  });

  // Auto-select today on mobile or when week changes
  useEffect(() => {
    if (isMobile) {
      const todayIndex = weekDays.findIndex(day =>
        format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      );
      if (todayIndex >= 0) {
        setSelectedDayIndex(todayIndex);
      }
    }
  }, [isMobile, weekStart]);

  const previousWeek = () => {
    setCurrentDate((date) => addDays(date, -7));
    if (isMobile) setSelectedDayIndex(0); // Reset to first day on week change
  };

  const nextWeek = () => {
    setCurrentDate((date) => addDays(date, 7));
    if (isMobile) setSelectedDayIndex(0); // Reset to first day on week change
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  // Group slots by day
  const slotsByDay: { [key: string]: TimeSlotType[] } = {};
  data?.slots?.forEach((slot: TimeSlotType) => {
    const day = format(new Date(slot.datetime), 'yyyy-MM-dd');
    if (!slotsByDay[day]) {
      slotsByDay[day] = [];
    }
    slotsByDay[day].push(slot);
  });

  const weekDays = [];
  for (let i = 0; i < 5; i++) { // Monday to Friday
    weekDays.push(addDays(weekStart, i));
  }

  // Keyboard navigation for mobile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMobile) return;

      if (e.key === 'ArrowLeft' && selectedDayIndex > 0) {
        setSelectedDayIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && selectedDayIndex < weekDays.length - 1) {
        setSelectedDayIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, selectedDayIndex, weekDays.length]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando agenda...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-red-600">
            Erro ao carregar agenda. Tente novamente.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mobile view - Single day with selector
  if (isMobile) {
    const selectedDay = weekDays[selectedDayIndex];
    const dayKey = format(selectedDay, 'yyyy-MM-dd');
    const daySlots = slotsByDay[dayKey] || [];
    const isToday = format(selectedDay, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    return (
      <div className="space-y-4">
        {/* Calendar Header */}
        <Card className="shadow-sm border border-gray-200 bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 via-white to-gray-50/50 border-b border-gray-100 px-3 sm:px-6 py-3 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="text-center sm:text-left">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 capitalize">
                  {format(weekStart, 'MMMM yyyy', { locale: ptBR })}
                </CardTitle>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1">
                  {format(weekStart, 'dd MMM', { locale: ptBR })} - {format(weekEnd, 'dd MMM', { locale: ptBR })}
                </p>
              </div>
              <div className="flex gap-1 sm:gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousWeek}
                  className="hover:bg-gray-50 border-gray-300 text-gray-700 font-medium px-2 sm:px-3"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={today}
                  className="hover:bg-gray-100 border-gray-300 text-gray-700 font-semibold px-2 sm:px-4 text-xs sm:text-sm"
                >
                  Hoje
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextWeek}
                  className="hover:bg-gray-50 border-gray-300 text-gray-700 font-medium px-2 sm:px-3"
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Day Selector */}
        <DaySelector
          weekDays={weekDays}
          selectedIndex={selectedDayIndex}
          onSelect={setSelectedDayIndex}
          onPrevious={() => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1))}
          onNext={() => setSelectedDayIndex(Math.min(weekDays.length - 1, selectedDayIndex + 1))}
        />

        {/* Single Day View */}
        <Card className="shadow-sm transition-all duration-200 border border-gray-200">
          <CardHeader className="pb-3 sm:pb-4 bg-gradient-to-b from-gray-50/80 to-white border-b border-gray-100 px-3 sm:px-6 py-3 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="text-center sm:text-left">
                <CardTitle className="text-base sm:text-lg font-semibold uppercase tracking-wide text-gray-600">
                  {format(selectedDay, 'EEEE', { locale: ptBR })}
                </CardTitle>
                <div className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                  {format(selectedDay, 'dd/MM/yyyy')}
                </div>
              </div>
              {isToday && (
                <div className="px-2 py-1 sm:px-3 sm:py-1.5 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-full self-center sm:self-auto">
                  Hoje
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gray-50/20">
            {daySlots.length > 0 ? (
              daySlots.map((slot) => (
                <TimeSlot
                  key={slot.datetime}
                  slot={slot}
                  onClick={() => onSlotClick(slot)}
                />
              ))
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <p className="text-sm sm:text-base font-medium text-gray-500 mb-2">
                  Sem horários disponíveis
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Tente selecionar outro dia
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop view - Original grid layout
  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card className="shadow-sm border border-gray-200 bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-50 via-white to-gray-50/50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 capitalize">
                {format(weekStart, 'MMMM yyyy', { locale: ptBR })}
              </CardTitle>
              <p className="text-sm font-medium text-gray-600 mt-1">
                {format(weekStart, 'dd MMM', { locale: ptBR })} - {format(weekEnd, 'dd MMM', { locale: ptBR })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousWeek}
                className="hover:bg-gray-50 border-gray-300 text-gray-700 font-medium"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={today}
                className="hover:bg-gray-100 border-gray-300 text-gray-700 font-semibold px-4"
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextWeek}
                className="hover:bg-gray-50 border-gray-300 text-gray-700 font-medium"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {weekDays.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const daySlots = slotsByDay[dayKey] || [];
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <Card
              key={dayKey}
              className={cn(
                "shadow-sm transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:shadow-md"
              )}
            >
              <CardHeader className="pb-4 bg-gradient-to-b from-gray-50/80 to-white border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                      {format(day, 'EEEE', { locale: ptBR })}
                    </CardTitle>
                    <div className="text-lg font-bold text-gray-900 mt-1">
                      {format(day, 'dd/MM')}
                    </div>
                  </div>
                  {isToday && (
                    <div className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Hoje
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3 space-y-2 custom-scrollbar max-h-[600px] overflow-y-auto bg-gray-50/20">
                {daySlots.length > 0 ? (
                  daySlots.map((slot) => (
                    <TimeSlot
                      key={slot.datetime}
                      slot={slot}
                      onClick={() => onSlotClick(slot)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Sem horários</p>
                    <p className="text-xs text-gray-400 mt-1">Volte mais tarde</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}