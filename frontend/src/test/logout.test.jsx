import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { getCurrentUser, logoutUser } from '../lib/api/penny-wise';

vi.mock('../lib/api/penny-wise', () => ({
  getCurrentUser: vi.fn(),
  clearImageCache: vi.fn(),
  logoutUser: vi.fn(),
}));

describe('auth navigation', () => {
  it('ends the cookie session on logout', async () => {
    getCurrentUser.mockResolvedValue({
      user: { id: 'learner', role: 'learner' },
    });
    logoutUser.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <ThemeProvider>
          <AuthProvider>
            <NavBar />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    const logoutButton = (
      await screen.findAllByRole('button', { name: /log out/i })
    )[0];
    expect(
      screen.getAllByRole('link', { name: /dashboard/i }).length,
    ).toBeGreaterThan(0);

    await userEvent.click(logoutButton);

    expect(logoutUser).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole('link', { name: /dashboard/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('link', { name: /log in/i }).length,
    ).toBeGreaterThan(0);
  });
});
