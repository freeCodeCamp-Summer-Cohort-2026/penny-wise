const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const { Page } = require('../models/Page');
const LessonProgress = require('../models/LessonProgress');
const { Learner } = require('../models/User');
const { requireAuth, optionalAuth, checkRole } = require('../middleware/auth');

const router = express.Router();

class RouteError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const asyncRoute = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

function validateObjectId(value, name) {
  if (!mongoose.isObjectIdOrHexString(value)) {
    throw new RouteError(400, `${name} must be a valid ObjectId`);
  }
}

function idEquals(left, right) {
  return left?.toString() === right?.toString();
}

function orderLessons(course, lessons) {
  const lessonList = lessons instanceof Map ? [...lessons.values()] : lessons;
  const lessonsById = new Map(
    lessonList.map((lesson) => [lesson._id.toString(), lesson]),
  );
  const orderedLessons = course.lessons.map((lessonId) =>
    lessonsById.get(lessonId.toString()),
  );

  if (orderedLessons.some((lesson) => !lesson)) {
    throw new Error('Course contains an invalid lesson reference');
  }

  return orderedLessons;
}

function serializeLessonSummary(lesson) {
  return {
    _id: lesson._id,
    courseId: lesson.courseId,
    name: lesson.name,
    description: lesson.description,
    experience: lesson.experience,
    estimatedDurationOfCompletionInMinutes:
      lesson.estimatedDurationOfCompletionInMinutes,
    briefLesson: lesson.briefLesson || null,
  };
}

function serializeCourse(course, lessons) {
  const lessonSummaries = lessons.map(serializeLessonSummary);

  return {
    _id: course._id,
    name: course.name,
    published: course.published,
    lessons: lessonSummaries,
    lessonCount: lessonSummaries.length,
    totalEstimatedDurationInMinutes: lessonSummaries.reduce(
      (total, lesson) => total + lesson.estimatedDurationOfCompletionInMinutes,
      0,
    ),
  };
}

async function loadPublishedCourse(courseId) {
  validateObjectId(courseId, 'courseId');

  const course = await Course.findOne({
    _id: courseId,
    published: true,
  }).lean();

  if (!course) {
    throw new RouteError(404, 'Course not found');
  }

  return course;
}

async function loadCourseLessons(course) {
  const lessons = await Lesson.find({
    _id: { $in: course.lessons },
    courseId: course._id,
  });

  return orderLessons(course, lessons);
}

async function loadLearner(learnerId) {
  const learner = await Learner.findById(learnerId);

  if (!learner) {
    throw new RouteError(404, 'Learner not found');
  }

  return learner;
}

async function getLearningState(course, learnerId) {
  const learner = await Learner.findById(learnerId).lean();
  const enrolled = learner.coursesEnrolled.some((courseId) =>
    idEquals(courseId, course._id),
  );
  const completedProgress = await LessonProgress.find({
    learner: learnerId,
    course: course._id,
    state: 'completed',
  })
    .select('lesson')
    .lean();
  const completedLessonIds = completedProgress.map((progress) =>
    progress.lesson.toString(),
  );
  const completedSet = new Set(completedLessonIds);
  const activeProgress = await LessonProgress.findOne({
    learner: learnerId,
    course: course._id,
    state: 'in_progress',
  })
    .sort({ updatedAt: -1 })
    .lean();
  const nextLessonId = course.lessons.find(
    (lessonId) => !completedSet.has(lessonId.toString()),
  );
  const totalLessons = course.lessons.length;
  const status = !enrolled
    ? 'not_enrolled'
    : completedLessonIds.length === totalLessons
      ? 'completed'
      : 'in_progress';

  return {
    enrolled,
    status,
    completedLessonIds,
    totalLessons,
    progressPercent:
      totalLessons === 0
        ? 0
        : Math.round((completedLessonIds.length / totalLessons) * 100),
    hasStarted: Boolean(activeProgress) || completedLessonIds.length > 0,
    firstLessonId: course.lessons[0] || null,
    resumeLessonId:
      activeProgress?.lesson || nextLessonId || course.lessons[0] || null,
  };
}

async function resolveLearningState(req, course) {
  if (req.user?.role !== 'learner') {
    return null;
  }

  return getLearningState(course, req.user.id);
}

async function loadLessonContent(courseId, lessonId, learnerId) {
  const course = await loadPublishedCourse(courseId);
  const learner = await loadLearner(learnerId);
  const enrolled = learner.coursesEnrolled.some((enrolledCourseId) =>
    idEquals(enrolledCourseId, course._id),
  );

  if (!enrolled) {
    throw new RouteError(403, 'Enroll in this course before starting a lesson');
  }

  validateObjectId(lessonId, 'lessonId');

  const lesson = await Lesson.findOne({
    _id: lessonId,
    courseId: course._id,
  });

  if (!lesson || !course.lessons.some((id) => idEquals(id, lesson._id))) {
    throw new RouteError(404, 'Lesson not found in this course');
  }

  if (lesson.pages.length === 0) {
    throw new RouteError(409, 'This lesson has no learning activities');
  }

  const pages = await Page.find({
    _id: { $in: lesson.pages },
    lessonId: lesson._id,
  });
  const pagesById = new Map(pages.map((page) => [page._id.toString(), page]));
  const orderedPages = lesson.pages.map((pageId) =>
    pagesById.get(pageId.toString()),
  );

  if (orderedPages.some((page) => !page)) {
    throw new Error('Lesson contains an invalid page reference');
  }

  return { course, learner, lesson, pages: orderedPages };
}

function serializePage(page, index) {
  const serialized = {
    _id: page._id,
    index,
    type: page.type,
    text: page.text,
    imageUrl: page.imageUrl || null,
    audioUrl: page.audioUrl || null,
  };

  if (page.type === 'multiple_choice') {
    serialized.options = page.options.map((option, optionIndex) => ({
      index: optionIndex,
      answerText: option.answerText,
    }));
  }

  if (page.type === 'matching') {
    serialized.words = page.pairs.map((pair, wordIndex) => ({
      index: wordIndex,
      text: pair.word,
    }));
    serialized.definitions = page.pairs
      .map((pair, definitionIndex) => ({
        index: definitionIndex,
        text: pair.definition,
      }))
      .reverse();
  }

  if (page.type === 'budgeting') {
    serialized.startingAmount = page.startingAmount;
    serialized.targetSavings = page.targetSavings;
    serialized.availableItems = page.availableItems.map((item, itemIndex) => ({
      index: itemIndex,
      name: item.name,
      cost: item.cost,
    }));
  }

  if (page.type === 'wants_needs') {
    serialized.items = page.itemsToSort.map((item, itemIndex) => ({
      index: itemIndex,
      name: item.name,
    }));
  }

  return serialized;
}

function serializeProgress(progress, totalPages) {
  return {
    state: progress.state,
    currentPage: progress.state === 'completed' ? null : progress.currentPage,
    score: progress.score,
    totalPages,
    completedPages: progress.pageResults.filter((result) => result.satisfied)
      .length,
    startedAt: progress.startedAt,
    completedAt: progress.completedAt,
    pageResults: progress.pageResults.map((result) => ({
      pageId: result.pageId,
      pageIndex: result.pageIndex,
      attempts: result.attempts,
      firstAttemptCorrect: result.firstAttemptCorrect,
      satisfied: result.satisfied,
      submittedAt: result.submittedAt,
      completedAt: result.completedAt,
    })),
  };
}

function serializePlayer(lesson, pages, progress) {
  return {
    lesson: serializeLessonSummary(lesson),
    pages: pages.map(serializePage),
    progress: serializeProgress(progress, pages.length),
  };
}

function validateMatchingMatches(answer, page) {
  if (
    !Array.isArray(answer.matches) ||
    answer.matches.length !== page.pairs.length
  ) {
    throw new RouteError(400, 'Match every word to one definition');
  }

  const wordIndexes = new Set();
  const definitionIndexes = new Set();

  for (const match of answer.matches) {
    if (
      !Number.isInteger(match.wordIndex) ||
      !Number.isInteger(match.definitionIndex) ||
      match.wordIndex < 0 ||
      match.wordIndex >= page.pairs.length ||
      match.definitionIndex < 0 ||
      match.definitionIndex >= page.pairs.length ||
      wordIndexes.has(match.wordIndex) ||
      definitionIndexes.has(match.definitionIndex)
    ) {
      throw new RouteError(400, 'Matching answers must be unique and in range');
    }

    wordIndexes.add(match.wordIndex);
    definitionIndexes.add(match.definitionIndex);
  }

  const normalized = [...answer.matches].sort(
    (left, right) => left.wordIndex - right.wordIndex,
  );
  const correct = normalized.every(
    (match) =>
      page.pairs[match.wordIndex].definition ===
      page.pairs[match.definitionIndex].definition,
  );

  return { correct, normalized };
}

function validateBudgetingAnswer(answer, page) {
  if (!Array.isArray(answer.selectedItemIndexes)) {
    throw new RouteError(400, 'Select at least one item');
  }

  const selected = [...answer.selectedItemIndexes].sort(
    (left, right) => left - right,
  );
  const unique = new Set(selected);

  if (
    selected.length === 0 ||
    unique.size !== selected.length ||
    selected.some(
      (itemIndex) =>
        !Number.isInteger(itemIndex) ||
        itemIndex < 0 ||
        itemIndex >= page.availableItems.length,
    )
  ) {
    throw new RouteError(
      400,
      'Budget item selections must be unique and valid',
    );
  }

  const totalCost = selected.reduce(
    (total, itemIndex) => total + page.availableItems[itemIndex].cost,
    0,
  );

  return {
    correct: totalCost <= page.startingAmount - Math.max(0, page.targetSavings),
    normalized: { selectedItemIndexes: selected },
  };
}

function validateWantsNeedsAnswer(answer, page) {
  if (
    !Array.isArray(answer.classifications) ||
    answer.classifications.length !== page.itemsToSort.length
  ) {
    throw new RouteError(400, 'Classify every item as a want or need');
  }

  const itemIndexes = new Set();

  for (const classification of answer.classifications) {
    if (
      !Number.isInteger(classification.itemIndex) ||
      classification.itemIndex < 0 ||
      classification.itemIndex >= page.itemsToSort.length ||
      !['want', 'need'].includes(classification.category) ||
      itemIndexes.has(classification.itemIndex)
    ) {
      throw new RouteError(
        400,
        'Item classifications must be unique and valid',
      );
    }

    itemIndexes.add(classification.itemIndex);
  }

  const normalized = [...answer.classifications].sort(
    (left, right) => left.itemIndex - right.itemIndex,
  );
  const correct = normalized.every(
    (classification) =>
      page.itemsToSort[classification.itemIndex].correctCategory ===
      classification.category,
  );

  return { correct, normalized };
}

function gradeAnswer(page, answer) {
  if (!answer || typeof answer !== 'object' || Array.isArray(answer)) {
    throw new RouteError(400, 'An answer object is required');
  }

  if (page.type === 'multiple_choice') {
    if (
      !Number.isInteger(answer.optionIndex) ||
      answer.optionIndex < 0 ||
      answer.optionIndex >= page.options.length
    ) {
      throw new RouteError(400, 'Select one valid option');
    }

    return {
      correct: page.options[answer.optionIndex].isCorrect === true,
      normalized: { optionIndex: answer.optionIndex },
    };
  }

  if (page.type === 'matching') {
    return validateMatchingMatches(answer, page);
  }

  if (page.type === 'budgeting') {
    return validateBudgetingAnswer(answer, page);
  }

  if (page.type === 'wants_needs') {
    return validateWantsNeedsAnswer(answer, page);
  }

  throw new Error(`Unsupported page type: ${page.type}`);
}

function answerHash(normalizedAnswer) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(normalizedAnswer))
    .digest('hex');
}

function incorrectFeedback(page) {
  if (page.incorrectMessage) {
    return page.incorrectMessage;
  }

  const fallback = {
    multiple_choice: 'Not quite. Review each option and try again.',
    matching: 'Not quite. Check each meaning and match it again.',
    budgeting: 'That plan misses the savings goal. Adjust your purchases.',
    wants_needs: 'Not quite. Decide whether each item is something you need.',
  };

  return fallback[page.type] || 'Not quite. Try again.';
}

function serializeResult(result, page) {
  return {
    pageId: result.pageId,
    pageIndex: result.pageIndex,
    correct: result.satisfied,
    satisfied: result.satisfied,
    attempts: result.attempts,
    firstAttemptCorrect: result.firstAttemptCorrect,
    feedback: result.satisfied ? null : incorrectFeedback(page),
    submittedAt: result.submittedAt,
  };
}

async function getCourseCompletion(course, lesson, progress) {
  const completedProgress = await LessonProgress.find({
    learner: progress.learner,
    course: course._id,
    state: 'completed',
  })
    .select('lesson')
    .lean();
  const completedIds = new Set(
    completedProgress.map((item) => item.lesson.toString()),
  );
  const courseCompleted = course.lessons.every((lessonId) =>
    completedIds.has(lessonId.toString()),
  );
  let nextLesson = null;

  if (!courseCompleted) {
    const nextLessonId = course.lessons.find(
      (lessonId) => !completedIds.has(lessonId.toString()),
    );
    const nextLessonDocument = await Lesson.findById(nextLessonId).lean();

    if (nextLessonDocument) {
      nextLesson = {
        lessonId: nextLessonDocument._id,
        name: nextLessonDocument.name,
      };
    }
  }

  return { courseCompleted, nextLesson };
}

async function finalizeCompletion(course, lesson, progress) {
  const completedAt = progress.completedAt || new Date();
  const updatedLearner = await Learner.findOneAndUpdate(
    {
      _id: progress.learner,
      completedLessons: {
        $not: { $elemMatch: { lessonId: lesson._id } },
      },
    },
    {
      $inc: { experience: lesson.experience },
      $push: {
        completedLessons: {
          lessonId: lesson._id,
          score: progress.score,
          completedAt,
        },
      },
    },
    { returnDocument: 'after' },
  );
  const newlyAwarded = Boolean(updatedLearner);

  if (!updatedLearner) {
    const learnerExists = await Learner.exists({ _id: progress.learner });

    if (!learnerExists) {
      throw new RouteError(404, 'Learner not found');
    }
  }

  const { courseCompleted, nextLesson } = await getCourseCompletion(
    course,
    lesson,
    progress,
  );

  return {
    completed: true,
    score: progress.score,
    totalPages: lesson.pages.length,
    xpEarned: lesson.experience,
    newlyAwarded,
    completedAt,
    courseCompleted,
    nextLesson,
  };
}

async function buildSubmissionResponse(
  course,
  lesson,
  pages,
  progress,
  result,
) {
  const page = pages[result.pageIndex];
  const response = {
    result: serializeResult(result, page),
    progress: serializeProgress(progress, pages.length),
    completion: null,
  };

  if (progress.state === 'completed') {
    response.completion = await finalizeCompletion(course, lesson, progress);
  }

  return response;
}

router.get(
  '/',
  asyncRoute(async (req, res) => {
    const courses = await Course.find({ published: true }).lean();
    const lessonIds = courses.flatMap((course) => course.lessons);
    const lessons = await Lesson.find({ _id: { $in: lessonIds } });
    const lessonsById = new Map(
      lessons.map((lesson) => [lesson._id.toString(), lesson]),
    );
    const summaries = courses.map((course) => {
      const orderedLessons = orderLessons(course, lessonsById);
      return serializeCourse(course, orderedLessons);
    });

    res.json({ courses: summaries });
  }),
);

router.get(
  '/:courseId',
  optionalAuth,
  asyncRoute(async (req, res) => {
    const course = await loadPublishedCourse(req.params.courseId);
    const lessons = await loadCourseLessons(course);
    const learningState = await resolveLearningState(req, course);

    res.json({
      course: serializeCourse(course, lessons),
      learningState,
    });
  }),
);

router.post(
  '/:courseId/enroll',
  requireAuth,
  checkRole('learner'),
  asyncRoute(async (req, res) => {
    const course = await loadPublishedCourse(req.params.courseId);
    const learner = await loadLearner(req.user.id);
    const alreadyEnrolled = learner.coursesEnrolled.some((courseId) =>
      idEquals(courseId, course._id),
    );

    if (!alreadyEnrolled) {
      await Learner.updateOne(
        { _id: learner._id },
        { $addToSet: { coursesEnrolled: course._id } },
      );
    }

    const lessons = await loadCourseLessons(course);
    const learningState = await getLearningState(course, learner._id);

    res.status(alreadyEnrolled ? 200 : 201).json({
      course: serializeCourse(course, lessons),
      learningState,
    });
  }),
);

router.post(
  '/:courseId/lessons/:lessonId/start',
  requireAuth,
  checkRole('learner'),
  asyncRoute(async (req, res) => {
    const { course, lesson, pages } = await loadLessonContent(
      req.params.courseId,
      req.params.lessonId,
      req.user.id,
    );
    let progress = await LessonProgress.findOne({
      learner: req.user.id,
      course: course._id,
      lesson: lesson._id,
    });
    let status = 200;

    if (!progress) {
      try {
        progress = await LessonProgress.create({
          learner: req.user.id,
          course: course._id,
          lesson: lesson._id,
        });
        status = 201;
      } catch (error) {
        if (error.code !== 11000) {
          throw error;
        }

        progress = await LessonProgress.findOne({
          learner: req.user.id,
          course: course._id,
          lesson: lesson._id,
        });
      }
    }

    let completion = null;

    if (progress.state === 'completed') {
      completion = await finalizeCompletion(course, lesson, progress);
    }

    res.status(status).json({
      ...serializePlayer(lesson, pages, progress),
      completion,
    });
  }),
);

router.post(
  '/:courseId/lessons/:lessonId/pages/:pageId/submit',
  requireAuth,
  checkRole('learner'),
  asyncRoute(async (req, res) => {
    validateObjectId(req.params.pageId, 'pageId');

    const { course, lesson, pages } = await loadLessonContent(
      req.params.courseId,
      req.params.lessonId,
      req.user.id,
    );
    const pageIndex = lesson.pages.findIndex((pageId) =>
      idEquals(pageId, req.params.pageId),
    );

    if (pageIndex === -1) {
      throw new RouteError(404, 'Page not found in this lesson');
    }

    const page = pages[pageIndex];
    const { correct, normalized } = gradeAnswer(page, req.body.answer);
    const hash = answerHash(normalized);
    const progress = await LessonProgress.findOne({
      learner: req.user.id,
      course: course._id,
      lesson: lesson._id,
    });

    if (!progress) {
      throw new RouteError(409, 'Start this lesson before submitting answers');
    }

    let result = progress.pageResults.find((item) =>
      idEquals(item.pageId, page._id),
    );

    if (result?.lastAnswerHash === hash) {
      const response = await buildSubmissionResponse(
        course,
        lesson,
        pages,
        progress,
        result,
      );
      return res.json(response);
    }

    if (result?.satisfied || pageIndex !== progress.currentPage) {
      throw new RouteError(
        409,
        'Answer the current activity before continuing',
      );
    }

    const submittedAt = new Date();

    if (!result) {
      result = {
        pageId: page._id,
        pageIndex,
        attempts: 0,
        firstAttemptCorrect: false,
        satisfied: false,
        lastAnswerHash: null,
        submittedAt,
        completedAt: null,
      };
      progress.pageResults.push(result);
      result = progress.pageResults.at(-1);
    }

    result.attempts += 1;
    result.lastAnswerHash = hash;
    result.submittedAt = submittedAt;

    if (correct) {
      result.satisfied = true;
      result.completedAt = submittedAt;

      if (result.attempts === 1) {
        result.firstAttemptCorrect = true;
        progress.score += 1;
      }

      if (pageIndex === pages.length - 1) {
        progress.state = 'completed';
        progress.currentPage = pageIndex;
        progress.completedAt = submittedAt;
      } else {
        progress.currentPage = pageIndex + 1;
      }
    }

    try {
      await progress.save();
    } catch (error) {
      if (error.name === 'VersionError') {
        throw new RouteError(
          409,
          'Activity changed on another device. Try again.',
        );
      }

      throw error;
    }

    const response = await buildSubmissionResponse(
      course,
      lesson,
      pages,
      progress,
      result,
    );
    return res.json(response);
  }),
);

router.use((error, req, res, next) => {
  if (error instanceof RouteError) {
    return res.status(error.status).json({ error: error.message });
  }

  return next(error);
});

module.exports = router;
