const Service = require('./Service');

/**
 * Add a new user.
 * Add a new user.
 *
 * user User Create a new user
 * returns User
 * */
const addUser = ({ user }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          user,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Deletes a user.
 * Delete a user.
 *
 * userId Long User id to delete
 * apiUnderscorekey String  (optional)
 * no response value expected for this operation
 * */
const deleteUser = ({ userId, apiUnderscorekey }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          userId,
          apiUnderscorekey,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Delete user resource.
 * This can only be done by the logged in user.
 *
 * username String The name that needs to be deleted
 * no response value expected for this operation
 * */
const deleteUserByName = ({ username }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          username,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Deletes a Wallet.
 * Delete a Wallet.
 *
 * walletId Long The id of the wallet known for the user
 * wallet Wallet Deletes an user wallet.
 * no response value expected for this operation
 * */
const deleteWallet = ({ walletId, wallet }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          walletId,
          wallet,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Finds Users by status.
 * Multiple status values can be provided with comma separated strings.
 *
 * status String Status values that need to be considered for filter (optional)
 * returns List
 * */
const findUsersByStatus = ({ status }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          status,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Finds Users by tags.
 * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
 *
 * tags List Tags to filter by (optional)
 * returns List
 * */
const findUsersByTags = ({ tags }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          tags,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Find user by ID.
 * Returns a single user.
 *
 * userId Long ID of user to return
 * returns User
 * */
const getUserById = ({ userId }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          userId,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Get user by user name.
 * Get user detail based on username.
 *
 * username String The name that needs to be fetched. Use user1 for testing
 * returns User
 * */
const getUserByName = ({ username }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          username,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Logs user into the system.
 * Log into the system.
 *
 * username String The user name for login (optional)
 * password String The password for login in clear text (optional)
 * returns String
 * */
const loginUser = ({ username, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          username,
          password,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Logs out current logged in user session.
 * Log user out of the system.
 *
 * no response value expected for this operation
 * */
const logoutUser = () =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(Service.successResponse({}));
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Update an existing user.
 * Update an existing user by Id.
 *
 * user User Update an existent user
 * returns User
 * */
const updateUser = ({ user }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          user,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Update user resource.
 * This can only be done by the logged in user.
 *
 * username String name that need to be updated
 * user User Update an existent user in the store (optional)
 * no response value expected for this operation
 * */
const updateUserByName = ({ username, user }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          username,
          user,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Updates a user with form data.
 * Updates a user resource based on the form data.
 *
 * userId Long ID of user that needs to be updated
 * name String Name of user that needs to be updated (optional)
 * status String Status of user that needs to be updated (optional)
 * returns User
 * */
const updateUserWithForm = ({ userId, name, status }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          userId,
          name,
          status,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Uploads an image.
 * Upload image of the user.
 *
 * userId Long ID of user to update
 * additionalMetadata String Additional Metadata (optional)
 * body File  (optional)
 * returns ApiResponse
 * */
const uploadFile = ({ userId, additionalMetadata, body }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          userId,
          additionalMetadata,
          body,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });

module.exports = {
  addUser,
  deleteUser,
  deleteUserByName,
  deleteWallet,
  findUsersByStatus,
  findUsersByTags,
  getUserById,
  getUserByName,
  loginUser,
  logoutUser,
  updateUser,
  updateUserByName,
  updateUserWithForm,
  uploadFile,
};
