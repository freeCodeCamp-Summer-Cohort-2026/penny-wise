import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Clock3, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import LessonArtwork from '../assets/Lesson-artwork.svg';
import { getCourses } from '../lib/api/penny-wise';
import { formatMinutes, getId } from '../utils/courseData';

export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  const loadCourses = useCallback(async (signal) => {
    setStatus('loading');
    setError(null);

    try {
      const data = await getCourses(signal);
      setCourses(Array.isArray(data?.courses) ? data.courses : []);
      setStatus('ready');
    } catch (loadError) {
      if (signal?.aborted || loadError?.code === 'ERR_CANCELED') return;
      setError(loadError);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      loadCourses(controller.signal);
    }, 0);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [loadCourses]);

  const retry = () => {
    const controller = new AbortController();
    loadCourses(controller.signal);
  };

  return (
    <main className='mx-auto w-full max-w-6xl px-4 py-8 text-left sm:px-6 sm:py-10'>
      <section className='max-w-3xl'>
        <p className='text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]'>
          Course catalog
        </p>
        <h1 className='mt-3 text-4xl font-semibold tracking-tight text-[var(--text-h)] sm:text-5xl'>
          Find your next money skill
        </h1>
        <p className='mt-4 max-w-2xl text-lg text-[var(--text)]'>
          Browse practical courses, choose a lesson, and build confidence one
          focused activity at a time.
        </p>
      </section>

      <section className='mt-10' aria-labelledby='catalog-heading'>
        <div className='mb-5 flex items-center justify-between gap-4'>
          <h2
            id='catalog-heading'
            className='text-2xl font-semibold text-[var(--text-h)]'
          >
            All courses
          </h2>
          {status === 'ready' && (
            <p className='text-sm text-[var(--text)]'>
              {courses.length} {courses.length === 1 ? 'course' : 'courses'}
            </p>
          )}
        </div>

        {status === 'loading' && (
          <div
            role='status'
            aria-live='polite'
            className='rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-8 text-center shadow-[var(--shadow)]'
          >
            <RefreshCw
              aria-hidden='true'
              className='mx-auto motion-safe:animate-spin text-[var(--accent)]'
            />
            <p className='mt-3 text-[var(--text)]'>Loading courses…</p>
          </div>
        )}

        {status === 'error' && (
          <div
            role='alert'
            className='rounded-2xl border border-red-300 bg-red-50 p-6 text-red-900 dark:border-red-800 dark:bg-red-950/30 dark:text-red-100'
          >
            <h3 className='font-semibold'>Courses could not load</h3>
            <p className='mt-2'>
              {error?.error ||
                error?.message ||
                'Please try again in a moment.'}
            </p>
            <button
              type='button'
              onClick={retry}
              className='mt-5 inline-flex items-center gap-2 bg-[var(--accent-bold)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
            >
              <RefreshCw aria-hidden='true' size={16} />
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && courses.length === 0 && (
          <div className='rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg)] p-8 text-center'>
            <BookOpen
              aria-hidden='true'
              className='mx-auto text-[var(--accent)]'
            />
            <h3 className='mt-3 text-lg font-semibold text-[var(--text-h)]'>
              No courses are available yet
            </h3>
            <p className='mt-2 text-[var(--text)]'>
              Check back soon for your next learning path.
            </p>
          </div>
        )}

        {status === 'ready' && courses.length > 0 && (
          <ul className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {courses.map((course, index) => {
              const courseId = getId(course);
              return (
                <li key={courseId ?? index}>
                  <Link
                    to={courseId ? `/courses/${courseId}` : '#'}
                    className='group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-[var(--nav-shadow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
                    aria-disabled={!courseId}
                  >
                    <div className='relative flex h-40 items-center justify-center overflow-hidden bg-[var(--accent-bg)]'>
                      <img
                        src={LessonArtwork}
                        alt=''
                        className='h-32 w-32 object-contain transition group-hover:scale-105'
                      />
                      {course.published === true && (
                        <span className='absolute right-3 top-3 rounded-full bg-[var(--bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-h)]'>
                          Published
                        </span>
                      )}
                    </div>
                    <div className='flex flex-1 flex-col p-5'>
                      <h3 className='text-xl font-semibold text-[var(--text-h)]'>
                        {course.name}
                      </h3>
                      <div className='mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--text)]'>
                        <span className='inline-flex items-center gap-1.5'>
                          <BookOpen aria-hidden='true' size={16} />
                          {course.lessonCount ??
                            course.lessons?.length ??
                            0}{' '}
                          lessons
                        </span>
                        <span className='inline-flex items-center gap-1.5'>
                          <Clock3 aria-hidden='true' size={16} />
                          {formatMinutes(
                            course.totalEstimatedDurationInMinutes,
                          )}
                        </span>
                      </div>
                      <span className='mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]'>
                        View course
                        <ArrowRight
                          aria-hidden='true'
                          size={16}
                          className='transition group-hover:translate-x-1'
                        />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
