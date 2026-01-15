import { useObservable } from '@ngneat/use-observable';
import {
  subscriptionStore,
  setWebsites,
  startSubscription,
  subscriptionSuccess,
  subscriptionError,
} from '../stores/subscriptionStore';
import { websiteApi, subscriptionApi } from '../services/api';

export function useSubscription() {
  const [state] = useObservable(subscriptionStore);

  const loadWebsites = async () => {
    try {
      const websites = await websiteApi.getAll();
      setWebsites(websites);
    } catch (error) {
      console.error('Failed to load websites:', error);
    }
  };

  const subscribe = async (websiteId, email) => {
    // Optimistic UI: immediately show success
    startSubscription({ websiteId, email });

    try {
      await subscriptionApi.subscribe(websiteId, email);
      subscriptionSuccess();
    } catch (error) {
      subscriptionError(error.message);
    }
  };

  const clearStatus = () => {
    subscriptionStore.update((state) => ({
      ...state,
      subscriptionStatus: null,
      errorMessage: null,
    }));
  };

  return {
    websites: state.websites,
    isLoadingWebsites: state.isLoadingWebsites,
    isSubscribing: state.isSubscribing,
    subscriptionStatus: state.subscriptionStatus,
    errorMessage: state.errorMessage,
    loadWebsites,
    subscribe,
    clearStatus,
  };
}
