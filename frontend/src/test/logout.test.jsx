import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AUTH_STORAGE_KEY } from '../lib/authStorage';

describe('auth navigation', () => {
  it('removes the bearer token from storage on logout', async () => {
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        token: 'token-to-remove',
        user: { id: 'learner', role: 'learner' },
      }),
    );

    render(
      <MemoryRouter>
        <ThemeProvider>
          <AuthProvider>
            <NavBar />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    const logoutButtons = screen.getAllByRole('button', { name: /log out/i });
    expect(
      screen.getAllByRole('link', { name: /dashboard/i }).length,
    ).toBeGreaterThan(0);
    await userEvent.click(logoutButtons[0]);

    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(
      screen.queryByRole('link', { name: /dashboard/i }),
    ).not.toBeInTheDocument();
  });
});
