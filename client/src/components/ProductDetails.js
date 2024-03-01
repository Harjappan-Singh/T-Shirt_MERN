import React, { Component } from 'react';
import axios from 'axios';
import Rating from '../components/Rating';
import '../css/ProductDetail.css';
import Loading from './Loading';
import Message from './Message';
import { SERVER_HOST } from '../config/global_constants';
import Banner from './Banner';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: '',
      product: {},
      quantity: 1,
      selectedSize: '',
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params; // Destructure id from params
    try {
      const result = await axios.get(`${SERVER_HOST}/tshirts/${id}`);
      this.setState({ product: result.data, loading: false });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  }

  addToCart = () => {
    const { product, quantity, selectedSize } = this.state;

    if (!selectedSize) {
      alert('Please select a size!');
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    for (let i = 0; i < quantity; i++) {
      cartItems.push({ ...product, size: selectedSize });
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));

    this.props.history.push('/ShoppingCart');
  };

  handleQuantityChange = (e) => {
    this.setState({ quantity: parseInt(e.target.value) || 1 });
  };

  handleSizeChange = (e) => {
    this.setState({ selectedSize: e.target.value });
  };

 

  render() {
    const { loading, error, product, quantity, selectedSize } = this.state;

    if (loading) {
      return <Loading />;
    } else if (error) {
      return (
        <div>
          <Message variant="danger">{error}</Message>
        </div>
      );
    } else {
      return (
        <div className="page-container">
        <div className="product-details-container">
          <div className="product-details-header">
            <h2>{product.name}</h2>
          </div>
          <div className="product-details-content">
            <div className="product-image-container">
              <img
                className="product-image"
                src={product.productImage}
                alt={product.name}
              />
            </div>
            <div className="product-info-container">
              <Rating rating={product.rating} numReviews={product.numReviews} />
              <p>Price: €{product.price}</p>
              <p>Description: {product.description}</p>
              <p>
                Status:{' '}
                <span
                  style={{
                    color: product.countInStock > 0 ? 'green' : 'red',
                  }}
                >
                  {product.countInStock > 0 ? 'In Stock' : 'Unavailable'}
                </span>
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
              <select
                id="size"
                value={selectedSize}
                onChange={this.handleSizeChange}
              >
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
          </div>
        </div>
        <div className="banner-container">
        {/* <Banner /> */}
        </div>
        </div>
      );
    }
  }
}

export default ProductDetails;
