import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/Nav.css';
import SearchBar from './Searchbar';
import bagImage from '../css/images/bag.png';
import searchicon from '../css/images/search.png';
import wings from '../css/images/logobw.png';
import axios from 'axios';
import {
  ACCESS_LEVEL_ADMIN,
  ACCESS_LEVEL_NORMAL_USER,
} from '../config/global_constants';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      error: '',
      isSearchVisible: false,
      userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    };
  }

  async componentDidMount() {
    await this.fetchData();
  }
  
  async fetchData() {
    try {
      const result = await axios.get('/tshirts'); // assuming the endpoint is correct
      this.setState({ products: result.data, loading: false });
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ error: error.message, loading: false });
    }
  }

  toggleSearchVisibility = () => {
    this.setState((prevState) => ({
      isSearchVisible: !prevState.isSearchVisible,
    }));
  };

  signoutHandler = () => {
    localStorage.removeItem('userInfo');
    this.setState({ userInfo: null });
    // Redirect to home page or login page if needed
  };

  render() {
    const { userInfo } = this.state;

    return (
      <div className="top-bar">
        <a href="/DisplayTshirts">
          <img src={wings} alt="icon" />
        </a>

        <div className="AdminFunc">
          {!userInfo && (
            <Link className="admin-button1" to={'/Login'}>
              Login
            </Link>
          )}

          {!userInfo && (
            <Link className="admin-button1" to={'/Register'}>
              Register
            </Link>
          )}

          {userInfo && userInfo.accessLevel === ACCESS_LEVEL_NORMAL_USER && (
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="adminDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {userInfo.profilePhoto && (
                  <img
                    id="profilePhoto"
                    src={`data:image/jpeg;base64,${userInfo.profilePhoto}`}
                    alt="Profile"
                  />
                )}
              </button>
              <div className="dropdown-menu" aria-labelledby="userDropdown">
                <Link className="dropdown-item" to="/profile">
                  User Profile
                </Link>
                <Link className="dropdown-item" to="/admin/ViewOrders">
                  Order History
                </Link>
               
                <Link
                  className="dropdown-item"
                  to="/"
                  onClick={this.signoutHandler}
                >
                  Log Out
                </Link>
              </div>
            </div>
          )}

          {userInfo && userInfo.accessLevel === ACCESS_LEVEL_ADMIN && (
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="adminDropdown"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Admin
              </button>
              <div className="dropdown-menu" aria-labelledby="adminDropdown">
                <Link className="dropdown-item" to='/AddTshirt'>
                  Add New T-shirt
                </Link>
                <Link className="dropdown-item" to="/admin/ViewCustomers">
                  Users
                </Link>
                <Link className="dropdown-item" to="/admin/dashboard">
                  Dashboard
                </Link>
                <Link className="dropdown-item" to="/admin/products">
                  Products
                </Link>
                <Link className="dropdown-item" to="/admin/ViewOrders">
                  Orders
                </Link>
              </div>
            </div>
          )}
        </div>

        <nav>
          <div className="left-section">
            <SearchBar />
            <img
              id="search-icon"
              src={searchicon}
              alt="Search"
              onClick={this.toggleSearchVisibility}
            />
          </div>

          <div className="center-section">
            <h1>Closet</h1>
          </div>

          <div className="right-section">
            <Link to="/ShoppingCart">
              <img
                src={bagImage}
                style={{ width: '20px', height: '20px' }}
                alt="Cart"
              />
            </Link>
            <Link
                  className="dropdown-item"
                  to="/"
                  onClick={this.signoutHandler}
                >
                  Log Out
                </Link>

        
            {userInfo ? (
              <img id="profile-icon" src="profile-icon.png" alt="Profile" />
            ) : null}
          </div>
        </nav>
      </div>
    );
  }
}

export default Nav;
