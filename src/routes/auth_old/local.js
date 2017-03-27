const moment = require('moment');
const jwt = require('jsonwebtoken');

require('dotenv').load();

function checkTokenSetUser(req, res, next) {
  const token = getTokenFromHeader(req);
  if (token) {

    verifyJWT(token).then((user) => {
      req.user = user;
      next();
    });
  } else {
    next();
  }
}

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

function getTokenFromHeader(req) {
  const token = req.get('Authorization');
  if (token) {
    const tokenSplit = token.split(' ');
    return tokenSplit.length > 0 ? tokenSplit[1] : tokenSplit[0];
  } else {
    return false;
  }
}

function loggedIn(req, res, next) {
  if(req.user && !isNaN(Number(req.user.id))){
    next();
  } else {
    res.status(401);
    res.json({message: 'UnAuthorized'});
  }
}

function verifyJWT(token) {
  return new Promise((resolve) => {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) return resolve();
      resolve(decoded);
    });
  });
}

module.exports = {
  checkTokenSetUser,
  decodeToken,
  encodeToken,
  getTokenFromHeader,
  loggedIn,
  verifyJWT
};
