import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { registerUser } from '../lib/api/penny-wise';
import AuthSplit, {
  FormStatus,
  SubmitButton,
  TextField,
} from '../components/AuthSplit';
import BankDealIllustration from '../assets/illustrations/svg/7 - BANK DEAL.svg';
import EconomyIllustration from '../assets/illustrations/svg/9 - ECONOMY ANALYSIS.svg';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState(null);

  const loading = status?.state === 'loading';
  const mismatch =
    password !== '' && confirmPassword !== '' && password !== confirmPassword;

  const submit = async (e) => {
    try {
      e.preventDefault();
      if (loading) return;
      if (mismatch) {
        setStatus({ state: 'error', message: 'Passwords do not match.' });
        return;
      }
      setStatus({ state: 'loading', message: 'Creating your account…' });
      await registerUser({ displayName, email, password });
      setStatus({
        state: 'success',
        message: 'Account created successfully! Redirecting to login…',
      });
      navigate('/login', { replace: true, state: location.state });
    } catch (error) {
      setStatus({
        state: 'error',
        message:
          error?.error ||
          'An error occurred while creating your account. Please try again.',
      });
    }
  };

  const eyeButton = (show, setShow) => (
    <button
      type='button'
      onClick={() => setShow((v) => !v)}
      aria-label={show ? 'Hide password' : 'Show password'}
      aria-pressed={show}
      className='absolute top-1/2 right-3 -translate-y-1/2 text-(--text) opacity-70 transition-opacity hover:opacity-100'
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <AuthSplit
      heroSrc={BankDealIllustration}
      heroAlt='Handshake over a bank counter'
      faintSrc={EconomyIllustration}
      panelTitle='Start smart with Penny Wise'
      panelSub='Create an account to learn money skills and grow savings.'
      chips={[
        { title: 'Free to start', sub: 'No card needed' },
        { title: 'Learn by doing', sub: 'Bite-size lessons' },
      ]}
      mobileTitle='Sign up'
      mobileSub='Hi! Create your account'
    >
      <div className='mb-6 hidden lg:block'>
        <h1 className='m-0 text-[28px] font-semibold tracking-tight text-(--text-h)'>
          Sign up
        </h1>
        <p className='mt-2 text-[15px] text-(--text)'>
          Hi! Create your account.
        </p>
      </div>

      <form onSubmit={submit} className='space-y-4'>
        <TextField
          id='username'
          label='Username'
          type='text'
          name='username'
          placeholder='Choose a username'
          autoComplete='username'
          minLength={3}
          maxLength={20}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          icon={User}
          required
        />
        <TextField
          id='email'
          label='Email'
          type='email'
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
          autoComplete='new-password'
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
          required
          rightSlot={eyeButton(showPassword, setShowPassword)}
        />
        <TextField
          id='confirm-password'
          label='Confirm password'
          type={showConfirm ? 'text' : 'password'}
          name='confirmPassword'
          placeholder='Confirm your password'
          autoComplete='new-password'
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={Lock}
          required
          error={mismatch ? 'Passwords do not match.' : undefined}
          rightSlot={eyeButton(showConfirm, setShowConfirm)}
        />

        <label
          htmlFor='terms'
          className='flex cursor-pointer items-start gap-2 text-sm text-(--text)'
        >
          <input
            type='checkbox'
            id='terms'
            name='terms'
            required
            className='mt-0.5 h-4 w-4 shrink-0 rounded accent-(--accent-bold)'
          />
          I agree to the Terms and Privacy Policy
        </label>

        <SubmitButton loading={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </SubmitButton>
        <FormStatus status={status} />
      </form>

      <p className='mt-6 text-center text-sm text-(--text)'>
        Already have an account?{' '}
        <Link
          to='/login'
          state={location.state}
          className='font-semibold text-(--accent) hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)'
        >
          Log in
        </Link>
      </p>
    </AuthSplit>
  );
};

export default SignUp;
