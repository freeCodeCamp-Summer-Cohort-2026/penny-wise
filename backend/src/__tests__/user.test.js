const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const { createApp } = require('../app');
const { setupTestDB, teardownTestDB, clearTestDB } = require('./setup');
const { Author, Learner } = require('../models/User');

const app = createApp();
const passwordHash = bcrypt.hashSync('password123', 4);
const defaultPicPrefix = 'https://api.dicebear.com/10.x/avataaars/svg';
const defaultEmailRegx = /.*@example.com/;

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

async function createUser(LearnerModel = Learner, mail = null) {
  const email = mail
    ? mail
    : `${LearnerModel.modelName.toLowerCase()}-${Date.now()}-${Math.random()}@example.com`;

  return LearnerModel.create({
    email: email,
    displayName: `Test ${LearnerModel.modelName}`,
    passwordHash: passwordHash,
  });
}

async function createUserFixture() {
  const author = await createUser(Author);
  const learner = await createUser();

  return {
    author,
    learner,
    learnerToken: createToken(learner),
    authorToken: createToken(author),
  };
}

beforeAll(async () => {
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

describe('PUT /api/user', () => {
  it('fails with invalid token', async () => {
    const { learner, learnerToken } = await createUserFixture();

    const body = {
      displayName: learner.displayName,
      country: learner.country,
      profilePic: learner.profilePic,
      // bio: learner.bio,
    };

    const res = await request(app)
      .put('/api/user', body)
      .set('Cookie', `authCookie='12456789abcdef'`);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid or expired token');
  });

  it('updates user name', async () => {
    const { learner, learnerToken } = await createUserFixture();

    const body = {
      displayName: 'Updated Test Learner',
    };

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${learnerToken}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.user.displayName).toBe('Updated Test Learner');
  });

  it('updates user profilePic blanks name', async () => {
    const { learner, learnerToken } = await createUserFixture();

    const body = {
      displayName: 123,
      profilePic: 'my_profile_pic.png',
    };

    expect(learner.profilePic).toMatch(defaultPicPrefix);

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${learnerToken}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.user.displayName).toBe('Test learner');
    expect(res.body.user.profilePic).toBe('my_profile_pic.png');
  });

  it('updates user country blanks profilePic', async () => {
    const { learner, learnerToken } = await createUserFixture();

    const body = {
      profilePic: 123,
      country: 'Macaronesia',
    };

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${learnerToken}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.user.country).toBe('Macaronesia');
    expect(res.body.user.profilePic).toBe('');
  });

  it('updates user email blanks country', async () => {
    const { learner, learnerToken } = await createUserFixture();

    const body = {
      email: 'new_email@pennywise.app',
      country: 123,
    };

    expect(learner.email).toMatch(defaultEmailRegx);

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${learnerToken}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('new_email@pennywise.app');
    expect(res.body.user.country).toBe(undefined);
  });

  it('fails to update user email with existing email', async () => {
    const { learner, learnerToken } = await createUserFixture();

    const existing_user = await createUser(Learner, 'new_email@pennywise.app');

    const body = {
      email: 'new_email@pennywise.app',
    };

    expect(learner.email).toMatch(defaultEmailRegx);
    expect(existing_user.email).toBe('new_email@pennywise.app');

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${learnerToken}`)
      .send(body);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('An account with that email already exists');
  });

  it('updates author bio', async () => {
    const { author, authorToken } = await createUserFixture();

    const body = {
      bio: 'The Author Biography',
    };

    expect(author.bio).toBe(undefined);

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${authorToken}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.author.bio).toBe('The Author Biography');
    expect(res.body.author.displayName).toBe('Test author');

    const new_body = {
      bio: 123,
      displayName: 'The Author',
    };

    const res2 = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${authorToken}`)
      .send(new_body);

    expect(res2.status).toBe(200);
    expect(res2.body.author.bio).toBe('The Author Biography');
    expect(res2.body.author.displayName).toBe('The Author');
  });

  it('updates author profilePic blanks name', async () => {
    const { author, authorToken } = await createUserFixture();

    const body = {
      displayName: 123,
      profilePic: 'my_profile_pic.png',
    };

    expect(author.profilePic).toMatch(defaultPicPrefix);

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${authorToken}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.author.displayName).toBe('Test author');
    expect(res.body.author.profilePic).toBe('my_profile_pic.png');
  });

  it('updates author country blanks profilePic', async () => {
    const { author, authorToken } = await createUserFixture();

    const body = {
      profilePic: 123,
      country: 'Macaronesia',
    };

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${authorToken}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.author.country).toBe('Macaronesia');
    expect(res.body.author.profilePic).toBe('');
  });

  it('updates author email blanks country', async () => {
    const { author, authorToken } = await createUserFixture();

    const body = {
      email: 'new_email@pennywise.app',
      country: 123,
    };

    expect(author.email).toMatch(defaultEmailRegx);

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${authorToken}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.author.email).toBe('new_email@pennywise.app');
    expect(res.body.author.country).toBe(undefined);
  });

  it('fails to update author email with existing email', async () => {
    const { author, authorToken } = await createUserFixture();

    const existing_user = await createUser(Learner, 'new_email@pennywise.app');

    const body = {
      email: 'new_email@pennywise.app',
    };

    expect(author.email).toMatch(defaultEmailRegx);
    expect(existing_user.email).toBe('new_email@pennywise.app');

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${authorToken}`)
      .send(body);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('An account with that email already exists');
  });

  it('fails to update unknown user', async () => {
    const { learner, learnerToken } = await createUserFixture();

    const body = {
      _id: '6af5598d5b805a435eee69d0',
      displayName: 'Unknown Test Learner',
    };
    const fake_token = jwt.sign(
      { sub: body._id, email: 'unknown@pennywise.app', role: 'learner' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${fake_token}`)
      .send(body);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Learner or Author not found');
  });

  it('fails to update unknown author', async () => {
    const { author, authorToken } = await createUserFixture();

    const body = {
      _id: '6af6698d5b805a435eee69d0',
      displayName: 'Unknown Test Author',
    };
    const fake_token = jwt.sign(
      { sub: body._id, email: 'unknown_authore@pennywise.app', role: 'author' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${fake_token}`)
      .send(body);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Learner or Author not found');
  });

  /*  This test needs a different approach
  it('fails to update user with outdated version', async () => {
    
    const {
      learner,
      learnerToken
    } = await createUserFixture();

    const body = {
      _id: `${learner._id}`,
      displayName: 'First Test Learner'
    };

    const res = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${learnerToken}`)
      .send(body);
    
    expect(res.status).toBe(200);
    expect(res.body.user.displayName).toBe('First Test Learner');
  
    const body2 = {
      _id: `${learner._id}`,
      displayName: 'Modified Test Learner'
    };

    const res2 = await request(app)
      .put('/api/user')
      .set('Cookie', `authCookie=${learnerToken}`)
      .send(body2);

    expect(res2.status).toBe(409);
    expect(res2.body.error).toBe('Activity changed on another device. Try again.');
  });
  */
});
