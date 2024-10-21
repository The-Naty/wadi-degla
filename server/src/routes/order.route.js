const express = require('express');
const OrderController = require('../controllers/order.controller');
const { customerAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');

const router = express.Router();

router.post('/request', customerAuth, OrderController.requestInvoice);

router.put('/offer-price', customerAuth, authorize('ADMIN'), OrderController.offerPrice);

router.put('/accept-offer', customerAuth, OrderController.acceptOffer);

router.put('/approve-order', customerAuth, authorize('ADMIN'), OrderController.approveOrder);

router.get('/my-invoices', customerAuth, OrderController.getMyInvoices);

router.post('/create', customerAuth, authorize('SUPER_ADMIN'), OrderController.createInvoice);

router.get('/all', customerAuth, authorize('SUPER_ADMIN'), OrderController.getAllInvoices);

module.exports = router;
