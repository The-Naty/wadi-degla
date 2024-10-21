const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packingListSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: Number, required: true },
  invoiceDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  invoiceNumber: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerTaxId: { type: String },
  shippingType: { type: String },
  shippingPort: { type: String },
  PaymentTerms: { type: String },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InvoiceItem' }],
  comments: { type: String },
  shipmentTotalContainers: { type: Number },
  totalBoxes: { type: Number },
  netWeight: { type: Number },
  grossWeight: { type: Number },
  discount: { type: Number },
  total: { type: Number },
  totalMeters: { type: Number },
});

const PackingList = mongoose.model('PackingList', packingListSchema);

module.exports = PackingList;
