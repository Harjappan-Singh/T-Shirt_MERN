import React, { Component } from 'react';
import axios from 'axios';
import Rating from '../components/Rating';
import '../css/ProductDetail.css';
import Loading from './Loading';
import Message from './Message';
import DocumentTitle from 'react-document-title';
class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: '',
      product: {},
    };
  }

  async componentDidMount() {
    const { slug } = this.props.match.params; // Destructure slug from params
    try {
      const result = await axios.get(
        `http://localhost:4000/api/products/slug/${slug}`
      );
      this.setState({ product: result.data, loading: false });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  }

  render() {
    // console.log(product);
    const { loading, error, product } = this.state;

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
        <div className="product-details-container">
          {loading && <Loading />}
          {error && <div>{error}</div>}
          {!loading && !error && (
            <>
              <div className="product-details-header">
                <DocumentTitle title={product.name}>
                  <h1>{product.name}</h1>
                </DocumentTitle>
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
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  />
                  <p>Price: ${product.price}</p>
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
                  {product.countInStock > 0 && (
                    <button onClick={() => alert('Added to cart')}>
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }
  }
}

export default ProductDetails;
