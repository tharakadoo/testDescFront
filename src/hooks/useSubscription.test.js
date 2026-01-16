import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSubscription } from './useSubscription';
import { resetStore } from '../stores/subscriptionStore';
import * as api from '../services/api';

vi.mock('../services/api');

describe('useSubscription', () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state values', () => {
      const { result } = renderHook(() => useSubscription());

      expect(result.current.websites).toEqual([]);
      expect(result.current.isLoadingWebsites).toBe(false);
      expect(result.current.isSubscribing).toBe(false);
      expect(result.current.subscriptionStatus).toBeNull();
      expect(result.current.errorMessage).toBeNull();
    });
  });

  describe('loadWebsites', () => {
    it('should load websites from API', async () => {
      const mockWebsites = [
        { id: 1, url: 'https://example.com' },
        { id: 2, url: 'https://test.com' },
      ];
      api.websiteApi.getAll.mockResolvedValueOnce(mockWebsites);

      const { result } = renderHook(() => useSubscription());

      await act(async () => {
        await result.current.loadWebsites();
      });

      expect(result.current.websites).toEqual(mockWebsites);
    });
  });

  describe('subscribe', () => {
    it('should show optimistic success immediately', async () => {
      api.subscriptionApi.subscribe.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { result } = renderHook(() => useSubscription());

      act(() => {
        result.current.subscribe(1, 'user@example.com');
      });

      // Optimistic: immediately shows success
      expect(result.current.subscriptionStatus).toBe('success');
      expect(result.current.isSubscribing).toBe(true);
    });

    it('should confirm success after API resolves', async () => {
      api.subscriptionApi.subscribe.mockResolvedValueOnce({});

      const { result } = renderHook(() => useSubscription());

      await act(async () => {
        await result.current.subscribe(1, 'user@example.com');
      });

      expect(result.current.subscriptionStatus).toBe('success');
      expect(result.current.isSubscribing).toBe(false);
    });

    it('should revert to error on API failure', async () => {
      api.subscriptionApi.subscribe.mockRejectedValueOnce(
        new Error('Already subscribed')
      );

      const { result } = renderHook(() => useSubscription());

      await act(async () => {
        await result.current.subscribe(1, 'user@example.com');
      });

      expect(result.current.subscriptionStatus).toBe('error');
      expect(result.current.errorMessage).toBe('Already subscribed');
      expect(result.current.isSubscribing).toBe(false);
    });
  });

  describe('clearStatus', () => {
    it('should clear subscription status and error', async () => {
      api.subscriptionApi.subscribe.mockRejectedValueOnce(
        new Error('Already subscribed')
      );

      const { result } = renderHook(() => useSubscription());

      await act(async () => {
        await result.current.subscribe(1, 'user@example.com');
      });

      expect(result.current.subscriptionStatus).toBe('error');

      act(() => {
        result.current.clearStatus();
      });

      expect(result.current.subscriptionStatus).toBeNull();
      expect(result.current.errorMessage).toBeNull();
    });
  });
});
