const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  count: { type: Number, default: 1 },
  orderedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);