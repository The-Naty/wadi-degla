const AuthController = {};
const AuthService = require('../services/auth.service');

AuthController.customerRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const data = await AuthService.createCustomerAndGenerateToken({
      username,
      email,
      password,
    });

    res.status(201).cookie('auth', data.token, { httpOnly: true }).json({
      id: data.newCustomer.id,
      username: data.newCustomer.username,
      email: data.newCustomer.email,
      token: data.token,
    });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};

AuthController.customerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await AuthService.loginCustomerAndSignToken({
      email,
      password,
    });

    res.status(200).cookie('auth', data.token, { httpOnly: true }).json({
      id: data.customer.id,
      username: data.customer.username,
      email: data.customer.email,
      token: data.token,
    });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};

AuthController.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await AuthService.loginAdminAndSignToken({
      email,
      password,
    });

    res.status(200).cookie('auth', data.token, { httpOnly: true }).json({
      id: data.admin.id,
      username: data.admin.username,
      email: data.admin.email,
      token: data.token,
    });
  } catch (err) {
    res.status(401).send({ message: err.message });
  }
};

AuthController.deleteCookie = async (req, res) => {
  res.status(200).clearCookie('auth').send('user logged out');
};

module.exports = AuthController;
