import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/Nav.css';
import SearchBar from './Searchbar';
import bagImage from '../css/images/bag.png';
import searchicon from '../css/images/search.png';
import wings from '../css/images/logobw.png';

import {
  ACCESS_LEVEL_ADMIN,
  ACCESS_LEVEL_NORMAL_USER,
} from '../config/global_constants';
import Login from './Login';
import ViewCustomers from './ViewCustomers';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchVisible: false,
      userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    };
  }

  updateUserInfo = (userInfo) => {
    this.setState({ userInfo: userInfo });
  };

  toggleSearchVisibility = () => {
    this.setState((prevState) => ({
      isSearchVisible: !prevState.isSearchVisible,
    }));
  };

  signoutHandler = () => {
    localStorage.removeItem('userInfo');
    this.setState({ userInfo: null });
    // this.props.history.push('/');
  };

  render() {
    const { userInfo } = this.state;

    return (
      <>
        <div className="top-bar">
          <Link to="/DisplayTshirts">
            <img src={wings} alt="icon" />
          </Link>

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
                {/* {userInfo.name}
                {console.log(userInfo)} */}
                User
              </button>
              <div className="dropdown-menu" aria-labelledby="userDropdown">
                <Link className="dropdown-item" to="/profile">
                  User Profile
                </Link>
                <Link className="dropdown-item" to="/orderhistory">
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
                <Link className=" dropdown-item blue-button" to={'/AddTshirt'}>
                  Add New T-shirt
                </Link>
                <Link className="dropdown-item" to="/ViewCustomers">
                  Users
                </Link>
                <Link className="dropdown-item" to="/admin/dashboard">
                  Dashboard
                </Link>
                <Link className="dropdown-item" to="/admin/products">
                  Products
                </Link>
                <Link className="dropdown-item" to="/admin/orders">
                  Orders
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
          {!userInfo && (
            <Link className="nav-link" to="/Login">
              Log In
            </Link>
          )}
        </div>

        <nav>
          <div className="left-section">
            <SearchBar
            // handleSearch={handleSearch}
            // isVisible={isSearchVisible}
            />
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
            <img id="profile-icon" src="profile-icon.png" alt="Profile" />
          </div>
        </nav>
      </>
    );
  }
}

export default Nav;
