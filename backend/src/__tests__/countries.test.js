const request = require('supertest');
const { createApp } = require('../app');
const { setupTestDB, teardownTestDB, clearTestDB } = require('./setup');
const Country = require('../models/country');

const app = createApp();

async function createCountriesFixture() {
  const usa = await Country.create({
    name: 'United States of America',
    code: 'USA',
  });

  const portugal = await Country.create({
    name: 'Portugal',
    code: 'PRT',
  });

  return { usa, portugal };
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

describe('countries', () => {
  it('returns the full list of countries', async () => {
    await createCountriesFixture();

    const response = await request(app).get('/api/countries');

    expect(response.status).toBe(200);

    expect(response.body.countries).toHaveLength(2);

    expect(response.body.countries[0]).toMatchObject({
      name: 'United States of America',
      code: 'USA',
    });

    expect(response.body.countries[1]).toMatchObject({
      name: 'Portugal',
      code: 'PRT',
    });
  });
});
