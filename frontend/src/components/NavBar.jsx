import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, CircleUser, House, LogOut, Menu } from 'lucide-react';
import Dollar from '../assets/dollar.png';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../lib/useAuth';
import { cn } from '../utils/utils';

const desktopLinkClass = ({ isActive }) =>
  cn(
    'flex h-10 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold text-[var(--text-h)] transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] dark:hover:bg-gray-800',
    isActive && 'bg-[var(--accent-bg)] text-[var(--accent)]',
  );

const mobileLinkClass =
  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[var(--text-h)] transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] dark:hover:bg-gray-800';

function Brand({
  to,
  dollarLoaded,
  dollarFailed,
  setDollarLoaded,
  setDollarFailed,
}) {
  return (
    <Link
      to={to}
      aria-label='Penny Wise home'
      className='flex shrink-0 items-center gap-2 rounded-full pr-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]'
    >
      <span className='relative block h-9 w-9 shrink-0'>
        <span
          aria-hidden='true'
          className='absolute inset-0 flex items-center justify-center text-xl font-black leading-none'
        >
          $
        </span>
        {!dollarFailed && (
          <img
            src={Dollar}
            alt=''
            width={36}
            height={36}
            decoding='async'
            onLoad={() => setDollarLoaded(true)}
            onError={() => setDollarFailed(true)}
            className={cn(
              'absolute inset-0 h-full w-full object-contain transition-opacity duration-200',
              dollarLoaded ? 'opacity-100' : 'opacity-0',
            )}
          />
        )}
      </span>
      <span className='hidden text-lg font-bold leading-none text-[var(--text-h)] sm:inline'>
        Penny Wise
      </span>
    </Link>
  );
}

function MobileMenuElements({ onNavigate }) {
  const { auth, signOut } = useAuth();
  const navigate = useNavigate();
  const isLearner = auth?.user?.role === 'learner';
  const closeMenu = () => onNavigate?.();

  return (
    <>
      <NavLink to='/courses' onClick={closeMenu} className={mobileLinkClass}>
        <span className='flex h-6 w-6 shrink-0 items-center justify-center'>
          <BookOpen aria-hidden='true' size={19} />
        </span>
        Courses
      </NavLink>
      {auth ? (
        <>
          {isLearner && (
            <NavLink
              to='/dashboard'
              onClick={closeMenu}
              className={mobileLinkClass}
            >
              <span className='flex h-6 w-6 shrink-0 items-center justify-center'>
                <House aria-hidden='true' size={19} />
              </span>
              Dashboard
            </NavLink>
          )}
          <NavLink
            to='/profile'
            onClick={closeMenu}
            className={mobileLinkClass}
          >
            <span className='flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--accent-bg)]'>
              {auth.user?.avatar ? (
                <img
                  src={auth.user.avatar}
                  alt=''
                  className='h-6 w-6 rounded-full object-cover'
                />
              ) : (
                <CircleUser aria-hidden='true' size={20} />
              )}
            </span>
            Profile
          </NavLink>
          <ThemeToggle
            label='Change theme'
            labelClassName='text-sm'
            iconClassName='h-6 w-6'
            className='w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-800'
          />
          <button
            type='button'
            onClick={() => {
              signOut();
              navigate('/');
              closeMenu();
            }}
            className={`${mobileLinkClass} cursor-pointer`}
          >
            <span className='flex h-6 w-6 shrink-0 items-center justify-center'>
              <LogOut aria-hidden='true' size={19} />
            </span>
            Log out
          </button>
        </>
      ) : (
        <>
          <ThemeToggle
            label='Change theme'
            labelClassName='text-sm'
            iconClassName='h-6 w-6'
            className='w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-800'
          />
          <div className='grid grid-cols-1 gap-2 pt-1'>
            <Link
              to='/login'
              onClick={closeMenu}
              className='border border-[var(--border)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--text-h)] transition hover:bg-[var(--code-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
            >
              Log in
            </Link>
            <Link
              to='/signup'
              onClick={closeMenu}
              className='bg-[var(--accent-bold)] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
            >
              Sign up
            </Link>
          </div>
        </>
      )}
    </>
  );
}

function DesktopMenuElements() {
  const { auth, signOut } = useAuth();
  const navigate = useNavigate();
  const isLearner = auth?.user?.role === 'learner';

  return (
    <div className='hidden items-center gap-1 lg:flex'>
      <NavLink to='/courses' className={desktopLinkClass} aria-label='Courses'>
        <BookOpen aria-hidden='true' size={19} />
        <span className='hidden xl:inline'>Courses</span>
      </NavLink>

      {auth ? (
        <>
          {isLearner && (
            <NavLink
              to='/dashboard'
              className={desktopLinkClass}
              aria-label='Dashboard'
            >
              <House aria-hidden='true' size={19} />
              <span className='hidden xl:inline'>Dashboard</span>
            </NavLink>
          )}
          <span
            aria-hidden='true'
            className='mx-1 hidden h-6 w-px bg-[var(--border)] xl:block'
          />
          <NavLink
            to='/profile'
            className={desktopLinkClass}
            aria-label='Profile'
          >
            <span className='flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--accent-bg)]'>
              {auth.user?.avatar ? (
                <img
                  src={auth.user.avatar}
                  alt=''
                  className='h-7 w-7 object-cover'
                />
              ) : (
                <CircleUser aria-hidden='true' size={20} />
              )}
            </span>
            <span className='hidden xl:inline'>Profile</span>
          </NavLink>
          <ThemeToggle className='h-10 w-10 shrink-0' />
          <button
            type='button'
            aria-label='Log out'
            onClick={() => {
              signOut();
              navigate('/');
            }}
            className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[var(--text-h)] transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] dark:hover:bg-gray-800'
          >
            <LogOut aria-hidden='true' size={19} />
          </button>
        </>
      ) : (
        <>
          <ThemeToggle className='h-10 w-10 shrink-0' />
          <Link
            to='/login'
            className='flex h-10 items-center px-3 text-sm font-semibold text-[var(--text-h)] transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] dark:hover:bg-gray-800'
          >
            Log in
          </Link>
          <Link
            to='/signup'
            className='flex h-10 items-center bg-[var(--accent-bold)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--accent-bold-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]'
          >
            Sign up
          </Link>
        </>
      )}
    </div>
  );
}

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dollarLoaded, setDollarLoaded] = useState(false);
  const [dollarFailed, setDollarFailed] = useState(false);
  const { auth } = useAuth();

  return (
    <nav className='navbar fixed top-0 left-0 right-0 z-20 mx-auto flex w-full max-w-5xl items-center justify-between border-b border-[var(--nav-border)] bg-[var(--nav-bg)] px-4 py-3 shadow-[var(--nav-shadow)] backdrop-blur-md backdrop-saturate-150 lg:mt-3 lg:rounded-full lg:border'>
      <Brand
        to={auth?.user?.role === 'learner' ? '/dashboard' : '/'}
        dollarLoaded={dollarLoaded}
        dollarFailed={dollarFailed}
        setDollarLoaded={setDollarLoaded}
        setDollarFailed={setDollarFailed}
      />
      <DesktopMenuElements />
      <button
        aria-label='Toggle navigation menu'
        aria-expanded={isOpen}
        type='button'
        className='flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] dark:hover:bg-gray-800 lg:hidden'
        onClick={() => setIsOpen((open) => !open)}
      >
        <Menu aria-hidden='true' />
      </button>
      <div
        className={cn(
          'absolute top-full left-0 right-0 max-h-[calc(100svh-72px)] flex-col gap-1 overflow-y-auto border-b border-[var(--border)] bg-[var(--bg)] p-4 shadow-[var(--nav-shadow)] lg:hidden',
          isOpen ? 'flex' : 'hidden',
        )}
      >
        <MobileMenuElements onNavigate={() => setIsOpen(false)} />
      </div>
    </nav>
  );
}
