'use strict';

var utils = require('../utils/writer.js');
var Country = require('../service/CountryService');

module.exports.createCountry = function createCountry(req, res, next, body) {
  Country.createCountry(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createCountry = function createCountry(req, res, next, body) {
  Country.createCountry(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getCountries = function getCountries(req, res, next) {
  Country.getCountries()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
