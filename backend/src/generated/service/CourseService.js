'use strict';

/**
 * Create a course.
 * Create a course to contain lessons.
 *
 * body Course  (optional)
 * returns Course
 **/
exports.createCourse = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      createdAt: '2000-01-23T04:56:07.000+00:00',
      creatorId: {},
      name: 'name',
      published: true,
      lessons: [{}, {}],
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
 * Create a course.
 * Create a course to contain lessons.
 *
 * body Course  (optional)
 * returns Course
 **/
exports.createCourse = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      createdAt: '2000-01-23T04:56:07.000+00:00',
      creatorId: {},
      name: 'name',
      published: true,
      lessons: [{}, {}],
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
 * Delete Course by identifier.
 * Delete Course by identifier
 *
 * courseId Long ID of the Course that needs to be deleted
 * no response value expected for this operation
 **/
exports.deleteCourse = function (courseId) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

/**
 * Find Course by ID.
 * Find Course by ID.
 *
 * courseId Long ID of Course
 * returns Course
 **/
exports.getCourseById = function (courseId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      createdAt: '2000-01-23T04:56:07.000+00:00',
      creatorId: {},
      name: 'name',
      published: true,
      lessons: [{}, {}],
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
 * List of Courses.
 * Returns all Courses.
 *
 * returns List
 **/
exports.getCourses = function () {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = [
      {
        createdAt: '2000-01-23T04:56:07.000+00:00',
        creatorId: {},
        name: 'name',
        published: true,
        lessons: [{}, {}],
        updatedAt: '2000-01-23T04:56:07.000+00:00',
      },
      {
        createdAt: '2000-01-23T04:56:07.000+00:00',
        creatorId: {},
        name: 'name',
        published: true,
        lessons: [{}, {}],
        updatedAt: '2000-01-23T04:56:07.000+00:00',
      },
    ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Returns list of published courses.
 * Returns a list of published courses.
 *
 * returns Map
 **/
exports.getCoursesCatalog = function () {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      key: 0,
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
