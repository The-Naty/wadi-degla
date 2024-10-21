const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesPersonSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
});

const SalesPerson = mongoose.model('SalesPerson', salesPersonSchema);

module.exports = SalesPerson;
