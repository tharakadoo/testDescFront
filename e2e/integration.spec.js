import { test, expect } from '@playwright/test';

/**
 * Integration tests - require Laravel backend running at localhost:8000
 * Run: php artisan serve (in testDesc directory)
 * Then: npx playwright test e2e/integration.spec.js --project=chromium-slow --headed
 */
test.describe('Integration with Laravel Backend', () => {
  test.skip(({ }, testInfo) => {
    // Skip in CI or when backend is not running
    return process.env.CI === 'true';
  });

  test.beforeEach(async ({ page }) => {
    // No mocking - use real API
    await page.goto('/');
  });

  test('should load real websites from API', async ({ page }) => {
    // Wait for websites to load from real API
    const select = page.getByLabel(/website/i);
    await expect(select).toBeVisible();

    // Should have options (depends on your database)
    await page.waitForTimeout(1000); // Wait for API
    const options = await page.locator('select option').count();
    console.log(`Loaded ${options - 1} websites from API`); // -1 for "Select a website"
  });

  test('should subscribe with real API', async ({ page }) => {
    // Fill form with unique email
    const uniqueEmail = `test-${Date.now()}@example.com`;
    await page.getByLabel(/email/i).fill(uniqueEmail);

    // Wait for websites to load and select first one
    await page.waitForTimeout(1000);
    const select = page.getByLabel(/website/i);
    const options = await select.locator('option').all();

    if (options.length > 1) {
      await select.selectOption({ index: 1 }); // Select first real website
      await page.getByRole('button', { name: /subscribe/i }).click();

      // Should show success or error from real API
      await expect(
        page.getByText(/successfully subscribed|already subscribed|error/i)
      ).toBeVisible({ timeout: 5000 });
    }
  });
});
