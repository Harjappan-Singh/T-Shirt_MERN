import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductScreen from './ProductScreen';
import Loading from './Loading';
import Message from './Message';
import '../css/HomeScreen.css';
import {
  ACCESS_LEVEL_GUEST,
  ACCESS_LEVEL_ADMIN,
  SERVER_HOST,
} from '../config/global_constants';

import Logout from './Logout';

export default class DisplayTshirts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      error: '',
      sortByRating: false,
      sortByPrice: false,

      genderFilter: 'All',
      colorFilter: 'All',
      brandFilter: 'All',
      sizesFilter: 'All',

      searchName: '',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    try {
      //${SERVER_HOST}/tshirts`
      //   const result = await axios.get('http://localhost:4000/api/products');
      const result = await axios.get(`${SERVER_HOST}/tshirts`);
      this.setState({ products: result.data, loading: false });
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ error: error.message, loading: false });
    }
  }

  handleSortByRating = () => {
    const { products, sortByRating } = this.state;
    const sortedProducts = [...products];
  
    sortedProducts.sort((a, b) => {
      return sortByRating ? b.rating - a.rating : a.rating - b.rating;
    });
  
    this.setState({
      products: sortedProducts,
      sortByRating: !sortByRating,
    });
  };
  
  handleSortByPrice = () => {
    const { products, sortByPrice } = this.state;
    const sortedProducts = [...products];
  
    sortedProducts.sort((a, b) => {
      return sortByPrice ? b.price - a.price : a.price - b.price;
    });
  
    this.setState({
      products: sortedProducts,
      sortByPrice: !sortByPrice,
    });
  };
  

  handleGenderFilter = (event) => {
    this.setState({ genderFilter: event.target.value });
  };

  handleColorFilter = (event) => {
    this.setState({ colorFilter: event.target.value });
  };
  handleSizesFilter = (event) => {
    this.setState({ sizesFilter: event.target.value });
  };

  handleBrandFilter = (event) => {
    this.setState({ brandFilter: event.target.value });
  };

  handleSearchName = (event) => {
    this.setState({ searchName: event.target.value });
  };

  render() {
    const {
      products,
      loading,
      error,
      genderFilter,
      colorFilter,
      sortByBrand,
      brandFilter,
      sizesFilter,
      searchName,
    } = this.state;

    let filteredTshirts = products.filter((tshirt) => {
      const matchesGender =
        genderFilter === 'All' || tshirt.category === genderFilter;
      const matchesColor =
        colorFilter === 'All' || tshirt.color === colorFilter;
      const matchesBrand =
        brandFilter === 'All' || tshirt.brand === brandFilter;
      const matchesSizes =
        sizesFilter === 'All' || tshirt.sizes.includes(sizesFilter);
      const matchesSearchName =
        searchName === '' ||
        tshirt.name.toLowerCase().includes(searchName.toLowerCase());

      // Return true if all filters match
      return (
        matchesGender && matchesColor && matchesBrand && matchesSizes && matchesSearchName
      );
    });

    if (sortByBrand) {
      filteredTshirts.sort((a, b) => {
        const brandA = a.brand.toUpperCase();
        const brandB = b.brand.toUpperCase();
        return brandA.localeCompare(brandB);
      });
    }

    return (
      
      <div className="form-container">
         <Link to="/ShoppingCart" className="green-button">
          Shopping Cart
        </Link>
        {localStorage.accessLevel > ACCESS_LEVEL_GUEST ? (
          <div className="logout">
            {localStorage.profilePhoto !== 'null' ? (
              <img
                id="profilePhoto"
                src={`data:;base64,${localStorage.profilePhoto}`}
                alt=""
              />
            ) : null}
            <Logout />
          </div>
        ) : (
          <div>
            
            <Link className="green-button" to={'/Login'}>
              Login
            </Link>
            <Link className="blue-button" to={'/Register'}>
              Register
            </Link>
            <Link className="red-button" to={'/ResetDatabase'}>
              Reset Database
            </Link>
            <br />
            <br />
            <br />
          </div>
        )}
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={this.handleSearchName}
          />
          <select value={sizesFilter} onChange={this.handleSizesFilter}>
            <option value="All">Sizes</option>
            <option value="XXS">XXS</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="XXXL">XXXL</option>
          </select>

          <select value={genderFilter} onChange={this.handleGenderFilter}>
            <option value="All">All</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
          <select value={colorFilter} onChange={this.handleColorFilter}>
            <option value="All">All Colors</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Brown">Brown</option>
            <option value="Blue">Blue</option>
            <option value="Red">Red</option>
            <option value="Green">Green</option>
            <option value="Gray">Gray</option>
          </select>

          <select value={brandFilter} onChange={this.handleBrandFilter}>
            <option value="All">All Brands</option>
            <option value="Nike">Nike</option>
            <option value="Mango">Mango</option>
            <option value="H&M">H&M</option>
            <option value="Adidas">Adidas</option>
            <option value="Zara">Zara</option>
            <option value="Puma">Puma</option>
            <option value="Under Armour">Under Armour</option>
            <option value="Fila">Fila</option>
          </select>
        </div>

        <div className="table-container">
          <div className="sort-by-rating">
            <button onClick={this.handleSortByRating}>
              Sort by Rating{' '}
              {this.state.sortByRating ? '(Low to High)' : '(High to Low)'}
            </button>
          </div>
          <div className="sort-by-price">
            <button onClick={this.handleSortByPrice}>
              Sort by Price{' '}
              {this.state.sortByPrice ? '(Low to High)' : '(High to Low)'}
            </button>
          </div>

          {/* <Table tshirts={filteredTshirts} /> */}
          {/* <DocumentTitle title="Home"></DocumentTitle> */}

          <div>
            {loading && <Loading />}
            {error && <Message variant="danger">{error}</Message>}
            
            <div className="products">
  {filteredTshirts.map((product) => (
    <div key={product.slug} className="product">
      <ProductScreen product={product} />
      <Link
  to={{
    pathname: `/TshirtDetails/${product._id}`, // Assuming _id is the product ID
    state: { product: product } // Pass product data as state
  }}
>
  View Details
</Link>
      
    </div>
    
  ))}
</div>

          {/*  <div className="products">
              {products.map((product) => (
                <div key={product.slug} className="product">
                  <ProductScreen product={product} />
                </div>
              ))}
              </div>*/}
             
              </div>

          {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? (
            <div className="add-new-tshirt">
              <Link className="blue-button" to={'/AddTshirt'}>
                Add New T-shirt
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
