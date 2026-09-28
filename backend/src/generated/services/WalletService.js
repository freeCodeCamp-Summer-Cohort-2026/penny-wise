const Service = require('./Service');

/**
 * Find wallet by ID.
 * Returns an user wallet.
 *
 * walletId Long The id of the wallet known for the user
 * returns Wallet
 * */
const getWallet = ({ walletId }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          walletId,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });
/**
 * Updates a Wallet with form data.
 * Updates a Wallet resource based on the form data.
 *
 * walletId Long The id of the wallet known for the user
 * wallet Wallet Updates an user wallet.
 * returns Wallet
 * */
const updateWalletWithForm = ({ walletId, wallet }) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        Service.successResponse({
          walletId,
          wallet,
        }),
      );
    } catch (e) {
      reject(
        Service.rejectResponse(e.message || 'Invalid input', e.status || 405),
      );
    }
  });

module.exports = {
  getWallet,
  updateWalletWithForm,
};
