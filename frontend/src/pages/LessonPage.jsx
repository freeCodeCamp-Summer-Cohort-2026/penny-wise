import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  Trophy,
  Volume2,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import BriefLesson from '../components/BriefLesson';
import ActivityRenderer from '../components/course/ActivityRenderer';
import ProgressBar from '../components/course/ProgressBar';
import { getFallbackBriefLesson } from '../data/briefLessons';
import useLessonPlayer from '../hooks/useLessonPlayer';
import { getCourse } from '../lib/api/penny-wise';
import { useAuth } from '../lib/useAuth';
import { formatMinutes, getId } from '../utils/courseData';

function getErrorMessage(error, fallback) {
  return error?.error || error?.message || fallback;
}

function isSameId(left, right) {
  return left !== null && right !== null && String(left) === String(right);
}

function ProgressMessage({ feedback }) {
  if (!feedback) {
    return <div aria-live='polite' className='min-h-6' />;
  }

  const isCorrect = feedback.type === 'correct';
  return (
    <div
      role={feedback.type === 'correct' ? 'status' : 'alert'}
      aria-live='polite'
      className={`flex min-h-6 items-center gap-2 text-sm font-medium ${
        isCorrect
          ? 'text-green-700 dark:text-green-300'
          : 'text-red-700 dark:text-red-300'
      }`}
    >
      {isCorrect ? (
        <CheckCircle2 aria-hidden='true' size={17} />
      ) : (
        <Circle aria-hidden='true' size={17} />
      )}
      <span>{feedback.message}</span>
    </div>
  );
}

function LessonOutline({ course, courseId, lessonId, completedIds }) {
  const lessons = Array.isArray(course?.lessons) ? course.lessons : [];

  return (
    <aside className='hidden lg:block' aria-label='Course outline'>
      <div className='sticky top-28 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 shadow-[var(--shadow)]'>
        <h2 className='text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text)]'>
          Course outline
        </h2>
        <ol className='mt-4 space-y-2'>
          {lessons.map((lesson, index) => {
            const id = getId(lesson);
            const active = isSameId(id, lessonId);
            const complete = completedIds.has(String(id));
            const content = (
              <>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    active
                      ? 'bg-[var(--accent-bold)] text-white'
                      : complete
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-[var(--code-bg)] text-[var(--text)]'
                  }`}
                >
                  {complete ? (
                    <Check aria-hidden='true' size={14} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className='min-w-0'>
                  <span className='block text-sm font-semibold text-[var(--text-h)]'>
                    {lesson.name}
                  </span>
                  <span className='mt-0.5 block text-xs text-[var(--text)]'>
                    {formatMinutes(
                      lesson.estimatedDurationOfCompletionInMinutes,
                    )}
                  </span>
                </span>
              </>
            );

            return (
              <li key={id ?? index}>
                {id ? (
                  <Link
                    to={`/courses/${courseId}/lessons/${id}`}
                    aria-current={active ? 'step' : undefined}
                    className={`flex items-start gap-3 rounded-xl p-2 transition hover:bg-[var(--code-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                      active ? 'bg-[var(--accent-bg)]' : ''
                    }`}
                  >
                    {content}
                  </Link>
                ) : (
                  <div className='flex items-start gap-3 p-2'>{content}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

function CompletionSummary({
  course,
  courseId,
  lesson,
  completion,
  progress,
  headingRef,
}) {
  const pages = progress?.totalPages ?? completion?.totalPages ?? 0;
  const score = Number(completion?.score ?? progress?.score ?? 0);
  const firstAttemptResults = (progress?.pageResults ?? []).filter(
    (result) => result.firstAttemptCorrect === true,
  ).length;
  const firstAttemptPercent = pages
    ? Math.round((firstAttemptResults / pages) * 100)
    : 0;
  const courseCompleted = completion?.courseCompleted === true;
  const nextLesson = completion?.nextLesson ?? null;
  const nextLessonId =
    getId(nextLesson?.lesson) ?? getId(nextLesson?.lessonId) ?? null;

  return (
    <section className='rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-[var(--shadow)] sm:p-8'>
      <div className='flex items-start gap-4'>
        <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'>
          <Trophy aria-hidden='true' size={25} />
        </span>
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]'>
            Lesson complete
          </p>
          <h2
            ref={headingRef}
            tabIndex='-1'
            className='mt-2 text-3xl font-semibold text-[var(--text-h)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
          >
            You finished {lesson?.name}
          </h2>
          <p className='mt-2 text-[var(--text)]'>
            Your progress is saved. Review your score or keep moving through the
            course.
          </p>
        </div>
      </div>

      <dl className='mt-7 grid gap-3 sm:grid-cols-3'>
        <div className='rounded-xl bg-[var(--accent-bg)] p-4'>
          <dt className='text-sm text-[var(--text)]'>First-attempt score</dt>
          <dd className='mt-1 text-2xl font-semibold text-[var(--text-h)]'>
            {score} / {pages}
          </dd>
          <p className='mt-1 text-xs text-[var(--text)]'>
            {firstAttemptPercent}% on the first try
          </p>
        </div>
        <div className='rounded-xl bg-[var(--accent-bg)] p-4'>
          <dt className='text-sm text-[var(--text)]'>Experience earned</dt>
          <dd className='mt-1 text-2xl font-semibold text-[var(--text-h)]'>
            {completion?.newlyAwarded === false
              ? '0 XP'
              : `${completion?.xpEarned ?? lesson?.experience ?? 0} XP`}
          </dd>
          <p className='mt-1 text-xs text-[var(--text)]'>
            {completion?.newlyAwarded === false
              ? 'Already added to your total'
              : 'Added to your total'}
          </p>
        </div>
        <div className='rounded-xl bg-[var(--accent-bg)] p-4'>
          <dt className='text-sm text-[var(--text)]'>Course status</dt>
          <dd className='mt-1 text-lg font-semibold text-[var(--text-h)]'>
            {courseCompleted ? 'Course complete' : 'In progress'}
          </dd>
        </div>
      </dl>

      <div className='mt-7 flex flex-wrap gap-3'>
        {nextLessonId && !courseCompleted && (
          <Link
            to={`/courses/${courseId}/lessons/${nextLessonId}`}
            className='inline-flex items-center gap-2 bg-[var(--accent-bold)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
          >
            Continue to next lesson
            <ArrowRight aria-hidden='true' size={17} />
          </Link>
        )}
        <Link
          to={`/courses/${courseId}`}
          className='inline-flex items-center gap-2 border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--text-h)] transition hover:bg-[var(--code-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
        >
          Back to course
        </Link>
      </div>
      {course?.name && (
        <p className='mt-5 text-sm text-[var(--text)]'>
          <Sparkles aria-hidden='true' className='mr-1 inline' size={15} />
          {courseCompleted
            ? `${course.name} is complete.`
            : `Keep going with ${course.name}.`}
        </p>
      )}
    </section>
  );
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const { auth } = useAuth();
  const [course, setCourse] = useState(null);
  const [learningState, setLearningState] = useState(null);
  const [courseError, setCourseError] = useState(null);
  const player = useLessonPlayer(courseId, lessonId, auth?.user?.id);
  const activityHeadingRef = useRef(null);
  const completionHeadingRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    getCourse(courseId, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setCourse(data?.course ?? null);
        setLearningState(data?.learningState ?? null);
      })
      .catch((error) => {
        if (!controller.signal.aborted && error?.code !== 'ERR_CANCELED') {
          setCourseError(error);
        }
      });
    return () => controller.abort();
  }, [courseId, player.isCompleted]);

  useEffect(() => {
    if (player.status !== 'ready') return;
    const heading = player.isCompleted
      ? completionHeadingRef.current
      : activityHeadingRef.current;
    heading?.focus();
  }, [player.currentPageIndex, player.isCompleted, player.status]);

  const completedIds = new Set(
    (learningState?.completedLessonIds ?? []).map((id) =>
      String(getId(id) ?? id),
    ),
  );
  const currentPageNumber = player.currentPageIndex + 1;
  const pagePercent = player.totalPages
    ? (currentPageNumber / player.totalPages) * 100
    : 0;
  const completion = player.completion;
  const courseLessons = Array.isArray(course?.lessons) ? course.lessons : [];
  const courseLessonCount = courseLessons.length;
  const currentLessonIndex = courseLessons.findIndex(
    (lesson) => String(getId(lesson)) === String(lessonId),
  );
  const fallbackNextLesson =
    currentLessonIndex >= 0 ? courseLessons[currentLessonIndex + 1] : undefined;
  const effectiveCourseCompleted =
    completion?.courseCompleted === true ||
    learningState?.status === 'completed' ||
    (courseLessonCount > 0 &&
      learningState?.completedLessonIds?.length >= courseLessonCount);
  const summaryCompletion = completion
    ? {
        ...completion,
        courseCompleted: effectiveCourseCompleted,
        nextLesson:
          completion.nextLesson ??
          (fallbackNextLesson
            ? {
                lessonId: getId(fallbackNextLesson),
                name: fallbackNextLesson.name,
              }
            : null),
      }
    : null;

  if (player.status === 'loading') {
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
          <p className='mt-3 text-[var(--text)]'>Loading your lesson…</p>
        </div>
      </main>
    );
  }

  if (player.status === 'error' || !player.lesson) {
    return (
      <main className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6'>
        <div
          role='alert'
          className='rounded-2xl border border-red-300 bg-red-50 p-6 text-red-900 dark:border-red-800 dark:bg-red-950/30 dark:text-red-100'
        >
          <h1 className='text-2xl font-semibold'>Lesson unavailable</h1>
          <p className='mt-2'>
            {getErrorMessage(player.error, 'We could not load this lesson.')}
          </p>
          <div className='mt-5 flex flex-wrap gap-3'>
            <button
              type='button'
              onClick={() => player.retry()}
              className='inline-flex items-center gap-2 bg-[var(--accent-bold)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
            >
              <RefreshCw aria-hidden='true' size={16} />
              Try again
            </button>
            <Link
              to={`/courses/${courseId}`}
              className='inline-flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text-h)] transition hover:bg-[var(--code-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
            >
              <ArrowLeft aria-hidden='true' size={16} />
              Back to course
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const briefLesson =
    player.lesson?.briefLesson || getFallbackBriefLesson(course?.name);

  return (
    <main className='mx-auto w-full max-w-7xl px-4 py-8 text-left sm:px-6 sm:py-10'>
      <nav aria-label='Breadcrumb' className='text-sm text-[var(--text)]'>
        <Link
          to={`/courses/${courseId}`}
          className='inline-flex items-center gap-1 hover:underline'
        >
          <ArrowLeft aria-hidden='true' size={15} />
          {course?.name || 'Course'}
        </Link>
        <span aria-hidden='true' className='mx-2'>
          ›
        </span>
        <span className='font-medium text-[var(--text-h)]'>
          {player.lesson.name}
        </span>
      </nav>

      <div className='mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]'>
        <div className='min-w-0'>
          <header>
            <p className='text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]'>
              {course?.name || 'Course lesson'}
            </p>
            <h1 className='mt-2 text-4xl font-semibold tracking-tight text-[var(--text-h)]'>
              {player.lesson.name}
            </h1>
            {player.lesson.description && (
              <p className='mt-3 max-w-3xl text-lg text-[var(--text)]'>
                {player.lesson.description}
              </p>
            )}
            <div className='mt-4 flex flex-wrap gap-4 text-sm text-[var(--text)]'>
              <span className='inline-flex items-center gap-2'>
                <Volume2 aria-hidden='true' size={16} />
                {formatMinutes(
                  player.lesson.estimatedDurationOfCompletionInMinutes,
                )}
              </span>
              {player.lesson.experience !== undefined && (
                <span className='inline-flex items-center gap-2'>
                  <Sparkles aria-hidden='true' size={16} />
                  {player.lesson.experience} XP
                </span>
              )}
            </div>
          </header>

          {briefLesson && <BriefLesson lesson={briefLesson} />}

          <div className='mt-8 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-[var(--shadow)] sm:p-6'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <h2 className='text-lg font-semibold text-[var(--text-h)]'>
                {player.isCompleted ? 'Lesson progress' : 'Your activity'}
              </h2>
              <p className='text-sm font-medium text-[var(--text)]'>
                {player.isCompleted
                  ? 'Complete'
                  : `Page ${Math.min(currentPageNumber, player.totalPages)} of ${player.totalPages}`}
              </p>
            </div>
            <ProgressBar
              className='mt-4'
              value={player.isCompleted ? 100 : pagePercent}
              valueText={
                player.isCompleted
                  ? 'Lesson complete'
                  : `Page ${Math.min(currentPageNumber, player.totalPages)} of ${player.totalPages}`
              }
              label={`${player.lesson.name} page progress`}
            />
          </div>

          {courseError && (
            <p className='mt-4 text-sm text-amber-700 dark:text-amber-300'>
              The course outline could not load, but your saved lesson can
              continue.
            </p>
          )}

          {player.isCompleted ? (
            <div className='mt-6'>
              <CompletionSummary
                course={course}
                courseId={courseId}
                lesson={player.lesson}
                completion={summaryCompletion}
                progress={player.progress}
                headingRef={completionHeadingRef}
              />
            </div>
          ) : player.currentPage ? (
            <section
              id='practice'
              className='mt-6 scroll-mt-24 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-[var(--shadow)] sm:p-8'
              aria-labelledby='activity-heading'
            >
              <p className='text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]'>
                One activity at a time
              </p>
              <h2
                ref={activityHeadingRef}
                id='activity-heading'
                tabIndex='-1'
                className='mt-2 text-2xl font-semibold text-[var(--text-h)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
              >
                {player.currentPage.text}
              </h2>
              {player.currentPage.imageUrl && (
                <img
                  src={player.currentPage.imageUrl}
                  alt={player.currentPage.text}
                  className='mt-5 max-h-64 w-full rounded-xl object-contain'
                />
              )}
              {player.currentPage.audioUrl && (
                <audio
                  controls
                  src={player.currentPage.audioUrl}
                  aria-label={`Audio for ${player.currentPage.text}`}
                  className='mt-5 w-full'
                />
              )}

              <div className='mt-7'>
                <ActivityRenderer
                  page={player.currentPage}
                  answer={player.answer}
                  onChange={player.changeAnswer}
                  disabled={
                    player.submitting ||
                    player.reconciling ||
                    player.feedback?.type === 'correct'
                  }
                />
              </div>

              <div className='mt-6'>
                <ProgressMessage feedback={player.feedback} />
              </div>

              <div className='mt-6 flex flex-wrap items-center gap-3'>
                {player.feedback?.type === 'correct' ? (
                  <button
                    type='button'
                    onClick={player.continueToNext}
                    disabled={player.submitting}
                    className='inline-flex items-center gap-2 bg-[var(--accent-bold)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-wait disabled:opacity-60'
                  >
                    Continue
                    <ArrowRight aria-hidden='true' size={17} />
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={player.submit}
                    disabled={player.submitting || player.reconciling}
                    className='inline-flex items-center gap-2 bg-[var(--accent-bold)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-wait disabled:opacity-60'
                  >
                    {player.submitting || player.reconciling ? (
                      <LoaderCircle
                        aria-hidden='true'
                        size={17}
                        className='motion-safe:animate-spin'
                      />
                    ) : (
                      <Check aria-hidden='true' size={17} />
                    )}
                    {player.reconciling
                      ? 'Reconnecting…'
                      : player.submitting
                        ? 'Checking…'
                        : 'Check answer'}
                  </button>
                )}
                {player.feedback?.type === 'incorrect' && (
                  <p className='text-sm text-[var(--text)]'>
                    Change your answer and try again.
                  </p>
                )}
              </div>
            </section>
          ) : (
            <p className='mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)] p-6 text-[var(--text)]'>
              This lesson has no activities yet.
            </p>
          )}
        </div>

        <LessonOutline
          course={course}
          courseId={courseId}
          lessonId={lessonId}
          completedIds={completedIds}
        />
      </div>
    </main>
  );
}
