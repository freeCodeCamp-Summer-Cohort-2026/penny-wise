const request = require('supertest');
const { createApp } = require('../app');
const { setupTestDB, teardownTestDB, clearTestDB } = require('./setup');

const app = createApp();

beforeAll(async () => {
  process.env.AUTHOR_SECRET_CODE =
    process.env.AUTHOR_SECRET_CODE || '1234567890ABCDEF';
  await setupTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

function getAuthCookie(response) {
  return response.headers['set-cookie']?.find((cookie) =>
    cookie.startsWith('authCookie=')
  );
}

describe('POST /api/auth/register', () => {
  it('creates a user, sets an httpOnly cookie, and returns neutral user data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeUndefined();
    expect(res.body.user).toMatchObject({
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'learner',
    });
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(getAuthCookie(res)).toMatch(/HttpOnly/);
    expect(getAuthCookie(res)).toMatch(/Path=\//);
    expect(getAuthCookie(res)).toMatch(/Max-Age=604800/);
    expect(getAuthCookie(res)).toMatch(/SameSite=Lax/);
  });

  it('rejects duplicate emails', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'dup@example.com',
      password: 'password123',
      displayName: 'First',
    });

    const res = await request(app).post('/api/auth/register').send({
      email: 'dup@example.com',
      password: 'password123',
      displayName: 'Second',
    });

    expect(res.status).toBe(409);
  });

  it('rejects short passwords', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'short@example.com',
      password: 'abc',
      displayName: 'Short',
    });

    expect(res.status).toBe(400);
  });

  it('ignores role in the request body and defaults to Learner', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'sneaky@example.com',
      password: 'password123',
      displayName: 'Sneaky',
      role: 'Author',
    });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe('learner');
  });
});

it('registers author with the correct invite code', async () => {
  const res = await request(app).post('/api/auth/register').send({
    email: 'test@gmail.com',
    password: 'fake1234',
    displayName: 'Testy',
    authorInviteCode: process.env.AUTHOR_SECRET_CODE,
  });

  expect(res.status).toBe(201);
  expect(res.body.user.role).toBe('author');
});

it('returns error with incorrect author invite code', async () => {
  const res = await request(app).post('/api/auth/register').send({
    email: 'test2@gmail.com',
    password: 'fake1234',
    displayName: 'Testy',
    authorInviteCode: 'FAKECODE',
  });

  expect(res.status).toBe(400);
});

it('rejects displayName longer than 100 characters', async () => {
  const longName = 'A'.repeat(101);

  const res = await request(app).post('/api/auth/register').send({
    email: 'testlong@example.com',
    password: 'password123',
    displayName: longName,
  });

  expect(res.status).toBe(400);
  expect(res.body.error).toBe('display name must be 100 characters or less');
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      email: 'login@example.com',
      password: 'password123',
      displayName: 'Login User',
    });
  });

  it('logs in with correct credentials and returns neutral user data', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeUndefined();
    expect(res.body.user).toMatchObject({
      email: 'login@example.com',
      role: 'learner',
    });
    expect(getAuthCookie(res)).toMatch(/HttpOnly/);
  });

  it('allows the cookie session to access the current user', async () => {
    const agent = request.agent(app);
    const login = await agent.post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });
    const me = await agent.get('/api/auth/me');

    expect(login.status).toBe(200);
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe('login@example.com');
  });

  it('rejects the current-user route without a cookie', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('User is not authenticated with authCookie');
  });

  it('clears the cookie on logout', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });

    const logout = await agent.post('/api/auth/logout');
    const me = await agent.get('/api/auth/me');

    expect(logout.status).toBe(200);
    expect(getAuthCookie(logout)).toMatch(/Expires=Thu, 01 Jan 1970/);
    expect(me.status).toBe(401);
  });

  it('rejects incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
  });
});
