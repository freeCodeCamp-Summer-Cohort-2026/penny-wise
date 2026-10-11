'use strict';

/**
 * Generate an invitation to register an Author.
 * Generate an invitation to register an Author.
 *
 * body AuthorInvite Generate an invitation code
 * email String Email of Author to invite.
 * returns AuthorInvite
 **/
exports.authorInvite = function (body, email) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      code: '0102030405060708090a0b0c0d0e0f',
      expiringDate: '2000-01-23T04:56:07.000+00:00',
      email: 'author@pennywise.app',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Generate an invitation to register an Author.
 * Generate an invitation to register an Author.
 *
 * body AuthorInvite Generate an invitation code
 * email String Email of Author to invite.
 * returns AuthorInvite
 **/
exports.authorInvite = function (body, email) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      code: '0102030405060708090a0b0c0d0e0f',
      expiringDate: '2000-01-23T04:56:07.000+00:00',
      email: 'author@pennywise.app',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Get Author invitation by email.
 * Returns the Author invitation by email.
 *
 * email String Email of Author invitation to return
 * returns AuthorInvite
 **/
exports.getAuthorInvite = function (email) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      code: '0102030405060708090a0b0c0d0e0f',
      expiringDate: '2000-01-23T04:56:07.000+00:00',
      email: 'author@pennywise.app',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
