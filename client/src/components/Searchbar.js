// import React, { Component } from "react";
// import '../css/Nav.css';

// import searchicon from '../css/images/search.png';
// import axios from 'axios';


// class SearchBar extends Component {
  
//     constructor(props) {
//       super(props);
//       this.state = {
//         searchName: '',
//         isSearchVisible: false,
//       brand: '',
//       sizes: '',
//       description: '',
//       price: '',
//       category: '',
//       color: '',
//       };
//     }

    
  
//     // handleSearch = () => {
//     //   const { handleSearch } = this.props;
//     //   const { searchName } = this.state;
//     //   handleSearch(searchName);
//     // };

//     // handleSearch = () => {
//     //   const { handleSearch } = this.props;
//     //   const { searchName } = this.state;
//     //   handleSearch(searchName);
//     // };

    
//   // handleSearch = (event) => {
//   //   const value = event.target.value.toLowerCase();
//   //   this.setState({ searchName: value, brand: value, sizes: value, description: value, price: value, color: value,category: value  });
//   // };

//   handleSearchChange = (event) => {
//     this.setState({ searchValue: event.target.value });
//   };

  
//   handleSearchClick = async () => {
//     const { searchValue } = this.state;

//     try {
//       // Make a request to your server with the search query
//       const response = await axios.get(`${YOUR_SERVER_API_ENDPOINT}/search`, {
//         params: {
//           query: searchValue,
//         },
//       });

//          // Handle the response, e.g., update the parent component state
//          this.props.handleSearch(response.data);
//         } catch (error) {
//           console.error('Error fetching search results:', error);
//         }
//       };

    
//     render() {
//         const { isVisible, searchName } = this.props;
  
//        return (
//         // <div className={`search-bar ${isVisible ? 'active' : ''}`}>
//         // {isVisible && (
//         //   // <input
//         //   //   type="text"
//         //   //   placeholder="Search"
//         //   //   value={this.state.searchName}
//         //   //   onChange={(e) => this.setState({ searchName: e.target.value })}
//         //   //   autoFocus
//         //   <input
//         //   type="text"
//         //   placeholder="Search"
//         //   value={this.state.searchName}
//         //   onChange={this.handleChange}
//         //   autoFocus
//         //   />
//         // )}
//         <div className="left-section">
//         <SearchBar isVisible={isSearchVisible} />
//         <img
//           id="search-icon"
//           src={searchicon}
//           alt="Search"
//           onClick={this.toggleSearchVisibility}
//         />
//       </div>
//       );
//     }
//   }

//   export default SearchBar;
import React, { Component } from 'react';
import axios from 'axios';
import {
  ACCESS_LEVEL_GUEST,
  ACCESS_LEVEL_ADMIN,
  SERVER_HOST,
} from '../config/global_constants';

// ... (existing imports)

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
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
      const result = await axios.get(`${SERVER_HOST}/tshirts`);
      this.setState({ products: result.data, loading: false });
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ error: error.message, loading: false });
    }
  }

  handleSearchChange = (event) => {
    this.setState({ searchValue: event.target.value });
  };

  handleSearchClick = () => {
    // Perform search logic here based on the name
    const { onSearch } = this.props;
    const { products, searchValue } = this.state;

    const filteredTshirts = products.filter((tshirt) =>
      tshirt.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Call the onSearch prop with the filtered results
    onSearch(filteredTshirts);
  };

  render() {
    const { searchValue } = this.state;

    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={this.handleSearchChange}
        />
        <button onClick={this.handleSearchClick}>Search</button>
      </div>
    );
  }
}

export default SearchBar;
