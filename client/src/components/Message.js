import React, { Component } from 'react';

class Message extends Component {
  render() {
    const { variant, children } = this.props;
    const alertStyle = {
      padding: '10px',
      marginBottom: '20px',
      border: '1px solid',
      borderRadius: '4px',
      borderColor: variant === 'danger' ? '#dc3545' : '#007bff',
      backgroundColor: variant === 'danger' ? '#f8d7da' : '#cce5ff',
      color: variant === 'danger' ? '#721c24' : '#004085',
    };

    return <div style={alertStyle}>{children}</div>;
  }
}

export default Message;
