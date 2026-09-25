const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const { createApp } = require('../app');
const { setupTestDB, teardownTestDB, clearTestDB } = require('./setup');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const {
  Page,
  MultipleChoicePage,
  MatchingPage,
  BudgetingPage,
  WantsNeedsPage,
} = require('../models/Page');
const LessonProgress = require('../models/LessonProgress');
const { Author, Learner } = require('../models/User');

const app = createApp();
const passwordHash = bcrypt.hashSync('password123', 4);

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
}

async function createUser(LearnerModel = Learner) {
  const email = `${LearnerModel.modelName.toLowerCase()}-${Date.now()}-${Math.random()}@example.com`;
  return LearnerModel.create({
    email,
    displayName: 'Test Learner',
    passwordHash,
  });
}

async function createCourseFixture({ enroll = true } = {}) {
  const author = await createUser(Author);
  const learner = await createUser();
  const lesson = new Lesson({
    courseId: new Course()._id,
    name: 'Money Practice',
    description: 'Practice core money decisions.',
    experience: 12,
    estimatedDurationOfCompletionInMinutes: 8,
    pages: [],
  });
  const multipleChoice = await MultipleChoicePage.create({
    lessonId: lesson._id,
    text: 'Choose the correct answer.',
    options: [
      { answerText: 'Correct', isCorrect: true },
      { answerText: 'Incorrect', isCorrect: false },
    ],
  });
  const matching = await MatchingPage.create({
    lessonId: lesson._id,
    text: 'Match each word.',
    pairs: [
      { word: 'coins', definition: 'metal money' },
      { word: 'notes', definition: 'paper money' },
    ],
  });
  const budgeting = await BudgetingPage.create({
    lessonId: lesson._id,
    text: 'Keep your savings goal.',
    startingAmount: 100,
    targetSavings: 50,
    availableItems: [
      { name: 'Expensive item', cost: 60 },
      { name: 'Small item', cost: 10 },
    ],
  });
  const wantsNeeds = await WantsNeedsPage.create({
    lessonId: lesson._id,
    text: 'Sort each item.',
    itemsToSort: [
      { name: 'Water', correctCategory: 'need' },
      { name: 'Game', correctCategory: 'want' },
    ],
  });

  lesson.pages = [
    multipleChoice._id,
    matching._id,
    budgeting._id,
    wantsNeeds._id,
  ];
  await lesson.save();

  const course = await Course.create({
    creatorId: author._id,
    name: 'Real Course',
    published: true,
    lessons: [lesson._id],
  });

  lesson.courseId = course._id;
  await lesson.save();

  if (enroll) {
    learner.coursesEnrolled = [course._id];
    await learner.save();
  }

  return {
    author,
    learner,
    learnerToken: createToken(learner),
    authorToken: createToken(author),
    course,
    lesson,
    pages: [multipleChoice, matching, budgeting, wantsNeeds],
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

describe('course catalog', () => {
  it('returns published summaries without page answer keys', async () => {
    await createCourseFixture();

    const response = await request(app).get('/api/courses');

    expect(response.status).toBe(200);
    expect(response.body.courses).toHaveLength(1);
    expect(response.body.courses[0]).toMatchObject({
      name: 'Real Course',
      lessonCount: 1,
      totalEstimatedDurationInMinutes: 8,
    });
    expect(response.body.courses[0].lessons[0].pages).toBeUndefined();
    expect(JSON.stringify(response.body)).not.toContain('isCorrect');
    expect(JSON.stringify(response.body)).not.toContain('correctCategory');
  });

  it('returns a public course outline with no learning state', async () => {
    const { course } = await createCourseFixture();

    const response = await request(app).get(`/api/courses/${course._id}`);

    expect(response.status).toBe(200);
    expect(response.body.course.lessons).toHaveLength(1);
    expect(response.body.learningState).toBeNull();
  });
});

describe('course enrollment', () => {
  it('requires a learner and enrolls idempotently', async () => {
    const { course, learner, learnerToken, authorToken } =
      await createCourseFixture({ enroll: false });

    const anonymous = await request(app).post(
      `/api/courses/${course._id}/enroll`,
    );
    const author = await request(app)
      .post(`/api/courses/${course._id}/enroll`)
      .set('Authorization', `Bearer ${authorToken}`);
    const first = await request(app)
      .post(`/api/courses/${course._id}/enroll`)
      .set('Authorization', `Bearer ${learnerToken}`);
    const second = await request(app)
      .post(`/api/courses/${course._id}/enroll`)
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(anonymous.status).toBe(401);
    expect(author.status).toBe(403);
    expect(first.status).toBe(201);
    expect(first.body.learningState).toMatchObject({
      status: 'in_progress',
      hasStarted: false,
    });
    expect(second.status).toBe(200);

    const updatedLearner = await Learner.findById(learner._id);
    expect(updatedLearner.coursesEnrolled).toHaveLength(1);
  });
});

describe('lesson player', () => {
  it('starts or resumes with sanitized activities', async () => {
    const { course, lesson, learnerToken } = await createCourseFixture();

    const first = await request(app)
      .post(`/api/courses/${course._id}/lessons/${lesson._id}/start`)
      .set('Authorization', `Bearer ${learnerToken}`);
    const second = await request(app)
      .post(`/api/courses/${course._id}/lessons/${lesson._id}/start`)
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(first.status).toBe(201);
    expect(first.body.progress.currentPage).toBe(0);
    expect(first.body.pages[0].options[0].isCorrect).toBeUndefined();
    expect(first.body.pages[1].pairs).toBeUndefined();
    expect(first.body.pages[3].items[0].correctCategory).toBeUndefined();
    expect(second.status).toBe(200);

    const courseResponse = await request(app)
      .get(`/api/courses/${second.body.lesson.courseId}`)
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(courseResponse.body.learningState.hasStarted).toBe(true);
  });

  it('retries wrong answers, advances on correct answers, and completes once', async () => {
    const {
      course,
      lesson,
      learner,
      learnerToken,
      pages: [multipleChoice, matching, budgeting, wantsNeeds],
    } = await createCourseFixture();
    const start = await request(app)
      .post(`/api/courses/${course._id}/lessons/${lesson._id}/start`)
      .set('Authorization', `Bearer ${learnerToken}`);
    const submit = (pageId, answer) =>
      request(app)
        .post(
          `/api/courses/${course._id}/lessons/${lesson._id}/pages/${pageId}/submit`,
        )
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({ answer });

    const wrongChoice = await submit(multipleChoice._id, { optionIndex: 1 });
    const replay = await submit(multipleChoice._id, { optionIndex: 1 });
    const correctChoice = await submit(multipleChoice._id, { optionIndex: 0 });
    const wrongMatch = await submit(matching._id, {
      matches: [
        { wordIndex: 0, definitionIndex: 1 },
        { wordIndex: 1, definitionIndex: 0 },
      ],
    });
    const correctMatch = await submit(matching._id, {
      matches: [
        { wordIndex: 0, definitionIndex: 0 },
        { wordIndex: 1, definitionIndex: 1 },
      ],
    });
    const wrongBudget = await submit(budgeting._id, {
      selectedItemIndexes: [0],
    });
    const correctBudget = await submit(budgeting._id, {
      selectedItemIndexes: [1],
    });
    const wrongSort = await submit(wantsNeeds._id, {
      classifications: [
        { itemIndex: 0, category: 'want' },
        { itemIndex: 1, category: 'want' },
      ],
    });
    const completed = await submit(wantsNeeds._id, {
      classifications: [
        { itemIndex: 0, category: 'need' },
        { itemIndex: 1, category: 'want' },
      ],
    });
    const repeated = await submit(wantsNeeds._id, {
      classifications: [
        { itemIndex: 0, category: 'need' },
        { itemIndex: 1, category: 'want' },
      ],
    });

    expect(start.status).toBe(201);
    expect(wrongChoice.body.result).toMatchObject({
      correct: false,
      satisfied: false,
      attempts: 1,
    });
    expect(replay.body.result.attempts).toBe(1);
    expect(correctChoice.body.progress).toMatchObject({
      currentPage: 1,
      score: 0,
    });
    expect(wrongMatch.body.result.correct).toBe(false);
    expect(correctMatch.body.progress).toMatchObject({
      currentPage: 2,
      score: 0,
    });
    expect(wrongBudget.body.result.correct).toBe(false);
    expect(correctBudget.body.progress.currentPage).toBe(3);
    expect(wrongSort.body.result.correct).toBe(false);
    expect(completed.body.progress.state).toBe('completed');
    expect(completed.body.completion).toMatchObject({
      completed: true,
      score: 0,
      xpEarned: 12,
      newlyAwarded: true,
      courseCompleted: true,
      nextLesson: null,
    });
    expect(repeated.body.completion.newlyAwarded).toBe(false);

    const updatedLearner = await Learner.findById(learner._id);
    const progress = await LessonProgress.findOne({
      learner: learner._id,
      lesson: lesson._id,
    });
    expect(updatedLearner.experience).toBe(12);
    expect(updatedLearner.completedLessons).toHaveLength(1);
    expect(progress.pageResults).toHaveLength(4);
  });

  it('rejects out-of-order and cross-lesson pages', async () => {
    const {
      course,
      lesson,
      learnerToken,
      pages: [multipleChoice, , , wantsNeeds],
    } = await createCourseFixture();
    const otherLesson = await Lesson.create({
      courseId: course._id,
      name: 'Other Lesson',
      description: 'Another lesson.',
      pages: [wantsNeeds._id],
    });
    await request(app)
      .post(`/api/courses/${course._id}/lessons/${lesson._id}/start`)
      .set('Authorization', `Bearer ${learnerToken}`);

    const outOfOrder = await request(app)
      .post(
        `/api/courses/${course._id}/lessons/${lesson._id}/pages/${wantsNeeds._id}/submit`,
      )
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        answer: {
          classifications: [
            { itemIndex: 0, category: 'need' },
            { itemIndex: 1, category: 'want' },
          ],
        },
      });
    const crossLesson = await request(app)
      .post(`/api/courses/${course._id}/lessons/${otherLesson._id}/start`)
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(outOfOrder.status).toBe(409);
    expect(crossLesson.status).toBe(404);
    expect(multipleChoice.text).toBe('Choose the correct answer.');
  });
});

describe('current learner', () => {
  it('returns active and next-lesson resume state', async () => {
    const { course, lesson, learnerToken, pages } = await createCourseFixture();
    const nextLesson = new Lesson({
      courseId: course._id,
      name: 'Next Lesson',
      description: 'Continue learning.',
      experience: 5,
      estimatedDurationOfCompletionInMinutes: 5,
      pages: [],
    });
    const nextPage = await MultipleChoicePage.create({
      lessonId: nextLesson._id,
      text: 'Choose one.',
      options: [
        { answerText: 'Correct', isCorrect: true },
        { answerText: 'Incorrect', isCorrect: false },
      ],
    });
    nextLesson.pages = [nextPage._id];
    await nextLesson.save();
    course.lessons.push(nextLesson._id);
    await course.save();

    await request(app)
      .post(`/api/courses/${course._id}/lessons/${lesson._id}/start`)
      .set('Authorization', `Bearer ${learnerToken}`);

    const active = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(active.status).toBe(200);
    expect(active.body.learning.resume).toMatchObject({
      courseId: course._id.toString(),
      lessonId: lesson._id.toString(),
      pageId: pages[0]._id.toString(),
      pageNumber: 1,
      totalPages: 4,
    });

    for (const [index, page] of pages.entries()) {
      let answer;
      if (page.type === 'multiple_choice') {
        answer = { optionIndex: 0 };
      } else if (page.type === 'matching') {
        answer = {
          matches: [
            { wordIndex: 0, definitionIndex: 0 },
            { wordIndex: 1, definitionIndex: 1 },
          ],
        };
      } else if (page.type === 'budgeting') {
        answer = { selectedItemIndexes: [1] };
      } else {
        answer = {
          classifications: [
            { itemIndex: 0, category: 'need' },
            { itemIndex: 1, category: 'want' },
          ],
        };
      }

      const response = await request(app)
        .post(
          `/api/courses/${course._id}/lessons/${lesson._id}/pages/${page._id}/submit`,
        )
        .set('Authorization', `Bearer ${learnerToken}`)
        .send({ answer });
      expect(response.status).toBe(200);
      expect(response.body.progress.completedPages).toBe(index + 1);
    }

    const courseState = await request(app)
      .get(`/api/courses/${course._id}`)
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(courseState.body.learningState).toMatchObject({
      hasStarted: true,
      resumeLessonId: nextLesson._id.toString(),
    });

    const resumed = await request(app)
      .post(`/api/courses/${course._id}/lessons/${lesson._id}/start`)
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(resumed.body.completion).toMatchObject({
      completed: true,
      courseCompleted: false,
      nextLesson: {
        lessonId: nextLesson._id.toString(),
        name: 'Next Lesson',
      },
    });

    const completed = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${learnerToken}`);
    expect(completed.body.learning.resume).toMatchObject({
      courseId: course._id.toString(),
      lessonId: nextLesson._id.toString(),
      pageId: nextPage._id.toString(),
      pageNumber: 1,
      totalPages: 1,
    });
    expect(completed.body.learning.completedCourseIds).toEqual([]);
  });
});
