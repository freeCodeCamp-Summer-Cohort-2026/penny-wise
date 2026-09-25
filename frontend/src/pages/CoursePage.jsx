import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  LoaderCircle,
  LogIn,
  RefreshCw,
} from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import BriefLesson from '../components/BriefLesson';
import ProgressBar from '../components/course/ProgressBar';
import { getFallbackBriefLesson } from '../data/briefLessons';
import { enrollInCourse, getCourse } from '../lib/api/penny-wise';
import { useAuth } from '../lib/useAuth';
import { formatMinutes, getId, isCourseCompleted } from '../utils/courseData';

function getErrorMessage(error, fallback) {
  return error?.error || error?.message || fallback;
}

export default function CoursePage() {
  const { courseId } = useParams();
  const location = useLocation();
  const { auth } = useAuth();
  const [course, setCourse] = useState(null);
  const [learningState, setLearningState] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState(null);

  const loadCourse = useCallback(
    async (signal) => {
      setStatus('loading');
      setError(null);

      try {
        const data = await getCourse(courseId, signal);
        if (signal?.aborted) return;
        setCourse(data?.course ?? null);
        setLearningState(data?.learningState ?? null);
        setStatus('ready');
      } catch (loadError) {
        if (signal?.aborted || loadError?.code === 'ERR_CANCELED') return;
        setError(loadError);
        setStatus('error');
      }
    },
    [courseId],
  );

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      loadCourse(controller.signal);
    }, 0);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [auth?.token, loadCourse]);

  const handleEnroll = async () => {
    if (enrolling) return;
    setEnrolling(true);
    setEnrollError(null);

    try {
      const data = await enrollInCourse(courseId);
      if (data?.course) setCourse(data.course);
      if (data?.learningState) setLearningState(data.learningState);
    } catch (enrollFailure) {
      setEnrollError(
        getErrorMessage(enrollFailure, 'Enrollment could not be completed.'),
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (status === 'loading') {
    return (
      <main className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6'>
        <div
          role='status'
          aria-live='polite'
          className='rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-10 text-center shadow-[var(--shadow)]'
        >
          <LoaderCircle
            aria-hidden='true'
            className='mx-auto motion-safe:animate-spin text-[var(--accent)]'
          />
          <p className='mt-3 text-[var(--text)]'>Loading course…</p>
        </div>
      </main>
    );
  }

  if (status === 'error' || !course) {
    return (
      <main className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6'>
        <div
          role='alert'
          className='rounded-2xl border border-red-300 bg-red-50 p-6 text-red-900 dark:border-red-800 dark:bg-red-950/30 dark:text-red-100'
        >
          <h1 className='text-2xl font-semibold'>Course unavailable</h1>
          <p className='mt-2'>
            {getErrorMessage(error, 'We could not find that course.')}
          </p>
          <div className='mt-5 flex flex-wrap gap-3'>
            <button
              type='button'
              onClick={() => {
                const controller = new AbortController();
                loadCourse(controller.signal);
              }}
              className='inline-flex items-center gap-2 bg-[var(--accent-bold)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
            >
              <RefreshCw aria-hidden='true' size={16} />
              Try again
            </button>
            <Link
              to='/courses'
              className='inline-flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text-h)] transition hover:bg-[var(--code-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
            >
              <ArrowLeft aria-hidden='true' size={16} />
              All courses
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const lessons = Array.isArray(course.lessons) ? course.lessons : [];
  const briefLesson =
    lessons.find((lesson) => lesson.briefLesson)?.briefLesson ||
    getFallbackBriefLesson(course.name);
  const completedLessonIds = new Set(
    (learningState?.completedLessonIds ?? []).map((id) =>
      String(getId(id) ?? id),
    ),
  );
  const totalLessons = learningState?.totalLessons ?? lessons.length;
  const progressPercent = learningState?.progressPercent ?? 0;
  const enrolled = learningState?.enrolled === true;
  const completed = isCourseCompleted(learningState, lessons.length);
  const started =
    enrolled &&
    (learningState?.hasStarted === true || completedLessonIds.size > 0);
  const firstLessonId =
    getId(learningState?.firstLessonId) ?? getId(lessons[0]) ?? null;
  const resumeLessonId = getId(learningState?.resumeLessonId) ?? firstLessonId;
  const isAuthor = auth?.user?.role === 'author';
  const canOpenLessons = enrolled;
  const targetLessonId = completed
    ? firstLessonId
    : started
      ? resumeLessonId
      : firstLessonId;

  const action = (() => {
    if (!auth) {
      return (
        <Link
          to='/login'
          state={{ from: location }}
          className='inline-flex items-center gap-2 bg-[var(--accent-bold)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
        >
          <LogIn aria-hidden='true' size={17} />
          Log in to enroll
        </Link>
      );
    }

    if (isAuthor) {
      return (
        <p className='rounded-xl border border-[var(--border)] bg-[var(--code-bg)] px-4 py-3 text-sm text-[var(--text)]'>
          Authors can browse this course, but only learners can enroll.
        </p>
      );
    }

    if (!enrolled) {
      return (
        <div>
          <button
            type='button'
            onClick={handleEnroll}
            disabled={enrolling}
            className='inline-flex items-center gap-2 bg-[var(--accent-bold)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-wait disabled:opacity-60'
          >
            {enrolling && (
              <LoaderCircle
                aria-hidden='true'
                size={17}
                className='motion-safe:animate-spin'
              />
            )}
            {enrolling ? 'Enrolling…' : 'Enroll'}
            {!enrolling && <ArrowRight aria-hidden='true' size={17} />}
          </button>
          {enrollError && (
            <p
              role='alert'
              className='mt-3 text-sm text-red-700 dark:text-red-300'
            >
              {enrollError}
            </p>
          )}
        </div>
      );
    }

    if (!targetLessonId || lessons.length === 0) {
      return (
        <p className='rounded-xl border border-[var(--border)] bg-[var(--code-bg)] px-4 py-3 text-sm text-[var(--text)]'>
          This course does not have a lesson to start yet.
        </p>
      );
    }

    return (
      <Link
        to={`/courses/${courseId}/lessons/${targetLessonId}`}
        className='inline-flex items-center gap-2 bg-[var(--accent-bold)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
      >
        {completed ? 'Review course' : started ? 'Continue' : 'Start course'}
        <ArrowRight aria-hidden='true' size={17} />
      </Link>
    );
  })();

  return (
    <main className='mx-auto w-full max-w-6xl px-4 py-8 text-left sm:px-6 sm:py-10'>
      <nav aria-label='Breadcrumb' className='text-sm text-[var(--text)]'>
        <Link
          to='/courses'
          className='inline-flex items-center gap-1 hover:underline'
        >
          <ArrowLeft aria-hidden='true' size={15} />
          Courses
        </Link>
        <span aria-hidden='true' className='mx-2'>
          ›
        </span>
        <span className='font-medium text-[var(--text-h)]'>{course.name}</span>
      </nav>

      <section className='mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-[var(--shadow)] sm:p-8'>
        <div className='flex flex-col justify-between gap-6 md:flex-row md:items-start'>
          <div className='max-w-3xl'>
            <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]'>
              {completed ? 'Course complete' : 'Learning path'}
            </p>
            <h1 className='mt-3 text-4xl font-semibold tracking-tight text-[var(--text-h)] sm:text-5xl'>
              {course.name}
            </h1>
            <p className='mt-4 text-lg text-[var(--text)]'>
              Build practical money skills through short, focused lessons and
              real decisions.
            </p>
            <div className='mt-5 flex flex-wrap gap-4 text-sm text-[var(--text)]'>
              <span className='inline-flex items-center gap-2'>
                <BookOpen aria-hidden='true' size={17} />
                {lessons.length} lessons
              </span>
              <span className='inline-flex items-center gap-2'>
                <Clock3 aria-hidden='true' size={17} />
                {formatMinutes(course.totalEstimatedDurationInMinutes)} total
              </span>
              {course.published && (
                <span className='inline-flex items-center gap-2'>
                  Published course
                </span>
              )}
            </div>
          </div>
          <div className='shrink-0'>{action}</div>
        </div>

        {enrolled && (
          <div className='mt-8 border-t border-[var(--border)] pt-6'>
            <div className='mb-2 flex flex-wrap items-center justify-between gap-2 text-sm'>
              <span className='font-semibold text-[var(--text-h)]'>
                Your progress
              </span>
              <span className='text-[var(--text)]'>
                {progressPercent}% complete
              </span>
            </div>
            <ProgressBar
              value={progressPercent}
              label={`${course.name} progress`}
            />
            <p className='mt-2 text-sm text-[var(--text)]'>
              {completedLessonIds.size} of {totalLessons} lessons completed
            </p>
          </div>
        )}
      </section>

      {briefLesson && <BriefLesson lesson={briefLesson} />}

      <section
        id='practice'
        className='mt-10 scroll-mt-24'
        aria-labelledby='lessons-heading'
      >
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h2
              id='lessons-heading'
              className='text-2xl font-semibold text-[var(--text-h)]'
            >
              Lesson outline
            </h2>
            <p className='mt-1 text-[var(--text)]'>
              Work through the lessons in order and return whenever you are
              ready.
            </p>
          </div>
          {completed && (
            <span className='inline-flex items-center gap-2 rounded-full bg-[var(--accent-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--text-h)]'>
              <Check aria-hidden='true' size={16} />
              Completed
            </span>
          )}
        </div>

        {lessons.length === 0 ? (
          <p className='mt-5 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)] p-6 text-[var(--text)]'>
            Lessons are being prepared for this course.
          </p>
        ) : (
          <ol className='mt-5 grid gap-4 sm:grid-cols-2'>
            {lessons.map((lesson, index) => {
              const lessonId = getId(lesson);
              const lessonCompleted = completedLessonIds.has(String(lessonId));
              const content = (
                <>
                  <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-bg)] font-semibold text-[var(--accent)]'>
                    {lessonCompleted ? (
                      <Check aria-hidden='true' size={18} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className='min-w-0 flex-1'>
                    <span className='block font-semibold text-[var(--text-h)]'>
                      {lesson.name}
                    </span>
                    <span className='mt-1 block text-sm text-[var(--text)]'>
                      {lesson.description}
                    </span>
                    <span className='mt-2 block text-xs text-[var(--text)]'>
                      {formatMinutes(
                        lesson.estimatedDurationOfCompletionInMinutes,
                      )}
                      {lesson.experience !== undefined &&
                        ` · ${lesson.experience} XP`}
                    </span>
                  </span>
                  {canOpenLessons && lessonId && (
                    <ArrowRight
                      aria-hidden='true'
                      className='mt-2 shrink-0 text-[var(--accent)]'
                    />
                  )}
                </>
              );

              return (
                <li key={lessonId ?? index}>
                  {canOpenLessons && lessonId ? (
                    <Link
                      to={`/courses/${courseId}/lessons/${lessonId}`}
                      className='flex h-full gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:shadow-[var(--nav-shadow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className='flex h-full gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5'>
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </main>
  );
}
