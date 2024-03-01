import React, { Component } from 'react';
import Rating from './Rating';
import '../css/Product.css';
import HeartIcon from './HeartIcon';
import { Link } from 'react-router-dom';
import { ACCESS_LEVEL_ADMIN } from '../config/global_constants';

class ProductScreen extends Component {
  render() {
    const { product } = this.props;
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Retrieve user info from localStorage

    return (
      <div className="product-card">
        <div className="product-image">
          <a href={`/product/${product._id}`}>
            <img src={product.productImage} alt={product.name} />
            <HeartIcon />
          </a>
        </div>
        <div className="product-info">
          <a href={`/product/${product._id}`} className="product-name">
            {product.name}
          </a>
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <div className="product-price">€{product.price}</div>
          <div>
            {userInfo && userInfo.accessLevel === ACCESS_LEVEL_ADMIN ? ( // Check if userInfo exists and user is admin
              <Link
                className="red-button"
                to={'/DeleteTshirt/' + this.props.product._id}
              >
                Delete
              </Link>
            ) : null}
            {userInfo && userInfo.accessLevel === ACCESS_LEVEL_ADMIN ? ( // Check if userInfo exists and user is admin
              <Link
                className="green-button"
                to={'/EditTshirt/' + this.props.product._id}
              >
                Edit
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default ProductScreen;
