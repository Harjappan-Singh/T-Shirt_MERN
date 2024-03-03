import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from './Searchbar';
import DisplayTshirts from './DisplayTshirts';
import Login from './Login';
import ViewCustomers from './ViewCustomers';
import wings from '../css/images/logobw.png';
import bagImage from '../css/images/bag.png';
import searchicon from '../css/images/search.png';
import '../css/Nav.css';
import { SERVER_HOST } from '../config/global_constants';






import {
  ACCESS_LEVEL_ADMIN,
  ACCESS_LEVEL_NORMAL_USER,
} from '../config/global_constants';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    };
  }



  signoutHandler = () => {
    localStorage.removeItem('userInfo');
    localStorage.clear();
    this.setState({ userInfo: null });
    // this.props.history.push('/');
  };

  render() {
    const { userInfo } = this.state;
    // console.log(userInfo.profilePhoto);s

    return (
      <>
      <div className="top-bar">
        <a href="/DisplayTshirts">
          <img src={wings} alt="icon" />
        </a>

        <div className="AdminFunc">
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
                onClick={(e) => e.stopPropagation()}
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
                <Link className="dropdown-item" to="/UserProfile">
                  User Profile
                </Link>
                <Link className="dropdown-item" to="/ViewOrders">
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
                onClick={(e) => e.stopPropagation()}
              >
                Admin
              </button>
              <div className="dropdown-menu" aria-labelledby="adminDropdown">
                <Link className="dropdown-item" to="/admin/AddTshirt">
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
                <Link className="dropdown-item" to="/admin/viewOrders">
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
          <Link className="admin-button1" to={'/Login'}>
            Login
          </Link>
        )}
         </div>
  </div>
        <nav>
        {/* <div className="left-section">
            <img
              id="search-icon"
              src={searchicon}
              alt="Search"
            />
          </div> */}

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
          </div>
        </nav>
    </>
    );
  }
}

export default Nav;