const mongoose = require('mongoose');

let addressesSchema = new mongoose.Schema({
    name:{type: String},
    email: { type: String },
    addressLine1:{ type: String },
    addressLine2:{ type: String },
    city:{type: String},
    county:{type: String}, 
    eircode:{type: String}
}, {
    collection: 'addresses'
});

module.exports = mongoose.model('addresses', addressesSchema); 