import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/testdescfront/);
  });

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Page should still be visible and functional
    await expect(page.locator('#root')).toBeVisible();
  });
});
