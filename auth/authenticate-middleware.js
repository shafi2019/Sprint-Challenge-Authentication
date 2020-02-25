/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require('jsonwebtoken');
const { JWTSecret } = require('../secret');

module.exports = (req, res, next) => {
  const token = req.headers.authorization; // Checking that token has been passed into the auth header

  if (token) {
    jwt.verify(token, JWTSecret, (error, decodedToken) => {
      if (error) {
        // response for invalid token passed into headers
        res.status(401).json({
          Message: 'Invalid Token'
        })
      }
      else {
        req.user = decodedToken.user;
        next();
      }
    })
  }
  else {
    res.status(401).json({
      Message: 'Unauthorized!'
    })
  }
};