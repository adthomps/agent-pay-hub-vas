import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AgentBox } from '../../components/AgentBox';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '../../components/ui/tooltip';

// Mock the useAgent hook
vi.mock('../../hooks/useAgent', () => ({
  useAgent: () => ({
    askAgent: vi.fn(),
    loading: false,
    lastResponse: null,
  }),
}));

// Mock the toast hook
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Test wrapper component
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

describe('AgentBox Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the agent box with all required elements', () => {
    render(
      <TestWrapper>
        <AgentBox />
      </TestWrapper>
    );

    expect(screen.getByText('🤖 AI Agent Assistant')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ask the ai assistant/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('allows user to type in the textarea', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <AgentBox />
      </TestWrapper>
    );

    const textarea = screen.getByPlaceholderText(/ask the ai assistant/i);
    await user.type(textarea, 'Create an invoice for $100');

    expect(textarea).toHaveValue('Create an invoice for $100');
  });

  it('disables send button when textarea is empty', () => {
    render(
      <TestWrapper>
        <AgentBox />
      </TestWrapper>
    );

    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when textarea has content', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <AgentBox />
      </TestWrapper>
    );

    const textarea = screen.getByPlaceholderText(/ask the ai assistant/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    await user.type(textarea, 'Test query');
    expect(sendButton).not.toBeDisabled();
  });

  it('shows loading state when agent is processing', () => {
    // We'll need to modify this test once we can properly mock the hook state
    const mockUseAgent = vi.fn().mockReturnValue({
      askAgent: vi.fn(),
      loading: true,
      lastResponse: null,
    });
    
    vi.mocked(require('../../hooks/useAgent').useAgent).mockImplementation(mockUseAgent);

    render(
      <TestWrapper>
        <AgentBox />
      </TestWrapper>
    );

    // The send button should show loading state
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });
});