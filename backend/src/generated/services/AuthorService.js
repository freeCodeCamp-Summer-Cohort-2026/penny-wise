const Service = require('./Service');

/**
 * Add a new author.
 * Add a new author.
 *
 * author Author Create a new Author
 * returns Author
 * */
const addAuthor = ({ author }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          author,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Update an existing author.
 * Update an existing author by Id.
 *
 * author Author Update an existent author
 * returns Author
 * */
const updateAuthor = ({ author }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          author,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });

module.exports = {
  addAuthor,
  updateAuthor,
};
