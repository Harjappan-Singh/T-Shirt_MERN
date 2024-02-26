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
    };
  }

  componentDidMount() {
    this.fetchOrderHistory();
  }

  async fetchOrderHistory() {
    try {
      const { customerId } = this.props; 
      const response = await axios.get(`${SERVER_HOST}/orderHistory/${customerId}`); 
      this.setState({ orderHistory: response.data, loading: false }); 
    } catch (error) {
      console.error('Error fetching order history', error);
      this.setState({ error: 'Internal Server Error', loading: false });
    }
  }

  render() {
    const { orderHistory, loading, error } = this.state; 

    return (
      <div>
        <h2>Order History</h2>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {orderHistory.length === 0 && !loading && <p>No order history found.</p>}
        {orderHistory.length > 0 && (
          <ul>
            {orderHistory.map((order) => ( 
              <li key={order._id}> 
                <strong>Name:</strong> {order.item_name}, 
                <strong>Date:</strong> {order.date}, 
                <strong>Cost:</strong> {order.cost} 
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}