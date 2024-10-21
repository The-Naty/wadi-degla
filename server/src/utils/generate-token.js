const jwt = require('jsonwebtoken');

const AUTH_TOKEN_EXPIRY = '7d';

const generateSignedCustomerToken = async (id) => {
  const jwtSignedCustomerToken = jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: AUTH_TOKEN_EXPIRY,
  });
  return jwtSignedCustomerToken;
};

const generateSignedAdminToken = async (id, role) => {
  const jwtSignedAdminToken = jwt.sign({ id, role }, process.env.SECRET_KEY, {
    expiresIn: AUTH_TOKEN_EXPIRY,
  });
  return jwtSignedAdminToken;
};

module.exports = { generateSignedCustomerToken, generateSignedAdminToken };
