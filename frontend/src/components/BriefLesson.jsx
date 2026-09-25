import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  Lightbulb,
  Sparkles,
  School,
} from 'lucide-react';

const imageSource = (image) =>
  typeof image === 'string' ? { url: image } : image;

export default function BriefLesson({ lesson }) {
  if (!lesson) return null;

  const heroImage = imageSource(lesson.heroImage);
  const sections = Array.isArray(lesson.sections) ? lesson.sections : [];
  const readTime = lesson.readTimeMinutes || 2;

  return (
    <article className='brief-lesson mt-4 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)]'>
      <header className='brief-lesson-hero relative isolate overflow-hidden'>
        {heroImage?.url && (
          <img
            src={heroImage.url}
            alt={heroImage.alt || ''}
            className='absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105'
            fetchPriority='high'
            decoding='async'
          />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-[#120d24]/90 via-[#120d24]/45 to-[#120d24]/10' />
        <div className='relative z-10 flex min-h-72 flex-col justify-end gap-5 p-6 text-white sm:min-h-96 sm:p-10'>
          <div className='flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/80'>
            <span className='inline-flex items-center gap-2 rounded border border-white/30 bg-white/15 px-3 py-1.5 backdrop-blur-md'>
              <School size={14} aria-hidden='true' />
              Quick lesson
            </span>
            <span className='inline-flex items-center gap-1.5 rounded   border border-white/20 bg-black/15 px-3 py-1.5 backdrop-blur-md'>
              <Clock3 size={14} aria-hidden='true' />
              {readTime} min read
            </span>
          </div>
          <div className='max-w-2xl'>
            <p className='mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#d8ff74]'>
              {lesson.kicker || 'A quick money idea'}
            </p>
            <h2 className='font-serif text-4xl leading-[0.98] tracking-tight text-white sm:text-6xl'>
              {lesson.title}
            </h2>
          </div>
        </div>
      </header>

      <div className='px-5 py-7 sm:px-9 sm:py-10'>
        <p className='max-w-2xl text-lg leading-relaxed text-[var(--text-h)] sm:text-xl'>
          {lesson.introduction}
        </p>

        <div className='mt-9 space-y-9'>
          {sections.map((section, index) => {
            const sectionImage = imageSource(section.image);
            return (
              <section
                key={`${section.heading}-${index}`}
                className='grid gap-4 sm:grid-cols-[3rem_1fr] sm:gap-5'
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-bg)] text-sm font-black text-[var(--accent-bold)] dark:text-[var(--accent)] sm:mt-1'>
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className='text-xl font-semibold tracking-tight text-[var(--text-h)] sm:text-2xl'>
                    {section.heading}
                  </h3>
                  <p className='mt-2 max-w-2xl leading-relaxed text-[var(--text)]'>
                    {section.body}
                  </p>
                  {section.note && (
                    <div className='mt-4 flex max-w-2xl gap-3 rounded-2xl border border-[var(--accent-border)] bg-[var(--accent-bg)] p-4 text-sm leading-relaxed text-[var(--text-h)]'>
                      <Lightbulb
                        size={18}
                        className='mt-0.5 shrink-0 text-[var(--accent-bold)] dark:text-[var(--accent)]'
                        aria-hidden='true'
                      />
                      <p>{section.note}</p>
                    </div>
                  )}
                  {sectionImage?.url && (
                    <figure className='mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--code-bg)]'>
                      <img
                        src={sectionImage.url}
                        alt={sectionImage.alt || ''}
                        className='h-48 w-full object-cover sm:h-64'
                        loading='lazy'
                        decoding='async'
                      />
                      {sectionImage.caption && (
                        <figcaption className='flex items-center gap-2 px-4 py-3 text-xs text-[var(--text)]'>
                          <BookOpen
                            size={14}
                            className='shrink-0'
                            aria-hidden='true'
                          />
                          {sectionImage.caption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {lesson.takeaway && (
          <aside className='mt-10 flex gap-4 rounded-2xl border border-[#b9db54]/50 bg-[#efffc9] p-5 text-[#26320f] shadow-sm dark:border-[#b9db54]/30 dark:bg-[#26320f] dark:text-[#efffc9] sm:p-6'>
            <Sparkles
              size={22}
              className='mt-0.5 shrink-0'
              aria-hidden='true'
            />
            <div>
              <p className='text-xs font-black uppercase tracking-[0.18em] opacity-70'>
                One thing to remember
              </p>
              <p className='mt-1 text-lg font-semibold leading-snug'>
                {lesson.takeaway}
              </p>
            </div>
          </aside>
        )}

        <div className='mt-8 flex flex-wrap items-center gap-3 text-sm text-[var(--text)]'>
          <span className='inline-flex items-center gap-2 font-semibold text-[var(--text-h)]'>
            <ArrowUpRight size={16} aria-hidden='true' />
            Ready to try the idea?
          </span>
          <a
            href='#practice'
            aria-label='Jump to the practice activity'
            className='rounded-full border border-[var(--accent-border)] px-4 py-2 font-semibold text-[var(--accent-bold)] transition hover:bg-[var(--accent-bg)] dark:text-[var(--accent)]'
          >
            Jump to practice
          </a>
        </div>
      </div>
    </article>
  );
}
