const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model assuming you have one
    email: { type: String, required: true }, // Email of the user
    items: [
      {
        itemName: { type: String, required: true }, // Name of the item
        quantity: { type: Number }, // Quantity of the item
        price: { type: Number, required: true }, // Price of the item
      },
    ],
    transactionId: { type: String, required: true }, // Transaction ID provided by PayPal
    orderTime: { type: Date, default: Date.now }, // Date and time when the order was placed
    totalCost: { type: Number }, // Total cost of the order
    shippingAddress: {
      // Shipping address of the user
      name: { type: String }, // Name
      addressLine1: { type: String }, // Address Line 1
      addressLine2: { type: String }, // Address Line 2 (optional)
      city: { type: String }, // City
      county: { type: String }, // County
      eircode: { type: String }, // Eircode
    },
  },
  {
    collection: 'orderHistory',
  }
);

module.exports = mongoose.model('OrderHistory', orderHistorySchema);
