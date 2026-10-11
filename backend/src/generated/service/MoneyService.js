'use strict';

/**
 * Add new Money definition.
 * Add new Money.
 *
 * body Money Create new Money
 * returns Money
 **/
exports.addMoney = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      country: {},
      notes: [null, null],
      coins: [
        {
          image: 'image',
          value: 0.8008281904610115,
        },
        {
          image: 'image',
          value: 0.8008281904610115,
        },
      ],
      name: 'name',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Add new Money definition.
 * Add new Money.
 *
 * body Money Create new Money
 * returns Money
 **/
exports.addMoney = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      country: {},
      notes: [null, null],
      coins: [
        {
          image: 'image',
          value: 0.8008281904610115,
        },
        {
          image: 'image',
          value: 0.8008281904610115,
        },
      ],
      name: 'name',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Update existing money.
 * Update existing money by Id.
 *
 * body Money Update existent money
 * returns Money
 **/
exports.updateMoney = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      country: {},
      notes: [null, null],
      coins: [
        {
          image: 'image',
          value: 0.8008281904610115,
        },
        {
          image: 'image',
          value: 0.8008281904610115,
        },
      ],
      name: 'name',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Update existing money.
 * Update existing money by Id.
 *
 * body Money Update existent money
 * returns Money
 **/
exports.updateMoney = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      country: {},
      notes: [null, null],
      coins: [
        {
          image: 'image',
          value: 0.8008281904610115,
        },
        {
          image: 'image',
          value: 0.8008281904610115,
        },
      ],
      name: 'name',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
