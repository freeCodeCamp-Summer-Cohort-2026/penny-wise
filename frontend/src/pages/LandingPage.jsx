import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  PiggyBank,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { cn } from '../utils/utils';
import {
  BankDealIllustration,
  BudgetingIllustration,
  BuyingHouseIllustration,
  EconomyAnalysisIllustration,
  FinancesIllustration,
  InequalityIllustration,
} from '../assets/illustrations';

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 bg-[var(--accent-bold)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]';

const secondaryButtonClass =
  'inline-flex items-center justify-center gap-2 border border-[var(--border)] bg-[var(--bg)] px-5 py-3 text-sm font-semibold text-[var(--text-h)] transition hover:bg-[var(--code-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]';

const BENEFITS = [
  {
    icon: PiggyBank,
    title: 'Build your first budget',
    description:
      'Allocate a fixed amount across food, transport, entertainment, savings, etc.',
  },
  {
    icon: Target,
    title: 'The Big Goal',
    description:
      'Combine earning, saving, budgeting and spending decisions to reach a major goal.',
  },
  {
    icon: TrendingUp,
    title: 'The Price Tag',
    description:
      'Compare prices, quantities, and unit prices to find the better deal.',
  },
  {
    icon: GraduationCap,
    title: 'Life Simulation',
    description:
      'A sandbox where the player gets income, expenses, goals and choices and tries to finish the month with the best outcome',
  },
];

const TOPICS = [
  {
    src: BudgetingIllustration,
    alt: 'Illustration of a person planning a monthly budget',
    title: 'Budgeting',
    description: 'Plan your month, spot leaks, and keep more of what you earn.',
  },
  {
    src: BankDealIllustration,
    alt: 'Illustration of a handshake at a bank counter',
    title: 'Banking and credit',
    description:
      'Accounts, loans, and borrowing terms explained without the jargon.',
  },
  {
    src: BuyingHouseIllustration,
    alt: 'Illustration of people looking at a house they want to buy',
    title: 'Big goals',
    description:
      'Break a house deposit or emergency fund into reachable milestones.',
  },
  {
    src: InequalityIllustration,
    alt: 'Illustration comparing incomes across different groups',
    title: 'How money moves',
    description:
      'Read the economy around you and see how it affects a single household.',
  },
];

function TopicCard({ src, alt, title, description }) {
  return (
    <li className='group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-[var(--nav-shadow)]'>
      <div className='flex h-44 items-center justify-center overflow-hidden bg-[var(--accent-bg)] px-4'>
        <img
          src={src}
          alt={alt}
          loading='lazy'
          className='h-36 w-auto object-contain transition duration-300 group-hover:scale-105'
        />
      </div>
      <div className='flex flex-1 flex-col p-5'>
        <h3 className='text-xl font-semibold text-[var(--text-h)]'>{title}</h3>
        <p className='mt-2 text-[15px] text-[var(--text)]'>{description}</p>
      </div>
    </li>
  );
}

export default function LandingPage() {
  const { auth } = useAuth();
  const isLearner = auth?.user?.role === 'learner';
  const primaryHref = isLearner ? '/dashboard' : '/signup';
  const primaryLabel = isLearner ? 'Go to dashboard' : 'Start learning free';

  return (
    <main className='mx-auto w-full max-w-6xl px-4 py-8 text-left sm:px-6 sm:py-10'>
      <section className='grid items-center gap-10 lg:grid-cols-2 lg:gap-14'>
        <div>
          <p className='text-sm font-semibold tracking-[0.18em] text-[var(--accent)] uppercase'>
            Pre-teen and teenagers managing their finances
          </p>
          <h1 className='m-0 mt-4 text-4xl leading-[1.08] font-semibold tracking-tight text-[var(--text-h)] sm:text-5xl'>
            Learn through byte-sized lessons and lab
          </h1>
          <p className='mt-5 max-w-xl text-lg text-[var(--text)]'>
            This project should produce an educational and interactive
            application to increase economic literacy. It should achieve this by
            using gamification.
          </p>

          <div className='mt-8 flex flex-wrap gap-3'>
            <Link to={primaryHref} className={primaryButtonClass}>
              {primaryLabel}
              <ArrowRight aria-hidden='true' size={16} />
            </Link>
            <Link to='/courses' className={secondaryButtonClass}>
              <BookOpen aria-hidden='true' size={16} />
              Browse courses
            </Link>
          </div>
        </div>

        <div className='relative'>
          <div className='overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--accent-bg)] p-6 shadow-[var(--shadow)]'>
            <img
              src={FinancesIllustration}
              alt='Illustration of someone organising their finances with coins and charts'
              className='mx-auto h-64 w-auto object-contain sm:h-80'
            />
          </div>
          <div className='relative mx-auto -mt-8 w-full max-w-xs rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 shadow-[var(--nav-shadow)] sm:-mt-10'>
            <p className='text-xs tracking-[0.18em] text-[var(--text)] uppercase'>
              This week
            </p>
            <p className='mt-1 text-2xl font-semibold text-[var(--text-h)]'>
              Needs vs Wants
            </p>
            <p className='mt-1 text-sm text-[var(--text)]'>
              Streaks and XP rewards to make learning more fun.
            </p>
          </div>
        </div>
      </section>

      <section className='mt-20' aria-labelledby='benefits-heading'>
        <div className='max-w-3xl'>
          <p className='text-sm font-semibold tracking-[0.18em] text-[var(--accent)] uppercase'>
            Why Penny Wise
          </p>
          <h2
            id='benefits-heading'
            className='mt-3 text-3xl font-semibold tracking-tight text-[var(--text-h)] sm:text-4xl'>
            Everything you need to get money under control
          </h2>
          <p className='mt-4 text-lg text-[var(--text)]'>
            Learners handle simulated money and budgets directly in the browser
            (counting, making change, allocating a budget) - never just passive
            reading.
          </p>
        </div>

        <ul className='mt-10 grid gap-5 sm:grid-cols-2'>
          {BENEFITS.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className='flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 shadow-[var(--shadow)]'>
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                  'bg-[var(--accent-bg)] text-[var(--accent)]'
                )}>
                <Icon aria-hidden='true' size={20} />
              </span>
              <div>
                <h3 className='text-lg font-semibold text-[var(--text-h)]'>
                  {title}
                </h3>
                <p className='mt-1.5 text-[15px] text-[var(--text)]'>
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className='mt-20' aria-labelledby='topics-heading'>
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div className='max-w-3xl'>
            <p className='text-sm font-semibold tracking-[0.18em] text-[var(--accent)] uppercase'>
              Course topics
            </p>
            <h2
              id='topics-heading'
              className='mt-3 text-3xl font-semibold tracking-tight text-[var(--text-h)] sm:text-4xl'>
              Pick the money problem you want solved
            </h2>
            <p className='mt-4 text-lg text-[var(--text)]'>
              Start with one topic and build from there. Every course ends with
              something you can apply this week.
            </p>
          </div>
          <Link to='/courses' className={cn(secondaryButtonClass, 'shrink-0')}>
            See all courses
            <ArrowRight aria-hidden='true' size={16} />
          </Link>
        </div>

        <ul className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {TOPICS.map((topic) => (
            <TopicCard key={topic.title} {...topic} />
          ))}
        </ul>
      </section>

      <section className='relative mt-20 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--accent-bg)] px-6 py-12 text-center shadow-[var(--shadow)] sm:px-12'>
        <img
          src={EconomyAnalysisIllustration}
          alt=''
          aria-hidden='true'
          loading='lazy'
          className='pointer-events-none absolute -right-10 -bottom-10 w-72 opacity-10'
        />
        <img
          src={BudgetingIllustration}
          alt=''
          aria-hidden='true'
          loading='lazy'
          className='pointer-events-none absolute -top-10 -left-10 hidden w-64 opacity-10 sm:block'
        />
        <div className='relative'>
          <h2 className='m-0 text-3xl font-semibold tracking-tight text-[var(--text-h)] sm:text-4xl'>
            Get started today
          </h2>
          <p className='mx-auto mt-4 max-w-xl text-lg text-[var(--text)]'>
            Create a free account and finish your first money lesson before your
            next coffee break.
          </p>
          <div className='mt-8 flex flex-wrap justify-center gap-3'>
            <Link to={primaryHref} className={primaryButtonClass}>
              {primaryLabel}
              <ArrowRight aria-hidden='true' size={16} />
            </Link>
            <Link to='/courses' className={secondaryButtonClass}>
              Browse the catalog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
