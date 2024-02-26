const mongoose = require('mongoose');

let orderHistorySchema = new mongoose.Schema({
    email: { type: String },
    item_name: { type: String },
    date: { type: Date },
    cost: { type: Number }    
}, {
    collection: 'orderHistory'
});

module.exports = mongoose.model('OrderHistory', orderHistorySchema); 
