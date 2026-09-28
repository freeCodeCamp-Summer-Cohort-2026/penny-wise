const Service = require('./Service');

/**
 * Add new Money definition.
 * Add new Money.
 *
 * money Money Create new Money
 * returns Money
 * */
const addMoney = ({ money }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          money,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Update existing money.
 * Update existing money by Id.
 *
 * money Money Update existent money
 * returns Money
 * */
const updateMoney = ({ money }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          money,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });

module.exports = {
  addMoney,
  updateMoney,
};
