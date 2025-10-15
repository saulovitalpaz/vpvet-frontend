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
      <div className="flex items-center justify-between px-2 py-2">
        <button
          onClick={() => handleSwipe('right')}
          disabled={selectedIndex === 0}
          className={cn(
            "p-2 rounded-lg transition-all",
            selectedIndex === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 active:scale-95"
          )}
          aria-label="Previous day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 mx-2 overflow-x-auto scrollbar-hide">
          <div className="flex justify-center gap-0.5 sm:gap-1 min-w-max px-1">
            {weekDays.map((day, index) => {
              const dayKey = format(day, 'yyyy-MM-dd');
              const isToday = dayKey === format(new Date(), 'yyyy-MM-dd');
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={dayKey}
                  onClick={() => onSelect(index)}
                  className={cn(
                    "flex flex-col items-center px-1.5 sm:px-3 py-2 rounded-lg transition-all min-w-[44px] sm:min-w-[60px]",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1",
                    isSelected
                      ? "bg-primary-600 text-white shadow-md scale-105"
                      : isToday
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wide">
                    {format(day, 'EEE', { locale: ptBR })}
                  </span>
                  <span className="text-sm sm:text-lg font-bold mt-0.5 sm:mt-1">
                    {format(day, 'dd')}
                  </span>
                  {isToday && !isSelected && (
                    <span className="text-[8px] sm:text-[10px] font-semibold mt-0.5 sm:mt-1">
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
            "p-2 rounded-lg transition-all",
            selectedIndex === weekDays.length - 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 active:scale-95"
          )}
          aria-label="Next day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}