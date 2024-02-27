
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
  
    // handleSearch = () => {
    //   const { handleSearch } = this.props;
    //   const { searchName } = this.state;
    //   handleSearch(searchName);
    // };

    handleSearch = () => {
      const { handleSearch } = this.props;
      const { searchName } = this.state;
      handleSearch(searchName);
    };
    

    handleChange = (e) => {
      this.setState({ searchName: e.target.value });
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
