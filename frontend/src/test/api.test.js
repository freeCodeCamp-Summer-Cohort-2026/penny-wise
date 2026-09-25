import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AUTH_STORAGE_KEY, saveAuth } from '../lib/authStorage';
import {
  api,
  attachAuthToken,
  handleApiError,
  normalizeApiError,
} from '../lib/api/client';
import {
  enrollInCourse,
  getCourse,
  getCourses,
  startLesson,
  submitLessonPage,
} from '../lib/api/penny-wise';

beforeEach(() => {
  window.localStorage.clear();
});

describe('API auth and errors', () => {
  it('reads the current token for each request configuration', () => {
    saveAuth({ token: 'token-123', user: { id: 'learner-1' } });

    const config = attachAuthToken({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer token-123');
  });

  it('normalizes an API error without losing its status or server message', () => {
    const error = normalizeApiError({
      response: {
        status: 422,
        data: { error: 'Choose a valid answer.' },
      },
    });

    expect(error.status).toBe(422);
    expect(error.error).toBe('Choose a valid answer.');
    expect(error.message).toBe('Choose a valid answer.');
  });

  it('clears stored authentication when a request returns 401', () => {
    saveAuth({ token: 'expired-token', user: { id: 'learner-1' } });
    const event = vi.fn();
    window.addEventListener('penny-wise.auth-changed', event);

    const error = handleApiError({
      response: { status: 401, data: { error: 'Session expired' } },
    });

    expect(error.status).toBe(401);
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(event).toHaveBeenCalledOnce();
    window.removeEventListener('penny-wise.auth-changed', event);
  });

  it('keeps an existing session when login credentials are invalid', () => {
    saveAuth({ token: 'valid-token', user: { id: 'learner-1' } });

    handleApiError({
      config: { url: '/auth/login' },
      response: { status: 401, data: { error: 'Invalid credentials' } },
    });

    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).not.toBeNull();
  });

  it('passes abort signals and locked endpoint bodies through services', async () => {
    const get = vi
      .spyOn(api, 'get')
      .mockResolvedValue({ data: { courses: [] } });
    const post = vi
      .spyOn(api, 'post')
      .mockResolvedValue({ data: { ok: true } });
    const controller = new AbortController();

    await getCourses(controller.signal);
    await getCourse('course-1', controller.signal);
    await enrollInCourse('course-1', controller.signal);
    await startLesson('course-1', 'lesson-1', controller.signal);
    await submitLessonPage(
      'course-1',
      'lesson-1',
      'page-1',
      { optionIndex: 1 },
      controller.signal,
    );

    expect(get).toHaveBeenNthCalledWith(1, '/courses', {
      signal: controller.signal,
    });
    expect(get).toHaveBeenNthCalledWith(2, '/courses/course-1', {
      signal: controller.signal,
    });
    expect(post).toHaveBeenNthCalledWith(
      1,
      '/courses/course-1/enroll',
      undefined,
      {
        signal: controller.signal,
      },
    );
    expect(post).toHaveBeenNthCalledWith(
      2,
      '/courses/course-1/lessons/lesson-1/start',
      undefined,
      { signal: controller.signal },
    );
    expect(post).toHaveBeenNthCalledWith(
      3,
      '/courses/course-1/lessons/lesson-1/pages/page-1/submit',
      { answer: { optionIndex: 1 } },
      { signal: controller.signal },
    );
  });
});
