const mongoose = require('mongoose');

let tshirtsSchema = new mongoose.Schema({
    brand: { type: String },
    name: { type: String },
    description: { type: String }, 
    category: { type: String },
    type: { type: String },
    color: { type: String },
    productImage: { type: String }, 
    images: [{ type: String }], 
    sizes: [{ type: String }],
    price: { type: Number },
    countInStock: { type: Number }, 
    rating: { type: Number },
    numReviews: { type: Number }
}, {
    collection: 'tshirts'
});

module.exports = mongoose.model('tshirts', tshirtsSchema); 
