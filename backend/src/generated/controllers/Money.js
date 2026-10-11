'use strict';

var utils = require('../utils/writer.js');
var Money = require('../service/MoneyService');

module.exports.addMoney = function addMoney(req, res, next, body) {
  Money.addMoney(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.addMoney = function addMoney(req, res, next, body) {
  Money.addMoney(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateMoney = function updateMoney(req, res, next, body) {
  Money.updateMoney(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateMoney = function updateMoney(req, res, next, body) {
  Money.updateMoney(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
