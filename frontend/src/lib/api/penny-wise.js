import { api, normalizeApiError } from './client';
import axios from 'axios';

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

async function putData(url, body, signal) {
  try {
    const response = await api.put(url, body, requestConfig(signal));
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export const registerUser = (userData, signal) =>
  postData('/auth/register', userData, getSignal(signal));

export const loginUser = (credentials, signal) =>
  postData('/auth/login', credentials, getSignal(signal));

export const logoutUser = (signal) =>
  postData('/auth/logout', undefined, getSignal(signal));

export const getCurrentUser = (signal) =>
  getData('/auth/me', getSignal(signal));

export const getCourses = (signal) => getData('/courses', getSignal(signal));

export const getCountries = (signal) =>
  getData('/countries', getSignal(signal));

export const getCourse = (courseId, signal) =>
  getData(`/courses/${courseId}`, getSignal(signal));

export const getImages = (userId, signal) => {
  // getData('/images/${userId}', getSignal(signal));
  try {
    console.log(
      `Started getImages userID= ${userId}, ${signal} at lib/api/penny-wise`,
    );
    const res = axios.get('http://localhost:5001/images');
    console.log(`Returning from getImages data= ${res.body}`);
    return res;
  } catch (err) {
    console.error('❌ Fetch error:', err.message);
  } finally {
    console.log('Ended getImages at lib/api/penny-wise');
  }
};

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

export const submitProfile = (body, signal) =>
  putData(
    `/user`,
    { displayName: body.displayName, country: body.country, bio: body.bio },
    getSignal(signal),
  );
