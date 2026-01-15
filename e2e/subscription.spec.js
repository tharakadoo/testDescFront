import { test, expect } from '@playwright/test';

test.describe('Subscription Form', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API responses
    await page.route('**/api/websites', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { id: 1, url: 'https://example.com' },
            { id: 2, url: 'https://test.com' },
          ],
        }),
      });
    });

    await page.goto('/');
  });

  test('should display subscription form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /subscribe to website/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/website/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /subscribe/i })).toBeVisible();
  });

  test('should load websites in dropdown', async ({ page }) => {
    const select = page.getByLabel(/website/i);
    await expect(select).toBeVisible();

    // Click to open dropdown and check options
    await select.click();
    await expect(page.locator('option', { hasText: 'example.com' })).toHaveCount(1);
    await expect(page.locator('option', { hasText: 'test.com' })).toHaveCount(1);
  });

  test('should show success message on successful subscription', async ({ page }) => {
    // Mock successful subscription
    await page.route('**/api/websites/1/subscribe', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            user: { email: 'user@example.com' },
            website: { url: 'https://example.com' },
          },
        }),
      });
    });

    // Fill form
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/website/i).selectOption('1');

    // Submit
    await page.getByRole('button', { name: /subscribe/i }).click();

    // Check success message
    await expect(page.getByText(/successfully subscribed/i)).toBeVisible();
  });

  test('should show error message on failed subscription', async ({ page }) => {
    // Mock failed subscription
    await page.route('**/api/websites/1/subscribe', async (route) => {
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Already subscribed to this website',
        }),
      });
    });

    // Fill form
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/website/i).selectOption('1');

    // Submit
    await page.getByRole('button', { name: /subscribe/i }).click();

    // Check error message
    await expect(page.getByText(/already subscribed/i)).toBeVisible();
  });

  test('should show loading state while subscribing', async ({ page }) => {
    // Mock slow subscription
    await page.route('**/api/websites/1/subscribe', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: {} }),
      });
    });

    // Fill and submit
    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByLabel(/website/i).selectOption('1');
    await page.getByRole('button', { name: /subscribe/i }).click();

    // Check loading state
    await expect(page.getByRole('button', { name: /subscribing/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /subscribing/i })).toBeDisabled();
  });
});

test.describe('Subscription Form - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should be responsive on mobile', async ({ page }) => {
    await page.route('**/api/websites', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [{ id: 1, url: 'https://example.com' }],
        }),
      });
    });

    await page.goto('/');

    // Form should still be usable on mobile
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/website/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /subscribe/i })).toBeVisible();
  });
});
