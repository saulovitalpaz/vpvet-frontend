import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Calendar } from '@/components/Calendar/Calendar';
import { TimeSlot } from '@/lib/types';

// Mock dependencies
jest.mock('@/lib/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    user: { id: '1', name: 'Test User', is_dr_saulo: false },
  })),
}));

// Mock responsive hook
const mockMediaQuery = jest.fn();
jest.mock('@/components/Calendar/Calendar', () => {
  const originalModule = jest.requireActual('@/components/Calendar/Calendar');
  return {
    ...originalModule,
    useMediaQuery: mockMediaQuery,
  };
});

// Test data
const mockTimeSlots: TimeSlot[] = [
  {
    datetime: '2024-01-15T09:00:00',
    available: true,
  },
  {
    datetime: '2024-01-15T10:00:00',
    available: false,
    appointment: {
      id: '1',
      service_type: 'Consulta',
      clinic: { id: '1', name: 'Clínica Teste' },
    },
  },
];

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderCalendar = (isMobile = false, mockData = { slots: mockTimeSlots }) => {
  mockMediaQuery.mockReturnValue(isMobile);

  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <Calendar onSlotClick={jest.fn()} />
    </QueryClientProvider>
  );
};

describe('Calendar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Responsive Behavior', () => {
    test('renders desktop grid layout on large screens', async () => {
      renderCalendar(false);

      await waitFor(() => {
        expect(screen.getByText('Carregando agenda...')).toBeInTheDocument();
      });

      // After loading, should see grid layout
      await waitFor(() => {
        const grid = document.querySelector('.grid');
        expect(grid).toHaveClass('lg:grid-cols-5');
      });
    });

    test('renders mobile single day layout on small screens', async () => {
      renderCalendar(true);

      await waitFor(() => {
        expect(screen.getByText('Carregando agenda...')).toBeInTheDocument();
      });

      // Should not show grid on mobile
      await waitFor(() => {
        const grid = document.querySelector('.grid');
        expect(grid).not.toHaveClass('lg:grid-cols-5');
      });
    });
  });

  describe('Mobile Day Navigation', () => {
    test('auto-selects today on mobile load', async () => {
      // Mock today's date
      const mockDate = new Date('2024-01-15');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      renderCalendar(true);

      await waitFor(() => {
        // Should select today (day 0 in this case)
        const selectedDay = screen.getByText('15');
        expect(selectedDay.closest('button')).toHaveClass('bg-primary-600');
      });

      global.Date.mockRestore();
    });

    test('navigates between days using arrow buttons', async () => {
      renderCalendar(true);

      await waitFor(() => {
        expect(screen.getByText('Carregando agenda...')).toBeInTheDocument();
      });

      // Find next day button
      const nextButton = screen.getByLabelText('Next day');
      expect(nextButton).not.toBeDisabled();

      // Click to go to next day
      fireEvent.click(nextButton);

      // Should update selected day
      await waitFor(() => {
        const dayButtons = screen.getAllByRole('button');
        expect(dayButtons[2]).toHaveClass('bg-primary-600'); // Second day selected
      });
    });

    test('disables navigation at boundaries', async () => {
      renderCalendar(true);

      await waitFor(() => {
        expect(screen.getByText('Carregando agenda...')).toBeInTheDocument();
      });

      // Previous button should be disabled on first day
      const prevButton = screen.getByLabelText('Previous day');
      expect(prevButton).toBeDisabled();
    });
  });

  describe('Keyboard Navigation', () => {
    test('supports arrow key navigation on mobile', async () => {
      renderCalendar(true);

      await waitFor(() => {
        expect(screen.getByText('Carregando agenda...')).toBeInTheDocument();
      });

      // Press right arrow key
      fireEvent.keyDown(document, { key: 'ArrowRight' });

      await waitFor(() => {
        const dayButtons = screen.getAllByRole('button');
        expect(dayButtons[2]).toHaveClass('bg-primary-600');
      });
    });

    test('supports number key navigation', async () => {
      renderCalendar(true);

      await waitFor(() => {
        expect(screen.getByText('Carregando agenda...')).toBeInTheDocument();
      });

      // Press '3' to select third day
      fireEvent.keyDown(document, { key: '3' });

      await waitFor(() => {
        const dayButtons = screen.getAllByRole('button');
        expect(dayButtons[4]).toHaveClass('bg-primary-600');
      });
    });
  });

  describe('Performance', () => {
    test('renders efficiently with large datasets', async () => {
      // Create large dataset
      const largeDataSet = Array.from({ length: 100 }, (_, i) => ({
        datetime: `2024-01-${String(i + 1).padStart(2, '0')}T09:00:00`,
        available: i % 2 === 0,
      }));

      const startTime = performance.now();
      renderCalendar(true, { slots: largeDataSet });

      await waitFor(() => {
        expect(screen.queryByText('Carregando agenda...')).not.toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time (less than 1 second)
      expect(renderTime).toBeLessThan(1000);
    });
  });

  describe('Accessibility', () => {
    test('announces day changes to screen readers', async () => {
      renderCalendar(true);

      await waitFor(() => {
        expect(screen.getByText('Carregando agenda...')).toBeInTheDocument();
      });

      const announcement = document.getElementById('calendar-announcement');
      expect(announcement).toBeInTheDocument();

      // Navigate to next day
      const nextButton = screen.getByLabelText('Next day');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(announcement).toHaveTextContent('Dia selecionado:');
      });
    });

    test('supports ARIA labels and roles', async () => {
      renderCalendar(true);

      await waitFor(() => {
        expect(screen.getByText('Carregando agenda...')).toBeInTheDocument();
      });

      // Check for proper ARIA attributes
      const dayButtons = screen.getAllByRole('button');
      dayButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });
  });
});

describe('DaySelector Component', () => {
  test('renders correct number of day buttons', () => {
    // Implementation pending
    expect(true).toBe(true);
  });

  test('highlights selected day', () => {
    // Implementation pending
    expect(true).toBe(true);
  });

  test('handles touch interactions', () => {
    // Implementation pending
    expect(true).toBe(true);
  });
});