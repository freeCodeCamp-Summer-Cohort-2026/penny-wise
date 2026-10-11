'use strict';

var utils = require('../utils/writer.js');
var Lesson = require('../service/LessonService');

module.exports.createLesson = function createLesson(
  req,
  res,
  next,
  body,
  courseId,
) {
  Lesson.createLesson(body, courseId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createLesson = function createLesson(
  req,
  res,
  next,
  body,
  courseId,
) {
  Lesson.createLesson(body, courseId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteLesson = function deleteLesson(
  req,
  res,
  next,
  courseId,
  lessonId,
) {
  Lesson.deleteLesson(courseId, lessonId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getLessonById = function getLessonById(
  req,
  res,
  next,
  courseId,
  lessonId,
) {
  Lesson.getLessonById(courseId, lessonId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
