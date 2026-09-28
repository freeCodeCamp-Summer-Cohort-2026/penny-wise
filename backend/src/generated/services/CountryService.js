const Service = require('./Service');

/**
 * Create a country.
 * Create a country to reference its currency.
 *
 * country Country  (optional)
 * returns Country
 * */
const createCountry = ({ country }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          country,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });

module.exports = {
  createCountry,
};
