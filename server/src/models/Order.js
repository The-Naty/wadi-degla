const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  orderNumber: { type: String, required: true },
  quotation: {
    type: Schema.Types.ObjectId,
    ref: 'Quotation',
  },
  proforma: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Proforma',
    },
  ],
  finalInvoice: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
