const Service = require('./Service');

/**
 * Create a lesson.
 * Create a lesson in the course.
 *
 * courseId Long ID of Course containing the Lesson
 * lesson Lesson  (optional)
 * returns Lesson
 * */
const createLesson = ({ courseId, lesson }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          courseId,
          lesson,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Delete Lesson by identifier.
 * For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors.
 *
 * courseId Long ID of Course containing the Lesson
 * lessonId Long ID of the Lesson that needs to be deleted
 * no response value expected for this operation
 * */
const deleteLesson = ({ courseId, lessonId }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          courseId,
          lessonId,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Find Lesson by ID.
 * Find Lesson by ID in Course.
 *
 * courseId Long ID of Course containing the Lesson
 * lessonId Long ID of Lesson that needs to be fetched
 * returns Lesson
 * */
const getLessonById = ({ courseId, lessonId }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          courseId,
          lessonId,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });

module.exports = {
  createLesson,
  deleteLesson,
  getLessonById,
};
