const express = require('express');
const Country = require('../models/country');

const router = express.Router();

class RouteError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const asyncRoute = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

function serializeCountry(country) {
  return {
    _id: country._id,
    code: country.code,
    name: country.name,
  };
}

router.get(
  '/',
  asyncRoute(async (req, res) => {
    const countries = await Country.find({}).lean();
    const codeNames = countries.map((country) => {
      return serializeCountry(country);
    });

    res.json({ countries: codeNames });
  }),
);

router.use((error, req, res, next) => {
  if (error instanceof RouteError) {
    return res.status(error.status).json({ error: error.message });
  }

  return next(error);
});

module.exports = router;
