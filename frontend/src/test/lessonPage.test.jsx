import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LessonPage from '../pages/LessonPage';
import {
  getCourse,
  startLesson,
  submitLessonPage,
} from '../lib/api/penny-wise';
import { AuthProvider } from '../context/AuthContext';
import { AUTH_STORAGE_KEY } from '../lib/authStorage';

vi.mock('../lib/api/penny-wise', () => ({
  getCourse: vi.fn(),
  startLesson: vi.fn(),
  submitLessonPage: vi.fn(),
}));

const course = {
  _id: 'course-1',
  name: 'Money Basics',
  lessons: [
    {
      _id: 'lesson-1',
      name: 'What is money?',
      estimatedDurationOfCompletionInMinutes: 8,
    },
    {
      _id: 'lesson-2',
      name: 'Counting value',
      estimatedDurationOfCompletionInMinutes: 10,
    },
  ],
};

const lesson = {
  _id: 'lesson-1',
  name: 'What is money?',
  description: 'Build the basics.',
  experience: 10,
  estimatedDurationOfCompletionInMinutes: 8,
};

const page = {
  _id: 'page-1',
  type: 'multiple_choice',
  text: 'Which option describes money?',
  options: [
    { index: 0, answerText: 'A way to trade value' },
    { index: 1, answerText: 'A picture of money' },
  ],
};

function initialProgress(overrides = {}) {
  return {
    state: 'in_progress',
    currentPage: 0,
    score: 0,
    totalPages: 1,
    completedPages: 0,
    pageResults: [],
    ...overrides,
  };
}

function renderLesson() {
  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      token: 'token',
      user: { id: 'learner-1', role: 'learner' },
    }),
  );
  return render(
    <MemoryRouter initialEntries={['/courses/course-1/lessons/lesson-1']}>
      <AuthProvider>
        <Routes>
          <Route
            path='/courses/:courseId/lessons/:lessonId'
            element={<LessonPage />}
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  getCourse.mockResolvedValue({ course, learningState: null });
});

describe('lesson player', () => {
  it('advances to the next activity only after explicit Continue', async () => {
    const nextPage = {
      _id: 'page-2',
      type: 'multiple_choice',
      text: 'What should you do next?',
      options: [
        { index: 0, answerText: 'Check the budget' },
        { index: 1, answerText: 'Ignore the goal' },
      ],
    };
    startLesson.mockResolvedValue({
      lesson,
      pages: [page, nextPage],
      progress: initialProgress({ totalPages: 2 }),
    });
    submitLessonPage.mockResolvedValue({
      result: { correct: true, satisfied: true },
      progress: initialProgress({
        currentPage: 1,
        score: 1,
        totalPages: 2,
        completedPages: 1,
        pageResults: [
          { pageId: 'page-1', satisfied: true, firstAttemptCorrect: true },
        ],
      }),
      completion: null,
    });

    renderLesson();

    await userEvent.click(
      await screen.findByRole('radio', { name: 'A way to trade value' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(
      await screen.findByRole('button', { name: 'Continue' }),
    ).toBeEnabled();

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(
      await screen.findByText('What should you do next?'),
    ).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
  });

  it('shows immediate retry feedback, then explicit Continue after a correct answer', async () => {
    startLesson.mockResolvedValue({
      lesson,
      pages: [page],
      progress: initialProgress(),
    });
    submitLessonPage
      .mockResolvedValueOnce({
        result: { correct: false, feedback: 'Not quite. Try again.' },
        progress: initialProgress({
          pageResults: [
            { pageId: 'page-1', satisfied: false, firstAttemptCorrect: false },
          ],
        }),
        completion: null,
      })
      .mockResolvedValueOnce({
        result: { correct: true },
        progress: initialProgress({
          state: 'completed',
          score: 1,
          completedPages: 1,
          pageResults: [
            { pageId: 'page-1', satisfied: true, firstAttemptCorrect: true },
          ],
          completedAt: '2026-01-01',
        }),
        completion: {
          completed: true,
          score: 1,
          totalPages: 1,
          xpEarned: 10,
          courseCompleted: false,
          nextLesson: { lessonId: 'lesson-2', name: 'Counting value' },
        },
      });

    renderLesson();

    expect(
      await screen.findByText('Which option describes money?'),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('radio', { name: 'A picture of money' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(
      await screen.findByText('Not quite. Try again.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Change your answer and try again.'),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('radio', { name: 'A way to trade value' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Check answer' }));

    expect(await screen.findByText('Lesson complete')).toBeInTheDocument();
    expect(screen.getByText('1 / 1')).toBeInTheDocument();
    expect(screen.getByText('10 XP', { selector: 'dd' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /continue to next lesson/i }),
    ).toHaveAttribute('href', '/courses/course-1/lessons/lesson-2');
  });

  it('does not reset a reopened completed lesson', async () => {
    startLesson.mockResolvedValue({
      lesson,
      pages: [page],
      progress: initialProgress({
        state: 'completed',
        currentPage: null,
        score: 1,
        completedPages: 1,
        pageResults: [
          { pageId: 'page-1', satisfied: true, firstAttemptCorrect: true },
        ],
        completedAt: '2026-01-01',
      }),
      completion: {
        completed: true,
        score: 1,
        totalPages: 1,
        xpEarned: 10,
        newlyAwarded: false,
        courseCompleted: true,
        nextLesson: null,
      },
    });

    getCourse.mockResolvedValue({
      course,
      learningState: {
        enrolled: true,
        status: 'completed',
        completedLessonIds: ['lesson-1', 'lesson-2'],
        totalLessons: 2,
        progressPercent: 100,
      },
    });

    renderLesson();

    expect(await screen.findByText('Lesson complete')).toBeInTheDocument();
    expect(screen.getByText('Course complete')).toBeInTheDocument();
    expect(screen.getByText('0 XP', { selector: 'dd' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Check answer' }),
    ).not.toBeInTheDocument();
  });

  it('reconciles stale progress conflicts without losing the answer', async () => {
    startLesson
      .mockResolvedValueOnce({
        lesson,
        pages: [page],
        progress: initialProgress(),
      })
      .mockResolvedValueOnce({
        lesson,
        pages: [page],
        progress: initialProgress(),
      });
    submitLessonPage.mockRejectedValue({
      status: 409,
      error: 'Activity changed on another device.',
    });

    renderLesson();

    const answer = await screen.findByRole('radio', {
      name: 'A way to trade value',
    });
    await userEvent.click(answer);
    await userEvent.click(screen.getByRole('button', { name: 'Check answer' }));

    expect(
      await screen.findByText(
        'We could not confirm that answer. Check your choices and try again.',
      ),
    ).toBeInTheDocument();
    expect(answer).toBeChecked();
  });

  it('reconciles an ambiguous submission by starting the lesson again', async () => {
    startLesson
      .mockResolvedValueOnce({
        lesson,
        pages: [page],
        progress: initialProgress(),
      })
      .mockResolvedValueOnce({
        lesson,
        pages: [page],
        progress: initialProgress({
          state: 'completed',
          currentPage: null,
          score: 1,
          completedPages: 1,
          pageResults: [
            { pageId: 'page-1', satisfied: true, firstAttemptCorrect: true },
          ],
        }),
        completion: {
          completed: true,
          score: 1,
          totalPages: 1,
          xpEarned: 10,
          courseCompleted: false,
          nextLesson: { lessonId: 'lesson-2', name: 'Counting value' },
        },
      });
    submitLessonPage.mockRejectedValue({ code: 'ERR_NETWORK' });

    renderLesson();

    await userEvent.click(
      await screen.findByRole('radio', { name: 'A way to trade value' }),
    );
    await userEvent.click(screen.getByRole('button', { name: 'Check answer' }));

    expect(await screen.findByText('Lesson complete')).toBeInTheDocument();
    expect(startLesson).toHaveBeenCalledTimes(2);
  });
});
