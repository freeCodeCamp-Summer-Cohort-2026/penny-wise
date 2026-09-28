const Service = require('./Service');

/**
 * Create a BudgetingPage.
 * Create a BudgetingPage in the lesson.
 *
 * budgetingPage BudgetingPage  (optional)
 * returns BudgetingPage
 * */
const createBudgetingPage = ({ budgetingPage }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          budgetingPage,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Create a MatchingPage.
 * Create a MatchingPage in the lesson.
 *
 * matchingPage MatchingPage  (optional)
 * returns MatchingPage
 * */
const createMatchingPage = ({ matchingPage }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          matchingPage,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Create a MultipleChoicePage.
 * Create a MultipleChoicePage in the lesson.
 *
 * multipleChoicePage MultipleChoicePage  (optional)
 * returns MultipleChoicePage
 * */
const createMultipleChoicePage = ({ multipleChoicePage }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          multipleChoicePage,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Create a page.
 * Create a page in the lesson.
 *
 * page Page  (optional)
 * returns Page
 * */
const createPage = ({ page }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          page,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Create a WantsNeedsPage.
 * Create a WantsNeedsPage in the lesson.
 *
 * wantsNeedsPage WantsNeedsPage  (optional)
 * returns WantsNeedsPage
 * */
const createWantsNeedsPage = ({ wantsNeedsPage }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          wantsNeedsPage,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });

module.exports = {
  createBudgetingPage,
  createMatchingPage,
  createMultipleChoicePage,
  createPage,
  createWantsNeedsPage,
};
