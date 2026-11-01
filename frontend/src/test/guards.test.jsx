import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppRoutes } from '../App';
import RequireAuth from '../components/RequireAuth';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
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
    </MemoryRouter>,
  );
}

function renderGuard(path, user, allowedRole) {
  if (user) {
    getCurrentUser.mockResolvedValue({ user });
  } else {
    getCurrentUser.mockRejectedValue({ status: 401 });
  }

  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route
            path='/private'
            element={
              <RequireAuth allowedRole={allowedRole}>
                <div>Private destination</div>
              </RequireAuth>
            }
          />
          <Route path='/login' element={<div>Login destination</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  getCurrentUser.mockRejectedValue({ status: 401 });
});

describe('route guards and legacy redirects', () => {
  it('redirects anonymous users to login', async () => {
    renderGuard('/private');

    expect(await screen.findByText('Login destination')).toBeInTheDocument();
  });

  it('renders protected content for an authenticated user', async () => {
    renderGuard('/private', { id: 'learner', role: 'learner' });

    expect(await screen.findByText('Private destination')).toBeInTheDocument();
  });

  it('denies authenticated users with the wrong role', async () => {
    renderGuard('/private', { id: 'author', role: 'author' }, 'learner');

    expect(
      await screen.findByText('This area is for learners'),
    ).toBeInTheDocument();
    expect(screen.queryByText('Private destination')).not.toBeInTheDocument();
  });

  it.each([
    '/coursecatalog',
    '/modules',
    '/modules/2',
    '/modules/2/course/course-9',
  ])('redirects %s to the new catalog', async (path) => {
    renderApp(path);

    expect(
      await screen.findByRole('heading', {
        name: 'Find your next money skill',
      }),
    ).toBeInTheDocument();
  });
});
