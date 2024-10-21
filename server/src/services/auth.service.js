const AuthService = {};
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

const hashPassword = require('../utils/password-hasher');
const comparePassword = require('../utils/compare-password');
const { generateSignedCustomerToken, generateSignedAdminToken } = require('../utils/generate-token');

AuthService.createCustomerAndGenerateToken = async (customerData) => {
  const { username, email, password } = customerData;

  const emailExistAsCustomer = await Customer.findOne({ email });
  const emailExistAsAdmin = await Admin.findOne({ email });

  if (emailExistAsCustomer || emailExistAsAdmin) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const session = await Customer.startSession();
  session.startTransaction();

  try {
    const newCustomer = await Customer.create(
      [
        {
          username,
          email,
          password: hashedPassword,
        },
      ],
      { session },
    );

    const token = await generateSignedCustomerToken(newCustomer[0]._id);

    await session.commitTransaction();
    session.endSession();

    return { newCustomer: newCustomer[0], token };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error('Transaction failed: ' + error.message);
  }
};

AuthService.loginCustomerAndSignToken = async (customerData) => {
  const { email, password } = customerData;

  const customer = await Customer.findOne({ email }, 'id email password');

  if (!customer) {
    throw new Error('User not found');
  }

  const isPasswordValid = await comparePassword(password, customer.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = await generateSignedCustomerToken(customer._id);

  return { customer, token };
};

AuthService.loginAdminAndSignToken = async (adminData) => {
  const { email, password } = adminData;

  const admin = await Admin.findOne({ email }, 'id email password role');

  if (!admin) {
    throw new Error('User not found');
  }

  const isPasswordValid = await comparePassword(password, admin.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = await generateSignedAdminToken(admin._id, admin.role);

  return { admin, token };
};

module.exports = AuthService;
