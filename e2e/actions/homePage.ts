import { Page, expect } from '@playwright/test';

const openHomePage = async (page: Page) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/React App/);
  // Target the specific Dashboard heading by its text content and styling
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
};

export const homePageActions = {
  openHomePage,
};
