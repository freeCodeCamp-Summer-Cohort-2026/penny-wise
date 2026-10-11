'use strict';

/**
 * Create a country.
 * Create a country to reference its currency.
 *
 * body Country  (optional)
 * returns Country
 **/
exports.createCountry = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      code: 'USA',
      name: 'United States of America',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Create a country.
 * Create a country to reference its currency.
 *
 * body Country  (optional)
 * returns Country
 **/
exports.createCountry = function (body) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      code: 'USA',
      name: 'United States of America',
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * List of Countries.
 * Returns all Countries.
 *
 * returns List
 **/
exports.getCountries = function () {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = [
      {
        code: 'USA',
        name: 'United States of America',
      },
      {
        code: 'USA',
        name: 'United States of America',
      },
    ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
