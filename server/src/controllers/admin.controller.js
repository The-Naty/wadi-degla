const AdminController = {};
const AdminService = require('../services/admin.service');

AdminController.createAdmin = async (req, res) => {
  try {
    const data = await AdminService.createAdmin(req.body);

    res.status(201).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

AdminController.deleteAdmin = async (req, res) => {
  try {
    const data = await AdminService.deleteAdmin(req.params.adminId, req.user.id);

    res.status(200).json({
      message: 'User deleted successfully',
      id: data.id,
      email: data.email,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

AdminController.getCurrentAdmin = async (req, res) => {
  try {
    const data = await AdminService.getAdminByIdAndExcludePassword(req.user.id);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

AdminController.getAllAdmin = async (req, res) => {
  try {
    const data = await AdminService.fetchAllAdmin();

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

AdminController.getAdminById = async (req, res) => {
  try {
    const data = await AdminService.getAdminById(req.params.adminId);

    res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

AdminController.putCurrentAdmin = async (req, res) => {
  try {
    const response = await AdminService.currentAdminUpdate(req.user.id, req.body);

    res.status(200).send(response);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

module.exports = AdminController;
