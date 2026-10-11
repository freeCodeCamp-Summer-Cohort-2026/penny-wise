'use strict';

/**
 * Add a new author.
 * Add a new author.
 *
 * body Author Create a new Author
 * returns Author
 **/
exports.addAuthor = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      createdAt: '2000-01-23T04:56:07.000+00:00',
      role: 'author',
      profilePicUrl: 'path/to/photo.jpg',
      displayName: 'Ama Author',
      coursesCreated: [{}, {}],
      email: 'author@pennywise.app',
      passwordHash: '0102030405060708090a0b0c0d0e0f',
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
 * Add a new author.
 * Add a new author.
 *
 * body Author Create a new Author
 * returns Author
 **/
exports.addAuthor = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      createdAt: '2000-01-23T04:56:07.000+00:00',
      role: 'author',
      profilePicUrl: 'path/to/photo.jpg',
      displayName: 'Ama Author',
      coursesCreated: [{}, {}],
      email: 'author@pennywise.app',
      passwordHash: '0102030405060708090a0b0c0d0e0f',
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
 * Update an existing author.
 * Update an existing author by Id.
 *
 * body Author Update an existent author
 * returns Author
 **/
exports.updateAuthor = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      createdAt: '2000-01-23T04:56:07.000+00:00',
      role: 'author',
      profilePicUrl: 'path/to/photo.jpg',
      displayName: 'Ama Author',
      coursesCreated: [{}, {}],
      email: 'author@pennywise.app',
      passwordHash: '0102030405060708090a0b0c0d0e0f',
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
 * Update an existing author.
 * Update an existing author by Id.
 *
 * body Author Update an existent author
 * returns Author
 **/
exports.updateAuthor = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      createdAt: '2000-01-23T04:56:07.000+00:00',
      role: 'author',
      profilePicUrl: 'path/to/photo.jpg',
      displayName: 'Ama Author',
      coursesCreated: [{}, {}],
      email: 'author@pennywise.app',
      passwordHash: '0102030405060708090a0b0c0d0e0f',
      updatedAt: '2000-01-23T04:56:07.000+00:00',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
