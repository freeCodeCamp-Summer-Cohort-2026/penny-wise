import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { startLesson, submitLessonPage } from '../lib/api/penny-wise';
import {
  createEmptyAnswer,
  getActivityAnswerError,
} from '../utils/activityValidation';
import { getPageId } from '../utils/courseData';

function isAbortError(error) {
  return error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError';
}

function shouldReconcileError(error) {
  if (isAbortError(error)) return false;
  if (error?.status === 409 || error?.status >= 500) return true;
  if (error?.status !== null && error?.status !== undefined) return false;
  return (
    ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT'].includes(error?.code) ||
    !error?.response
  );
}

function getPageIndex(progress, pages) {
  if (!pages.length) return 0;
  const currentPage = Number(progress?.currentPage);
  if (!Number.isInteger(currentPage) || currentPage < 0) return 0;
  return Math.min(currentPage, pages.length - 1);
}

function completionFromProgress(lesson, pages, progress, completion) {
  return {
    completed: true,
    score: Number(progress?.score) || 0,
    totalPages: pages.length,
    xpEarned: Number(lesson?.experience) || 0,
    newlyAwarded: completion?.newlyAwarded ?? true,
    courseCompleted: completion?.courseCompleted ?? null,
    nextLesson: completion?.nextLesson ?? null,
    completedAt: progress?.completedAt ?? null,
  };
}

export default function useLessonPlayer(courseId, lessonId, learnerId) {
  const [status, setStatus] = useState('loading');
  const [lesson, setLesson] = useState(null);
  const [pages, setPages] = useState([]);
  const [progress, setProgress] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answer, setAnswer] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const requestId = useRef(0);

  const applyPlayer = useCallback((data) => {
    const nextLesson = data?.lesson ?? null;
    const nextPages = Array.isArray(data?.pages) ? data.pages : [];
    const nextProgress = data?.progress ?? null;
    const nextIndex = getPageIndex(nextProgress, nextPages);
    const isCompleted =
      nextProgress?.state === 'completed' ||
      data?.completion?.completed === true;

    setLesson(nextLesson);
    setPages(nextPages);
    setProgress(nextProgress);
    setCurrentPageIndex(nextIndex);
    setAnswer(
      createEmptyAnswer(nextPages[nextIndex]?.type, nextPages[nextIndex]),
    );
    setFeedback(null);
    setError(null);
    setCompletion(
      isCompleted
        ? completionFromProgress(
            nextLesson,
            nextPages,
            nextProgress,
            data?.completion,
          )
        : null,
    );
  }, []);

  const load = useCallback(
    async (signal) => {
      if (!learnerId) {
        setError(new Error('A learner session is required.'));
        setStatus('error');
        return;
      }

      const activeRequest = requestId.current + 1;
      requestId.current = activeRequest;
      setStatus('loading');
      setError(null);

      try {
        const data = await startLesson(courseId, lessonId, signal);
        if (requestId.current !== activeRequest || signal?.aborted) return;
        applyPlayer(data);
        setStatus('ready');
      } catch (loadError) {
        if (
          requestId.current !== activeRequest ||
          signal?.aborted ||
          isAbortError(loadError)
        ) {
          return;
        }
        setError(loadError);
        setStatus('error');
      }
    },
    [applyPlayer, courseId, learnerId, lessonId],
  );

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      load(controller.signal);
    }, 0);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
      requestId.current += 1;
    };
  }, [load]);

  const currentPage = pages[currentPageIndex] ?? null;
  const isCompleted =
    progress?.state === 'completed' || completion?.completed === true;
  const totalPages = pages.length || Number(progress?.totalPages) || 0;

  const changeAnswer = useCallback(
    (nextAnswer) => {
      const feedbackType = feedback?.type;
      if (submitting || feedbackType === 'correct') return;
      setAnswer(nextAnswer);
      if (feedbackType) setFeedback(null);
    },
    [feedback, submitting],
  );

  const reconcile = useCallback(
    async (submittedPageId, submittedAnswer) => {
      setReconciling(true);
      try {
        const data = await startLesson(courseId, lessonId);
        const nextProgress = data?.progress ?? null;
        const pageResult = (nextProgress?.pageResults ?? []).find(
          (item) => String(item?.pageId) === String(submittedPageId),
        );
        const accepted = pageResult?.satisfied === true;
        const reconciledCompleted =
          nextProgress?.state === 'completed' ||
          data?.completion?.completed === true;
        const submittedPageIndex = (data?.pages ?? []).findIndex(
          (page) => String(getPageId(page)) === String(submittedPageId),
        );

        applyPlayer(data);
        if (accepted) {
          if (!reconciledCompleted && submittedPageIndex >= 0) {
            const submittedPage = data.pages[submittedPageIndex];
            setCurrentPageIndex(submittedPageIndex);
            setAnswer(createEmptyAnswer(submittedPage.type, submittedPage));
          }
          setCompletion(
            reconciledCompleted
              ? completionFromProgress(
                  data.lesson,
                  data.pages ?? [],
                  nextProgress,
                  data.completion,
                )
              : (data.completion ?? null),
          );
          setFeedback({
            type: 'correct',
            message: 'Your answer was saved. Nice work!',
          });
        } else {
          if (
            submittedPageIndex >= 0 &&
            getPageIndex(nextProgress, data.pages ?? []) === submittedPageIndex
          ) {
            setAnswer(submittedAnswer);
          }
          setFeedback({
            type: 'error',
            message:
              'We could not confirm that answer. Check your choices and try again.',
          });
        }
      } catch (reconcileError) {
        if (!isAbortError(reconcileError)) {
          setFeedback({
            type: 'error',
            message:
              'We could not reconnect to your progress. Check your connection and try again.',
          });
        }
      } finally {
        setReconciling(false);
      }
    },
    [applyPlayer, courseId, lessonId],
  );

  const submit = useCallback(async () => {
    if (submitting || !currentPage) return;

    const validationError = getActivityAnswerError(
      currentPage.type,
      answer,
      currentPage,
    );
    if (validationError) {
      setFeedback({ type: 'error', message: validationError });
      return;
    }

    const pageId = getPageId(currentPage);
    if (!pageId) {
      setFeedback({
        type: 'error',
        message: 'This activity is missing its page identifier. Try again.',
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const data = await submitLessonPage(courseId, lessonId, pageId, answer);
      const result = data?.result ?? {};
      const correct =
        result.correct === true ||
        result.satisfied === true ||
        result.isCorrect === true;
      setProgress(data?.progress ?? progress);

      if (correct) {
        const nextProgress = data?.progress ?? progress;
        const nextCompleted =
          nextProgress?.state === 'completed' ||
          data?.completion?.completed === true;
        setCompletion(
          nextCompleted
            ? completionFromProgress(
                data?.lesson ?? lesson,
                pages,
                nextProgress,
                data?.completion,
              )
            : (data?.completion ?? null),
        );
        setFeedback({
          type: 'correct',
          message: 'Correct. You are ready to continue.',
        });
      } else {
        setFeedback({
          type: 'incorrect',
          message:
            result.feedback ||
            currentPage.incorrectMessage ||
            'Not quite. Review your choices and try again—you are getting closer.',
        });
      }
    } catch (submitError) {
      if (isAbortError(submitError)) return;
      if (shouldReconcileError(submitError)) {
        await reconcile(pageId, answer);
      } else {
        setFeedback({
          type: 'error',
          message:
            submitError?.error ||
            submitError?.message ||
            'We could not check that answer. Please try again.',
        });
      }
    } finally {
      setSubmitting(false);
    }
  }, [
    answer,
    courseId,
    currentPage,
    lesson,
    lessonId,
    pages,
    progress,
    reconcile,
    submitting,
  ]);

  const continueToNext = useCallback(() => {
    if (feedback?.type !== 'correct' || isCompleted) return;
    const nextIndex = Math.min(currentPageIndex + 1, pages.length - 1);
    const nextPage = pages[nextIndex];
    if (!nextPage) return;
    setCurrentPageIndex(nextIndex);
    setAnswer(createEmptyAnswer(nextPage.type, nextPage));
    setFeedback(null);
  }, [currentPageIndex, feedback?.type, isCompleted, pages]);

  const player = useMemo(
    () => ({
      status,
      lesson,
      pages,
      progress,
      currentPage,
      currentPageIndex,
      totalPages,
      answer,
      feedback,
      completion,
      error,
      submitting,
      reconciling,
      isCompleted,
      changeAnswer,
      submit,
      continueToNext,
      retry: load,
    }),
    [
      answer,
      changeAnswer,
      completion,
      continueToNext,
      currentPage,
      currentPageIndex,
      error,
      feedback,
      isCompleted,
      lesson,
      load,
      pages,
      progress,
      reconciling,
      status,
      submit,
      submitting,
      totalPages,
    ],
  );

  return player;
}
