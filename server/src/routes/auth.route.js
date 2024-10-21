const express = require('express');
const AuthController = require('../controllers/auth.controller');
const validate = require('../middlewares/request-validator.middleware');
const { registerCustomerReqSchema, loginCustomerReqSchema } = require('../validations/customer.validation.schema');

const router = express.Router();

router.post('/customer/register', validate(registerCustomerReqSchema), AuthController.customerRegister);
router.post('/customer/login', validate(loginCustomerReqSchema), AuthController.customerLogin);
router.post('/admin/login', validate(loginCustomerReqSchema), AuthController.adminLogin);
router.post('/logout', AuthController.deleteCookie);

module.exports = router;
