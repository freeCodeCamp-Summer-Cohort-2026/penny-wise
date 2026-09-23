import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Dollar from '../assets/dollar.png';
import { cn } from '../utils/utils';
import { useState } from 'react';
import { useAuth } from '../lib/useAuth';
import { CircleUser, House, Menu, LogOut } from 'lucide-react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dollarLoaded, setDollarLoaded] = useState(false);
  const [dollarFailed, setDollarFailed] = useState(false);
  return (
    <nav className='navbar fixed top-0 left-0 right-0 py-4 md:rounded-full md:mt-2 max-w-4xl mx-auto w-full px-6 flex items-center justify-between z-20 bg-[var(--nav-bg)] text-[var(--text)] border-b border-[var(--nav-border)] shadow-[var(--nav-shadow)] backdrop-blur-md backdrop-saturate-150 transition-colors duration-300'>
      <Link to='/' className='relative'>
        <button className='w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90'>
          <House />
        </button>
      </Link>
      <Link
        to='/dashboard'
        className='text-xl font-bold flex items-center justify-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap'
      >
        <span className='relative block w-10 h-10 shrink-0'>
          <span
            aria-hidden='true'
            className='absolute inset-0 flex items-center justify-center text-2xl font-black leading-none'
          >
            $
          </span>
          {!dollarFailed && (
            <img
              src={Dollar}
              alt='$'
              width={40}
              height={40}
              decoding='async'
              onLoad={() => setDollarLoaded(true)}
              onError={() => setDollarFailed(true)}
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-200 ${
                dollarLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </span>
        <span className='leading-none'>Penny Wise</span>
      </Link>
      <div className='md:flex hidden gap-4 items-center justify-end relative'>
        <MenuElements />
      </div>
      <button
        aria-label='menu-btn'
        type='button'
        className='flex md:hidden w-9 h-9 items-center justify-center rounded-full transition-colors active:scale-90 hover:bg-gray-100 dark:hover:bg-gray-800'
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu />
      </button>
      <div
        className={cn(
          'absolute top-full left-0 right-0 md:hidden flex flex-col items-stretch gap-2 p-5 bg-[var(--bg)] border-b border-[var(--border)] shadow-[var(--nav-shadow)]',
          isOpen ? '' : 'hidden',
        )}
      >
        <MenuElements onNavigate={() => setIsOpen(false)} />
      </div>
    </nav>
  );
}

function MenuElements({ onNavigate }) {
  const { auth, signOut } = useAuth();
  return (
    <>
      <ThemeToggle
        label='Change Theme'
        className='max-md:w-full max-md:justify-start max-md:gap-2 max-md:rounded-lg max-md:px-3 max-md:hover:bg-gray-100 max-md:dark:hover:bg-gray-800'
      />
      {auth ? (
        <>
          <Link
            to='/profile'
            onClick={onNavigate}
            className='flex items-center max-md:w-full max-md:gap-2 max-md:rounded-lg max-md:px-3 max-md:py-2 max-md:hover:bg-gray-100 max-md:dark:hover:bg-gray-800'
          >
            <span className='flex h-9 w-9 items-center justify-center'>
              {auth.user.avatar ? (
                <img
                  src={auth.user.avatar}
                  alt='avatar'
                  className='rounded-full w-6'
                />
              ) : (
                <CircleUser />
              )}
            </span>
            <span className='hidden text-sm max-md:inline'>Profile</span>
          </Link>
          <button
            onClick={() => {
              signOut();
              onNavigate();
            }}
            className='flex cursor-pointer items-center max-md:w-full max-md:gap-2 max-md:rounded-lg max-md:px-3 max-md:py-2 max-md:hover:bg-gray-100 max-md:dark:hover:bg-gray-800'
          >
            <span className='flex h-9 w-9 items-center justify-center'>
              <LogOut />
            </span>
            <span className='hidden text-sm max-md:inline'>Log Out</span>
          </button>
        </>
      ) : (
        <>
          <Link to='/signup' className='max-md:w-full' onClick={onNavigate}>
            <button className='px-4 py-2 max-md:w-full max-md:rounded-lg bg-[var(--accent-bold)] text-white transition-colors hover:bg-gray-500 dark:hover:bg-gray-800'>
              Sign Up
            </button>
          </Link>
          <Link to='/login' className='max-md:w-full' onClick={onNavigate}>
            <button className='px-4 py-2 max-md:w-full max-md:rounded-lg bg-[var(--accent-bg)] text-[var(--text)] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'>
              Log In
            </button>
          </Link>
        </>
      )}
    </>
  );
}
