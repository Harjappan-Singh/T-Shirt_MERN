import React, { Component } from 'react';
import Rating from './Rating';
import '../css/Product.css';
import HeartIcon from './HeartIcon';
import { Link } from 'react-router-dom';
import { ACCESS_LEVEL_ADMIN } from '../config/global_constants';

class ProductScreen extends Component {
  componentDidUpdate(prevProps) {
    // Log a message when the component updates
    console.log('ProductScreen updated');
    // Check if product props have changed
    if (this.props.product !== prevProps.product) {
      console.log('Product prop updated:', this.props.product);
    }
  }

  render() {
    const { product } = this.props;

    // Check if product is not null or undefined
    if (!product) {
      return <div>No product data available.</div>;
    }

    // Parse userInfo from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Access accessLevel from userInfo
    const accessLevel = userInfo ? userInfo.accessLevel : 0;

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
            {accessLevel === ACCESS_LEVEL_ADMIN && (
              <Link className="blue-button" to={`/AddTshirt/${product._id}`}>
                Add
              </Link>
            )}


            {accessLevel === ACCESS_LEVEL_ADMIN && (
              //<Link className="red-button" to={`/DeleteTshirt/${product._id}`}>
             
              <Link className="red-button" to={`/DeleteTshirt/${product._id}`}>
                Delete
              </Link>
            )}
            {accessLevel === ACCESS_LEVEL_ADMIN && (
              <Link className="green-button" to={`/EditTshirt/${product._id}`}>
                Edit
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ProductScreen;
