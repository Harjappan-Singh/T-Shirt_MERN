const router = require('express').Router();
const OrderHistory = require('../models/orderHistory');

router.post('/orderHistory', (req, res) => {
    try {
        const { cust_id, item_id, date, cost } = req.body;

        // Create a new instance of OrderHistory model
        const newOrder = new OrderHistory({
            cust_id,
            item_id,
            date,
            cost
        });

        // Save the new order to the database
        newOrder.save((error, data) => {
            if (error) {
                console.error("Error adding order to orderHistory:", error);
                res.status(500).json({ errorMessage: "Internal server error" });
            } else {
                console.log("Order added to orderHistory:", data);
                res.status(201).json(data);
            }
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(400).json({ errorMessage: "Bad request" });
    }
});

module.exports = router;
