import { api, normalizeApiError } from './client';

function getSignal(signalOrOptions) {
  if (
    signalOrOptions &&
    typeof signalOrOptions === 'object' &&
    'aborted' in signalOrOptions
  ) {
    return signalOrOptions;
  }
  if (
    signalOrOptions &&
    typeof signalOrOptions === 'object' &&
    'signal' in signalOrOptions
  ) {
    return signalOrOptions.signal;
  }
  return signalOrOptions;
}

function requestConfig(signal) {
  return signal ? { signal } : undefined;
}

async function getData(url, signal) {
  try {
    const response = await api.get(url, requestConfig(signal));
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

async function postData(url, body, signal) {
  try {
    const response = await api.post(url, body, requestConfig(signal));
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export const registerUser = (userData, signal) =>
  postData('/auth/register', userData, getSignal(signal));

export const loginUser = (credentials, signal) =>
  postData('/auth/login', credentials, getSignal(signal));

export const getCurrentUser = (signal) =>
  getData('/auth/me', getSignal(signal));

export const getCourses = (signal) => getData('/courses', getSignal(signal));

export const getCourse = (courseId, signal) =>
  getData(`/courses/${courseId}`, getSignal(signal));

export const enrollInCourse = (courseId, signal) =>
  postData(`/courses/${courseId}/enroll`, undefined, getSignal(signal));

export const startLesson = (courseId, lessonId, signal) =>
  postData(
    `/courses/${courseId}/lessons/${lessonId}/start`,
    undefined,
    getSignal(signal),
  );

export const submitLessonPage = (courseId, lessonId, pageId, answer, signal) =>
  postData(
    `/courses/${courseId}/lessons/${lessonId}/pages/${pageId}/submit`,
    { answer },
    getSignal(signal),
  );
