'use strict';

var utils = require('../utils/writer.js');
var Authorinvite = require('../service/AuthorinviteService');

module.exports.authorInvite = function authorInvite(
  req,
  res,
  next,
  body,
  email,
) {
  Authorinvite.authorInvite(body, email)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.authorInvite = function authorInvite(
  req,
  res,
  next,
  body,
  email,
) {
  Authorinvite.authorInvite(body, email)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAuthorInvite = function getAuthorInvite(
  req,
  res,
  next,
  email,
) {
  Authorinvite.getAuthorInvite(email)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
