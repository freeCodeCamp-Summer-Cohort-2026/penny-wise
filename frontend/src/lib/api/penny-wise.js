import { api, normalizeApiError } from './client';

// userId -> Promise<image[]>. Shares one request between all callers and
// keeps the result until the page reloads or the cache is cleared.
const imageCache = new Map();

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

export function getImages(userId, { force = false } = {}) {
  if (!force && imageCache.has(userId)) {
    return imageCache.get(userId);
  }

  const request = api
    .get('/images')
    .then(({ data }) => data.images ?? [])
    .catch((err) => {
      imageCache.delete(userId); // let the next call retry
      throw err;
    });

  imageCache.set(userId, request);
  return request;
}

export async function uploadImage(userId, file) {
  const formData = new FormData();
  formData.append('image', file);

  // No manual Content-Type: the browser adds the multipart boundary.
  const { data } = await api.post('/images/upload', formData);

  if (imageCache.has(userId)) {
    imageCache.set(
      userId,
      imageCache.get(userId).then((list) => [data.image, ...list]),
    );
  }

  return data.image;
}

export function clearImageCache() {
  imageCache.clear();
}

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
    {
      displayName: body.displayName,
      country: body.country,
      profilePic: body.profilePic,
      bio: body.bio,
    },
    getSignal(signal),
  );
