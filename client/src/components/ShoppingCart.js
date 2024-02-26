import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { SANDBOX_CLIENT_ID, SERVER_HOST } from "../config/global_constants";
import PayPalMessage from "./PayPalMessage";

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

  // onApprove = (data, actions) => {
  //     console.log("Payment approved:", data);
  //     return actions.order.capture().then(details => {
  //         console.log("Payment details:", details);
  //         localStorage.removeItem("cart");
  //         this.setState({
  //             payPalMessageType: PayPalMessage.messageType.SUCCESS,
  //             payPalOrderID: data.orderID,
  //             redirectToPayPalMessage: true
  //         });
  //     });
  // }

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
