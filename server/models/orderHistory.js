const mongoose = require('mongoose');

let orderHistorySchema = new mongoose.Schema(
  {
    cust_id: { type: String },
    item_name: { type: String },
    date: { type: Date },
    cost: { type: Number },
    // New fields for purchase tracking data
    orderID: { type: String },
    items: [
      {
        name: { type: String },
        price: { type: Number },
        // Add more fields if needed (e.g., quantity, size, etc.)
      },
    ],
    totalAmount: { type: Number },
  },
  {
    collection: 'orderHistory',
  }
);

module.exports = mongoose.model('OrderHistory', orderHistorySchema);
