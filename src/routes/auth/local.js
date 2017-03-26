const moment = require('moment');
const jwt = require('jsonwebtoken');

require('dotenv').load();

function encodeToken(user) {
  const playload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user.id
  };
  return jwt.sign(playload, process.env.TOKEN_SECRET);
}

function decodeToken(token, callback) {
  const payload = jwt.verify(token, process.env.TOKEN_SECRET);
  const now = moment().unix();

  console.log(payload, now);
  // check if the token has expired
  if (now > payload.exp) callback('Token has expired.');
  else callback(null, payload);
}
module.exports = {
  encodeToken,
  decodeToken
};
