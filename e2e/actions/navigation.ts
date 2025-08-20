import { Page, expect } from '@playwright/test';

const navigateToHomePage = async (page: Page) => {
  const link = page.getByRole('link', { name: 'Dashboard' });

  await expect(link).toHaveAttribute('href', '/');
  await link.click();

  await expect(page).toHaveURL('');
};
const navigateToAboutPage = async (page: Page) => {
  const link = page.getByRole('link', { name: 'About' });

  await expect(link).toHaveAttribute('href', '/about');
  await link.click();

  await expect(page).toHaveURL(/about/);
};

export const navigationActions = {
  navigateToHomePage,
  navigateToAboutPage,
};
