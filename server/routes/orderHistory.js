const express = require('express');
const router = express.Router();
const Order = require('../models/orderHistory');

router.get('/orderHistory/:email', (req, res) => {
    const email = req.params.email;
    
    Order.find({ email: email }, (error, orderHistory) => { 
        if (error) {
            return res.status(500).json({ errorMessage: 'Internal Server Error' });
        }
// Route to retrieve order history for a specific customer
router.get('/orderHistory/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  Order.find({ cust_id: customerId }, (error, orderHistory) => {
    if (error) {
      return res.status(500).json({ errorMessage: 'Internal Server Error' });
    }

    if (!orderHistory || orderHistory.length === 0) {
      return res
        .status(404)
        .json({ errorMessage: 'No order history found for the customer' });
    }

    res.json(orderHistory);
  });
});

router.post('/track-purchase', (req, res) => {
  // Extract purchase tracking data from the request body
  const { orderID, items, totalAmount } = req.body;

  // Create a new instance of the Order model with the purchase tracking data
  const newOrder = new Order({
    // cust_id: req.user._id, // Assuming you have a user object in the request (e.g., obtained through authentication)
    orderID: orderID,
    items: items,
    totalAmount: totalAmount,
    date: new Date(), // Set the current date as the order date
  });

  // Save the new order to the database
  newOrder.save((err, savedOrder) => {
    if (err) {
      console.error('Error saving order:', err);
      return res
        .status(500)
        .json({ errorMessage: 'Error saving order to database' });
    }

    // If the order is saved successfully, send a success response to the client
    const response = {
      status: 'success',
      message: 'Purchase tracked successfully',
      order: savedOrder,
    };
    res.json(response);
  });
});

module.exports = router;
