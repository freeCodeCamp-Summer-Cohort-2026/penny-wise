'use strict';

var utils = require('../utils/writer.js');
var Course = require('../service/CourseService');

module.exports.createCourse = function createCourse(req, res, next, body) {
  Course.createCourse(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createCourse = function createCourse(req, res, next, body) {
  Course.createCourse(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteCourse = function deleteCourse(req, res, next, courseId) {
  Course.deleteCourse(courseId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getCourseById = function getCourseById(
  req,
  res,
  next,
  courseId,
) {
  Course.getCourseById(courseId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getCourses = function getCourses(req, res, next) {
  Course.getCourses()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getCoursesCatalog = function getCoursesCatalog(req, res, next) {
  Course.getCoursesCatalog()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
