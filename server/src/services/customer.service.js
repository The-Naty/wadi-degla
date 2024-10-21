const CustomerService = {};

const hashPassword = require('../utils/password-hasher');
const Customer = require('../models/Customer');
const Admin = require('../models/Admin');

CustomerService.createCustomer = async (customerData) => {
  const { username, email, password } = customerData;

  const emailExistAsCustomer = await Customer.findOne({ email });
  const emailExistAsAdmin = await Admin.findOne({ email });

  if (emailExistAsCustomer || emailExistAsAdmin) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const newCustomer = new Customer({
    username,
    email,
    password: hashedPassword,
  });

  await newCustomer.save();
  newCustomer.password = undefined;

  return { newCustomer };
};

CustomerService.deleteCustomer = async (customerId) => {
  const customerExist = await Customer.findById(customerId).select('-password');

  if (!customerExist) {
    return { error: "User Doesn't Exist" };
  }

  const deletedCustomer = await Customer.findByIdAndDelete(customerId).select('-password');

  return deletedCustomer;
};

CustomerService.getCustomerByIdAndExcludePassword = async (customerId) => {
  return Customer.findById(customerId).select('-password');
};

CustomerService.getCustomerById = async (customerId) => {
  return Customer.findById(customerId).select('-password');
};

CustomerService.fetchAllCustomer = async () => {
  const respond = await Customer.find().select('-password');
  return respond;
};

CustomerService.currentCustomerUpdate = async (customerId, newCustomer) => {
  const customerExist = await Customer.findById(customerId).select('-password');
  console.log(customerExist);
  if (!customerExist) {
    return { error: "User Doesn't Exist" };
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(customerId, { username: newCustomer.username }, { new: true }).select(
    '-password',
  );

  return updatedCustomer;
};

module.exports = CustomerService;
