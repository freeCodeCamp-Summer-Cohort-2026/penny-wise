import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../App';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { getCurrentUser } from '../lib/api/penny-wise';

vi.mock('../lib/api/penny-wise', () => ({
  getCourses: vi.fn().mockResolvedValue({ courses: [] }),
  getCourse: vi.fn().mockResolvedValue({ course: null, learningState: null }),
  startLesson: vi.fn().mockResolvedValue({
    lesson: null,
    pages: [],
    progress: null,
  }),
  getCurrentUser: vi.fn(),
  clearImageCache: vi.fn(),
  logoutUser: vi.fn().mockResolvedValue({ success: true }),
}));

function renderApp(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

function getFooter() {
  return within(screen.getByRole('contentinfo'));
}

beforeEach(() => {
  vi.clearAllMocks();
  getCurrentUser.mockRejectedValue({ status: 401 });
});

describe('footer', () => {
  it('renders on the landing route with guest links', async () => {
    renderApp('/');

    await screen.findByRole('heading', { name: 'Budgeting' });
    const footer = getFooter();

    expect(
      footer.getByRole('link', { name: /Course catalog/ })
    ).toHaveAttribute('href', '/courses');
    expect(footer.getByRole('link', { name: /^Log in$/ })).toHaveAttribute(
      'href',
      '/login'
    );
    expect(footer.getByRole('link', { name: /^Sign up$/ })).toHaveAttribute(
      'href',
      '/signup'
    );
    expect(
      footer.getByText(new RegExp(`© ${new Date().getFullYear()} Penny Wise`))
    ).toBeInTheDocument();
  });

  it('renders on other routes too', async () => {
    renderApp('/courses');

    expect(
      await screen.findByRole('heading', {
        name: 'Find your next money skill',
      })
    ).toBeInTheDocument();
    expect(
      getFooter().getByRole('link', { name: /Course catalog/ })
    ).toBeTruthy();
  });

  it('swaps guest links for member links when authenticated', async () => {
    getCurrentUser.mockResolvedValue({
      user: { id: 'learner-1', role: 'learner' },
    });

    renderApp('/');

    const footer = getFooter();
    await screen.findAllByRole('link', { name: /Go to dashboard/ });

    expect(footer.getByRole('link', { name: /Dashboard/ })).toHaveAttribute(
      'href',
      '/dashboard'
    );
    expect(footer.getByRole('link', { name: /My profile/ })).toHaveAttribute(
      'href',
      '/profile'
    );
    expect(footer.queryByRole('link', { name: /^Log in$/ })).toBeNull();
  });
});
