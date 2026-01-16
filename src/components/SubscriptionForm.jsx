import { useEffect, useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';

export function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [websiteId, setWebsiteId] = useState('');

  const {
    websites,
    isSubscribing,
    subscriptionStatus,
    errorMessage,
    loadWebsites,
    subscribe,
  } = useSubscription();

  useEffect(() => {
    loadWebsites();
  }, [loadWebsites]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (websiteId && email) {
      subscribe(Number(websiteId), email);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Subscribe to Website</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium mb-1">
            Website
          </label>
          <select
            id="website"
            value={websiteId}
            onChange={(e) => setWebsiteId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a website</option>
            {websites.map((website) => (
              <option key={website.id} value={website.id}>
                {website.url}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubscribing}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSubscribing ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {subscriptionStatus === 'success' && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          Successfully subscribed!
        </div>
      )}

      {subscriptionStatus === 'error' && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
