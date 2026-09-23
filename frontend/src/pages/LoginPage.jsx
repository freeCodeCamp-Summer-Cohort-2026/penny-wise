import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import AuthSplit, {
  FormStatus,
  SubmitButton,
  TextField,
} from '../components/AuthSplit';
import Hero from '../assets/illustrations/svg/4 - BUDGETTING.svg';
import Faint from '../assets/illustrations/svg/6 - FINANCES.svg';
import { loginUser } from '../lib/api/penny-wise';
import { useAuth } from '../lib/useAuth';

const LoginPage = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const loading = status?.state === 'loading';

  const submit = (e) => {
    e.preventDefault();
    if (loading) return;
    setStatus({ state: 'loading', message: 'Signing you in…' });
    timer.current = setTimeout(() => {
      setStatus({
        state: 'success',
        message: 'Welcome back! You are now signed in.',
      });
    }, 900);
  };

  const forgotPassword = () => {
    setStatus(
      email.trim()
        ? {
            state: 'info',
            message: `Password reset link sent to ${email.trim()}.`,
          }
        : {
            state: 'info',
            message: 'Enter your email above, then try again.',
          },
    );
  };

  return (
    <AuthSplit
      heroSrc={Hero}
      heroAlt='Person planning a budget at a desk'
      faintSrc={Faint}
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
        <h1 className='m-0 text-[28px] font-semibold tracking-tight text-[var(--text-h)]'>
          Log in
        </h1>
        <p className='mt-2 text-[15px] text-[var(--text)]'>
          Welcome back! Log in to your account.
        </p>
      </div>

      <form onSubmit={submit} className='space-y-4'>
        <TextField
          id='email'
          label='Email'
          type='email'
          pattern=''
          id='e-mail'
          name='email'
          placeholder='Enter your email'
          autoComplete='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          required
          rightSlot={
            <button
              type='button'
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className='absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text)] opacity-70 transition-opacity hover:opacity-100'
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <div className='flex items-center justify-between text-sm'>
          <label
            htmlFor='remember'
            className='flex cursor-pointer items-center gap-2 text-[var(--text)]'
          >
            <input
              type='checkbox'
              id='remember'
              name='remember'
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className='h-4 w-4 rounded accent-[var(--accent-bold)]'
            />
            Remember me
          </label>
          <button
            type='button'
            onClick={forgotPassword}
            className='font-medium text-[var(--accent)] hover:underline'
          >
            Forgot password?
          </button>
        </div>

        <SubmitButton loading={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </SubmitButton>
        <FormStatus status={status} />
      </form>

      <p className='mt-6 text-center text-sm text-[var(--text)]'>
        Don&apos;t have an account?{' '}
        <Link
          to='/signup'
          className='font-semibold text-[var(--accent)] hover:underline'
        >
          Create an account
        </Link>
      </p>
    </AuthSplit>
  );
};

export default LoginPage;
