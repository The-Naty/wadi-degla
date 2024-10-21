const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleEnum = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'];

const adminSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: RoleEnum, required: true },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
