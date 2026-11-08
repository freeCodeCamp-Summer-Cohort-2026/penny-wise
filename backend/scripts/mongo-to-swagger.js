const m2s = require('mongoose-to-swagger');

const Author = require('../src/models/Author');
const Country = require('../src/models/country');
const Course = require('../src/models/Course');
const Lesson = require('../src/models/Lesson');
const Money = require('../src/models/money');
const {
  Page,
  MultipleChoicePage,
  MatchingPage,
  BudgetingPage,
  WantsNeedsPage,
} = require('../src/models/Page');
const User = require('../src/models/User');
const Wallet = require('../src/models/wallet');

const options = {
  omitFields: ['_id'],
};

const header = `{
  "openapi" : "3.0.4",
  "info" : {
    "title" : "Penny Wise - Economy Literacy Helper",
    "description" : "This is a project created during the Summer Cohort in 20226 from [https://freecodecamp.org](https://freecodecamp.org). It is aimed for preteens and teenagers, and the goal is to teach basic economy literacy in a interactive way, which we hope to be a pleasant experience. Because the users are children we advise the parents or tutors to be side by side, with the learners.",
    "termsOfService" : "https://freecodecamp.org/terms/",
    "contact" : {
      "email" : "pennywise@example.com"
    },
    "license" : {
      "name" : "Apache 2.0",
      "url" : "https://www.apache.org/licenses/LICENSE-2.0.html"
    },
    "version" : "1.0.0"
  },
  "externalDocs" : {
    "description" : "Find out more about FreeCodeCamp",
    "url" : "https://freecodecamp.org"
  },
  "servers" : [ {
    "url" : "http://localhost:5000/api/health"
  } ],
  "tags" : [ `;

let swaggerSchema =
  header +
  '\n' +
  JSON.stringify(m2s(Author, options), null, 2) +
  ',\n' +
  JSON.stringify(m2s(Country, options), null, 2) +
  ',\n' +
  JSON.stringify(m2s(Course, options), null, 2) +
  ',\n' +
  JSON.stringify(m2s(Lesson, options), null, 2) +
  ',\n' +
  JSON.stringify(m2s(Money, options), null, 2) +
  ',\n' +
  JSON.stringify(m2s(Page, options), null, 2) +
  ',\n' +
  JSON.stringify(m2s(MultipleChoicePage, options), null, 2) +
  ',\n' +
  JSON.stringify(m2s(MatchingPage, options), null, 2) +
  ',\n' +
  JSON.stringify(m2s(BudgetingPage, options), null, 2) +
  ',\n' +
  JSON.stringify(m2s(WantsNeedsPage, options), null, 2) +
  ',\n' +
  JSON.stringify(m2s(User, options), null, 2) +
  ',\n' +
  JSON.stringify(m2s(Wallet, options), null, 2) +
  ']\n' +
  '}\n';

console.log(swaggerSchema);
