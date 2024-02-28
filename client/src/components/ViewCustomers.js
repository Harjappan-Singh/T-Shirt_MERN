import React, { Component } from 'react';
import axios from 'axios';
import ViewOrderHistory from './ViewOrderHistory'; // Import the ViewOrderHistory component
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
      filteredCustomers: [],
      loading: true,
      error: '',
      showOrderHistory: false, 
      selectedCustomerEmail: null, 
      searchQuery: '', 
    };
  }

  componentDidMount() {
    this.fetchCustomers();
  }

  async fetchCustomers() {
    try {
      const response = await axios.get(`${SERVER_HOST}/users`);
      this.setState({ customers: response.data, filteredCustomers: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      this.setState({ error: 'Internal Server Error', loading: false });
    }
  }

  handleDeleteCustomer = async (customerId) => {
    try {
      await axios.delete(`${SERVER_HOST}/users/${customerId}`);
      this.fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
     
    }
  };

  handleShowOrderHistory = async (customerEmail) => {
    try {
      const response = await axios.get(`${SERVER_HOST}/orderHistory/${customerEmail}`);
      this.setState({
        showOrderHistory: true,
        selectedCustomerEmail: customerEmail,
        orderHistory: response.data,
      });
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  handleCloseOrderHistory = () => {
    this.setState({
      showOrderHistory: false,
      selectedCustomerEmail: null,
      orderHistory: [],
    });
  };

  handleSearchChange = (event) => {
    const searchQuery = event.target.value;
    this.setState({ searchQuery });
    this.filterCustomers(searchQuery);
  };

  filterCustomers = (searchQuery) => {
    const { customers } = this.state;
    const filteredCustomers = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    this.setState({ filteredCustomers });
  };

  handleShowOrderHistory = async (customerEmail) => {
    try {
      const response = await axios.get(`${SERVER_HOST}/orderHistory/${customerEmail}`);
      this.setState({
        showOrderHistory: true,
        selectedCustomerEmail: customerEmail,
        orderHistory: response.data,
        // Pass customer's email to ViewOrderHistory component
        selectedCustomerEmailForOrderHistory: customerEmail,
      });
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };
  
  render() {
    const { filteredCustomers, loading, error, showOrderHistory, selectedCustomerEmail, orderHistory, searchQuery } = this.state;

    return (
      <div>
        <h2>Customers</h2>
        <input type="text" placeholder="Search by name" value={searchQuery} onChange={this.handleSearchChange} />
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <ul>
          {filteredCustomers.map((customer) => (
            <li key={customer._id}>
              <strong>Name:</strong> {customer.name}, <strong>Email:</strong> {customer.email},
              <button onClick={() => this.handleDeleteCustomer(customer._id)}>Delete</button>
              <button onClick={() => this.handleShowOrderHistory(customer.email)}>Show Order History</button>
              {showOrderHistory && selectedCustomerEmail === customer.email && (
                <ViewOrderHistory customerEmail={customer.email} onClose={this.handleCloseOrderHistory} />
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
