'use strict';

/**
 * Find wallet by ID.
 * Returns an user wallet.
 *
 * walletId Long The id of the wallet known for the user
 * returns Wallet
 **/
exports.getWallet = function (walletId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      country: {},
      total: 0.8008281904610115,
      denominations: {},
      type: 'immediate',
      user: {},
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Updates a Wallet with form data.
 * Updates a Wallet resource based on the form data.
 *
 * body Wallet Updates an user wallet.
 * walletId Long The id of the wallet known for the user
 * returns Wallet
 **/
exports.updateWalletWithForm = function (body, walletId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      country: {},
      total: 0.8008281904610115,
      denominations: {},
      type: 'immediate',
      user: {},
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};

/**
 * Updates a Wallet with form data.
 * Updates a Wallet resource based on the form data.
 *
 * body Wallet Updates an user wallet.
 * walletId Long The id of the wallet known for the user
 * returns Wallet
 **/
exports.updateWalletWithForm = function (body, walletId) {
  return new Promise(function (resolve, reject) {
    var examples = {};
    examples['application/json'] = {
      country: {},
      total: 0.8008281904610115,
      denominations: {},
      type: 'immediate',
      user: {},
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
