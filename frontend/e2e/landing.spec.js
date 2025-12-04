import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check if the page title or main heading is visible
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');

    // Check for common navigation elements
    const navbar = page.locator('nav, header').first();
    await expect(navbar).toBeVisible();
  });

  test('should have a footer with links', async ({ page }) => {
    await page.goto('/');

    // Check footer exists
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check footer links
    const termsLink = footer.getByText('Regulamin');
    const privacyLink = footer.getByText('Polityka Prywatności');
    const contactLink = footer.getByText('Kontakt');

    await expect(termsLink).toBeVisible();
    await expect(privacyLink).toBeVisible();
    await expect(contactLink).toBeVisible();
  });

  test('should navigate to terms page when clicking terms link', async ({ page }) => {
    await page.goto('/');

    const termsLink = page.getByText('Regulamin').first();
    await termsLink.click();

    // Wait for navigation
    await page.waitForURL('**/terms');

    // Check if we're on the terms page
    expect(page.url()).toContain('/terms');
  });

  test('should navigate to contact page when clicking contact link', async ({ page }) => {
    await page.goto('/');

    const contactLink = page.getByText('Kontakt').first();
    await contactLink.click();

    // Wait for navigation
    await page.waitForURL('**/contact');

    // Check if we're on the contact page
    expect(page.url()).toContain('/contact');
  });

  test('should display SmartSaver branding', async ({ page }) => {
    await page.goto('/');

    // Check for SmartSaver branding elements
    const branding = page.locator('text=/Smart.*aver/i').first();
    await expect(branding).toBeVisible();
  });
});
