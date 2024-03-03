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
      loading: true,
      error: '',
      showOrderHistory: false,
      selectedCustomer: null,
      searchQuery: '',
    };
  }

  componentDidMount() {
    this.fetchCustomers();
  }

  async fetchCustomers() {
    try {
      const response = await axios.get(`${SERVER_HOST}/users`);
      this.setState({
        customers: response.data,
        loading: false,
      });
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
      const response = await axios.get(
        `${SERVER_HOST}/orderHistory/${customerEmail}`
      );
      console.log('Response from backend:', response.data); // Add this debugging statement
      this.setState({
        showOrderHistory: true,
        selectedCustomer: { email: customerEmail, orderHistory: response.data },
      });
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };
  

  handleCloseOrderHistory = () => {
    this.setState({
      showOrderHistory: false,
      selectedCustomer: null,
    });
  };

  handleSearchChange = (event) => {
    const searchQuery = event.target.value;
    this.setState({ searchQuery });
  };

  render() {
    const {
      customers,
      loading,
      error,
      showOrderHistory,
      selectedCustomer,
      searchQuery,
    } = this.state;

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Customers</h2>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={this.handleSearchChange}
          style={{
            marginBottom: '20px',
            padding: '8px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {customers.map((customer) => (
          <div
            key={customer._id}
            style={{
              marginBottom: '20px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              <strong>Name:</strong> {customer.name}
              </div>
              <div>
               <strong>Email:</strong>
              {customer.email}
            </div>
            <div>
              <strong>Date of Birth:</strong> {customer.dateOfBirth}
              <br />
              <strong>Full Name:</strong> {customer.fullName}
              <br />
              <strong>Gender:</strong> {customer.gender}
              <br />
              <strong>Phone Number:</strong> {customer.phoneNumber}
              <br />
              {/* {console.log(customer.address.addressLine1)} */}
              {/* <strong>Address:</strong> {customer.address} */}
              <br />
              <strong>Account Creation Date:</strong>{' '}
              {customer.accountCreationDate}
              <br />
              <strong>Last Login Date:</strong> {customer.lastLoginDate}
              <br />
            </div>
            <div>
              <button
                style={{ marginRight: '10px' }}
                onClick={() => this.handleDeleteCustomer(customer._id)}
              >
                Delete
              </button>
              <button
                onClick={() => this.handleShowOrderHistory(customer.email)}
              >
                Show Order History
              </button>
            </div>
            {showOrderHistory &&
              selectedCustomer &&
              selectedCustomer.email === customer.email && (
                <div style={{ marginTop: '10px' }}>
                  <h3>Order History for {selectedCustomer.email}</h3>
                  <ul>
                  {selectedCustomer.orderHistory.map((order, index) => (
  <li key={index}>
    <div>Item Name: {order.item_name}</div>
    <div>Date: {new Date(order.date).toLocaleDateString()}</div>
    <div>Time: {new Date(order.date).toLocaleTimeString()}</div>
    <div>Cost: {order.cost}</div>
  </li>
))}
                  </ul>
                  <button onClick={this.handleCloseOrderHistory}>Close</button>
                </div>
              )}
          </div>
        ))}
      </div>
    );
  }
}
