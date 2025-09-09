import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useInvoices } from '../../hooks/useInvoices';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock fetch
global.fetch = vi.fn();

// Mock the toast hook
const mockToast = vi.fn();
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('useInvoices Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetch).mockClear();
  });

  it('initializes with empty invoice array', () => {
    const { result } = renderHook(() => useInvoices(), {
      wrapper: TestWrapper,
    });

    expect(result.current.invoices).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('fetches invoices and falls back to mock data on 404', async () => {
    // Mock fetch to return 404
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    const { result } = renderHook(() => useInvoices(), {
      wrapper: TestWrapper,
    });

    act(() => {
      result.current.fetchInvoices();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have mock data
    expect(result.current.invoices.length).toBeGreaterThan(0);
    expect(result.current.invoices[0]).toHaveProperty('id');
    expect(result.current.invoices[0]).toHaveProperty('amount');
  });

  it('creates invoice with valid data', async () => {
    // Mock successful response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'inv_123', status: 'created' }),
    } as Response);

    const { result } = renderHook(() => useInvoices(), {
      wrapper: TestWrapper,
    });

    const invoiceData = {
      amount: 100,
      currency: 'USD',
      email: 'test@example.com',
      name: 'John Doe',
      memo: 'Test invoice',
    };

    await act(async () => {
      await result.current.createInvoice(invoiceData);
    });

    expect(fetch).toHaveBeenCalledWith('/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Invoice Created',
      description: 'Your invoice has been created successfully.',
    });
  });

  it('handles invoice creation failure', async () => {
    // Mock failed response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const { result } = renderHook(() => useInvoices(), {
      wrapper: TestWrapper,
    });

    const invoiceData = {
      amount: 100,
      currency: 'USD',
      email: 'test@example.com',
    };

    await act(async () => {
      await result.current.createInvoice(invoiceData);
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'Failed to create invoice. Please try again.',
      variant: 'destructive',
    });
  });

  it('sends invoice with correct payload', async () => {
    // Mock successful response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'sent' }),
    } as Response);

    const { result } = renderHook(() => useInvoices(), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await result.current.sendInvoice('inv_123');
    });

    expect(fetch).toHaveBeenCalledWith('/api/invoices/inv_123/send', {
      method: 'POST',
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Invoice Sent',
      description: 'Invoice has been sent successfully.',
    });
  });

  it('cancels invoice with correct payload', async () => {
    // Mock successful response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'cancelled' }),
    } as Response);

    const { result } = renderHook(() => useInvoices(), {
      wrapper: TestWrapper,
    });

    await act(async () => {
      await result.current.cancelInvoice('inv_123');
    });

    expect(fetch).toHaveBeenCalledWith('/api/invoices/inv_123/cancel', {
      method: 'POST',
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Invoice Cancelled',
      description: 'Invoice has been cancelled successfully.',
    });
  });

  it('refreshes invoices after operations', async () => {
    // Mock responses
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'inv_123', status: 'created' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

    const { result } = renderHook(() => useInvoices(), {
      wrapper: TestWrapper,
    });

    const invoiceData = {
      amount: 100,
      currency: 'USD',
      email: 'test@example.com',
    };

    await act(async () => {
      await result.current.createInvoice(invoiceData);
    });

    // Should have called fetch twice - once for create, once for refresh
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});