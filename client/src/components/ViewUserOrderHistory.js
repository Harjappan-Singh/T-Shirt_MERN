import React, { Component } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../config/global_constants';

const styles = {
  container: {
    padding: '20px',
  },
  orderItem: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '20px',
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
};

class ViewUserOrderHistory extends Component {
  state = {
    orderHistory: [],
    filteredOrders: [],
    searchQuery: '',
    sortField: '',
    error: null,
  };

  componentDidMount() {
    this.fetchOrderHistory();
  }

  fetchOrderHistory = async () => {
    try {
      const userEmail = JSON.parse(localStorage.getItem('userInfo')).email;
      const response = await axios.get(
        `${SERVER_HOST}/orders/user/${userEmail}`
      );
      this.setState({
        orderHistory: response.data,
        filteredOrders: response.data,
      });
    } catch (error) {
      console.error('Error fetching order history:', error);
      this.setState({ error: 'Failed to fetch order history' });
    }
  };

  handleSearch = (query) => {
    const { orderHistory } = this.state;
    const filteredOrders = orderHistory.filter(
      (order) =>
        order._id.toLowerCase().includes(query.toLowerCase()) ||
        order.email.toLowerCase().includes(query.toLowerCase()) ||
        order.transactionId.toLowerCase().includes(query.toLowerCase())
    );
    this.setState({ filteredOrders, searchQuery: query });
  };

  handleSort = (field) => {
    const { filteredOrders } = this.state;
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    });
    this.setState({ filteredOrders: sortedOrders, sortField: field });
  };

  render() {
    const { filteredOrders, searchQuery, sortField, error } = this.state;

    return (
      <div style={styles.container}>
        <h2>Order History</h2>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => this.handleSearch(e.target.value)}
        />
        <button onClick={() => this.handleSort('orderTime')}>
          Sort by Order Time
        </button>
        {error && <p style={styles.errorMessage}>{error}</p>}
        {filteredOrders.map((order) => (
          <div key={order._id} style={styles.orderItem}>
            <h3>Order ID: {order._id}</h3>
            <p>Email: {order.email}</p>
            <p>Order Time: {order.orderTime}</p>
            <p>Total Cost: {order.totalCost}</p>
            <p>Transaction ID: {order.transactionId}</p>
            <p>
              Shipping Address: {order.shippingAddress.addressLine1},{' '}
              {order.shippingAddress.city}, {order.shippingAddress.county},{' '}
              {order.shippingAddress.eircode}
            </p>
            <ul>
              {order.items.map((item) => (
                <li key={item.itemName}>
                  {item.itemName} - Quantity: {item.quantity} - Price:{' '}
                  {item.price}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

export default ViewUserOrderHistory;
