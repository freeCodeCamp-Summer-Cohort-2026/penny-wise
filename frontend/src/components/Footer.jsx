import { Link } from 'react-router-dom';
import { BookOpen, CircleUser, House, LogIn, UserPlus } from 'lucide-react';
import Dollar from '../assets/dollar.png';
import { useAuth } from '../lib/useAuth';

const footerLinkClass =
  'inline-flex items-center gap-2 rounded-lg text-sm text-[var(--text)] transition hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]';

function FooterColumn({ title, children }) {
  return (
    <div>
      <h2 className='text-sm font-semibold tracking-wide text-[var(--text-h)] uppercase'>
        {title}
      </h2>
      <ul className='mt-4 space-y-3'>{children}</ul>
    </div>
  );
}

function FooterItem({ to, icon: Icon, children }) {
  return (
    <li>
      <Link to={to} className={footerLinkClass}>
        <Icon aria-hidden='true' size={16} />
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  const { auth } = useAuth();
  const isLearner = auth?.user?.role === 'learner';

  return (
    <footer className='mt-auto border-t border-[var(--border)] bg-[var(--code-bg)] text-left'>
      <div className='mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12'>
        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]'>
          <div>
            <Link
              to='/'
              aria-label='Penny Wise home'
              className='inline-flex items-center gap-2 rounded-full pr-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]'>
              <span className='relative block h-9 w-9 shrink-0'>
                <span
                  aria-hidden='true'
                  className='absolute inset-0 flex items-center justify-center text-xl font-black leading-none'>
                  $
                </span>
                <img
                  src={Dollar}
                  alt=''
                  width={36}
                  height={36}
                  decoding='async'
                  className='absolute inset-0 h-full w-full object-contain'
                />
              </span>
              <span className='text-lg font-bold leading-none text-[var(--text-h)]'>
                Penny Wise
              </span>
            </Link>
            <p className='mt-4 max-w-xs text-sm text-[var(--text)]'>
              Browse practical courses, choose a lesson, and build confidence
              one focused activity at a time.
            </p>
          </div>

          <FooterColumn title='Learn'>
            <FooterItem to='/courses' icon={BookOpen}>
              Course catalog
            </FooterItem>
            {isLearner && (
              <FooterItem to='/dashboard' icon={House}>
                Dashboard
              </FooterItem>
            )}
            {auth ? (
              <FooterItem to='/profile' icon={CircleUser}>
                My profile
              </FooterItem>
            ) : (
              <FooterItem to='/signup' icon={UserPlus}>
                Create account
              </FooterItem>
            )}
          </FooterColumn>

          <FooterColumn title='Account'>
            {auth ? (
              <>
                <FooterItem to='/courses' icon={BookOpen}>
                  Continue learning
                </FooterItem>
                <FooterItem to='/profile' icon={CircleUser}>
                  Profile settings
                </FooterItem>
              </>
            ) : (
              <>
                <FooterItem to='/login' icon={LogIn}>
                  Log in
                </FooterItem>
                <FooterItem to='/signup' icon={UserPlus}>
                  Sign up
                </FooterItem>
              </>
            )}
          </FooterColumn>
        </div>

        <div className='mt-10 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-sm text-[var(--text)] sm:flex-row sm:items-center sm:justify-between'>
          <p>
            &copy; {new Date().getFullYear()} Penny Wise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
