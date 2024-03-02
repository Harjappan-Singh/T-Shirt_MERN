const mongoose = require('mongoose');

let tshirtsSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    slug: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, required: true },
    productImage: { type: String },
    images: [{ type: String }],
    sizes: [{ type: String, required: true }],
    price: { type: Number },
    countInStock: { type: Number },
    rating: { type: Number },
    numReviews: { type: Number },
  },
  {
    collection: 'tshirts',
  }
);

module.exports = mongoose.model('Tshirt', tshirtsSchema);
