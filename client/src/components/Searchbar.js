// // import React, { Component } from "react";
// // import '../css/Nav.css';

// // import searchicon from '../css/images/search.png';
// // import axios from 'axios';


// // class SearchBar extends Component {
  
// //     constructor(props) {
// //       super(props);
// //       this.state = {
// //         searchName: '',
// //         isSearchVisible: false,
// //       brand: '',
// //       sizes: '',
// //       description: '',
// //       price: '',
// //       category: '',
// //       color: '',
// //       };
// //     }

    
  
// //     // handleSearch = () => {
// //     //   const { handleSearch } = this.props;
// //     //   const { searchName } = this.state;
// //     //   handleSearch(searchName);
// //     // };

// //     // handleSearch = () => {
// //     //   const { handleSearch } = this.props;
// //     //   const { searchName } = this.state;
// //     //   handleSearch(searchName);
// //     // };

    
// //   // handleSearch = (event) => {
// //   //   const value = event.target.value.toLowerCase();
// //   //   this.setState({ searchName: value, brand: value, sizes: value, description: value, price: value, color: value,category: value  });
// //   // };

// //   handleSearchChange = (event) => {
// //     this.setState({ searchValue: event.target.value });
// //   };

  
// //   handleSearchClick = async () => {
// //     const { searchValue } = this.state;

// //     try {
// //       // Make a request to your server with the search query
// //       const response = await axios.get(`${YOUR_SERVER_API_ENDPOINT}/search`, {
// //         params: {
// //           query: searchValue,
// //         },
// //       });

// //          // Handle the response, e.g., update the parent component state
// //          this.props.handleSearch(response.data);
// //         } catch (error) {
// //           console.error('Error fetching search results:', error);
// //         }
// //       };

    
// //     render() {
// //         const { isVisible, searchName } = this.props;
  
// //        return (
// //         // <div className={`search-bar ${isVisible ? 'active' : ''}`}>
// //         // {isVisible && (
// //         //   // <input
// //         //   //   type="text"
// //         //   //   placeholder="Search"
// //         //   //   value={this.state.searchName}
// //         //   //   onChange={(e) => this.setState({ searchName: e.target.value })}
// //         //   //   autoFocus
// //         //   <input
// //         //   type="text"
// //         //   placeholder="Search"
// //         //   value={this.state.searchName}
// //         //   onChange={this.handleChange}
// //         //   autoFocus
// //         //   />
// //         // )}
// //         <div className="left-section">
// //         <SearchBar isVisible={isSearchVisible} />
// //         <img
// //           id="search-icon"
// //           src={searchicon}
// //           alt="Search"
// //           onClick={this.toggleSearchVisibility}
// //         />
// //       </div>
// //       );
// //     }
// //   }

// //   export default SearchBar;
// import React, { Component } from 'react';
// import axios from 'axios';
import {
  ACCESS_LEVEL_GUEST,
  ACCESS_LEVEL_ADMIN,
  SERVER_HOST,
} from '../config/global_constants';

// class SearchBar extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       searchValue: '',
//       products: [], // Initialize products array
//       loading: true,
//       error: '',
//       genderFilter: 'All',
//       colorFilter: 'All',
//       sortByBrand: false,
//       brandFilter: 'All',
//       sizesFilter: 'All',
//       searchName: '',
//     };
//   }

//   componentDidMount() {
//     this.fetchData();
//   }

//   async fetchData() {
//     try {
//       const result = await axios.get(`${SERVER_HOST}/tshirts`);
//       this.setState({ products: result.data, loading: false });
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       this.setState({ error: error.message, loading: false });
//     }
//   }

//   handleSearchChange = (event) => {
//     this.setState({ searchValue: event.target.value });
//   };

//   handleSearchClick = () => {
//     const { onSearch } = this.props;
//     const { searchValue } = this.state;

//     // Call the onSearch prop with the search query
//     onSearch(searchValue);
//   };

//   render() {
//     const { searchValue, products, loading, error, genderFilter, colorFilter, sortByBrand, brandFilter, sizesFilter, searchName } = this.state;

//     // Check if products is an array before filtering
//     let filteredTshirts = Array.isArray(products)
//       ? products.filter((tshirt) => {
//           const matchesGender = genderFilter === 'All' || tshirt.category === genderFilter;
//           const matchesColor = colorFilter === 'All' || tshirt.color === colorFilter;
//           const matchesBrand = brandFilter === 'All' || tshirt.brand === brandFilter;
//           const matchesSizes = sizesFilter === 'All' || tshirt.sizes.includes(sizesFilter);
//           const matchesSearchName = searchName === '' || tshirt.name.toLowerCase().includes(searchName.toLowerCase());

//           // Return true if all filters match
//           return matchesGender && matchesColor && matchesBrand && matchesSizes && matchesSearchName;
//         })
//       : [];

//     return (
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchValue}
//           onChange={this.handleSearchChange}
//         />
       
//       </div>
//     );
//   }
// }

// export default SearchBar;

import React, { Component } from 'react';
import axios from 'axios';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  handleSearchChange = (event) => {
    this.setState({ searchValue: event.target.value });
  };

  handleSearchClick = async () => {
    const { searchValue } = this.state;
    const { onSearch } = this.props;

    try {
      const response = await axios.get('http://localhost:3000/search', {
        params: {
          query: searchValue,
        },
      });
    
      onSearch(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    
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
