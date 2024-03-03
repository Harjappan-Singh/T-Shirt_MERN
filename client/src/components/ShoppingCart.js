import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import {
  SANDBOX_CLIENT_ID,
  SERVER_HOST,
  ACCESS_LEVEL_GUEST,
} from '../config/global_constants';
import PayPalMessage from './PayPalMessage';
import '../css/ShoppingCart.css';

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
    addressSubmitted: false,
    errors: {},
    wasSubmittedAtLeastOnce: false,
  };

  componentDidMount() {
    this.loadCartItems();
  }

  loadCartItems = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsWithIds = cartItems.map((item, index) => ({
      ...item,
      id: item._id + '_' + item.size, // Unique ID based on item ID and size
    }));
    this.setState({ cartItems: cartItemsWithIds });
  };

  handleRemoveItem = (index) => {
    const updatedCartItems = [...this.state.cartItems];
    updatedCartItems.splice(index, 1);
    this.setState({ cartItems: updatedCartItems });
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  handleSizeChange = (index, newSize) => {
    const updatedCartItems = [...this.state.cartItems];
    updatedCartItems[index] = { ...updatedCartItems[index], size: newSize };
    this.setState({ cartItems: updatedCartItems });
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  updateCartHandler = (item, newQuantity) => {
    const updatedCartItems = this.state.cartItems.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });
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
    const addressData = {
      name: this.state.name,
      email: this.state.email,
      addressLine1: this.state.addressLine1,
      addressLine2: this.state.addressLine2,
      city: this.state.city,
      county: this.state.county,
      eircode: this.state.eircode,
    };

    axios
      .post('http://localhost:4000/addresses/add', addressData)
      .then((response) => {
        if (response.data.errorMessage) {
          console.log(response.data.errorMessage);
        } else console.log('Address added:', response.data);
        this.setState({ addressSubmitted: true });
      })
      .catch((error) => {
        console.error('Error adding address:', error);
      });
  };
  validateName = () => {
    return this.state.name.trim() !== '';
  };

  validateEmail = () => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(this.state.email);
  };

  validateAddressLine1 = () => {
    return this.state.addressLine1.trim() !== '';
  };

  validateCity = () => {
    return this.state.city.trim() !== '';
  };

  validateCounty = () => {
    return this.state.county !== '';
  };

  validateEircode = () => {
    const pattern =
      '\\b(?:(' +
      'a(4[125s]|6[37]|7[5s]|[8b][1-6s]|9[12468b])|' +
      'c1[5s]|' +
      'd([0o][1-9sb]|1[0-8osb]|2[024o]|6w)|' +
      'e(2[15s]|3[24]|4[15s]|[5s]3|91)|' +
      'f(12|2[368b]|3[15s]|4[25s]|[5s][26]|9[1-4])|' +
      'h(1[2468b]|23|[5s][34]|6[25s]|[79]1)|' +
      'k(3[246]|4[5s]|[5s]6|67|7[8b])|' +
      'n(3[79]|[49]1)|' +
      'p(1[247]|2[45s]|3[126]|4[37]|[5s][16]|6[17]|7[25s]|[8b][15s])|' +
      'r(14|21|3[25s]|4[25s]|[5s][16]|9[35s])|' +
      't(12|23|34|4[5s]|[5s]6)|' +
      'v(1[45s]|23|3[15s]|42|9[2-5s])|' +
      'w(12|23|34|91)|' +
      'x(3[5s]|42|91)|' +
      'y(14|2[15s]|3[45s])' +
      ')\\s?[abcdefhknoprtsvwxy\\d]{4})\\b';
    return pattern.test(this.state.eircode);
  };

  validate = () => {
    return {
      name: this.validateName(),
      email: this.validateEmail(),
      addressLine1: this.validateAddressLine1(),
      city: this.validateCity(),
      county: this.validateCounty(),
      eircode: this.validateEircode(),
    };
  };

  createOrder = (data, actions) => {
    return new Promise((resolve, reject) => {
      resolve(
        actions.order.create({
          purchase_units: [{ amount: { value: this.calculateTotalCost() } }],
        })
      );
    });
  };

  calculateTotalCost = () => {
    const shippingCost = 4; // Flat rate shipping cost
    const totalItemsCost = this.state.cartItems.reduce(
      (total, item) => total + (item.price * item.quantity || 0),
      0
    );
    return (totalItemsCost + shippingCost).toFixed(2);
  };

  onApprove = (data, actions) => {
    console.log('Payment approved:', data);
    return actions.order.capture().then((details) => {
      console.log('Payment details:', details);

      // Prepare data to be sent to the backend
      const orderData = {
        userId: '<userId>', // Replace <userId> with the actual user ID
        email: '<userEmail>', // Replace <userEmail> with the actual user's email
        items: this.state.cartItems.map((item) => ({
          itemName: item.name, // Name of the item
          quantity: item.quantity, // Quantity of the item
          price: item.price, // Price of the item
        })),
        transactionId: data.orderID, // Transaction ID provided by PayPal
        orderTime: new Date(), // Date and time when the order was placed
        totalCost: this.calculateTotalCost(), // Total cost of the order
        shippingAddress: {
          name: this.state.name, // Name
          addressLine1: this.state.addressLine1, // Address Line 1
          addressLine2: this.state.addressLine2, // Address Line 2
          city: this.state.city, // City
          county: this.state.county, // County
          eircode: this.state.eircode, // Eircode
        },
      };

      // Send a POST request to your backend API to store the order
      axios
        .post('http://localhost:4000/orders/add', orderData)
        .then((response) => {
          console.log('Order stored in database:', response.data);
          localStorage.removeItem('cart');
          this.setState({
            payPalMessageType: PayPalMessage.messageType.SUCCESS,
            payPalOrderID: data.orderID,
            redirectToPayPalMessage: true,
          });
        })
        .catch((error) => {
          console.error('Error storing order in database:', error);
          // Handle error, maybe display a message to the user
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

  render() {
    const { cartItems, errors } = this.state;
    const shippingCost = 4; // Flat rate shipping cost
    const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
    const totalCost = subtotal + shippingCost;

    return (
      
      <div className='cart-content'>
        <h2>Your Bag</h2>

    
        {cartItems.length === 0 ? (
          <div className="empty-cart-message">
            <h2>Oh no :(</h2>
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
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
              <button className="removebutton" onClick={() => this.handleRemoveItem(index)}>
                x
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
        <button className="buttonclear" onClick={this.handleClearCart}>Clear Cart</button>
        

        {localStorage.accessLevel > ACCESS_LEVEL_GUEST ||
        this.state.addressSubmitted ? (
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
            <div className="error">
              {this.state.wasSubmittedAtLeastOnce &&
                !errors.name &&
                'Name is required'}
            </div>
            <input
              name="name"
              type="text"
              placeholder="Name"
              autoComplete="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
            <div className="error">
              {this.state.wasSubmittedAtLeastOnce &&
                !errors.email &&
                'Valid email is required'}
            </div>
            <input
              name="email"
              type="text"
              placeholder="Email"
              autoComplete="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
            <div className="error">
              {this.state.wasSubmittedAtLeastOnce &&
                !errors.addressLine1 &&
                'Address Line 1 is required'}
            </div>
            <input
              name="addressLine1"
              type="text"
              placeholder="Address Line 1"
              autoComplete="addressLine1"
              value={this.state.addressLine1}
              onChange={this.handleChange}
            />
            <div className="error">
              {this.state.wasSubmittedAtLeastOnce &&
                !errors.city &&
                'City is required'}
            </div>
            <input
              name="city"
              type="text"
              placeholder="City"
              autoComplete="city"
              value={this.state.city}
              onChange={this.handleChange}
            />
            <div className="error">
              {this.state.wasSubmittedAtLeastOnce &&
                !errors.county &&
                'County is required'}
            </div>
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
            <div className="error">
              {this.state.wasSubmittedAtLeastOnce &&
                !errors.eircode &&
                'Valid Eircode is required'}
            </div>
            <input
              name="eircode"
              type="text"
              placeholder="Eircode"
              autoComplete="eircode"
              value={this.state.eircode}
              onChange={this.handleChange}
            />
            <button onClick={this.handleSubmit}>Submit</button>
            </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export default ShoppingCart;
