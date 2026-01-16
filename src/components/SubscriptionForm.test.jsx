import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubscriptionForm } from './SubscriptionForm';
import * as useSubscriptionModule from '../hooks/useSubscription';

vi.mock('../hooks/useSubscription');

describe('SubscriptionForm', () => {
  const mockUseSubscription = {
    websites: [],
    isLoadingWebsites: false,
    isSubscribing: false,
    subscriptionStatus: null,
    errorMessage: null,
    loadWebsites: vi.fn(),
    subscribe: vi.fn(),
    clearStatus: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useSubscriptionModule.useSubscription.mockReturnValue(mockUseSubscription);
  });

  describe('rendering', () => {
    it('should render form elements', () => {
      render(<SubscriptionForm />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/website/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    });

    it('should load websites on mount', () => {
      render(<SubscriptionForm />);

      expect(mockUseSubscription.loadWebsites).toHaveBeenCalledTimes(1);
    });

    it('should render website options', () => {
      useSubscriptionModule.useSubscription.mockReturnValue({
        ...mockUseSubscription,
        websites: [
          { id: 1, url: 'https://example.com' },
          { id: 2, url: 'https://test.com' },
        ],
      });

      render(<SubscriptionForm />);

      expect(screen.getByRole('option', { name: /example\.com/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /test\.com/i })).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('should call subscribe with form values', async () => {
      const user = userEvent.setup();
      useSubscriptionModule.useSubscription.mockReturnValue({
        ...mockUseSubscription,
        websites: [{ id: 1, url: 'https://example.com' }],
      });

      render(<SubscriptionForm />);

      await user.type(screen.getByLabelText(/email/i), 'user@example.com');
      await user.selectOptions(screen.getByLabelText(/website/i), '1');
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      expect(mockUseSubscription.subscribe).toHaveBeenCalledWith(1, 'user@example.com');
    });

    it('should disable button while subscribing', () => {
      useSubscriptionModule.useSubscription.mockReturnValue({
        ...mockUseSubscription,
        isSubscribing: true,
      });

      render(<SubscriptionForm />);

      expect(screen.getByRole('button', { name: /subscribing/i })).toBeDisabled();
    });
  });

  describe('status messages', () => {
    it('should show success message', () => {
      useSubscriptionModule.useSubscription.mockReturnValue({
        ...mockUseSubscription,
        subscriptionStatus: 'success',
      });

      render(<SubscriptionForm />);

      expect(screen.getByText(/successfully subscribed/i)).toBeInTheDocument();
    });

    it('should show error message', () => {
      useSubscriptionModule.useSubscription.mockReturnValue({
        ...mockUseSubscription,
        subscriptionStatus: 'error',
        errorMessage: 'Already subscribed',
      });

      render(<SubscriptionForm />);

      expect(screen.getByText(/already subscribed/i)).toBeInTheDocument();
    });
  });
});
