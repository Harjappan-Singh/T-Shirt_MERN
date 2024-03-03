import React, { Component } from 'react';
import axios from 'axios';
import {
  ACCESS_LEVEL_GUEST,
  ACCESS_LEVEL_ADMIN,
  SERVER_HOST,
} from '../config/global_constants';

export default class ViewOrderHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderHistory: [],
      loading: true,
      error: '',
      sortByDateAsc: true,
      customerEmail: props.customerEmail || JSON.parse(localStorage.getItem('userInfo'))?.email,
    };
  }

  componentDidMount() {
    const { customerEmail } = this.state;
    if (customerEmail) {
      this.fetchOrderHistory(customerEmail);
    } else {
      this.setState({ loading: false, error: 'Customer email not provided' });
    }
  }

  async fetchOrderHistory(customerEmail) {
    try {
      const response = await axios.get(`${SERVER_HOST}/orderHistory/${customerEmail}`);
      console.log('Order history:', response.data); // Debugging statement
      this.setState({ orderHistory: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching order history', error);
      this.setState({ error: 'Internal Server Error', loading: false });
    }
  }

  handleSortByDate = () => {
    const { orderHistory, sortByDateAsc } = this.state;
    const sortedOrderHistory = orderHistory.slice().sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortByDateAsc ? dateA - dateB : dateB - dateA;
    });
    this.setState({
      orderHistory: sortedOrderHistory,
      sortByDateAsc: !sortByDateAsc,
    });
  };

  render() {
    const { orderHistory, loading, error } = this.state;

    return (
      <div>
        <h2>Order History</h2>
        <button onClick={this.handleSortByDate}>Sort by Date</button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {orderHistory.length === 0 && !loading && <p>No order history found.</p>}
        {orderHistory.length > 0 && (
          <ul>
            {orderHistory.map((order) => (
              <li key={order._id}>
                <strong>Name:</strong> {order.item_name},
                <strong>Date:</strong> {new Date(order.date).toLocaleDateString()},
                <strong>Time:</strong> {new Date(order.date).toLocaleTimeString()},
                <strong>Cost:</strong> {order.cost}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
