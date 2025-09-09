import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateInvoiceForm } from '../../components/CreateInvoiceForm';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '../../components/ui/tooltip';

// Mock the useInvoices hook
const mockCreateInvoice = vi.fn();
vi.mock('../../hooks/useInvoices', () => ({
  useInvoices: () => ({
    createInvoice: mockCreateInvoice,
    loading: false,
  }),
}));

// Mock the toast hook
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
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
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('CreateInvoiceForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with all required fields', () => {
    render(
      <TestWrapper>
        <CreateInvoiceForm />
      </TestWrapper>
    );

    expect(screen.getByText('Create Invoice')).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/customer email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create invoice/i })).toBeInTheDocument();
  });

  it('allows user to fill in form fields', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <CreateInvoiceForm />
      </TestWrapper>
    );

    // Fill in amount
    const amountInput = screen.getByLabelText(/amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, '100');

    // Fill in email
    const emailInput = screen.getByLabelText(/customer email/i);
    await user.type(emailInput, 'test@example.com');

    // Fill in name
    const nameInput = screen.getByLabelText(/customer name/i);
    await user.type(nameInput, 'John Doe');

    expect(amountInput).toHaveValue(100);
    expect(emailInput).toHaveValue('test@example.com');
    expect(nameInput).toHaveValue('John Doe');
  });

  it('validates required fields before submission', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <CreateInvoiceForm />
      </TestWrapper>
    );

    // Try to submit with empty fields
    const submitButton = screen.getByRole('button', { name: /create invoice/i });
    await user.click(submitButton);

    // Should not call createInvoice with invalid data
    expect(mockCreateInvoice).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockCreateInvoice.mockResolvedValue({});
    
    render(
      <TestWrapper>
        <CreateInvoiceForm />
      </TestWrapper>
    );

    // Fill in required fields
    const amountInput = screen.getByLabelText(/amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, '100');

    const emailInput = screen.getByLabelText(/customer email/i);
    await user.type(emailInput, 'test@example.com');

    const nameInput = screen.getByLabelText(/customer name/i);
    await user.type(nameInput, 'John Doe');

    const memoInput = screen.getByLabelText(/memo/i);
    await user.type(memoInput, 'Test invoice');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create invoice/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateInvoice).toHaveBeenCalledWith({
        amount: 100,
        currency: 'USD',
        email: 'test@example.com',
        name: 'John Doe',
        memo: 'Test invoice',
        dueDays: 30,
      });
    });
  });

  it('resets form after successful submission', async () => {
    const user = userEvent.setup();
    mockCreateInvoice.mockResolvedValue({});
    
    render(
      <TestWrapper>
        <CreateInvoiceForm />
      </TestWrapper>
    );

    // Fill in form
    const amountInput = screen.getByLabelText(/amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, '100');

    const emailInput = screen.getByLabelText(/customer email/i);
    await user.type(emailInput, 'test@example.com');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create invoice/i });
    await user.click(submitButton);

    // Wait for form to reset
    await waitFor(() => {
      expect(amountInput).toHaveValue(0);
      expect(emailInput).toHaveValue('');
    });
  });
});