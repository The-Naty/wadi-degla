const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  username: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  taxId: { type: String },
  password: { type: String, required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  salespersonId: { type: Schema.Types.ObjectId, ref: 'SalesPerson' },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
