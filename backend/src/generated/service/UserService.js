'use strict';

/**
 * Add a new user.
 * Add a new user.
 *
 * body User Create a new user
 * returns User
 **/
exports.addUser = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      currentStreak: 0.8008281904610115,
      country: {},
      role: 'learner',
      level: 1.4658129805029452,
      displayName: 'displayName',
      experience: 5.962133916683182,
      passwordHash: 'passwordHash',
      createdAt: '2000-01-23T04:56:07.000+00:00',
      currentLives: 5.637376656633329,
      profilePicUrl: 'profilePicUrl',
      coursesEnrolled: [{}, {}],
      coursesCreated: [{}, {}],
      longestStreak: 6.027456183070403,
      email: 'email',
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
 * Add a new user.
 * Add a new user.
 *
 * body User Create a new user
 * returns User
 **/
exports.addUser = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      currentStreak: 0.8008281904610115,
      country: {},
      role: 'learner',
      level: 1.4658129805029452,
      displayName: 'displayName',
      experience: 5.962133916683182,
      passwordHash: 'passwordHash',
      createdAt: '2000-01-23T04:56:07.000+00:00',
      currentLives: 5.637376656633329,
      profilePicUrl: 'profilePicUrl',
      coursesEnrolled: [{}, {}],
      coursesCreated: [{}, {}],
      longestStreak: 6.027456183070403,
      email: 'email',
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
 * Deletes a user.
 * Delete a user.
 *
 * userId Long User id to delete
 * api_key String  (optional)
 * no response value expected for this operation
 **/
exports.deleteUser = function (userId, api_key) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

/**
 * Delete user resource.
 * This can only be done by the logged in user.
 *
 * username String The name that needs to be deleted
 * no response value expected for this operation
 **/
exports.deleteUserByName = function (username) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

/**
 * Deletes a Wallet.
 * Delete a Wallet.
 *
 * walletId Long The id of the wallet known for the user
 * no response value expected for this operation
 **/
exports.deleteWallet = function (walletId) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

/**
 * Finds Users by status.
 * Multiple status values can be provided with comma separated strings.
 *
 * status String Status values that need to be considered for filter (optional)
 * returns List
 **/
exports.findUsersByStatus = function (status) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = [
      {
        currentStreak: 0.8008281904610115,
        country: {},
        role: 'learner',
        level: 1.4658129805029452,
        displayName: 'displayName',
        experience: 5.962133916683182,
        passwordHash: 'passwordHash',
        createdAt: '2000-01-23T04:56:07.000+00:00',
        currentLives: 5.637376656633329,
        profilePicUrl: 'profilePicUrl',
        coursesEnrolled: [{}, {}],
        coursesCreated: [{}, {}],
        longestStreak: 6.027456183070403,
        email: 'email',
        updatedAt: '2000-01-23T04:56:07.000+00:00',
      },
      {
        currentStreak: 0.8008281904610115,
        country: {},
        role: 'learner',
        level: 1.4658129805029452,
        displayName: 'displayName',
        experience: 5.962133916683182,
        passwordHash: 'passwordHash',
        createdAt: '2000-01-23T04:56:07.000+00:00',
        currentLives: 5.637376656633329,
        profilePicUrl: 'profilePicUrl',
        coursesEnrolled: [{}, {}],
        coursesCreated: [{}, {}],
        longestStreak: 6.027456183070403,
        email: 'email',
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
 * Finds Users by tags.
 * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
 *
 * tags List Tags to filter by (optional)
 * returns List
 **/
exports.findUsersByTags = function (tags) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = [
      {
        currentStreak: 0.8008281904610115,
        country: {},
        role: 'learner',
        level: 1.4658129805029452,
        displayName: 'displayName',
        experience: 5.962133916683182,
        passwordHash: 'passwordHash',
        createdAt: '2000-01-23T04:56:07.000+00:00',
        currentLives: 5.637376656633329,
        profilePicUrl: 'profilePicUrl',
        coursesEnrolled: [{}, {}],
        coursesCreated: [{}, {}],
        longestStreak: 6.027456183070403,
        email: 'email',
        updatedAt: '2000-01-23T04:56:07.000+00:00',
      },
      {
        currentStreak: 0.8008281904610115,
        country: {},
        role: 'learner',
        level: 1.4658129805029452,
        displayName: 'displayName',
        experience: 5.962133916683182,
        passwordHash: 'passwordHash',
        createdAt: '2000-01-23T04:56:07.000+00:00',
        currentLives: 5.637376656633329,
        profilePicUrl: 'profilePicUrl',
        coursesEnrolled: [{}, {}],
        coursesCreated: [{}, {}],
        longestStreak: 6.027456183070403,
        email: 'email',
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
 * Find user by ID.
 * Returns a single user.
 *
 * userId Long ID of user to return
 * returns User
 **/
exports.getUserById = function (userId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      currentStreak: 0.8008281904610115,
      country: {},
      role: 'learner',
      level: 1.4658129805029452,
      displayName: 'displayName',
      experience: 5.962133916683182,
      passwordHash: 'passwordHash',
      createdAt: '2000-01-23T04:56:07.000+00:00',
      currentLives: 5.637376656633329,
      profilePicUrl: 'profilePicUrl',
      coursesEnrolled: [{}, {}],
      coursesCreated: [{}, {}],
      longestStreak: 6.027456183070403,
      email: 'email',
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
 * Get user by user name.
 * Get user detail based on username.
 *
 * username String The name that needs to be fetched. Use user1 for testing
 * returns User
 **/
exports.getUserByName = function (username) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      currentStreak: 0.8008281904610115,
      country: {},
      role: 'learner',
      level: 1.4658129805029452,
      displayName: 'displayName',
      experience: 5.962133916683182,
      passwordHash: 'passwordHash',
      createdAt: '2000-01-23T04:56:07.000+00:00',
      currentLives: 5.637376656633329,
      profilePicUrl: 'profilePicUrl',
      coursesEnrolled: [{}, {}],
      coursesCreated: [{}, {}],
      longestStreak: 6.027456183070403,
      email: 'email',
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
 * Logs user into the system.
 * Log into the system.
 *
 * username String The user name for login (optional)
 * password String The password for login in clear text (optional)
 * returns String
 **/
exports.loginUser = function (username, password) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = '';
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Logs out current logged in user session.
 * Log user out of the system.
 *
 * no response value expected for this operation
 **/
exports.logoutUser = function () {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

/**
 * Update an existing user.
 * Update an existing user by Id.
 *
 * body User Update an existent user
 * returns User
 **/
exports.updateUser = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      currentStreak: 0.8008281904610115,
      country: {},
      role: 'learner',
      level: 1.4658129805029452,
      displayName: 'displayName',
      experience: 5.962133916683182,
      passwordHash: 'passwordHash',
      createdAt: '2000-01-23T04:56:07.000+00:00',
      currentLives: 5.637376656633329,
      profilePicUrl: 'profilePicUrl',
      coursesEnrolled: [{}, {}],
      coursesCreated: [{}, {}],
      longestStreak: 6.027456183070403,
      email: 'email',
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
 * Update an existing user.
 * Update an existing user by Id.
 *
 * body User Update an existent user
 * returns User
 **/
exports.updateUser = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      currentStreak: 0.8008281904610115,
      country: {},
      role: 'learner',
      level: 1.4658129805029452,
      displayName: 'displayName',
      experience: 5.962133916683182,
      passwordHash: 'passwordHash',
      createdAt: '2000-01-23T04:56:07.000+00:00',
      currentLives: 5.637376656633329,
      profilePicUrl: 'profilePicUrl',
      coursesEnrolled: [{}, {}],
      coursesCreated: [{}, {}],
      longestStreak: 6.027456183070403,
      email: 'email',
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
 * Update user resource.
 * This can only be done by the logged in user.
 *
 * body User Update an existent user in the store (optional)
 * username String name that need to be updated
 * no response value expected for this operation
 **/
exports.updateUserByName = function (body, username) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

/**
 * Update user resource.
 * This can only be done by the logged in user.
 *
 * body User Update an existent user in the store (optional)
 * username String name that need to be updated
 * no response value expected for this operation
 **/
exports.updateUserByName = function (body, username) {
  return new Promise(function (resolve, reject) {
    resolve();
  });
};

/**
 * Updates a user with form data.
 * Updates a user resource based on the form data.
 *
 * userId Long ID of user that needs to be updated
 * name String Name of user that needs to be updated (optional)
 * status String Status of user that needs to be updated (optional)
 * returns User
 **/
exports.updateUserWithForm = function (userId, name, status) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      currentStreak: 0.8008281904610115,
      country: {},
      role: 'learner',
      level: 1.4658129805029452,
      displayName: 'displayName',
      experience: 5.962133916683182,
      passwordHash: 'passwordHash',
      createdAt: '2000-01-23T04:56:07.000+00:00',
      currentLives: 5.637376656633329,
      profilePicUrl: 'profilePicUrl',
      coursesEnrolled: [{}, {}],
      coursesCreated: [{}, {}],
      longestStreak: 6.027456183070403,
      email: 'email',
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
 * Uploads an image.
 * Upload image of the user.
 *
 * body Object  (optional)
 * additionalMetadata String Additional Metadata (optional)
 * userId Long ID of user to update
 * returns ApiResponse
 **/
exports.uploadFile = function (body, additionalMetadata, userId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      code: 0,
      type: 'type',
      message: 'message',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
