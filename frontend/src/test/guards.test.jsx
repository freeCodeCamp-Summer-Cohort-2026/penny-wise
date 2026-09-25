import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AppRoutes } from '../App';
import RequireAuth from '../components/RequireAuth';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { AUTH_STORAGE_KEY } from '../lib/authStorage';

vi.mock('../lib/api/penny-wise', () => ({
  getCourses: vi.fn().mockResolvedValue({ courses: [] }),
  getCourse: vi.fn().mockResolvedValue({ course: null, learningState: null }),
  startLesson: vi.fn().mockResolvedValue({
    lesson: null,
    pages: [],
    progress: null,
  }),
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

function renderGuard(path, auth, allowedRole) {
  if (auth) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
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
  window.localStorage.clear();
});

describe('route guards and legacy redirects', () => {
  it('redirects anonymous users to login', () => {
    renderGuard('/private');

    expect(screen.getByText('Login destination')).toBeInTheDocument();
  });

  it('renders protected content for an authenticated user', () => {
    renderGuard('/private', { token: 'token', user: { id: 'learner' } });

    expect(screen.getByText('Private destination')).toBeInTheDocument();
  });

  it('denies authenticated users with the wrong role', () => {
    renderGuard(
      '/private',
      { token: 'token', user: { id: 'author', role: 'author' } },
      'learner',
    );

    expect(screen.getByText('This area is for learners')).toBeInTheDocument();
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
