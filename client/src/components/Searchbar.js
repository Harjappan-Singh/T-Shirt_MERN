
import React, { Component } from "react";
import '../css/Nav.css';
import searchicon from '../css/images/search.png';
import axios from 'axios';


class SearchBar extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        searchName: '',
        isSearchVisible: false,
      brand: '',
      sizes: '',
      description: '',
      price: '',
      category: '',
      color: '',
      };
    }

    
  
    // handleSearch = () => {
    //   const { handleSearch } = this.props;
    //   const { searchName } = this.state;
    //   handleSearch(searchName);
    // };

    // handleSearch = () => {
    //   const { handleSearch } = this.props;
    //   const { searchName } = this.state;
    //   handleSearch(searchName);
    // };

    
  handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    this.setState({ searchName: value, brand: value, sizes: value, description: value, price: value, color: value,category: value  });
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
