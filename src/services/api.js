const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data.data;
}

export const websiteApi = {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/api/websites`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    return handleResponse(response);
  },
};

export const subscriptionApi = {
  async subscribe(websiteId, email) {
    const response = await fetch(`${API_BASE_URL}/api/websites/${websiteId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return handleResponse(response);
  },
};
