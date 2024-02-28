import React, { Component } from "react";
import { Link } from "react-router-dom";
import '../css/Nav.css';
import SearchBar from "./Searchbar";
import bagImage from '../css/images/bag.png';
import searchicon from '../css/images/search.png';
import exit from '../css/images/logout.png';
import Banner from "./Banner";
import Logout from "./Logout";
import wings from '../css/images/logobw.png';
import DisplayTshirts from "./DisplayTshirts";


import { ACCESS_LEVEL_ADMIN, ACCESS_LEVEL_GUEST} from '../config/global_constants';





class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: '',
      brand: '',
      sizes: '',
      description: '',
      price: '',
      category: '',
      color: '',
      isSearchVisible: false,
    };
  }

  handleSearch = (searchValue) => {
    this.setState({
      searchName: searchValue,
      brand: searchValue,
      sizes: searchValue,
      description: searchValue,
      price: searchValue,
      color: searchValue,
      category: searchValue,
    });
  };

  toggleSearchVisibility = () => {
    this.setState((prevState) => ({
      isSearchVisible: !prevState.isSearchVisible,
    }));
  };

  render() {
    const { handleSearch } = this.props;
    const { isSearchVisible } = this.state;

    return (
      <>

<div className="top-bar">
<a href="/DisplayTshirts">
<img src={wings} alt="icon" />
</a>

<div className="AdminFunc">
  {/* for admin use */}
  {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN && (
              <Link to="/ViewCustomers">
                <button className="admin-button">Customers</button>
              </Link>
            )}


 {/* {localStorage.accessLevel > ACCESS_LEVEL_GUEST ? (
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
 ) */}



            


  <Link className="admin-button1" to={'/Login'}>
    Login
  </Link>
  <Link className="admin-button1" to={'/Register'}>
    Register
  </Link>

{/* <Link className="red-button" to={'/ResetDatabase'}>
  Reset Database
</Link> */}
</div>

  </div>

      <nav>
        <div className="left-section">
          <SearchBar handleSearch={handleSearch} isVisible={isSearchVisible} />
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
            <img src={bagImage} style={{ width: '20px', height: '20px' }} alt="Cart" />
          </Link>
          {/* <img id="profile-icon" src="profile-icon.png" alt="Profile" /> */}



        


</div>
      </nav>
      
</>
    );
  }
}

export default Nav;
