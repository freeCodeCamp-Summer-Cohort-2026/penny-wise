import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';

export default function RequireAuth({ children, allowedRole }) {
  const { auth, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <main className='mx-auto w-full max-w-4xl px-4 py-12 text-left'>
        <p role='status' className='text-[var(--text)]'>
          Checking your session…
        </p>
      </main>
    );
  }

  if (!auth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (allowedRole && auth.user?.role !== allowedRole) {
    return (
      <main className='mx-auto w-full max-w-3xl px-4 py-12'>
        <section className='rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-8 text-left shadow-[var(--shadow)]'>
          <p className='text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent)]'>
            Learning access
          </p>
          <h1 className='mt-2 text-3xl font-semibold text-[var(--text-h)]'>
            This area is for learners
          </h1>
          <p className='mt-3 text-[var(--text)]'>
            You can browse the course catalog, but tracked lessons and progress
            are available from a learner account.
          </p>
          <Link
            to='/courses'
            className='mt-6 inline-flex bg-[var(--accent-bold)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
          >
            Browse courses
          </Link>
        </section>
      </main>
    );
  }

  return children;
}
