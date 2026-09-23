import { LoaderCircle, ChevronDown, Check, ChevronUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function AuthSplit({
  heroSrc,
  heroAlt,
  faintSrc,
  panelTitle,
  panelSub,
  chips = [],
  mobileTitle,
  mobileSub,
  children,
}) {
  return (
    <div className='relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip text-left'>
      <div className='mx-auto grid min-h-[calc(100svh-80px)] w-full max-w-6xl lg:grid-cols-2'>
        <aside className='relative hidden overflow-hidden border-r border-[var(--border)] bg-[var(--code-bg)] px-10 py-12 lg:flex lg:flex-col lg:justify-center'>
          <h2 className='mt-8 max-w-sm text-[32px] leading-tight font-semibold tracking-tight text-[var(--text-h)]'>
            {panelTitle}
          </h2>
          <p className='mt-3 max-w-sm text-[15px] text-[var(--text)]'>
            {panelSub}
          </p>
          <img
            src={heroSrc}
            alt={heroAlt}
            className='mx-auto mt-8 max-h-72 w-auto object-contain'
          />
          {chips.length > 0 && (
            <div className='mt-8 grid max-w-sm grid-cols-2 gap-4'>
              {chips.map((chip) => (
                <div
                  key={chip.title}
                  className='rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4'
                >
                  <p className='text-sm font-semibold text-[var(--text-h)]'>
                    {chip.title}
                  </p>
                  <p className='mt-1 text-sm text-[var(--text)]'>{chip.sub}</p>
                </div>
              ))}
            </div>
          )}
          <img
            src={faintSrc}
            alt=''
            aria-hidden='true'
            className='pointer-events-none absolute -right-10 -bottom-10 w-72 opacity-10'
          />
        </aside>

        <section className='relative flex items-center justify-center bg-[var(--bg)] px-5 py-10 sm:px-10'>
          <div className='w-full max-w-sm'>
            <div className='mb-8 overflow-hidden rounded-2xl bg-[var(--accent-bg)] p-6 text-center lg:hidden'>
              <img
                src={heroSrc}
                alt={heroAlt}
                className='mx-auto h-36 w-auto object-contain'
              />
              <p className='mt-4 text-xl font-semibold text-[var(--text-h)]'>
                {mobileTitle}
              </p>
              <p className='mt-1 text-sm text-[var(--text)]'>{mobileSub}</p>
            </div>
            {children}
          </div>
          <img
            src={faintSrc}
            alt=''
            aria-hidden='true'
            className='pointer-events-none absolute right-0 bottom-0 w-48 opacity-10 lg:hidden'
          />
        </section>
      </div>
    </div>
  );
}

export function TextField({
  id,
  label,
  error,
  icon: Icon,
  rightSlot,
  ...inputProps
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className='mb-1.5 block text-sm font-medium text-[var(--text-h)]'
      >
        {label}
      </label>
      <div className='relative'>
        {Icon && (
          <Icon
            size={18}
            aria-hidden='true'
            className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text)] opacity-60'
          />
        )}
        <input
          id={id}
          {...inputProps}
          className={`w-full border border-[var(--border)] bg-[var(--code-bg)] py-2.5 pr-3 pl-10 text-[15px] text-[var(--text-h)] transition-colors outline-none placeholder:text-[var(--text)] placeholder:opacity-70 focus:border-[var(--accent-border)] focus:ring-2 focus:ring-[var(--accent-border)] ${
            rightSlot ? 'pr-10' : ''
          }`}
        />
        {rightSlot}
      </div>
      {error ? (
        <p
          role='alert'
          className='mt-1.5 text-sm text-red-600 dark:text-red-400'
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SubmitButton({ loading, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('User');
  const toggleDropDown = () => setIsOpen(!isOpen);
  const dropDownRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
  return (
    <div ref={dropDownRef} className='relative'>
      <div className='flex items-stretch bg-[var(--accent-bold)] text-[15px] font-semibold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70'>
        <button
          type='submit'
          disabled={loading}
          className='flex w-full items-center justify-center gap-2 px-4 py-3'
        >
          {loading && (
            <LoaderCircle
              size={18}
              aria-hidden='true'
              className='animate-spin'
            />
          )}
          {children}
        </button>
        <div
          onClick={toggleDropDown}
          className='flex shrink-0 cursor-pointer items-center self-stretch border-l border-white/30 pr-4 pl-3 transition-colors hover:bg-white/10'
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      {isOpen && (
        <div
          className='origin-top-right absolute right-0 mt-2 w-56
                         rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5
                         focus:outline-none'
          role='menu'
        >
          <div className='py-1 cursor-pointer' role='none'>
            <div>
              <div
                href='#'
                onClick={() => {
                  setSelectedRole('User');
                }}
                className='block px-4 py-2 text-sm text-gray-700
                                 hover:bg-gray-100 flex justify-between items-center'
                role='menuitem'
              >
                <span>User</span>
                {selectedRole === 'User' && <Check />}
              </div>
            </div>
            <div
              href='#'
              onClick={() => {
                setSelectedRole('Author');
              }}
              className='block px-4 py-2 text-sm text-gray-700
                                 hover:bg-gray-100 flex justify-between items-center'
              role='menuitem'
            >
              <span>Author</span>
              {selectedRole === 'Author' && <Check />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FormStatus({ status }) {
  if (!status) return <div aria-live='polite' className='min-h-6' />;
  const color =
    status.state === 'error'
      ? 'text-red-600 dark:text-red-400'
      : status.state === 'success'
        ? 'text-green-700 dark:text-green-400'
        : 'text-[var(--text)]';
  return (
    <div aria-live='polite' className='min-h-6'>
      <p className={`text-sm ${color}`}>{status.message}</p>
    </div>
  );
}
