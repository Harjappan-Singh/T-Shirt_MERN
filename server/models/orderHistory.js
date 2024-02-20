//purchase_history 

//cust_id 

//item_id 

//Date 

//Cost  

const mongoose = require('mongoose');

let orderHistorySchema = new mongoose.Schema({
    cust_id: { type: String },
    item_id: { type: String },
    date: {type: Date},
    cost: { type: Number}
    
}, {
    collection: 'orderHistory'
});

module.exports = mongoose.model('orderHistory', orderHistorySchema); 
