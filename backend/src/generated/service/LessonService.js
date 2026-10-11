'use strict';

/**
 * Create a lesson.
 * Create a lesson in the course.
 *
 * body Lesson  (optional)
 * courseId Long ID of Course containing the Lesson
 * returns Lesson
 **/
exports.createLesson = function (body, courseId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      createdAt: '2000-01-23T04:56:07.000+00:00',
      pages: [{}, {}],
      name: 'name',
      description: 'description',
      estimatedDurationOfCompletionInMinutes: 6.027456183070403,
      experience: 0.8008281904610115,
      courseId: {},
      updatedAt: '2000-01-23T04:56:07.000+00:00',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Create a lesson.
 * Create a lesson in the course.
 *
 * body Lesson  (optional)
 * courseId Long ID of Course containing the Lesson
 * returns Lesson
 **/
exports.createLesson = function (body, courseId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      createdAt: '2000-01-23T04:56:07.000+00:00',
      pages: [{}, {}],
      name: 'name',
      description: 'description',
      estimatedDurationOfCompletionInMinutes: 6.027456183070403,
      experience: 0.8008281904610115,
      courseId: {},
      updatedAt: '2000-01-23T04:56:07.000+00:00',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Delete Lesson by identifier.
 * For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors.
 *
 * courseId Long ID of Course containing the Lesson
 * lessonId Long ID of the Lesson that needs to be deleted
 * no response value expected for this operation
 **/
exports.deleteLesson = function (courseId, lessonId) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

/**
 * Find Lesson by ID.
 * Find Lesson by ID in Course.
 *
 * courseId Long ID of Course containing the Lesson
 * lessonId Long ID of Lesson that needs to be fetched
 * returns Lesson
 **/
exports.getLessonById = function (courseId, lessonId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      createdAt: '2000-01-23T04:56:07.000+00:00',
      pages: [{}, {}],
      name: 'name',
      description: 'description',
      estimatedDurationOfCompletionInMinutes: 6.027456183070403,
      experience: 0.8008281904610115,
      courseId: {},
      updatedAt: '2000-01-23T04:56:07.000+00:00',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
