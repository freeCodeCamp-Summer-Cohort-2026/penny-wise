const Service = require('./Service');

/**
 * Generate an invitation to register an Author.
 * Generate an invitation to register an Author.
 *
 * email String Email of Author to invite.
 * authorInvite AuthorInvite Generate an invitation code
 * returns AuthorInvite
 * */
const authorInvite = ({ email, authorInvite }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          email,
          authorInvite,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Get Author invitation by email.
 * Returns the Author invitation by email.
 *
 * email String Email of Author invitation to return
 * returns AuthorInvite
 * */
const getAuthorInvite = ({ email }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          email,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });

module.exports = {
  authorInvite,
  getAuthorInvite,
};
