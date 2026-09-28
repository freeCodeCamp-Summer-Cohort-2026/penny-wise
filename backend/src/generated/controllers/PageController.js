/**
 * The PageController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/PageService');
const createBudgetingPage = async (request, response) => {
  await Controller.handleRequest(
    request,
    response,
    service.createBudgetingPage,
  );
};

const createMatchingPage = async (request, response) => {
  await Controller.handleRequest(request, response, service.createMatchingPage);
};

const createMultipleChoicePage = async (request, response) => {
  await Controller.handleRequest(
    request,
    response,
    service.createMultipleChoicePage,
  );
};

const createPage = async (request, response) => {
  await Controller.handleRequest(request, response, service.createPage);
};

const createWantsNeedsPage = async (request, response) => {
  await Controller.handleRequest(
    request,
    response,
    service.createWantsNeedsPage,
  );
};

module.exports = {
  createBudgetingPage,
  createMatchingPage,
  createMultipleChoicePage,
  createPage,
  createWantsNeedsPage,
};
