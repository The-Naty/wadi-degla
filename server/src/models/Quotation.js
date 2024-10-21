const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = require('./itemschema');

const quotationSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  quotationDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  quotationNumber: { type: String, required: true },
  items: {
    type: [itemSchema],
    required: true,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: 'Quotation must have at least one item.',
    },
  },
});

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;
