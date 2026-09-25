export function getId(value) {
  if (typeof value === 'string' || typeof value === 'number') return value;
  return value?._id ?? value?.id ?? null;
}

export function clampPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(100, Math.max(0, number));
}

export function formatMinutes(value) {
  const minutes = Number(value);
  if (!Number.isFinite(minutes) || minutes < 0) return '—';
  return `${minutes} min`;
}

export function formatMoney(cents) {
  const amount = Number(cents);
  if (!Number.isFinite(amount)) return '$0.00';
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);
}

export function getPageId(page) {
  return getId(page);
}

export function getCourseResumeLink(resume) {
  const courseId = getId(resume?.course) ?? getId(resume?.courseId);
  const lessonId = getId(resume?.lesson) ?? getId(resume?.lessonId);
  if (!courseId || !lessonId) return courseId ? `/courses/${courseId}` : null;
  return `/courses/${courseId}/lessons/${lessonId}`;
}

export function isCourseCompleted(learningState, lessonCount) {
  if (learningState?.status === 'completed') return true;
  const completed = learningState?.completedLessonIds;
  return (
    Array.isArray(completed) &&
    Number.isFinite(Number(lessonCount)) &&
    Number(lessonCount) > 0 &&
    completed.length >= Number(lessonCount)
  );
}
