import React, { Component } from "react";
import {SANDBOX_CLIENT_ID, SERVER_HOST} from "../config/global_constants"
import PayPalMessage from "./PayPalMessage"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default class ShoppingCart extends Component {
    state = {
        cartItems: []
    };

    componentDidMount() {
        this.loadCartItems();
    }

    loadCartItems = () => {
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        this.setState({ cartItems });
    }

    handleRemoveItem = (index) => {
        const { cartItems } = this.state;
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        this.setState({ cartItems: updatedCartItems });
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    }

    handleSizeChange = (index, newSize) => {
        const { cartItems } = this.state;
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].size = newSize;
        this.setState({ cartItems: updatedCartItems });
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    }

    handleClearCart = () => {
        this.setState({ cartItems: [] });
        localStorage.removeItem("cart");
    }

    render() {
        const { cartItems } = this.state;
        const shippingCost = 4; // Flat rate shipping cost

        // Calculate subtotal
        const subtotal = cartItems.reduce((total, item) => total + item.price, 0);

        // Calculate total cost including shipping
        const totalCost = subtotal + shippingCost;

        return (
            <div>
                <h2>Shopping Cart</h2>
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index}>
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>Brand:</strong> {item.brand}</p>
                            <p><strong>Price:</strong> €{item.price}</p>
                            <select value={item.size} onChange={(e) => this.handleSizeChange(index, e.target.value)}>
                                <option value="">Select Size</option>
                                {item.sizes.map((size, sizeIndex) => (
                                    <option key={sizeIndex} value={size}>{size}</option>
                                ))}
                            </select>
                            <button onClick={() => this.handleRemoveItem(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <div>
                    <p><strong>Subtotal:</strong> €{subtotal.toFixed(2)}</p>
                    <p><strong>Shipping Cost:</strong> €{shippingCost.toFixed(2)}</p>
                    <p><strong>Total Cost (including shipping):</strong> €{totalCost.toFixed(2)}</p>
                </div>
                <button onClick={this.handleClearCart}>Clear Cart</button>

                <div>
                <PayPalScriptProvider options={{currency:"EUR", "client-id":SANDBOX_CLIENT_ID }}>
                    <PayPalButtons style={{layout: "horizontal"}} createOrder={this.createOrder} onApprove={this.onApprove} onError={this.onError} onCancel={this.onCancel}/>
                </PayPalScriptProvider>
            </div>
            </div>
            
        );
    }
}
