const express = require('express');
const router = express.Router();
const Order = require('../models/orderHistory');

router.get('/orderHistory/:email', (req, res) => {
    const email = req.params.email;
    
    Order.find({ email: email }, (error, orderHistory) => { 
        if (error) {
            return res.status(500).json({ errorMessage: 'Internal Server Error' });
        }

        if (!orderHistory || orderHistory.length === 0) {
            return res.status(404).json({ errorMessage: 'No order history found for the customer' });
        }

        
        res.json(orderHistory);
    });
});

module.exports = router;