const request = require('supertest');
const { createApp } = require('../app');
const { setupTestDB, teardownTestDB, clearTestDB } = require('./setup');
const User = require('../models/User');
const authRoutes = require('../routes/auth');

const app = createApp();

beforeAll(async () => {
  await setupTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe('POST /api/auth/register', () => {
  it('creates a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.passwordHash).toBeUndefined();
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

  it('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
  });
});
