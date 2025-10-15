'use client';

import { useEffect } from 'react';

interface CalendarAccessibilityProps {
  isMobile: boolean;
  selectedDayIndex: number;
  weekDays: Date[];
  onDaySelect: (index: number) => void;
}

export function CalendarAccessibility({
  isMobile,
  selectedDayIndex,
  weekDays,
  onDaySelect
}: CalendarAccessibilityProps) {

  // Screen reader announcements for day changes
  useEffect(() => {
    if (!isMobile) return;

    const announcement = document.getElementById('calendar-announcement');
    if (announcement) {
      const selectedDay = weekDays[selectedDayIndex];
      const dayName = selectedDay.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      announcement.textContent = `Dia selecionado: ${dayName}`;
    }
  }, [selectedDayIndex, weekDays, isMobile]);

  // Keyboard navigation setup
  useEffect(() => {
    if (!isMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard events when not focused on input elements
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '')) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (selectedDayIndex > 0) {
            onDaySelect(selectedDayIndex - 1);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (selectedDayIndex < weekDays.length - 1) {
            onDaySelect(selectedDayIndex + 1);
          }
          break;
        case 'Home':
          e.preventDefault();
          onDaySelect(0);
          break;
        case 'End':
          e.preventDefault();
          onDaySelect(weekDays.length - 1);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
          e.preventDefault();
          const dayIndex = parseInt(e.key) - 1;
          if (dayIndex < weekDays.length) {
            onDaySelect(dayIndex);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, selectedDayIndex, weekDays.length, onDaySelect]);

  if (!isMobile) return null;

  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      <div id="calendar-announcement" />
      <div>
        Navegação por teclado disponível: Setas esquerda/direita para mudar dias,
        Home para primeiro dia, End para último dia, números 1-5 para selecionar dias específicos.
      </div>
    </div>
  );
}