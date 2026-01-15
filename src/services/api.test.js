import { describe, it, expect, beforeEach, vi } from 'vitest';
import { websiteApi, subscriptionApi } from './api';

describe('API Services', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  describe('websiteApi', () => {
    describe('getAll', () => {
      it('should fetch all websites', async () => {
        const mockWebsites = [
          { id: 1, url: 'https://example.com' },
          { id: 2, url: 'https://test.com' },
        ];

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: mockWebsites }),
        });

        const result = await websiteApi.getAll();

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/websites'),
          expect.objectContaining({ method: 'GET' })
        );
        expect(result).toEqual(mockWebsites);
      });

      it('should throw error on failed request', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ message: 'Server error' }),
        });

        await expect(websiteApi.getAll()).rejects.toThrow('Server error');
      });
    });
  });

  describe('subscriptionApi', () => {
    describe('subscribe', () => {
      it('should post subscription request', async () => {
        const mockResponse = {
          user: { email: 'user@example.com' },
          website: { url: 'https://example.com' },
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: mockResponse }),
        });

        const result = await subscriptionApi.subscribe(1, 'user@example.com');

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/websites/1/subscribe'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({ email: 'user@example.com' }),
          })
        );
        expect(result).toEqual(mockResponse);
      });

      it('should throw error with message on validation failure', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 422,
          json: () => Promise.resolve({ message: 'Already subscribed to this website' }),
        });

        await expect(subscriptionApi.subscribe(1, 'user@example.com')).rejects.toThrow(
          'Already subscribed to this website'
        );
      });

      it('should throw error on network failure', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(subscriptionApi.subscribe(1, 'user@example.com')).rejects.toThrow(
          'Network error'
        );
      });
    });
  });
});
