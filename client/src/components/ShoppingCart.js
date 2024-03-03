import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { SANDBOX_CLIENT_ID, SERVER_HOST, ACCESS_LEVEL_GUEST,
} from '../config/global_constants';
import PayPalMessage from './PayPalMessage';

class ShoppingCart extends Component {
  state = {
    cartItems: [],
    redirectToPayPalMessage: false,
    payPalMessageType: null,
    payPalOrderID: null,
    name: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    eircode: '',
    errors: {
      name: '',
      email: '',
      addressLine1: '',
      city: '',
      eircode: ''
    }
  };

  componentDidMount() {
    this.loadCartItems();
  }

  loadCartItems = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    this.setState({ cartItems });
  };

  handleRemoveItem = (index) => {
    const updatedCartItems = [...this.state.cartItems];
    updatedCartItems.splice(index, 1);
    this.setState({ cartItems: updatedCartItems });
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  handleSizeChange = (index, newSize) => {
    const updatedCartItems = [...this.state.cartItems];
    updatedCartItems[index].size = newSize;
    this.setState({ cartItems: updatedCartItems });
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  handleClearCart = () => {
    this.setState({ cartItems: [] });
    localStorage.removeItem('cart');
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    if (!this.validateForm()) {
      return; 
    }

    // If validation passes, proceed with form submission
    const addressData = {
      name: this.state.name,
      email: this.state.email,
      addressLine1: this.state.addressLine1,
      city: this.state.city,
      eircode: this.state.eircode
    };


    axios
      .post(`${SERVER_HOST}/addresses/add`, addressData)
      .then((response) => {
        console.log('Address added:', response.data);

        this.setState({ addressSubmitted: true });
      })
      .catch((error) => {
        console.error('Error adding address:', error);
      });
  };

  createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: this.calculateTotalCost() } }],
    });
  };

  calculateTotalCost = () => {
    const shippingCost = 4; // Flat rate shipping cost
    const subtotal = this.state.cartItems.reduce(
      (total, item) => total + item.price,
      0
    );
    return (subtotal + shippingCost).toFixed(2);
  };

  onApprove = (data, actions) => {
    const userDetails = JSON.parse(localStorage.getItem('userInfo'));
    console.log('Payment approved:', data);
    return actions.order.capture().then((details) => {
      console.log('Payment details:', details);
      this.setState({
        payPalMessageType: PayPalMessage.messageType.SUCCESS,
        payPalOrderID: data.orderID,
        redirectToPayPalMessage: true,
      });

      // Prepare the data to be sent to the backend
      const orderData = {
        email: userDetails.email, // Assuming userDetails contains the user's email
        items: this.state.cartItems.map((item) => ({
          itemName: item.name, // Assuming each item in cartItems has a name property
          quantity: item.quantity, // Assuming each item in cartItems has a quantity property
          price: item.price, // Assuming each item in cartItems has a price property
        })),
        transactionId: data.orderID, // Assuming orderID is the transaction ID
        orderTime: new Date().toISOString(), // Current time as the order time
        totalCost: this.state.cartItems.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        ), // Calculate total cost based on cartItems
        shippingAddress: {
          name: userDetails.fullName, 
          addressLine1: '123 Main St', 
          addressLine2: '', 
          city: 'City', 
          county: 'County', 
          eircode: '12345', 
        },
      };

      localStorage.removeItem('cart');
      console.log(orderData);

      // Make an HTTP POST request to the backend
      axios
        .post(`${SERVER_HOST}/orders/add`, orderData)
        .then((response) => {
          console.log('Order added successfully:', response.data);
          // Handle any further actions after successful order addition
        })
        .catch((error) => {
          console.error('Error adding order:', error);
          // Handle error cases
        });
    });
  };

  onError = (err) => {
    console.error('PayPal error:', err);
    this.setState({
      payPalMessageType: PayPalMessage.messageType.ERROR,
      redirectToPayPalMessage: true,
    });
  };

  onCancel = (data) => {
    console.log('Payment cancelled:', data);
    this.setState({
      payPalMessageType: PayPalMessage.messageType.CANCEL,
      redirectToPayPalMessage: true,
    });
  };
  validateForm = () => {
    const { name, email, addressLine1, city, eircode } = this.state;
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Name is required';
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!addressLine1.trim()) {
      errors.addressLine1 = 'Address Line 1 is required';
    }

    if (!city.trim()) {
      errors.city = 'City is required';
    }

    if (!eircode.trim()) {
      errors.eircode = 'Eircode is required';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };


  render() {
    const { errors, cartItems } = this.state;

    const shippingCost = 4; // Flat rate shipping cost
    const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
    const totalCost = subtotal + shippingCost;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const accessLevel = userInfo ? userInfo.accessLevel : 0;

    return (
      <div>
        <h2>Shopping Cart</h2>
        <ul>
          {cartItems.map((item, index) => (
            <li key={index}>
              <p>
                <strong>Name:</strong> {item.name}
              </p>
              <p>
                <strong>Brand:</strong> {item.brand}
              </p>
              <p>
                <strong>Price:</strong> €{item.price}
              </p>
              <select
                value={item.size}
                onChange={(e) => this.handleSizeChange(index, e.target.value)}
              >
                <option value="">Select Size</option>
                {item.sizes.map((size, sizeIndex) => (
                  <option key={sizeIndex} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <button onClick={() => this.handleRemoveItem(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div>
          <p>
            <strong>Subtotal:</strong> €{subtotal.toFixed(2)}
          </p>
          <p>
            <strong>Shipping Cost:</strong> €{shippingCost.toFixed(2)}
          </p>
          <p>
            <strong>Total Cost (including shipping):</strong> €
            {totalCost.toFixed(2)}
          </p>
        </div>
        <button onClick={this.handleClearCart}>Clear Cart</button>

        {accessLevel > ACCESS_LEVEL_GUEST || this.state.addressSubmitted ? (
          <div>
            {this.state.redirectToPayPalMessage && (
              <Redirect
                to={`/PayPalMessage/${this.state.payPalMessageType}/${this.state.payPalOrderID}`}
              />
            )}
            <PayPalScriptProvider
              options={{ currency: 'EUR', 'client-id': SANDBOX_CLIENT_ID }}
            >
              <PayPalButtons
                style={{ layout: 'horizontal' }}
                createOrder={this.createOrder}
                onApprove={this.onApprove}
                onError={this.onError}
                onCancel={this.onCancel}
              />
            </PayPalScriptProvider>
          </div>
        ) : (
          <div>
            <h2>Enter Address Details</h2>
            <input
          name="name"
          type="text"
          placeholder="Name"
          autoComplete="name"
          value={this.state.name}
          onChange={this.handleChange}
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
        <br />
            <input
          name="email"
          type="text"
          placeholder="Email"
          autoComplete="email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
        <br />
            <input
          name="addressLine1"
          type="text"
          placeholder="Address Line 1"
          autoComplete="addressLine1"
          value={this.state.addressLine1}
          onChange={this.handleChange}
        />
        {errors.addressLine1 && <div className="error-message">{errors.addressLine1}</div>}
        <br />
            <input
              name="addressLine2"
              type="text"
              placeholder="Address Line 2"
              autoComplete="addressLine2"
              value={this.state.addressLine2}
              onChange={this.handleChange}
            />
            <br />
            <input
          name="city"
          type="text"
          placeholder="City"
          autoComplete="city"
          value={this.state.city}
          onChange={this.handleChange}
        />
        {errors.city && <div className="error-message">{errors.city}</div>}
        <br />

            <select
              id="county-dropdown"
              name="county"
              value={this.state.county}
              onChange={this.handleChange}
            >
              <option value="">Select County</option>
              <option value="Antrim">Antrim</option>
              <option value="Armagh">Armagh</option>
              <option value="Carlow">Carlow</option>
              <option value="Cavan">Cavan</option>
              <option value="Clare">Clare</option>
              <option value="Cork">Cork</option>
              <option value="Derry">Derry</option>
              <option value="Donegal">Donegal</option>
              <option value="Down">Down</option>
              <option value="Dublin">Dublin</option>
              <option value="Fermanagh">Fermanagh</option>
              <option value="Galway">Galway</option>
              <option value="Kerry">Kerry</option>
              <option value="Kildare">Kildare</option>
              <option value="Kilkenny">Kilkenny</option>
              <option value="Laois">Laois</option>
              <option value="Leitrim">Leitrim</option>
              <option value="Limerick">Limerick</option>
              <option value="Longford">Longford</option>
              <option value="Louth">Louth</option>
              <option value="Mayo">Mayo</option>
              <option value="Meath">Meath</option>
              <option value="Monaghan">Monaghan</option>
              <option value="Offaly">Offaly</option>
              <option value="Roscommon">Roscommon</option>
              <option value="Sligo">Sligo</option>
              <option value="Tipperary">Tipperary</option>
              <option value="Tyrone">Tyrone</option>
              <option value="Waterford">Waterford</option>
              <option value="Westmeath">Westmeath</option>
              <option value="Wexford">Wexford</option>
              <option value="Wicklow">Wicklow</option>
            </select>
            <br />
            <input
          name="eircode"
          type="text"
          placeholder="Eircode"
          value={this.state.eircode}
          onChange={this.handleChange}
        />
        {errors.eircode && <div className="error-message">{errors.eircode}</div>}
        <br />
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        )}
      </div>
    );
  }
}

export default ShoppingCart;
