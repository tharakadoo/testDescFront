import { describe, it, expect, beforeEach } from 'vitest';
import {
  subscriptionStore,
  setWebsites,
  startSubscription,
  subscriptionSuccess,
  subscriptionError,
  resetStore,
} from './subscriptionStore';

describe('subscriptionStore', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('initial state', () => {
    it('should have empty websites array', () => {
      const state = subscriptionStore.getValue();
      expect(state.websites).toEqual([]);
    });

    it('should not be loading initially', () => {
      const state = subscriptionStore.getValue();
      expect(state.isLoadingWebsites).toBe(false);
      expect(state.isSubscribing).toBe(false);
    });

    it('should have null status and error', () => {
      const state = subscriptionStore.getValue();
      expect(state.subscriptionStatus).toBeNull();
      expect(state.errorMessage).toBeNull();
    });
  });

  describe('setWebsites', () => {
    it('should set websites array', () => {
      const websites = [
        { id: 1, url: 'https://example.com' },
        { id: 2, url: 'https://test.com' },
      ];

      setWebsites(websites);

      const state = subscriptionStore.getValue();
      expect(state.websites).toEqual(websites);
    });
  });

  describe('optimistic UI flow', () => {
    it('should set optimistic success on startSubscription', () => {
      const subscription = { websiteId: 1, email: 'user@example.com' };

      startSubscription(subscription);

      const state = subscriptionStore.getValue();
      expect(state.isSubscribing).toBe(true);
      expect(state.subscriptionStatus).toBe('success');
      expect(state.optimisticSubscription).toEqual(subscription);
    });

    it('should confirm success on subscriptionSuccess', () => {
      startSubscription({ websiteId: 1, email: 'user@example.com' });

      subscriptionSuccess();

      const state = subscriptionStore.getValue();
      expect(state.isSubscribing).toBe(false);
      expect(state.subscriptionStatus).toBe('success');
      expect(state.optimisticSubscription).toBeNull();
    });

    it('should revert to error on subscriptionError', () => {
      startSubscription({ websiteId: 1, email: 'user@example.com' });

      subscriptionError('Already subscribed');

      const state = subscriptionStore.getValue();
      expect(state.isSubscribing).toBe(false);
      expect(state.subscriptionStatus).toBe('error');
      expect(state.errorMessage).toBe('Already subscribed');
      expect(state.optimisticSubscription).toBeNull();
    });
  });
});
