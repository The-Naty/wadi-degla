const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

const customerAuth = async (req, res, next) => {
  try {
    const token = req.cookies.auth || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Invalid Auth Token');
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const customer = await Customer.findById(decodedToken.id).select('id');

    if (!customer) {
      throw new Error('User not found');
    }

    req.user = customer;
    next();
  } catch (err) {
    res.status(401).send('Unauthorized. Invalid Credentials');
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.auth || req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Invalid Auth Token');
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const admin = await Admin.findById(decodedToken.id).select('id role');

    if (!admin) {
      throw new Error('User not found');
    }

    req.user = admin;
    next();
  } catch (err) {
    res.status(401).send('Unauthorized. Invalid Credentials');
  }
};

module.exports = { customerAuth, adminAuth };
