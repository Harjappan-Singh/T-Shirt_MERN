const mongoose = require('mongoose');

let tshirtsSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, required: true },
    productImage: { type: String, required: true },
    images: [{ type: String, required: true }],
    sizes: [{ type: String, required: true }],
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
  },
  {
    collection: 'tshirts',
  }
);

module.exports = mongoose.model('Tshirt', tshirtsSchema);
