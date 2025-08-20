import { test, expect } from '@playwright/test';

import { homePageActions } from '../actions/homePage';
import { navigationActions } from '../actions/navigation';

test.describe('Home Page', () => {
  test('should load the dashboard and display main elements', async ({ page }) => {
    await homePageActions.openHomePage(page);

    // Verify main dashboard elements are present
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Track your time and manage your work logs')).toBeVisible();
    await expect(page.getByText('Welcome to Tick-Tock!')).toBeVisible();

    // Verify navigation buttons are present
    await expect(page.getByRole('link', { name: /Log Today's Work/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Calendar Solutions/ })).toBeVisible();

    // Verify status cards are present
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'This Week' })).toBeVisible();
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'This Month' })).toBeVisible();
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Draft Entries' })).toBeVisible();
  });

  test('should navigate to the about page', async ({ page }) => {
    await homePageActions.openHomePage(page);
    await navigationActions.navigateToAboutPage(page);

    // Verify we're on the about page
    await expect(page.getByRole('heading', { name: 'About Tick-Tock' })).toBeVisible();
  });

  test('should navigate to the home page from other page', async ({ page }) => {
    await homePageActions.openHomePage(page);
    await navigationActions.navigateToAboutPage(page);
    await navigationActions.navigateToHomePage(page);

    // Verify we're back on the dashboard
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('should have working navigation buttons', async ({ page }) => {
    await homePageActions.openHomePage(page);

    // Check Log Today's Work button
    const logWorkButton = page.getByRole('link', { name: /Log Today's Work/ });
    await expect(logWorkButton).toHaveAttribute('href', '/log-entry');

    // Check Calendar Solutions button
    const calendarButton = page.getByRole('link', { name: /Calendar Solutions/ });
    await expect(calendarButton).toHaveAttribute('href', '/calendar-solutions');
  });
});
