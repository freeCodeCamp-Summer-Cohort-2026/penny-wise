const Service = require('./Service');

/**
 * Create a course.
 * Create a course to contain lessons.
 *
 * course Course  (optional)
 * returns Course
 * */
const createCourse = ({ course }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          course,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Delete Course by identifier.
 * Delete Course by identifier
 *
 * courseId Long ID of the Course that needs to be deleted
 * no response value expected for this operation
 * */
const deleteCourse = ({ courseId }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          courseId,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Find Course by ID.
 * Find Course by ID.
 *
 * courseId Long ID of Course
 * returns Course
 * */
const getCourseById = ({ courseId }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          courseId,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Returns list of published courses.
 * Returns a list of published courses.
 *
 * returns Map
 * */
const getCoursesCatalog = () =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(Service.successResponse({}));
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });

module.exports = {
  createCourse,
  deleteCourse,
  getCourseById,
  getCoursesCatalog,
};
