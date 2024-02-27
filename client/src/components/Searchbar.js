// import React, { Component } from "react";
// import '../css/Nav.css';
// import searchicon from '../css/images/search.png';

// class SearchBar extends Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         searchName: '',
//         isSearchVisible: false,
//       };
//     }
  
//     handleSearch = () => {
//       const { handleSearch } = this.props;
//       const { searchName } = this.state;
//       handleSearch(searchName);
//     };
  
//     toggleSearchVisibility = () => {
//       this.setState((prevState) => ({
//         isSearchVisible: !prevState.isSearchVisible,
//       }));
//     };
  
//     render() {
//       const { isSearchVisible, searchName } = this.state;
  
//       return (
//         <div className={`search-bar ${isSearchVisible ? 'active' : ' '}`}>
//           {isSearchVisible && (
//             <input
//               type="text"
//               placeholder="Search"
//               value={searchName}
//               onChange={(e) => this.setState({ searchName: e.target.value })}
//               autoFocus
//             />
//           )}
//           <img
//             id="search-icon"
//             src={searchicon}
//             alt="Search"
//             onClick={this.toggleSearchVisibility}
//           />
//         </div>
//       );
//     }
//   }
  
//   export default SearchBar;

// SearchBar.js

import React, { Component } from "react";
import '../css/Nav.css';
import searchicon from '../css/images/search.png';
class SearchBar extends Component {
    constructor(props) {
      super(props);
      this.state = {
        searchName: '',
        isSearchVisible: false,
      };
    }
  
    handleSearch = () => {
      const { handleSearch } = this.props;
      const { searchName } = this.state;
      handleSearch(searchName);
    };
  

    render() {
        const { isVisible, searchName } = this.props;
  
       return (
        <div className={`search-bar ${isVisible ? 'active' : ''}`}>
        {isVisible && (
          <input
            type="text"
            placeholder="Search"
            value={this.state.searchName}
            onChange={(e) => this.setState({ searchName: e.target.value })}
            autoFocus
          />
        )}
      </div>
      );
    }
  }

  export default SearchBar;