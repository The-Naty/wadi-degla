const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  invoiceDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  invoiceNumber: { type: String, required: true },
  shippingType: { type: String },
  shippingPort: { type: String },
  PaymentTerms: { type: String },
  items: {
    type: [itemSchema],
    required: true,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: 'Invoice must have at least one item.',
    },
  },
  comments: { type: String },
  shipmentTotalContainers: { type: Number },
  totalBoxes: { type: Number },
  netWeight: { type: Number },
  grossWeight: { type: Number },
  discount: { type: Number },
  total: { type: Number },
  totalMeters: { type: Number },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
