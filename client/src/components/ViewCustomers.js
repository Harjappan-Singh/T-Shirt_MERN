import React, { Component } from 'react';
import axios from 'axios';
import {
  ACCESS_LEVEL_GUEST,
  ACCESS_LEVEL_ADMIN,
  SERVER_HOST,
} from '../config/global_constants';

export default class ViewCustomers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      loading: true,
      error: '',
    };
  }

  componentDidMount() {
    this.fetchCustomers();
  }

  async fetchCustomers() {
    try {
      const response = await axios.get(`${SERVER_HOST}/users`);
      this.setState({ customers: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      this.setState({ error: 'Internal Server Error', loading: false });
    }
  }

  handleDeleteCustomer = async (customerId) => {
    try {
      await axios.delete(`${SERVER_HOST}/users/${customerId}`);
      // After successful deletion, fetch updated list of customers
      this.fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      // Handle error
    }
  };

  render() {
    const { customers, loading, error } = this.state;

    return (
      <div>
        <h2>Customers</h2>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <ul>
          {customers.map((customer) => (
            <li key={customer._id}>
              <strong>Name:</strong> {customer.name}, <strong>Email:</strong>{' '}
              {customer.email}
              <button onClick={() => this.handleDeleteCustomer(customer._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
