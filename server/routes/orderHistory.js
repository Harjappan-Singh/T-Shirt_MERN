const express = require('express');
const router = express.Router();
const OrderHistory = require('../models/orderHistory');

router.get('/orderHistory/:email', (req, res) => {
  const email = req.params.email;

  OrderHistory.find({ email: email }, (error, orderHistory) => {
    if (error) {
      console.error('Error fetching order history:', error); // Add this debugging statement
      return res.status(500).json({ errorMessage: 'Internal Server Error' });
    }

    if (!orderHistory || orderHistory.length === 0) {
      console.log('No order history found for customer:', email); // Add this debugging statement
      return res
        .status(404)
        .json({ errorMessage: 'No order history found for the customer' });
    }

    console.log('Order history found:', orderHistory); // Add this debugging statement
    res.json(orderHistory);
  });
});

// Route to add order data to the database
router.post('/orders/add', (req, res) => {
  // Extract order data from the request body
  const {
    userId,
    email,
    items,
    transactionId,
    orderTime,
    totalCost,
    shippingAddress,
  } = req.body;

  // Create a new order instance
  const newOrder = new OrderHistory({
    userId: userId,
    email: email,
    items: items.map((item) => ({
      itemName: item.itemName,
      quantity: item.quantity,
      price: item.price,
    })),
    transactionId: transactionId,
    orderTime: orderTime,
    totalCost: totalCost,
    shippingAddress: shippingAddress,
  });

  // Save the order to the database
  newOrder.save((err, order) => {
    if (err) {
      console.error('Error saving order:', err);
      return res.status(500).json({ errorMessage: 'Internal Server Error' });
    }
    console.log('Order saved successfully:', order);
    res.status(201).json(order); // Respond with the saved order
  });
});

router.get('/orders/user/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const orders = await OrderHistory.find({ email: userEmail });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ errorMessage: 'Internal Server Error' });
  }
});

module.exports = router;
