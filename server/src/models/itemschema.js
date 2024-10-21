const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  itemName: { type: String, required: true },
  size: { type: String },
  quantity: { type: Number },
  meters: { type: Number },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

module.exports = itemSchema;
