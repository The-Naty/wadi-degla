const AdminService = {};

const hashPassword = require('../utils/password-hasher');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');

AdminService.createAdmin = async (adminData) => {
  const { username, email, password, role } = adminData;

  const emailExistAsAdmin = await Admin.findOne({ email });
  const emailExistAsCustomer = await Customer.findOne({ email });

  if (emailExistAsCustomer || emailExistAsAdmin) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const newAdmin = new Admin({
    username,
    email,
    password: hashedPassword,
    role,
  });

  await newAdmin.save();
  newAdmin.password = undefined;

  return { newAdmin };
};

AdminService.deleteAdmin = async (adminId, userId) => {
  const adminExist = await Admin.findById(adminId);
  if (!adminExist) {
    throw new Error("User doesn't exist");
  }

  if (adminExist.id === userId) {
    throw new Error("You can't delete yourself");
  }

  const deletedAdmin = await Admin.findByIdAndDelete(adminId);
  if (!deletedAdmin) {
    throw new Error('Error deleting user');
  }

  return deletedAdmin;
};

AdminService.getAdminByIdAndExcludePassword = async (adminId) => {
  return Admin.findById(adminId).select('-password');
};

AdminService.getAdminById = async (adminId) => {
  return Admin.findById(adminId);
};

AdminService.fetchAllAdmin = async () => {
  const respond = await Admin.find();
  return respond;
};

AdminService.currentAdminUpdate = async (adminId, newAdmin) => {
  const adminExist = await Admin.findById(adminId);

  if (!adminExist) {
    return { error: "User Doesn't Exist" };
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(adminId, { username: newAdmin.username }, { new: true });

  return updatedAdmin;
};

module.exports = AdminService;
