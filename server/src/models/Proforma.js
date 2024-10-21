const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const proformaSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  proformaDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  proformaNumber: { type: String, required: true },
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
      message: 'Proforma must have at least one item.',
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

const Proforma = mongoose.model('Proforma', proformaSchema);

module.exports = Proforma;
