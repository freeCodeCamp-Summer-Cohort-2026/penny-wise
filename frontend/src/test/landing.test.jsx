import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

beforeEach(() => {
  vi.clearAllMocks();
  getCurrentUser.mockRejectedValue({ status: 401 });
});

describe('landing page', () => {
  it('introduces the app with calls to action', async () => {
    renderApp('/');

    expect(
      await screen.findByRole('heading', {
        name: /Learn through byte-sized lessons and lab/,
      })
    ).toBeInTheDocument();

    const startLinks = screen.getAllByRole('link', {
      name: /Start learning free/,
    });
    expect(startLinks[0]).toHaveAttribute('href', '/signup');
    expect(
      screen.getAllByRole('link', { name: /Browse courses/ })[0]
    ).toHaveAttribute('href', '/courses');
  });

  it('shows course topics with illustrations and explainer sections', async () => {
    renderApp('/');

    expect(
      await screen.findByRole('heading', {
        name: /Everything you need to get money under control/,
      })
    ).toBeInTheDocument();

    for (const topic of [
      'Budgeting',
      'Banking and credit',
      'Big goals',
      'How money moves',
    ]) {
      expect(screen.getByRole('heading', { name: topic })).toBeInTheDocument();
    }

    expect(
      screen.getAllByRole('heading', { name: 'Get started today' }).length
    ).toBeGreaterThan(0);
  });

  it('lists the benefit cards', async () => {
    renderApp('/');

    expect(
      await screen.findByRole('heading', { name: 'Build your first budget' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'The Big Goal' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'The Price Tag' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Life Simulation' })
    ).toBeInTheDocument();
  });

  it('points learners to the dashboard once signed in', async () => {
    getCurrentUser.mockResolvedValue({
      user: { id: 'learner-1', role: 'learner' },
    });

    renderApp('/');

    const dashboardLinks = await screen.findAllByRole('link', {
      name: /Go to dashboard/,
    });
    expect(dashboardLinks[0]).toHaveAttribute('href', '/dashboard');
    expect(
      screen.queryByRole('link', { name: /Start learning free/ })
    ).not.toBeInTheDocument();
  });
});
