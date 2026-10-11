'use strict';

var utils = require('../utils/writer.js');
var Wallet = require('../service/WalletService');

module.exports.getWallet = function getWallet(req, res, next, walletId) {
  Wallet.getWallet(walletId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateWalletWithForm = function updateWalletWithForm(
  req,
  res,
  next,
  body,
  walletId,
) {
  Wallet.updateWalletWithForm(body, walletId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateWalletWithForm = function updateWalletWithForm(
  req,
  res,
  next,
  body,
  walletId,
) {
  Wallet.updateWalletWithForm(body, walletId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
