import { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TargetHero from '../assets/target_icon.svg';
import { getCourses, getCurrentUser } from '../lib/api/penny-wise';
import { useAuth } from '../lib/useAuth';
import { formatMinutes, getCourseResumeLink, getId } from '../utils/courseData';

function getErrorMessage(error) {
  return error?.error || error?.message || 'Something went wrong. Try again.';
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className='rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-[var(--shadow)]'>
      <div className='flex items-center gap-3'>
        <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-bg)] text-[var(--accent)]'>
          <Icon aria-hidden='true' size={19} />
        </span>
        <div>
          <dt className='text-sm text-[var(--text)]'>{label}</dt>
          <dd className='mt-0.5 text-2xl font-semibold text-[var(--text-h)]'>
            {value}
          </dd>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { auth } = useAuth();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [coursesStatus, setCoursesStatus] = useState('loading');
  const [user, setUser] = useState(null);
  const [learning, setLearning] = useState(null);

  const loadDashboard = useCallback(async (signal) => {
    setStatus('loading');
    setCoursesStatus('loading');
    setError(null);

    const [courseResult, userResult] = await Promise.allSettled([
      getCourses(signal),
      getCurrentUser(signal),
    ]);

    if (signal?.aborted) return;

    if (courseResult.status === 'fulfilled') {
      setCourses(
        Array.isArray(courseResult.value?.courses)
          ? courseResult.value.courses
          : [],
      );
      setCoursesStatus('ready');
    } else {
      setCoursesStatus('error');
    }
    if (userResult.status === 'fulfilled') {
      setUser(userResult.value?.user ?? null);
      setLearning(userResult.value?.learning ?? null);
    }

    const failures = [courseResult, userResult].filter(
      (result) => result.status === 'rejected',
    );
    if (failures.length > 0) {
      setError(failures[0].reason);
    }
    setStatus('ready');
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      loadDashboard(controller.signal);
    }, 0);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [auth?.user?.id, loadDashboard]);

  const retry = () => {
    const controller = new AbortController();
    loadDashboard(controller.signal);
  };

  const resume = learning?.resume ?? null;
  const resumeLink = getCourseResumeLink(resume);
  const completedLessons =
    learning?.completedLessons ?? user?.completedLessons ?? [];
  const enrolledCourses =
    learning?.enrolledCourseIds ?? user?.coursesEnrolled ?? [];
  const completedCourses = learning?.completedCourseIds ?? [];
  const experience = user?.experience;
  const displayName = user?.displayName;

  return (
    <main className='mx-auto w-full max-w-6xl px-4 py-8 text-left sm:px-6 sm:py-10'>
      <section className='overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--code-bg)] p-6 shadow-[var(--shadow)] sm:p-8'>
        <div className='flex items-center justify-between gap-4 sm:gap-8'>
          <div className='max-w-3xl'>
            <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]'>
              Learning dashboard
            </p>
            <h1 className='mt-3 text-4xl font-semibold tracking-tight text-[var(--text-h)] sm:text-5xl'>
              {displayName
                ? `Keep going, ${displayName}.`
                : 'Keep learning at your pace.'}
            </h1>
            <p className='mt-4 max-w-2xl text-lg text-[var(--text)]'>
              Pick up your saved lesson or choose a new course when you are
              ready.
            </p>
          </div>
          <img
            src={TargetHero}
            alt=''
            aria-hidden='true'
            className='w-20 shrink-0 object-contain drop-shadow-sm sm:w-24 lg:w-28'
          />
        </div>
      </section>

      {status === 'loading' && (
        <div
          role='status'
          aria-live='polite'
          className='mt-8 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-8 text-center shadow-[var(--shadow)]'
        >
          <RefreshCw
            aria-hidden='true'
            className='mx-auto motion-safe:animate-spin text-[var(--accent)]'
          />
          <p className='mt-3 text-[var(--text)]'>Loading your learning plan…</p>
        </div>
      )}

      {status === 'ready' && error && (
        <div
          role='alert'
          className='mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100 sm:flex-row sm:items-center'
        >
          <p>{getErrorMessage(error)}</p>
          <button
            type='button'
            onClick={retry}
            className='inline-flex shrink-0 items-center justify-center gap-2 border border-current px-4 py-2 text-sm font-semibold transition hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:hover:bg-white/10'
          >
            <RefreshCw aria-hidden='true' size={16} />
            Try again
          </button>
        </div>
      )}

      {status === 'ready' && (
        <>
          <section className='mt-8' aria-labelledby='resume-heading'>
            <h2
              id='resume-heading'
              className='text-2xl font-semibold text-[var(--text-h)]'
            >
              Continue learning
            </h2>
            {resume && resumeLink ? (
              <div className='mt-4 flex flex-col justify-between gap-6 rounded-2xl border border-[var(--border)] bg-[var(--accent-bg)] p-6 shadow-[var(--shadow)] sm:flex-row sm:items-center sm:p-7'>
                <div className='flex min-w-0 items-start gap-4'>
                  <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg)] text-[var(--accent)]'>
                    <BookOpen aria-hidden='true' size={23} />
                  </span>
                  <div className='min-w-0'>
                    <p className='text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text)]'>
                      Resume course
                    </p>
                    <h3 className='mt-1 truncate text-2xl font-semibold text-[var(--text-h)]'>
                      {resume.lessonName || 'Continue your lesson'}
                    </h3>
                    <p className='mt-1 text-[var(--text)]'>
                      {resume.courseName}
                    </p>
                    {resume.pageNumber && resume.totalPages && (
                      <p className='mt-2 text-sm text-[var(--text)]'>
                        Page {resume.pageNumber} of {resume.totalPages}
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  to={resumeLink}
                  className='inline-flex shrink-0 items-center justify-center gap-2 bg-[var(--accent-bold)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
                >
                  Resume lesson
                  <ArrowRight aria-hidden='true' size={17} />
                </Link>
              </div>
            ) : (
              <div className='mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)] p-7'>
                <h3 className='text-xl font-semibold text-[var(--text-h)]'>
                  No lesson is waiting for you
                </h3>
                <p className='mt-2 max-w-xl text-[var(--text)]'>
                  Browse the catalog and choose a course when you are ready to
                  begin.
                </p>
                <Link
                  to='/courses'
                  className='mt-5 inline-flex items-center gap-2 bg-[var(--accent-bold)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
                >
                  Browse courses
                  <ArrowRight aria-hidden='true' size={16} />
                </Link>
              </div>
            )}
          </section>

          <section className='mt-10' aria-labelledby='stats-heading'>
            <h2
              id='stats-heading'
              className='text-2xl font-semibold text-[var(--text-h)]'
            >
              Your learning stats
            </h2>
            <dl className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <StatCard
                icon={Trophy}
                label='Experience'
                value={
                  typeof experience === 'number' ? `${experience} XP` : '—'
                }
              />
              <StatCard
                icon={CheckCircle2}
                label='Lessons completed'
                value={
                  Array.isArray(completedLessons)
                    ? completedLessons.length
                    : '—'
                }
              />
              <StatCard
                icon={GraduationCap}
                label='Courses enrolled'
                value={
                  Array.isArray(enrolledCourses) ? enrolledCourses.length : '—'
                }
              />
              <StatCard
                icon={BadgeCheck}
                label='Courses completed'
                value={
                  Array.isArray(completedCourses)
                    ? completedCourses.length
                    : '—'
                }
              />
            </dl>
          </section>

          <section className='mt-10' aria-labelledby='courses-heading'>
            <div className='flex flex-wrap items-end justify-between gap-3'>
              <div>
                <h2
                  id='courses-heading'
                  className='text-2xl font-semibold text-[var(--text-h)]'
                >
                  Explore courses
                </h2>
                <p className='mt-1 text-[var(--text)]'>
                  Choose a path for your next money skill.
                </p>
              </div>
              <Link
                to='/courses'
                className='inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
              >
                View all courses
                <ArrowRight aria-hidden='true' size={16} />
              </Link>
            </div>
            {coursesStatus === 'ready' && courses.length === 0 ? (
              <p className='mt-5 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)] p-6 text-[var(--text)]'>
                No published courses are available right now.
              </p>
            ) : coursesStatus === 'ready' ? (
              <ul className='mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {courses.slice(0, 6).map((course, index) => {
                  const id = getId(course);
                  return (
                    <li key={id ?? index}>
                      <Link
                        to={id ? `/courses/${id}` : '#'}
                        className='group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:shadow-[var(--nav-shadow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
                        aria-disabled={!id}
                      >
                        <h3 className='text-lg font-semibold text-[var(--text-h)]'>
                          {course.name}
                        </h3>
                        <div className='mt-4 flex flex-wrap gap-3 text-sm text-[var(--text)]'>
                          <span className='inline-flex items-center gap-1.5'>
                            <BookOpen aria-hidden='true' size={15} />
                            {course.lessonCount ??
                              course.lessons?.length ??
                              0}{' '}
                            lessons
                          </span>
                          <span className='inline-flex items-center gap-1.5'>
                            <Clock3 aria-hidden='true' size={15} />
                            {formatMinutes(
                              course.totalEstimatedDurationInMinutes,
                            )}
                          </span>
                        </div>
                        <span className='mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]'>
                          View course
                          <ArrowRight
                            aria-hidden='true'
                            size={16}
                            className='transition group-hover:translate-x-1'
                          />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </section>
        </>
      )}
    </main>
  );
}
