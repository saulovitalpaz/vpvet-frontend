import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Calendar } from '@/components/Calendar/Calendar';
import { api } from '@/lib/api';
import { TimeSlot } from '@/lib/types';

// Mock API responses
const mockAvailabilityResponse = {
  slots: [
    {
      datetime: '2024-01-15T09:00:00',
      available: true,
    },
    {
      datetime: '2024-01-15T10:00:00',
      available: false,
      appointment: {
        id: '1',
        service_type: 'Consulta Regular',
        clinic: { id: '1', name: 'Clínica Central' },
        animal: { id: '1', name: 'Rex' },
      },
    },
    {
      datetime: '2024-01-16T14:00:00',
      available: true,
    },
  ],
};

describe('Calendar Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock media query for mobile testing
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width: 1023px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    jest.clearAllMocks();
  });

  const renderCalendarWithProviders = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <Calendar onSlotClick={jest.fn()} />
      </QueryClientProvider>
    );
  };

  describe('Complete User Journey', () => {
    test('mobile user navigates from landing to booking', async () => {
      const user = userEvent.setup();
      const mockOnSlotClick = jest.fn();

      // Mock API calls
      (api.get as jest.Mock).mockResolvedValue({ data: mockAvailabilityResponse });

      render(
        <QueryClientProvider client={queryClient}>
          <Calendar onSlotClick={mockOnSlotClick} />
        </QueryClientProvider>
      );

      // 1. Calendar loads
      await waitFor(() => {
        expect(screen.getByText('Carregando agenda...')).toBeInTheDocument();
      });

      // 2. Mobile view loads with today selected
      await waitFor(() => {
        expect(screen.getByText('15')).toBeInTheDocument();
        expect(screen.getByText('Hoje')).toBeInTheDocument();
      });

      // 3. User navigates to next day
      const nextButton = screen.getByLabelText('Next day');
      await user.click(nextButton);

      // 4. Should show different day
      await waitFor(() => {
        expect(screen.getByText('16')).toBeInTheDocument();
      });

      // 5. User clicks on available time slot
      const availableSlots = screen.getAllByText('Disponível');
      await user.click(availableSlots[0]);

      // 6. Should trigger onSlotClick callback
      expect(mockOnSlotClick).toHaveBeenCalled();
    });

    test('desktop user sees full week view', async () => {
      // Mock desktop view
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 1023px)' ? false : true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      (api.get as jest.Mock).mockResolvedValue({ data: mockAvailabilityResponse });

      renderCalendarWithProviders();

      await waitFor(() => {
        expect(screen.getByText('Carregando agenda...')).toBeInTheDocument();
      });

      // Should see all 5 days in grid
      await waitFor(() => {
        const grid = document.querySelector('.grid');
        expect(grid).toHaveClass('lg:grid-cols-5');

        // Should see multiple day cards
        expect(screen.getAllByText('Sem horários')).toHaveLength(5);
      });
    });
  });

  describe('Responsive Behavior', () => {
    test('handles viewport resize correctly', async () => {
      const user = userEvent.setup();
      (api.get as jest.Mock).mockResolvedValue({ data: mockAvailabilityResponse });

      renderCalendarWithProviders();

      await waitFor(() => {
        expect(screen.getByText('Carregando agenda...')).toBeInTheDocument();
      });

      // Simulate window resize from mobile to desktop
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 1023px)' ? false : true,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      // Trigger resize event
      fireEvent.resize(window);

      // Should adapt to desktop layout
      await waitFor(() => {
        const grid = document.querySelector('.grid');
        expect(grid).toHaveClass('lg:grid-cols-5');
      });
    });
  });

  describe('Error Handling', () => {
    test('handles API errors gracefully', async () => {
      (api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      renderCalendarWithProviders();

      await waitFor(() => {
        expect(screen.getByText('Erro ao carregar agenda. Tente novamente.')).toBeInTheDocument();
      });
    });

    test('handles empty availability data', async () => {
      (api.get as jest.Mock).mockResolvedValue({ data: { slots: [] } });

      renderCalendarWithProviders();

      await waitFor(() => {
        expect(screen.getByText('Sem horários disponíveis')).toBeInTheDocument();
        expect(screen.getByText('Tente selecionar outro dia')).toBeInTheDocument();
      });
    });
  });

  describe('Performance Integration', () => {
    test('maintains performance with large datasets', async () => {
      const largeDataset = {
        slots: Array.from({ length: 500 }, (_, i) => ({
          datetime: `2024-01-${String((i % 5) + 1).padStart(2, '0')}T${String(Math.floor(i / 20) + 8).padStart(2, '0')}:00:00`,
          available: i % 3 !== 0,
        })),
      };

      (api.get as jest.Mock).mockResolvedValue({ data: largeDataset });

      const startTime = performance.now();
      renderCalendarWithProviders();

      await waitFor(() => {
        expect(screen.queryByText('Carregando agenda...')).not.toBeInTheDocument();
      });

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(2000); // Should load within 2 seconds
    });
  });
});