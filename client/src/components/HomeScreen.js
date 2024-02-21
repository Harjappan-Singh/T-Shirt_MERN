import React, { Component } from 'react';
import axios from 'axios';
import ProductScreen from './ProductScreen';
import '../css/HomeScreen.css';
import Loading from './Loading';
import Message from './Message';
import DocumentTitle from 'react-document-title';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      error: '',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      const result = await axios.get('http://localhost:4000/api/products');
      this.setState({ products: result.data, loading: false });
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ error: error.message, loading: false });
    }
  }

  render() {
    const { products, loading, error } = this.state;

    return (
      <div>
        <DocumentTitle title="Home"></DocumentTitle>

        <div>
          {loading && <Loading />}
          {error && <Message variant="danger">{error}</Message>}
          <div className="products">
            {products.map((product) => (
              <div key={product.slug} className="product">
                <ProductScreen product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default HomeScreen;
