import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleUser, Globe, Mail, User } from 'lucide-react';
import { useAuth } from '../lib/useAuth';

const levelTitlePicker = (level) => {
  switch (true) {
    case level <= 0:
      return 'Loot Learner';
    case 0 < level && level <= 3:
      return 'Nickel Knower';
    case 3 < level && level <= 6:
      return 'Dollar Dweller';
    case 6 < level && level <= 9:
      return 'Currency Crusher';
    case 9 < level && level <= 14:
      return 'Cash Cultivator';
    case 14 < level && level <= 19:
      return 'Money Master';
    case level == 20:
      return 'Penny Wise';
    default:
      return 'Loot Learner';
  }
};

const COUNTRY_SUGGESTIONS = [
  'United States',
  'United Kingdom',
  'Canada',
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'India',
  'Brazil',
  'Germany',
  'France',
];

const inputClass =
  'w-full rounded-lg border border-(--border) bg-(--code-bg) px-3 py-2.5 text-[15px] text-(--text-h) transition-colors outline-none placeholder:opacity-70 focus:ring-2 focus:ring-(--accent-border) disabled:cursor-not-allowed';

const ProfilePage = () => {
  const { auth } = useAuth();
  const user = auth?.user ?? null;

  if (!user) {
    return (
      <main className='mx-auto w-full max-w-4xl p-4 text-left sm:p-6'>
        <nav aria-label='Breadcrumb' className='text-sm text-(--text)'>
          <Link to='/' className='hover:underline'>
            Home
          </Link>
          <span aria-hidden='true' className='mx-2'>
            ›
          </span>
          <span className='font-medium text-(--text-h)'>My Profile</span>
        </nav>
        <h1 className='mt-2 text-3xl font-semibold tracking-tight text-(--text-h)'>
          My Account
        </h1>
        <section className='mt-6 rounded-2xl border border-(--border) bg-(--bg) p-8 text-center shadow-(--shadow)'>
          <p className='text-(--text)'>
            You need to log in to view your profile.
          </p>
          <Link
            to='/login'
            className='mt-4 inline-block rounded-lg bg-(--accent-bold) px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.99]'
          >
            Go to Log in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <ProfileForm key={user.id ?? user.email} user={user} token={auth.token} />
  );
};

const ProfileForm = ({ user, token }) => {
  const { signIn } = useAuth();
  const [displayName, setDisplayName] = useState(user.displayName ?? '');
  const [country, setCountry] = useState(user.country ?? '');
  const [bio, setBio] = useState(user.bio ?? '');
  const [status, setStatus] = useState(null);

  const stats = useMemo(() => {
    if (!user) return [];
    const rows = [];
    if (typeof user.experience === 'number')
      rows.push({ label: 'Experience', value: `${user.experience} XP` });
    if (typeof user.currentStreak === 'number')
      rows.push({
        label: 'Current streak',
        value: `${user.currentStreak} days`,
      });
    if (typeof user.longestStreak === 'number')
      rows.push({
        label: 'Longest streak',
        value: `${user.longestStreak} days`,
      });
    if (typeof user.currentLives === 'number')
      rows.push({ label: 'Lives', value: String(user.currentLives) });
    if (Array.isArray(user.coursesEnrolled))
      rows.push({
        label: 'Enrolled',
        value: String(user.coursesEnrolled.length),
      });
    if (Array.isArray(user.completedLessons))
      rows.push({
        label: 'Lessons completed',
        value: String(user.completedLessons.length),
      });
    if (Array.isArray(user.coursesMade))
      rows.push({
        label: 'Courses made',
        value: String(user.coursesMade.length),
      });
    return rows;
  }, [user]);

  const trimmedName = displayName.trim();
  const trimmedCountry = country.trim();
  const trimmedBio = bio.trim();
  const dirty =
    trimmedName !== (user.displayName ?? '') ||
    trimmedCountry !== (user.country ?? '') ||
    (user.role === 'author' && trimmedBio !== (user.bio ?? ''));
  const nameError =
    trimmedName.length === 0
      ? 'Display name is required.'
      : trimmedName.length > 100
        ? 'Display name must be 100 characters or less.'
        : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameError) {
      setStatus({ state: 'error', message: nameError });
      return;
    }
    if (!dirty) {
      setStatus({ state: 'success', message: 'No changes to save.' });
      return;
    }
    signIn({
      token,
      user: {
        ...user,
        displayName: trimmedName,
        country: trimmedCountry,
        ...(user.role === 'author' ? { bio: trimmedBio } : {}),
      },
    });
    setStatus({
      state: 'success',
      message: 'Profile saved on this device. Server sync coming soon.',
    });
  };

  const handleDiscard = () => {
    setDisplayName(user.displayName ?? '');
    setCountry(user.country ?? '');
    setBio(user.bio ?? '');
    setStatus(null);
  };

  const level = user.level ?? 1;
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <main className='mx-auto w-full max-w-6xl p-4 text-left sm:p-6'>
      <nav aria-label='Breadcrumb' className='text-sm text-(--text)'>
        <Link to='/' className='hover:underline'>
          Home
        </Link>
        <span aria-hidden='true' className='mx-2'>
          ›
        </span>
        <span className='font-medium text-(--text-h)'>My Profile</span>
      </nav>

      <div className='mt-2 flex flex-wrap items-baseline justify-between gap-2'>
        <h1 className='text-3xl font-semibold tracking-tight text-(--text-h)'>
          My Account
        </h1>
        {memberSince && (
          <p className='text-sm text-(--text)'>Member since {memberSince}</p>
        )}
      </div>

      <div className='mt-6 grid gap-6 lg:grid-cols-[280px_1fr]'>
        {/* Summary card (left, mirrors mockup tab column position) */}
        <aside className='h-fit rounded-2xl border border-(--border) bg-(--bg) p-6 text-center shadow-(--shadow)'>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.displayName}'s avatar`}
              className='mx-auto h-24 w-24 rounded-full border border-(--border) object-cover'
            />
          ) : (
            <CircleUser
              aria-hidden='true'
              className='mx-auto h-24 w-24 text-(--text)'
            />
          )}
          <h2 className='mt-4 text-xl font-semibold text-(--text-h)'>
            {user.displayName}
          </h2>
          <p className='mt-1 text-sm break-all text-(--text)'>{user.email}</p>
          {user.role && (
            <p className='mt-3 inline-block rounded-full bg-(--accent-bg) px-3 py-1 text-xs font-semibold text-(--accent-bold) capitalize'>
              {user.role}
            </p>
          )}
          <div className='mt-4 rounded-xl bg-(--accent-bg) p-4'>
            <p className='text-sm font-bold tracking-wide text-(--text-h)'>
              LEVEL {level}
            </p>
            <p className='mt-1 text-sm text-(--text)'>
              {levelTitlePicker(level)}
            </p>
          </div>
          {stats.length > 0 && (
            <dl className='mt-4 space-y-2 border-t border-(--border) pt-4 text-left text-sm'>
              {stats.map((row) => (
                <div key={row.label} className='flex justify-between gap-3'>
                  <dt className='text-(--text)'>{row.label}</dt>
                  <dd className='font-semibold text-(--text-h)'>{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </aside>

        {/* Personal Information (right, mirrors mockup form card) */}
        <section
          aria-labelledby='personal-info-heading'
          className='rounded-2xl border border-(--border) bg-(--bg) p-6 shadow-(--shadow) sm:p-8'
        >
          <h2
            id='personal-info-heading'
            className='border-b border-(--border) pb-4 text-lg font-semibold text-(--text-h)'
          >
            Personal Information
          </h2>

          <div className='mt-6 flex flex-wrap items-center gap-4'>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt='Current avatar'
                className='h-16 w-16 rounded-full border border-(--border) object-cover'
              />
            ) : (
              <CircleUser
                aria-hidden='true'
                className='h-16 w-16 text-(--text)'
              />
            )}
            <div className='flex gap-3'>
              <button
                type='button'
                disabled
                title='Avatar upload is not yet available'
                className='cursor-not-allowed bg-(--accent-bold) px-5 py-2 text-sm font-semibold text-white opacity-50'
              >
                Upload
              </button>
              <button
                type='button'
                disabled
                title='Avatar upload is not yet available'
                className='cursor-not-allowed border border-(--accent-border) px-5 py-2 text-sm font-semibold text-(--accent-bold) opacity-50'
              >
                Remove
              </button>
            </div>
          </div>
          <p className='mt-2 text-xs text-(--text)'>
            Avatar upload is not yet available.
          </p>

          <form onSubmit={handleSubmit} className='mt-6 space-y-5'>
            <div className='grid gap-5 sm:grid-cols-2'>
              <div>
                <label
                  htmlFor='displayName'
                  className='mb-1.5 block text-sm font-medium text-(--text-h)'
                >
                  Display Name <span aria-hidden='true'>*</span>
                </label>
                <div className='relative'>
                  <User
                    size={18}
                    aria-hidden='true'
                    className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-(--text) opacity-60'
                  />
                  <input
                    id='displayName'
                    name='displayName'
                    type='text'
                    required
                    maxLength={100}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder='Choose a display name'
                    autoComplete='nickname'
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {nameError && displayName !== '' && (
                  <p role='alert' className='mt-1.5 text-sm text-red-600'>
                    {nameError}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='mb-1.5 block text-sm font-medium text-(--text-h)'
                >
                  Email <span aria-hidden='true'>*</span>
                </label>
                <div className='relative'>
                  <Mail
                    size={18}
                    aria-hidden='true'
                    className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-(--text) opacity-60'
                  />
                  <input
                    id='email'
                    name='email'
                    type='email'
                    value={user.email ?? ''}
                    disabled
                    readOnly
                    title='Email changes are not yet available'
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className='sm:col-span-2'>
                <label
                  htmlFor='country'
                  className='mb-1.5 block text-sm font-medium text-(--text-h)'
                >
                  Country
                </label>
                <div className='relative'>
                  <Globe
                    size={18}
                    aria-hidden='true'
                    className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-(--text) opacity-60'
                  />
                  <input
                    id='country'
                    name='country'
                    type='text'
                    list='country-suggestions'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder='Enter your country'
                    autoComplete='country-name'
                    className={`${inputClass} pl-10`}
                  />
                  <datalist id='country-suggestions'>
                    {COUNTRY_SUGGESTIONS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {user.role === 'author' && (
                <div className='sm:col-span-2'>
                  <label
                    htmlFor='bio'
                    className='mb-1.5 block text-sm font-medium text-(--text-h)'
                  >
                    Bio
                  </label>
                  <textarea
                    id='bio'
                    name='bio'
                    rows={3}
                    maxLength={500}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder='Tell learners about yourself'
                    className={`${inputClass} resize-y`}
                  />
                </div>
              )}
            </div>

            <div aria-live='polite' className='min-h-6'>
              {status && (
                <p
                  className={`text-sm ${status.state === 'error' ? 'text-red-600' : 'text-green-700'}`}
                >
                  {status.message}
                </p>
              )}
            </div>

            <div className='flex flex-wrap gap-3'>
              <button
                type='submit'
                disabled={!dirty || Boolean(nameError)}
                className='rounded-lg bg-(--accent-bold) px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50'
              >
                Save changes
              </button>
              <button
                type='button'
                onClick={handleDiscard}
                disabled={!dirty}
                className='border border-(--border) bg-(--bg) px-6 py-2.5 text-sm font-semibold text-(--text-h) transition hover:bg-(--code-bg) disabled:cursor-not-allowed disabled:opacity-50'
              >
                Discard
              </button>
            </div>
            <p className='text-xs text-(--text)'>
              Changes are saved on this device only. Server sync is coming soon.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
