const express = require('express');
const AdminController = require('../controllers/admin.controller');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');

const router = express.Router();

router.post('/create', adminAuth, authorize('SUPER_ADMIN'), AdminController.createAdmin);

router.delete('/delete/:adminId', adminAuth, authorize('SUPER_ADMIN'), AdminController.deleteAdmin);

router.get('/me', adminAuth, AdminController.getCurrentAdmin);

router.get('/all', adminAuth, authorize('SUPER_ADMIN'), AdminController.getAllAdmin);

router.put('/me/edit', adminAuth, AdminController.putCurrentAdmin);

router.get('/:adminId', adminAuth, authorize('ADMIN'), AdminController.getAdminById);

module.exports = router;
