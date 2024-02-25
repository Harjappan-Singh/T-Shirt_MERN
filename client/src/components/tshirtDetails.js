import React, { Component } from 'react';

import '../css/ProductDetail.css';

export default class TshirtDetails extends Component {
  state = {
    quantity: 1,
    selectedSize: '',
  };

  addToCart = () => {
    const { product } = this.props.location.state;
    const { quantity, selectedSize } = this.state;

    if (!selectedSize) {
      alert('Please select a size!');
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    for (let i = 0; i < quantity; i++) {
      cartItems.push({ ...product, size: selectedSize });
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));

    alert(`${quantity} T-shirt(s) added to cart!`);
  };

  handleQuantityChange = (e) => {
    this.setState({ quantity: parseInt(e.target.value) || 1 });
  };

  handleSizeChange = (e) => {
    this.setState({ selectedSize: e.target.value });
  };

  removeFromCart = () => {
    const { product } = this.props.location.state;
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    const updatedCartItems = cartItems.filter((item) => {
      return (
        item.name !== product.name ||
        product.brand !== product.brand ||
        product.color !== product.color ||
        product.price !== product.price ||
        item.sizes.join(',') !== product.sizes.join(',')
      );
    });

    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    alert('T-shirt removed from cart!');
  };

  render() {
    const { product } = this.props.location.state;
    const { quantity, selectedSize } = this.state;

    return (
      <div className="product-details-container">
        <p>
          <strong>Brand:</strong> {product.brand}
        </p>
        <p>
          <strong>Description:</strong> {product.description}
        </p>
        <p>
          <strong>Category:</strong> {product.category}
        </p>
        <p>
          <strong>Color:</strong> {product.color}
        </p>
        <p>
          <strong>Sizes:</strong> {product.sizes.join(', ')}
        </p>
        <p>
          <strong>Cost:</strong> €{product.price}
        </p>
        <p>
          <strong>Rating:</strong> {product.rating}
        </p>

        <label>Quantity:</label>
        <input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={this.handleQuantityChange}
        />

        <label>Size:</label>
        <select id="size" value={selectedSize} onChange={this.handleSizeChange}>
          <option value="">Select Size</option>
          {product.sizes.map((size, index) => (
            <option key={index} value={size}>
              {size}
            </option>
          ))}
        </select>

        <button className="blue-button" onClick={this.addToCart}>
          Add to Cart
        </button>
        <button onClick={this.removeFromCart}>Remove</button>
      </div>
    );
  }
}
