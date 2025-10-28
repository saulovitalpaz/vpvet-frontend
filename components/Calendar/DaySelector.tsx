'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DaySelectorProps {
  weekDays: Date[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function DaySelector({
  weekDays,
  selectedIndex,
  onSelect,
  onPrevious,
  onNext
}: DaySelectorProps) {
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && selectedIndex < weekDays.length - 1) {
      onSelect(selectedIndex + 1);
    } else if (direction === 'right' && selectedIndex > 0) {
      onSelect(selectedIndex - 1);
    }
  };

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* Day Navigation */}
      <div className="flex items-center justify-between px-1 py-1.5">
        <button
          onClick={() => handleSwipe('right')}
          disabled={selectedIndex === 0}
          className={cn(
            "p-1.5 sm:p-2 rounded-lg transition-all",
            selectedIndex === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 active:scale-95"
          )}
          aria-label="Previous day"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex-1 mx-1 min-w-0 overflow-hidden">
          <div className="flex justify-center gap-0.5 px-0.5 w-full">
            {weekDays.map((day, index) => {
              const dayKey = format(day, 'yyyy-MM-dd');
              const isToday = dayKey === format(new Date(), 'yyyy-MM-dd');
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={dayKey}
                  onClick={() => onSelect(index)}
                  className={cn(
                    "flex flex-col items-center px-0.5 py-1.5 sm:px-1 sm:py-2 rounded-lg transition-all flex-1 min-w-0",
                    "focus:outline-none focus:ring-1 focus:ring-primary-500 focus:ring-offset-1",
                    isSelected
                      ? "bg-primary-600 text-white shadow-md scale-105"
                      : isToday
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <span className="text-[8px] sm:text-[9px] md:text-xs font-medium uppercase leading-tight truncate">
                    {format(day, 'EEE', { locale: ptBR })}
                  </span>
                  <span className="text-xs sm:text-sm font-bold mt-0.5 leading-tight">
                    {format(day, 'dd')}
                  </span>
                  {isToday && !isSelected && (
                    <span className="text-[6px] sm:text-[7px] font-semibold mt-0.5 leading-tight truncate block">
                      Hoje
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => handleSwipe('left')}
          disabled={selectedIndex === weekDays.length - 1}
          className={cn(
            "p-1.5 sm:p-2 rounded-lg transition-all",
            selectedIndex === weekDays.length - 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 active:scale-95"
          )}
          aria-label="Next day"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}