import { createStore, withProps } from '@ngneat/elf';

const initialState = {
  websites: [],
  isLoadingWebsites: false,
  isSubscribing: false,
  subscriptionStatus: null,
  errorMessage: null,
  optimisticSubscription: null,
};

export const subscriptionStore = createStore(
  { name: 'subscription' },
  withProps(initialState)
);

export function setWebsites(websites) {
  subscriptionStore.update((state) => ({
    ...state,
    websites,
    isLoadingWebsites: false,
  }));
}

export function startSubscription(subscription) {
  subscriptionStore.update((state) => ({
    ...state,
    isSubscribing: true,
    subscriptionStatus: 'success',
    errorMessage: null,
    optimisticSubscription: subscription,
  }));
}

export function subscriptionSuccess() {
  subscriptionStore.update((state) => ({
    ...state,
    isSubscribing: false,
    subscriptionStatus: 'success',
    optimisticSubscription: null,
  }));
}

export function subscriptionError(message) {
  subscriptionStore.update((state) => ({
    ...state,
    isSubscribing: false,
    subscriptionStatus: 'error',
    errorMessage: message,
    optimisticSubscription: null,
  }));
}

export function resetStore() {
  subscriptionStore.update(() => initialState);
}
