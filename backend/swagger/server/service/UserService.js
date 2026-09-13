'use strict';


/**
 * Create user.
 * This can only be done by the logged in user.
 *
 * body User Created user object (optional)
 * returns User
 **/
exports.createUser = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "firstName" : "John",
  "lastName" : "James",
  "password" : "12345",
  "userStatus" : 1,
  "phone" : "12345",
  "id" : 10,
  "email" : "john@email.com",
  "username" : "theUser"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Create user.
 * This can only be done by the logged in user.
 *
 * body User Created user object (optional)
 * returns User
 **/
exports.createUser = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "firstName" : "John",
  "lastName" : "James",
  "password" : "12345",
  "userStatus" : 1,
  "phone" : "12345",
  "id" : 10,
  "email" : "john@email.com",
  "username" : "theUser"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Creates list of users with given input array.
 * Creates list of users with given input array.
 *
 * body List  (optional)
 * returns User
 **/
exports.createUsersWithListInput = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "firstName" : "John",
  "lastName" : "James",
  "password" : "12345",
  "userStatus" : 1,
  "phone" : "12345",
  "id" : 10,
  "email" : "john@email.com",
  "username" : "theUser"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Delete user resource.
 * This can only be done by the logged in user.
 *
 * username String The name that needs to be deleted
 * no response value expected for this operation
 **/
exports.deleteUser = function(username) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get user by user name.
 * Get user detail based on username.
 *
 * username String The name that needs to be fetched. Use user1 for testing
 * returns User
 **/
exports.getUserByName = function(username) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "firstName" : "John",
  "lastName" : "James",
  "password" : "12345",
  "userStatus" : 1,
  "phone" : "12345",
  "id" : 10,
  "email" : "john@email.com",
  "username" : "theUser"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Logs user into the system.
 * Log into the system.
 *
 * username String The user name for login (optional)
 * password String The password for login in clear text (optional)
 * returns String
 **/
exports.loginUser = function(username,password) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Logs out current logged in user session.
 * Log user out of the system.
 *
 * no response value expected for this operation
 **/
exports.logoutUser = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update user resource.
 * This can only be done by the logged in user.
 *
 * body User Update an existent user in the store (optional)
 * username String name that need to be deleted
 * no response value expected for this operation
 **/
exports.updateUser = function(body,username) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update user resource.
 * This can only be done by the logged in user.
 *
 * body User Update an existent user in the store (optional)
 * username String name that need to be deleted
 * no response value expected for this operation
 **/
exports.updateUser = function(body,username) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

