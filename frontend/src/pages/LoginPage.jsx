import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import AuthSplit, {
  FormStatus,
  SubmitButton,
  TextField,
} from '../components/AuthSplit';
import BudgetingIllustration from '../assets/illustrations/svg/4 - BUDGETTING.svg';
import FinancesIllustration from '../assets/illustrations/svg/6 - FINANCES.svg';
import { loginUser } from '../lib/api/penny-wise';
import { useAuth } from '../lib/useAuth';

function getDestination(location, role) {
  const from = location.state?.from;
  if (typeof from === 'string') return from;
  if (from?.pathname) {
    return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
  }
  return role === 'learner' ? '/dashboard' : '/';
}

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null);

  const loading = status?.state === 'loading';

  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setStatus({ state: 'loading', message: 'Signing you in…' });

    try {
      const data = await loginUser({ email, password });
      signIn({ token: data.token, user: data.user });
      setStatus({ state: 'success', message: 'Logged in successfully!' });
      navigate(getDestination(location, data.user.role), { replace: true });
    } catch (error) {
      setStatus({
        state: 'error',
        message:
          error?.error ||
          error?.message ||
          'An error occurred while logging in. Please check your credentials and try again.',
      });
    }
  };

  return (
    <AuthSplit
      heroSrc={BudgetingIllustration}
      heroAlt='Person planning a budget at a desk'
      faintSrc={FinancesIllustration}
      panelTitle='Penny Wise keeps every coin in check'
      panelSub='Log in to track spending, budgets, and savings goals.'
      chips={[
        { title: 'Smart budgets', sub: 'Plan every coin' },
        { title: 'Goal tracking', sub: 'Watch savings grow' },
      ]}
      mobileTitle='Welcome back'
      mobileSub='Log in to your account'
    >
      <div className='mb-6 hidden lg:block'>
        <h1 className='m-0 text-[28px] font-semibold tracking-tight text-(--text-h)'>
          Log in
        </h1>
        <p className='mt-2 text-[15px] text-(--text)'>
          Welcome back! Log in to your account.
        </p>
      </div>

      <form onSubmit={submit} className='space-y-4'>
        <TextField
          id='email'
          label='Email'
          type='email'
          name='email'
          placeholder='Enter your email'
          autoComplete='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          icon={Mail}
          required
        />
        <TextField
          id='password'
          label='Password'
          type={showPassword ? 'text' : 'password'}
          name='password'
          placeholder='Enter your password'
          autoComplete='current-password'
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          icon={Lock}
          required
          rightSlot={
            <button
              type='button'
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className='absolute top-1/2 right-3 -translate-y-1/2 text-(--text) opacity-70 transition-opacity hover:opacity-100 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-(--accent)'
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <div className='flex items-center justify-between text-sm'>
          <label
            htmlFor='remember'
            className='flex cursor-pointer items-center gap-2 text-(--text)'
          >
            <input
              type='checkbox'
              id='remember'
              name='remember'
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className='h-4 w-4 rounded accent-(--accent-bold)'
            />
            Remember me
          </label>
          <button
            type='button'
            onClick={() =>
              setStatus({
                state: 'info',
                message:
                  'Password reset is not available yet. Ask an administrator for help.',
              })
            }
            className='font-medium text-(--accent) hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)'
          >
            Forgot password?
          </button>
        </div>

        <SubmitButton loading={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </SubmitButton>
        <FormStatus status={status} />
      </form>

      <p className='mt-6 text-center text-sm text-(--text)'>
        Don&apos;t have an account?{' '}
        <Link
          to='/signup'
          state={location.state}
          className='font-semibold text-(--accent) hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)'
        >
          Create an account
        </Link>
      </p>
    </AuthSplit>
  );
}
