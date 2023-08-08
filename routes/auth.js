const {expressjwt:jwt} = require('express-jwt');

const getTokenFromHeader = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
    req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

const auth = {
  required: jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;
