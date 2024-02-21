import React, { Component } from 'react';

class HeartIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRed: false,
    };
  }

  handleClick = () => {
    this.setState((prevState) => ({
      isRed: !prevState.isRed,
    }));
  };

  render() {
    const { isRed } = this.state;
    return (
      <div
        className={`heart-icon ${isRed ? 'red' : ''}`}
        onClick={this.handleClick}
      ></div>
    );
  }
}

export default HeartIcon;
