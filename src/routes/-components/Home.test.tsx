import axiosClient from 'api/axios';
import { render, screen } from 'tests';

import { Home } from './Home';

const response = { status: 200, data: {} };
vitest.spyOn(axiosClient, 'get').mockResolvedValue(response);

describe('Home', () => {
  test('renders dashboard heading', async () => {
    render(<Home />);
    const element = await screen.findByText(/Dashboard/);
    expect(element).toBeInTheDocument();
  });

  test('renders welcome alert', async () => {
    render(<Home />);
    const welcomeTitle = await screen.findByText(/Welcome to Tick-Tock!/);
    const welcomeDescription = await screen.findByText(/Start by clicking "Log Today's Work"/);

    expect(welcomeTitle).toBeInTheDocument();
    expect(welcomeDescription).toBeInTheDocument();
  });

  test('renders navigation buttons', async () => {
    render(<Home />);
    const logWorkButton = await screen.findByRole('link', { name: /Log Today's Work/ });
    const calendarSolutionsButton = await screen.findByRole('link', { name: /Calendar Solutions/ });

    expect(logWorkButton).toBeInTheDocument();
    expect(calendarSolutionsButton).toBeInTheDocument();

    // Verify the buttons link to the correct pages
    expect(logWorkButton).toHaveAttribute('href', '/log-entry');
    expect(calendarSolutionsButton).toHaveAttribute('href', '/calendar-solutions');
  });

  test('renders status overview cards', async () => {
    render(<Home />);
    const weekCard = await screen.findByText(/This Week/);
    const monthCard = await screen.findByText(/This Month/);
    const draftCard = await screen.findByText(/Draft Entries/);

    expect(weekCard).toBeInTheDocument();
    expect(monthCard).toBeInTheDocument();
    expect(draftCard).toBeInTheDocument();
  });
});
