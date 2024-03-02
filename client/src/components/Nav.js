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
import axios from 'axios';


import { ACCESS_LEVEL_ADMIN, SERVER_HOST} from '../config/global_constants';





class Nav extends Component {


  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      products: [],
      loading: true,
      error: '',
      isSearchVisible: false,
    };
  }

  async componentDidMount() {
    await this.fetchData(); // Change to async/await
  }
  
  async fetchData() { // Change to async
    try {
      const result = await axios.get(`${SERVER_HOST}/tshirts`);
      this.setState({ products: result.data, loading: false });
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ error: error.message, loading: false });
    }
  }

  handleSearch = (searchParams) => {
    const { name } = searchParams;
    // Filter products based on the name
    const filteredTshirts = this.state.products.filter((tshirt) =>
      tshirt.name.toLowerCase().includes(name.toLowerCase())
    );
  
    // Update the state with the filtered data
    this.setState({ searchName: name, products: filteredTshirts });
  };
  

  handleSearchClick = () => {
    const { onSearch } = this.props;
    const { searchValue } = this.state;
  
    onSearch({ name: searchValue });
  };
  


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
  
  

  render() {

    const { searchValue } = this.state;

    
    return (
      <>

<div className="top-bar">
<a href="/DisplayTshirts">
<img src={wings} alt="icon" />
</a>

<div className="AdminFunc">
  {/* for admin use */}
  {localStorage.accessLevel === ACCESS_LEVEL_ADMIN && (
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
            {/* <img
              id="search-icon"
              src={searchicon}
              alt="Search"
              onClick={this.handleSearchClick}
            />
          */}
  </div>
         
          <div className="center-section">
            <h1>Closet</h1>
          </div>

        <div className="right-section">
          <Link to="/ShoppingCart">
            <img src={bagImage} style={{ width: '20px', height: '20px' }} alt="Cart" />
          </Link>

          
          <img id="profile-icon" src="profile-icon.png" alt="Profile" />



        


</div>
      </nav>
      
</>
    );
  }
}

export default Nav;
