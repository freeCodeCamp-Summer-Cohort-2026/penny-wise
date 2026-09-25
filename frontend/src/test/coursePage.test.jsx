import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CoursePage from '../pages/CoursePage';
import { AuthProvider } from '../context/AuthContext';
import { AUTH_STORAGE_KEY } from '../lib/authStorage';
import { enrollInCourse, getCourse } from '../lib/api/penny-wise';

vi.mock('../lib/api/penny-wise', () => ({
  getCourse: vi.fn(),
  enrollInCourse: vi.fn(),
}));

const course = {
  _id: 'course-1',
  name: 'Money Basics',
  published: true,
  lessons: [
    {
      _id: 'lesson-1',
      name: 'What is money?',
      description: 'Start here.',
      experience: 10,
      estimatedDurationOfCompletionInMinutes: 8,
    },
    {
      _id: 'lesson-2',
      name: 'Counting value',
      description: 'Then count.',
      experience: 15,
      estimatedDurationOfCompletionInMinutes: 10,
    },
  ],
  lessonCount: 2,
  totalEstimatedDurationInMinutes: 18,
};

function renderCourse(learningState, auth = null) {
  if (auth) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  }
  getCourse.mockResolvedValue({ course, learningState });
  return render(
    <MemoryRouter initialEntries={['/courses/course-1']}>
      <AuthProvider>
        <Routes>
          <Route path='/courses/:courseId' element={<CoursePage />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

describe('course detail enrollment states', () => {
  it('shows login enrollment for an anonymous visitor', async () => {
    renderCourse(null);

    expect(
      await screen.findByRole('link', { name: /log in to enroll/i }),
    ).toHaveAttribute('href', '/login');
    expect(screen.getByText('What is money?')).toBeInTheDocument();
  });

  it('enrolls a learner and exposes the start action', async () => {
    const auth = { token: 'token', user: { id: 'learner', role: 'learner' } };
    enrollInCourse.mockResolvedValue({
      course,
      learningState: {
        enrolled: true,
        status: 'in_progress',
        completedLessonIds: [],
        totalLessons: 2,
        progressPercent: 0,
        hasStarted: false,
        firstLessonId: 'lesson-1',
        resumeLessonId: 'lesson-1',
      },
    });

    renderCourse(
      {
        enrolled: false,
        status: 'not_enrolled',
        completedLessonIds: [],
        totalLessons: 2,
        progressPercent: 0,
        firstLessonId: 'lesson-1',
        resumeLessonId: 'lesson-1',
      },
      auth,
    );

    await userEvent.click(
      await screen.findByRole('button', { name: 'Enroll' }),
    );

    expect(
      await screen.findByRole('link', { name: 'Start course' }),
    ).toHaveAttribute('href', '/courses/course-1/lessons/lesson-1');
    expect(enrollInCourse).toHaveBeenCalledWith('course-1');
  });

  it('shows continue when a lesson is started before first completion', async () => {
    renderCourse(
      {
        enrolled: true,
        status: 'in_progress',
        completedLessonIds: [],
        totalLessons: 2,
        progressPercent: 0,
        hasStarted: true,
        firstLessonId: 'lesson-1',
        resumeLessonId: 'lesson-1',
      },
      { token: 'token', user: { id: 'learner', role: 'learner' } },
    );

    expect(
      await screen.findByRole('link', { name: 'Continue' }),
    ).toHaveAttribute('href', '/courses/course-1/lessons/lesson-1');
  });

  it('shows continue and accessible backend progress for an in-progress learner', async () => {
    renderCourse(
      {
        enrolled: true,
        status: 'in_progress',
        completedLessonIds: ['lesson-1'],
        totalLessons: 2,
        progressPercent: 50,
        hasStarted: true,
        firstLessonId: 'lesson-1',
        resumeLessonId: 'lesson-2',
      },
      { token: 'token', user: { id: 'learner', role: 'learner' } },
    );

    expect(
      await screen.findByRole('link', { name: 'Continue' }),
    ).toHaveAttribute('href', '/courses/course-1/lessons/lesson-2');
    const progress = screen.getByRole('progressbar', {
      name: /Money Basics progress/i,
    });
    expect(progress).toHaveAttribute('aria-valuenow', '50');
  });

  it('shows a completed review state', async () => {
    renderCourse(
      {
        enrolled: true,
        status: 'completed',
        completedLessonIds: ['lesson-1', 'lesson-2'],
        totalLessons: 2,
        progressPercent: 100,
        firstLessonId: 'lesson-1',
        resumeLessonId: 'lesson-1',
      },
      { token: 'token', user: { id: 'learner', role: 'learner' } },
    );

    expect(await screen.findByText('Course complete')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Review course' }),
    ).toBeInTheDocument();
  });

  it('does not offer enrollment to authors', async () => {
    renderCourse(null, {
      token: 'token',
      user: { id: 'author', role: 'author' },
    });

    expect(
      await screen.findByText(/only learners can enroll/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Enroll' }),
    ).not.toBeInTheDocument();
  });
});
