import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages using footer links', async ({ page }) => {
    await page.goto('/');

    // Navigate to Terms
    await page.getByText('Regulamin').first().click();
    await expect(page).toHaveURL(/.*terms/);

    // Navigate back to home
    await page.goto('/');

    // Navigate to Privacy Policy
    await page.getByText('Polityka Prywatności').first().click();
    await expect(page).toHaveURL(/.*privacy-policy/);

    // Navigate back to home
    await page.goto('/');

    // Navigate to Terms of Service
    await page.getByText('Warunki Usługi').first().click();
    await expect(page).toHaveURL(/.*terms-of-service/);
  });

  test('should handle browser back button', async ({ page }) => {
    await page.goto('/');

    // Navigate to contact page
    await page.getByText('Kontakt').first().click();
    await expect(page).toHaveURL(/.*contact/);

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('should maintain layout consistency across pages', async ({ page }) => {
    const pages = ['/', '/terms', '/privacy-policy', '/contact'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      // Check that footer is present on all pages
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      // Check that the page has loaded completely
      await page.waitForLoadState('networkidle');
    }
  });

  test('should display copyright with current year on all pages', async ({ page }) => {
    const currentYear = new Date().getFullYear();
    const pages = ['/', '/terms', '/contact'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      const copyrightText = page.locator(`text=/© ${currentYear}/i`);
      await expect(copyrightText).toBeVisible();
    }
  });
});
