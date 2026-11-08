import { describe, expect, it, vi } from 'vitest';
import {
  api,
  AUTH_EXPIRED_EVENT,
  handleApiError,
  normalizeApiError,
} from '../lib/api/client';
import {
  enrollInCourse,
  getCourse,
  getCourses,
  logoutUser,
  startLesson,
  submitLessonPage,
} from '../lib/api/penny-wise';

describe('API auth and errors', () => {
  it('uses cookie credentials instead of an Authorization header', () => {
    expect(api.defaults.withCredentials).toBe(true);
    expect(api.defaults.headers.Authorization).toBeUndefined();
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

  it('notifies the session when a protected request returns 401', () => {
    const event = vi.fn();
    window.addEventListener(AUTH_EXPIRED_EVENT, event);

    const error = handleApiError({
      config: { url: '/courses/course-1' },
      response: { status: 401, data: { error: 'Session expired' } },
    });

    expect(error.status).toBe(401);
    expect(event).toHaveBeenCalledOnce();
    window.removeEventListener(AUTH_EXPIRED_EVENT, event);
  });

  it('does not expire the session for invalid login credentials', () => {
    const event = vi.fn();
    window.addEventListener(AUTH_EXPIRED_EVENT, event);

    handleApiError({
      config: { url: '/auth/login' },
      response: { status: 401, data: { error: 'Invalid credentials' } },
    });

    expect(event).not.toHaveBeenCalled();
    window.removeEventListener(AUTH_EXPIRED_EVENT, event);
  });

  it('replaces an html error body with a readable message', () => {
    const error = normalizeApiError({
      response: {
        status: 502,
        data: '<html><body>Bad Gateway</body></html>',
      },
    });

    expect(error.status).toBe(502);
    expect(error.message).toBe(
      'The server is temporarily unavailable. Please try again in a moment.'
    );
    expect(error.error).toBe(
      'The server is temporarily unavailable. Please try again in a moment.'
    );
  });

  it('explains a request timeout instead of leaking the axios message', () => {
    const error = normalizeApiError({
      code: 'ECONNABORTED',
      message: 'timeout of 30000ms exceeded',
    });

    expect(error.status).toBeNull();
    expect(error.message).toBe(
      'The server is taking too long to respond. Please try again.'
    );
  });

  it('explains an unreachable server instead of leaking the axios message', () => {
    const error = normalizeApiError({
      message: 'Network Error',
    });

    expect(error.status).toBeNull();
    expect(error.message).toBe(
      'We could not reach the server. Check your connection and try again.'
    );
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
      controller.signal
    );
    await logoutUser(controller.signal);

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
      }
    );
    expect(post).toHaveBeenNthCalledWith(
      2,
      '/courses/course-1/lessons/lesson-1/start',
      undefined,
      { signal: controller.signal }
    );
    expect(post).toHaveBeenNthCalledWith(
      3,
      '/courses/course-1/lessons/lesson-1/pages/page-1/submit',
      { answer: { optionIndex: 1 } },
      { signal: controller.signal }
    );
    expect(post).toHaveBeenNthCalledWith(4, '/auth/logout', undefined, {
      signal: controller.signal,
    });
  });
});
