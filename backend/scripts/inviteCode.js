const crypto = require('node:crypto');
const Invite = require('../src/models/AuthorInvite');

async function createInviteCode() {
  const code = crypto.randomBytes(3).toString('hex').toUpperCase();

  try {
    const newInvite = await Invite.create({ code });
    return newInvite.code;
  } catch (error) {
    if (error.code === 11000) return createInviteCode();
    throw error;
  }
}

module.exports = { createInviteCode };
