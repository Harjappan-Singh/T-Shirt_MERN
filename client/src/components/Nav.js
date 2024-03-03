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


// class Nav extends Component {


  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     searchValue: '',
  //     products: [],
  //     loading: true,
  //     error: '',
  //     isSearchVisible: false,
  //     userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
  //   };
  // }

  // updateUserInfo = (userInfo) => {
  //   this.setState({ userInfo: userInfo });
  // };

  // async componentDidMount() {
  //   await this.fetchData(); // Change to async/await
  // }
  
  // async fetchData() { // Change to async
  //   try {
  //     const result = await axios.get(`${SERVER_HOST}/tshirts`);
  //     this.setState({ products: result.data, loading: false });
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     this.setState({ error: error.message, loading: false });
  //   }
  // }

  // handleSearch = (searchParams) => {
  //   const { name } = searchParams;
  //   // Filter products based on the name
  //   const filteredTshirts = this.state.products.filter((tshirt) =>
  //     tshirt.name.toLowerCase().includes(name.toLowerCase())
  //   );
  
  //   // Update the state with the filtered data
  //   this.setState({ searchName: name, products: filteredTshirts });
  // };
  

  // handleSearchClick = () => {
  //   const { onSearch } = this.props;
  //   const { searchValue } = this.state;
  
  //   onSearch({ name: searchValue });
  // };
  


  // toggleSearchVisibility = () => {
  //   this.setState((prevState) => ({
  //     isSearchVisible: !prevState.isSearchVisible,
  //   }), () => {
  //     // Focus on the input field when the search bar is made visible
  //     if (this.state.isSearchVisible) {
  //       this.searchInput.focus();
  //     }
  //   });
  // };
  
  
  // toggleSearchVisibility = () => {
  //   this.setState((prevState) => ({
  //     isSearchVisible: !prevState.isSearchVisible,
  //   }));
  // };

  // signoutHandler = () => {
  //   localStorage.removeItem('userInfo');
  //   this.setState({ userInfo: null });
  //   // this.props.history.push('/');
  // };

  // render() {
  //   const { searchValue, userInfo } = this.state;

  // return(

// <div className="top-bar">
// <a href="/DisplayTshirts">
// <img src={wings} alt="icon" />
// </a>

// <div className="AdminFunc">
//   {/* for admin use */}
//   {localStorage.accessLevel === ACCESS_LEVEL_ADMIN && (
//   <Link to="/ViewCustomers">
//     <button className="admin-button">Customers</button>
//   </Link>
// )}





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



            

//  <>
//  <div className="top-bar">
//    <Link to="/DisplayTshirts">
//      <img src={wings} alt="icon" />
//    </Link>

//    {localStorage.profilePhoto &&
//      localStorage.profilePhoto !== 'null' && (
//        <img
//          id="profilePhoto"
//          src={`data:image/jpeg;base64,${localStorage.profilePhoto}`}
//          alt="Profile"
//        />
//      )}

//    {userInfo && userInfo.accessLevel === ACCESS_LEVEL_NORMAL_USER && (
//      <div className="dropdown">
//        <button
//          className="btn btn-secondary dropdown-toggle"
//          type="button"
//          id="adminDropdown"
//          data-toggle="dropdown"
//          aria-haspopup="true"
//          aria-expanded="false"
//        >
//          {/* {userInfo.name}
//          {console.log(userInfo)} */}
//          User
//        </button>
//        <div className="dropdown-menu" aria-labelledby="userDropdown">
//          <Link className="dropdown-item" to="/profile">
//            User Profile
//          </Link>
//          <Link className="dropdown-item" to="/orderhistory">
//            Order History
//          </Link>
//          <Link
//            className="dropdown-item"
//            to="/"
//            onClick={this.signoutHandler}
//          >
//            Log Out
//          </Link>
//        </div>
//      </div>
//    )}

// {userInfo && userInfo.accessLevel === ACCESS_LEVEL_ADMIN && (
//             <div className="dropdown">
//               <button
//                 className="btn btn-secondary dropdown-toggle"
//                 type="button"
//                 id="adminDropdown"
//                 data-toggle="dropdown"
//                 aria-haspopup="true"
//                 aria-expanded="false"
//               >
//                 Admin
//               </button>
//               <div className="dropdown-menu" aria-labelledby="adminDropdown">
//                 <Link className=" dropdown-item blue-button" to={'/AddTshirt'}>
//                   Add New T-shirt
//                 </Link>
//                 <Link className="dropdown-item" to="/ViewCustomers">
//                   Users
//                 </Link>
//                 <Link className="dropdown-item" to="/admin/dashboard">
//                   Dashboard
//                 </Link>
//                 <Link className="dropdown-item" to="/admin/products">
//                   Products
//                 </Link>
//                 <Link className="dropdown-item" to="/admin/orders">
//                   Orders
//                 </Link>

//                 <Link
//                   className="dropdown-item"
//                   to="/"
//                   onClick={this.signoutHandler}
//                 >
//                   Log Out
//                 </Link>
//               </div>
//             </div>
//           )}
//           {!userInfo && (
//             <Link className="nav-link" to="/Login">
//               Log In
//             </Link>
//           )}
//         </div>
//         </div>
//             <nav>
//               <div className="left-section">
//                 <img
//                   id="search-icon"
//                   src={searchicon}
//                   alt="Search"
//                   onClick={this.handleSearchClick}
//                 />
             
//               </div>
         
//           <div className="center-section">
//             <h1>Closet</h1>
//           </div>

//         <div className="right-section">
//           <Link to="/ShoppingCart">
//             <img src={bagImage} style={{ width: '20px', height: '20px' }} alt="Cart" />
//           </Link>

//           <img id="profile-icon" src="profile-icon.png" alt="Profile" />
//           </div>
//         </nav>

//   );
// }
// }

// export default Nav;



class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchVisible: false,
      userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    };
  }

  toggleSearchVisibility = () => {
    this.setState((prevState) => ({
      isSearchVisible: !prevState.isSearchVisible,
    }), () => {
      // Focus on the input field when the search bar is made visible
      if (this.state.isSearchVisible) {
        this.searchInput.focus();
      }
    });
  };


  componentDidMount() {
    console.log('localStorage.profilePhoto:', localStorage.profilePhoto);
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
    const { userInfo, isSearchVisible } = this.state;

    return (
      <>
        <div className="top-bar">
          <Link to="/DisplayTshirts">
            <img src={wings} alt="icon" />
          </Link>

          {localStorage.profilePhoto &&
            localStorage.profilePhoto !== 'null' && (
              <img
                id="profilePhoto"
                src={`data:image/jpeg;base64,${localStorage.profilePhoto}`}
                alt="Profile"
              />
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
              <Link className="dropdown-item blue-button" to='/AddTshirt/:id'>
  Add T-shirt
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
        </div>

        <nav>
        <nav>
          <div className="left-section">
          {isSearchVisible && (
              <SearchBar
                ref={(input) => {
                  this.searchInput = input;
                }}
              />
            )}
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