'use strict';

var utils = require('../utils/writer.js');
var Page = require('../service/PageService');

module.exports.createBudgetingPage = function createBudgetingPage(
  req,
  res,
  next,
  body,
) {
  Page.createBudgetingPage(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createBudgetingPage = function createBudgetingPage(
  req,
  res,
  next,
  body,
) {
  Page.createBudgetingPage(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createMatchingPage = function createMatchingPage(
  req,
  res,
  next,
  body,
) {
  Page.createMatchingPage(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createMatchingPage = function createMatchingPage(
  req,
  res,
  next,
  body,
) {
  Page.createMatchingPage(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createMultipleChoicePage = function createMultipleChoicePage(
  req,
  res,
  next,
  body,
) {
  Page.createMultipleChoicePage(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createMultipleChoicePage = function createMultipleChoicePage(
  req,
  res,
  next,
  body,
) {
  Page.createMultipleChoicePage(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createPage = function createPage(req, res, next, body) {
  Page.createPage(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createPage = function createPage(req, res, next, body) {
  Page.createPage(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createWantsNeedsPage = function createWantsNeedsPage(
  req,
  res,
  next,
  body,
) {
  Page.createWantsNeedsPage(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createWantsNeedsPage = function createWantsNeedsPage(
  req,
  res,
  next,
  body,
) {
  Page.createWantsNeedsPage(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
