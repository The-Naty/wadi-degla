const CustomerController = {};
const CustomerService = require('../services/customer.service');

CustomerController.createCustomer = async (req, res) => {
  try {
    const data = await CustomerService.createCustomer(req.body);

    res.status(201).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

CustomerController.deleteCustomer = async (req, res) => {
  try {
    const data = await CustomerService.deleteCustomer(req.params.customerId);

    res.status(200).send(`User deleted. \nId: ${data.id}\nEmail: ${data.email}`);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

CustomerController.getCurrentCustomer = async (req, res) => {
  try {
    const data = await CustomerService.getCustomerByIdAndExcludePassword(req.user.id);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

CustomerController.getAllCustomer = async (req, res) => {
  try {
    const data = await CustomerService.fetchAllCustomer();

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

CustomerController.getCustomerById = async (req, res) => {
  try {
    const data = await CustomerService.getCustomerById(req.params.customerId);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

CustomerController.putCurrentCustomer = async (req, res) => {
  try {
    const response = await CustomerService.currentCustomerUpdate(req.user.id, req.body);

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

module.exports = CustomerController;
