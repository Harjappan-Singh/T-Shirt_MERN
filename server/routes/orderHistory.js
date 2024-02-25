const router = require('express').Router();
const OrderHistory = require('../models/orderHistory');

router.post('/orderHistory', async (req, res) => {
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
        await newOrder.save();
        console.log("Order added to orderHistory:", newOrder);

        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Error adding order to orderHistory:", error);
        res.status(500).json({ errorMessage: "Internal server error" });
    }
});

module.exports = router;
