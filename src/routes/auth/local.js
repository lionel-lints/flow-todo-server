const moment = require('moment');
const jwt = require('jsonwebtoken');

require('dotenv').load();

function decodeToken(token, callback) {
  const payload = jwt.verify(token, process.env.TOKEN_SECRET);
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) callback('Token has expired.');
  else callback(null, payload);
}

function encodeToken(user) {
  const playload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user.id
  };
  return jwt.sign(playload, process.env.TOKEN_SECRET);
}

module.exports = {
  decodeToken,
  encodeToken
};
