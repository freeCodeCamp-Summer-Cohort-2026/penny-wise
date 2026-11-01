import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { getCurrentUser, loginUser, registerUser } from '../lib/api/penny-wise';

vi.mock('../lib/api/penny-wise', () => ({
  getCurrentUser: vi.fn(),
  clearImageCache: vi.fn(),
  loginUser: vi.fn(),
  logoutUser: vi.fn().mockResolvedValue({ success: true }),
  registerUser: vi.fn(),
}));

const learner = {
  id: 'learner-1',
  email: 'sara@example.com',
  displayName: 'Sara Ekon',
  role: 'learner',
  level: 1,
  avatar: 'https://example.com/avatar.svg',
  country: 'United States of America',
};

function renderSignUp() {
  return render(
    <MemoryRouter initialEntries={['/signup']}>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path='/signup' element={<SignUp />} />
            <Route path='/dashboard' element={<p>Learner dashboard</p>} />
            <Route path='/' element={<p>Landing page</p>} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/dashboard' element={<p>Learner dashboard</p>} />
            <Route path='/' element={<p>Landing page</p>} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

async function fillSignUp() {
  await userEvent.type(await screen.findByLabelText(/username/i), 'Sara Ekon');
  await userEvent.type(screen.getByLabelText(/email/i), 'sara@example.com');
  await userEvent.type(screen.getByLabelText(/^password/i), 'PennyWise-123');
  await userEvent.type(
    screen.getByLabelText(/confirm password/i),
    'PennyWise-123',
  );
  await userEvent.click(screen.getByRole('checkbox'));
  await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
}

async function fillLogin() {
  await userEvent.type(screen.getByLabelText(/email/i), 'sara@example.com');
  await userEvent.type(screen.getByLabelText(/^password/i), 'PennyWise-123');
  await userEvent.click(screen.getByRole('button', { name: /log in/i }));
}

beforeEach(() => {
  vi.clearAllMocks();
  getCurrentUser.mockRejectedValue({ status: 401 });
});

describe('sign up flow', () => {
  it('hydrates the session from the register response without refetching the user', async () => {
    registerUser.mockResolvedValue({ success: true, user: learner });

    renderSignUp();
    await fillSignUp();

    expect(await screen.findByText('Learner dashboard')).toBeInTheDocument();

    expect(registerUser).toHaveBeenCalledTimes(1);
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it('sends an author to the landing page after signing up', async () => {
    registerUser.mockResolvedValue({
      success: true,
      user: { ...learner, role: 'author' },
    });

    renderSignUp();
    await fillSignUp();

    expect(await screen.findByText('Landing page')).toBeInTheDocument();
  });

  it('shows the server message when the email is already taken', async () => {
    registerUser.mockRejectedValue({
      status: 409,
      error: 'An account with that email already exists',
    });

    renderSignUp();
    await fillSignUp();

    expect(
      await screen.findByText('An account with that email already exists'),
    ).toBeInTheDocument();
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });
});

describe('log in flow', () => {
  it('hydrates the session from the login response without refetching the user', async () => {
    loginUser.mockResolvedValue({ success: true, user: learner });

    renderLogin();
    await fillLogin();

    expect(await screen.findByText('Learner dashboard')).toBeInTheDocument();

    expect(loginUser).toHaveBeenCalledTimes(1);
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it('sends an author to the landing page after logging in', async () => {
    loginUser.mockResolvedValue({
      success: true,
      user: { ...learner, role: 'author' },
    });

    renderLogin();
    await fillLogin();

    expect(await screen.findByText('Landing page')).toBeInTheDocument();
  });

  it('shows the server message when the credentials are wrong', async () => {
    loginUser.mockRejectedValue({
      status: 401,
      error: 'Invalid email or password',
    });

    renderLogin();
    await fillLogin();

    expect(
      await screen.findByText('Invalid email or password'),
    ).toBeInTheDocument();
  });
});
