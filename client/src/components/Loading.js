import React, { Component } from 'react';
import '../css/Loading.css';

class Loading extends Component {
  render() {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <span>Loading...</span>
      </div>
    );
  }
}

export default Loading;
