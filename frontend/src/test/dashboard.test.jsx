import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../context/AuthContext';
import { AUTH_STORAGE_KEY } from '../lib/authStorage';
import { getCourses, getCurrentUser } from '../lib/api/penny-wise';

vi.mock('../lib/api/penny-wise', () => ({
  getCourses: vi.fn(),
  getCurrentUser: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  getCourses.mockResolvedValue({
    courses: [
      {
        _id: 'course-1',
        name: 'Money Basics',
        lessonCount: 3,
        totalEstimatedDurationInMinutes: 30,
      },
    ],
  });
});

function renderDashboard() {
  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      token: 'token',
      user: { id: 'learner', role: 'learner' },
    }),
  );
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('learner dashboard', () => {
  it('renders the backend resume and real learner stats', async () => {
    getCurrentUser.mockResolvedValue({
      user: { displayName: 'Sara', experience: 120 },
      learning: {
        resume: {
          courseId: 'course-1',
          courseName: 'Money Basics',
          lessonId: 'lesson-2',
          lessonName: 'Counting value',
          pageNumber: 2,
          totalPages: 3,
        },
        enrolledCourseIds: ['course-1'],
        completedCourseIds: [],
        completedLessons: [{ lessonId: 'lesson-1' }],
      },
    });

    renderDashboard();

    expect(await screen.findByText('Counting value')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /resume lesson/i }),
    ).toHaveAttribute('href', '/courses/course-1/lessons/lesson-2');
    expect(screen.getByText('120 XP')).toBeInTheDocument();
    expect(
      screen.getByText('Lessons completed').parentElement,
    ).toHaveTextContent('1');
    expect(
      screen.getByText('Courses enrolled').parentElement,
    ).toHaveTextContent('1');
  });

  it('does not show an empty catalog when course loading fails', async () => {
    getCourses.mockRejectedValue(new Error('Catalog unavailable'));
    getCurrentUser.mockResolvedValue({
      user: { displayName: 'Kofi', experience: 0 },
      learning: {
        resume: null,
        enrolledCourseIds: [],
        completedCourseIds: [],
        completedLessons: [],
      },
    });

    renderDashboard();

    expect(await screen.findByText('Catalog unavailable')).toBeInTheDocument();
    expect(
      screen.queryByText('No published courses are available right now.'),
    ).not.toBeInTheDocument();
  });

  it('uses a browse empty state when the server has no resume', async () => {
    getCurrentUser.mockResolvedValue({
      user: { displayName: 'Kofi', experience: 0 },
      learning: {
        resume: null,
        enrolledCourseIds: [],
        completedCourseIds: [],
        completedLessons: [],
      },
    });

    renderDashboard();

    expect(
      await screen.findByText('No lesson is waiting for you'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /browse courses/i }),
    ).toHaveAttribute('href', '/courses');
  });
});
