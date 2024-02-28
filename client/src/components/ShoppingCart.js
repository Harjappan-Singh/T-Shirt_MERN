import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { SANDBOX_CLIENT_ID, SERVER_HOST } from '../config/global_constants';
import PayPalMessage from './PayPalMessage';
import '../css/ShoppingCart.css';

class ShoppingCart extends Component {
  state = {
    cartItems: [],
    redirectToPayPalMessage: false,
    payPalMessageType: null,
    payPalOrderID: null,
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

  createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: this.calculateTotalCost() } }],
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
      // Send purchase data to server
      const purchaseData = {
        orderID: data.orderID,
        items: this.state.cartItems,
        totalAmount: this.calculateTotalCost(),
        // Include any other relevant data here
      };
      axios
        .post(`${SERVER_HOST}/track-purchase`, purchaseData)
        .then((response) => {
          console.log('Purchase tracked successfully:', response.data);
          // Clear cart after successful purchase tracking
          localStorage.removeItem('cart');
          this.setState({
            payPalMessageType: PayPalMessage.messageType.SUCCESS,
            payPalOrderID: data.orderID,
            redirectToPayPalMessage: true,
          });
        })
        .catch((error) => {
          console.error('Error tracking purchase:', error);
          this.setState({
            payPalMessageType: PayPalMessage.messageType.ERROR,
            redirectToPayPalMessage: true,
          });
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
    const { cartItems } = this.state;
    const shippingCost = 4; // Flat rate shipping cost
    const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
    const totalCost = subtotal + shippingCost;

    return (
      <div className="shopping-cart">
        <h1 className="shopping-cart-title">Shopping Cart</h1>
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <p>
                  Cart is empty. <Link to="/">Go Shopping</Link>
                </p>
              </div>
            ) : (
              <ul className="cart-items-list">
                {cartItems.map((item, index) => (
                  <li key={index} className="cart-item">
                    <div className="item-details">
                      <img
                        src={item.productImage}
                        alt={item.name}
                        className="item-image"
                      />
                      <div className="item-info">
                        <Link
                          to={`/product/${item.slug}`}
                          className="item-name"
                        >
                          {item.name}
                        </Link>
                        <select
                          value={item.size}
                          onChange={(e) =>
                            this.handleSizeChange(index, e.target.value)
                          }
                          className="item-size-selector"
                        >
                          <option value="">Select Size</option>
                          {item.sizes.map((size, sizeIndex) => (
                            <option key={sizeIndex} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="item-actions">
                      <p className="item-price">${item.price}</p>

                      <div className="quantity-controls">
                        <button
                          onClick={() => this.handleRemoveItem(index)}
                          className="remove-button"
                        >
                          <span className="material-icons-outlined">
                            delete
                          </span>
                        </button>
                        <button
                          className="action-button decrease-button"
                          onClick={() =>
                            this.updateCartHandler(item, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                        >
                          <span className="material-icons-outlined">
                            remove
                          </span>
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="action-button increase-button"
                          onClick={() =>
                            this.updateCartHandler(item, item.quantity + 1)
                          }
                          disabled={item.quantity === item.countInStock}
                        >
                          <span className="material-icons-outlined">add</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="cart-summary">
            <div className="subtotal">
              <p className="subtotal-text">Subtotal: ${subtotal.toFixed(2)}</p>
            </div>
            <div className="shipping">
              <p className="shipping-text">
                Shipping Cost: ${shippingCost.toFixed(2)}
              </p>
            </div>
            <div className="total">
              <p className="total-text">
                Total Cost (including shipping): ${this.calculateTotalCost()}
              </p>
            </div>
            <div className="clear-cart">
              <button
                onClick={this.handleClearCart}
                className="clear-cart-button"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
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
    );
  }
}

export default ShoppingCart;
