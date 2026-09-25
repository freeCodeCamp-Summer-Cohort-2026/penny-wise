import { ArrowRight, BookOpen, Clock3, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { modules } from '../data/modules';
import { useCourseCatalog } from '../lib/useCourseCatalog';

const normalize = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const findRemoteCourse = (courses, module) =>
  courses.find((course) => normalize(course.name) === normalize(module.name));

const getLessonDetails = (remoteCourse, lesson) => {
  const remoteLesson = remoteCourse?.lessons.find(
    (item) => normalize(item.name) === normalize(lesson.title),
  );

  return {
    ...lesson,
    description: remoteLesson?.description || lesson.description,
    duration:
      remoteLesson?.estimatedDurationOfCompletionInMinutes || lesson.duration,
    pathCount: remoteLesson?.pages?.length || 1,
  };
};

const BriefLessonPreview = ({ lesson, moduleId }) => {
  if (!lesson) return null;

  return (
    <Link
      to={`/modules/${moduleId}/course/1`}
      className='group grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)] transition hover:-translate-y-1 hover:border-[var(--accent-border)] sm:grid-cols-[minmax(0,1fr)_minmax(15rem,0.8fr)]'
    >
      <div className='order-2 flex flex-col justify-center p-6 sm:order-1 sm:p-8'>
        <div className='flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--accent-bold)] dark:text-[var(--accent)]'>
          <span className='inline-flex items-center gap-2 rounded-full bg-[var(--accent-bg)] px-3 py-1.5'>
            <Sparkles size={14} aria-hidden='true' />
            Quick lesson
          </span>
          <span className='inline-flex items-center gap-1.5 text-[var(--text)]'>
            <Clock3 size={14} aria-hidden='true' />
            {lesson.readTimeMinutes || 2} min read
          </span>
        </div>
        <h2 className='mt-5 max-w-xl font-serif text-3xl leading-tight tracking-tight text-[var(--text-h)] sm:text-4xl'>
          {lesson.title}
        </h2>
        <p className='mt-3 max-w-xl leading-relaxed text-[var(--text)]'>
          {lesson.introduction}
        </p>
        <span className='mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--accent-bold)] dark:text-[var(--accent)]'>
          Read the quick lesson
          <ArrowRight
            size={16}
            className='transition-transform group-hover:translate-x-1'
            aria-hidden='true'
          />
        </span>
      </div>
      <div className='relative order-1 min-h-56 overflow-hidden sm:order-2 sm:min-h-full'>
        {lesson.heroImage?.url && (
          <img
            src={lesson.heroImage.url}
            alt={lesson.heroImage.alt || ''}
            className='absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105'
            loading='lazy'
            decoding='async'
          />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-[#120d24]/60 via-transparent to-transparent' />
      </div>
    </Link>
  );
};

const LessonCard = ({ lesson, moduleId }) => (
  <Link
    to={`/modules/${moduleId}/course/${lesson.id}`}
    className='group flex min-h-44 flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[var(--accent-border)] hover:shadow-[var(--shadow)]'
  >
    <div className='flex items-center justify-between gap-3'>
      <span className='rounded-full bg-[var(--accent-bg)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--accent-bold)] dark:text-[var(--accent)]'>
        Interactive path
      </span>
      <span className='text-sm font-black text-[var(--text)] opacity-50'>
        {String(lesson.id).padStart(2, '0')}
      </span>
    </div>
    <h3 className='mt-5 text-xl font-semibold text-[var(--text-h)]'>
      {lesson.title}
    </h3>
    <p className='mt-2 text-sm leading-relaxed text-[var(--text)]'>
      {lesson.description}
    </p>
    <div className='mt-auto flex items-center justify-between gap-3 pt-5 text-sm font-semibold text-[var(--text)]'>
      <span className='inline-flex items-center gap-1.5'>
        <Clock3 size={15} aria-hidden='true' />
        {lesson.duration} min
      </span>
      <ArrowRight
        size={17}
        className='text-[var(--accent-bold)] transition-transform group-hover:translate-x-1 dark:text-[var(--accent)]'
        aria-hidden='true'
      />
    </div>
  </Link>
);

const ModulesPage = () => {
  const { moduleId } = useParams();
  const { courses } = useCourseCatalog();
  const selectedModule = moduleId
    ? modules.find((module) => module.id === Number(moduleId))
    : null;

  if (moduleId && !selectedModule) {
    return (
      <main className='mx-auto w-full max-w-7xl p-4 text-left sm:p-6'>
        <h1 className='text-3xl font-semibold text-[var(--text-h)]'>
          Module not found
        </h1>
        <Link
          to='/modules'
          className='mt-4 inline-block rounded-full border border-[var(--accent-border)] px-4 py-2 text-sm font-semibold text-[var(--accent-bold)] dark:text-[var(--accent)]'
        >
          Back to modules
        </Link>
      </main>
    );
  }

  if (selectedModule) {
    const remoteCourse = findRemoteCourse(courses, selectedModule);
    const remoteBrief = remoteCourse?.lessons.find(
      (lesson) => lesson.briefLesson,
    )?.briefLesson;
    const briefLesson = remoteBrief || selectedModule.briefLesson;
    const lessonDetails = selectedModule.lessons.map((lesson) =>
      getLessonDetails(remoteCourse, lesson),
    );

    return (
      <main className='mx-auto w-full max-w-7xl p-4 text-left sm:p-6'>
        <Link
          to='/modules'
          className='inline-flex items-center gap-2 text-sm text-[var(--text)] hover:text-[var(--text-h)] hover:underline'
        >
          <ArrowRight size={16} className='rotate-180' aria-hidden='true' />
          Back to modules
        </Link>

        <header className='mt-6 max-w-3xl'>
          <p className='text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-bold)] dark:text-[var(--accent)]'>
            Module {selectedModule.id.toString().padStart(2, '0')}
          </p>
          <h1 className='mt-2 text-4xl font-semibold tracking-tight text-[var(--text-h)] sm:text-6xl'>
            {selectedModule.name}
          </h1>
          <p className='mt-4 text-lg leading-relaxed text-[var(--text)]'>
            {selectedModule.description}
          </p>
        </header>

        <section className='mt-10' aria-labelledby='quick-lesson-heading'>
          <div className='mb-5 flex items-end justify-between gap-4'>
            <div>
              <p className='text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-bold)] dark:text-[var(--accent)]'>
                Before you practise
              </p>
              <h2
                id='quick-lesson-heading'
                className='mt-2 text-2xl font-semibold text-[var(--text-h)]'
              >
                Start with a bright idea
              </h2>
            </div>
            <BookOpen
              size={24}
              className='text-[var(--accent-bold)] dark:text-[var(--accent)]'
              aria-hidden='true'
            />
          </div>
          <BriefLessonPreview
            lesson={briefLesson}
            moduleId={selectedModule.id}
          />
        </section>

        <section className='mt-12' aria-labelledby='paths-heading'>
          <div className='flex flex-wrap items-end justify-between gap-4'>
            <div>
              <p className='text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-bold)] dark:text-[var(--accent)]'>
                Then make it yours
              </p>
              <h2
                id='paths-heading'
                className='mt-2 text-2xl font-semibold text-[var(--text-h)]'
              >
                Interactive learning paths
              </h2>
            </div>
            <p className='text-sm text-[var(--text)]'>
              {lessonDetails.length} paths · build confidence as you go
            </p>
          </div>
          <div className='mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {lessonDetails.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                moduleId={selectedModule.id}
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className='mx-auto w-full max-w-7xl p-4 text-left sm:p-6'>
      <header className='max-w-3xl'>
        <p className='text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-bold)] dark:text-[var(--accent)]'>
          Learn at your pace
        </p>
        <h1 className='mt-2 text-4xl font-semibold tracking-tight text-[var(--text-h)] sm:text-6xl'>
          Pick a money idea
        </h1>
        <p className='mt-4 text-lg leading-relaxed text-[var(--text)]'>
          Every module opens with a quick, image-rich lesson, then gives you
          interactive paths to practise the idea.
        </p>
      </header>

      <div className='mt-10 space-y-8'>
        {modules.map((module) => {
          const remoteCourse = findRemoteCourse(courses, module);
          const briefLesson =
            remoteCourse?.lessons.find((lesson) => lesson.briefLesson)
              ?.briefLesson || module.briefLesson;

          return (
            <section
              key={module.id}
              className='grid gap-5 rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-5 shadow-sm sm:grid-cols-[1fr_1.4fr] sm:items-center sm:p-7'
            >
              <div>
                <p className='text-xs font-black uppercase tracking-[0.2em] text-[var(--accent-bold)] dark:text-[var(--accent)]'>
                  Module {module.id.toString().padStart(2, '0')}
                </p>
                <h2 className='mt-2 text-2xl font-semibold text-[var(--text-h)]'>
                  {module.name}
                </h2>
                <p className='mt-2 text-sm leading-relaxed text-[var(--text)]'>
                  {module.description}
                </p>
                <Link
                  to={`/modules/${module.id}`}
                  className='mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--accent-bold)] dark:text-[var(--accent)] hover:underline'
                >
                  View module · {module.lessons.length} paths
                  <ArrowRight size={16} aria-hidden='true' />
                </Link>
              </div>
              {briefLesson?.heroImage?.url && (
                <Link
                  to={`/modules/${module.id}`}
                  className='group relative min-h-48 overflow-hidden rounded-2xl'
                >
                  <img
                    src={briefLesson.heroImage.url}
                    alt={briefLesson.heroImage.alt || ''}
                    className='absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105'
                    loading='lazy'
                    decoding='async'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-[#120d24]/85 via-[#120d24]/20 to-transparent' />
                  <div className='absolute inset-x-0 bottom-0 p-5 text-white'>
                    <p className='text-xs font-bold uppercase tracking-[0.18em] text-[#d8ff74]'>
                      Quick lesson · {briefLesson.readTimeMinutes || 2} min
                    </p>
                    <p className='mt-1 text-xl font-semibold'>
                      {briefLesson.title}
                    </p>
                  </div>
                </Link>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
};

export default ModulesPage;
