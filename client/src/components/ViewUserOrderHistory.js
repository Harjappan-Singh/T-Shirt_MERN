import React, { Component } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../config/global_constants';

class ViewUserOrderHistory extends Component {
  state = {
    orderHistory: [],
    error: null,
  };

  componentDidMount() {
    this.fetchOrderHistory();
  }

  fetchOrderHistory = async () => {
    try {
      const userEmail = JSON.parse(localStorage.getItem('userInfo')).email; // Get user email from localStorage
      const response = await axios.get(
        `${SERVER_HOST}/orders/user/${userEmail}`
      );
      this.setState({ orderHistory: response.data });
    } catch (error) {
      console.error('Error fetching order history:', error);
      this.setState({ error: 'Failed to fetch order history' });
    }
  };

  render() {
    const { orderHistory, error } = this.state;

    return (
      <div>
        <h2>Order History</h2>
        {error && <p>{error}</p>}
        {orderHistory.map((order) => (
          <div key={order._id}>
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
