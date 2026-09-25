import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CourseCatalog from '../pages/CourseCatalog';
import { getCourses } from '../lib/api/penny-wise';

vi.mock('../lib/api/penny-wise', () => ({
  getCourses: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

function renderCatalog() {
  return render(
    <MemoryRouter>
      <CourseCatalog />
    </MemoryRouter>,
  );
}

describe('course catalog', () => {
  it('shows a loading state and then real course summaries', async () => {
    let resolveCourses;
    getCourses.mockReturnValue(
      new Promise((resolve) => {
        resolveCourses = resolve;
      }),
    );

    renderCatalog();

    expect(await screen.findByText('Loading courses…')).toBeInTheDocument();
    await act(async () => {
      resolveCourses({
        courses: [
          {
            _id: 'course-1',
            name: 'Money Basics',
            published: true,
            lessonCount: 3,
            totalEstimatedDurationInMinutes: 37,
          },
        ],
      });
    });
    expect(await screen.findByText('Money Basics')).toBeInTheDocument();
    expect(screen.getByText('3 lessons')).toBeInTheDocument();
    expect(screen.getByText('37 min')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Money Basics/ })).toHaveAttribute(
      'href',
      '/courses/course-1',
    );
  });

  it('renders an empty state when the API returns no courses', async () => {
    getCourses.mockResolvedValue({ courses: [] });

    renderCatalog();

    expect(
      await screen.findByText('No courses are available yet'),
    ).toBeInTheDocument();
  });

  it('shows an error and retries the request', async () => {
    getCourses
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValueOnce({ courses: [] });

    renderCatalog();

    expect(
      await screen.findByText('Courses could not load'),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(
      await screen.findByText('No courses are available yet'),
    ).toBeInTheDocument();
    expect(getCourses).toHaveBeenCalledTimes(2);
  });
});
