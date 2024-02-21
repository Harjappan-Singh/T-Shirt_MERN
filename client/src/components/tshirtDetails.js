import React, { Component } from "react";

export default class TshirtDetails extends Component {
    state = {
        quantity: 1,
        selectedSize: "" 
    };

    addToCart = () => {
        const { tshirt } = this.props.location.state;
        const { quantity, selectedSize } = this.state;

        if (!selectedSize) {
            alert("Please select a size!");
            return;
        }

        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

        for (let i = 0; i < quantity; i++) {
            cartItems.push({ ...tshirt, size: selectedSize });
        }

        localStorage.setItem("cart", JSON.stringify(cartItems));

        alert(`${quantity} T-shirt(s) added to cart!`);
    };

    handleQuantityChange = (e) => {
        this.setState({ quantity: parseInt(e.target.value) || 1 }); 
    };

    handleSizeChange = (e) => {
        this.setState({ selectedSize: e.target.value }); 
    };

    removeFromCart = () => {
        const { tshirt } = this.props.location.state;
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    
        const updatedCartItems = cartItems.filter(item => {
           
            return item.name !== tshirt.name || item.brand !== tshirt.brand || item.color !== tshirt.color || item.price !== tshirt.price || item.sizes.join(",") !== tshirt.sizes.join(",");
        });
    
        localStorage.setItem("cart", JSON.stringify(updatedCartItems)); 
        alert("T-shirt removed from cart!");
    };
    
    render() {
        const { tshirt } = this.props.location.state; 
        const { quantity, selectedSize } = this.state;

        return (
            <div>
                <h2>{tshirt.name}</h2>
                <p><strong>Brand:</strong> {tshirt.brand}</p>
                <p><strong>Description:</strong> {tshirt.description}</p>
                <p><strong>Category:</strong> {tshirt.category}</p>
                <p><strong>Color:</strong> {tshirt.color}</p>
                <p><strong>Sizes:</strong> {tshirt.sizes.join(", ")}</p>
                <p><strong>Cost:</strong> €{tshirt.price}</p>
                <p><strong>Rating:</strong> {tshirt.rating}</p>
                
                <label >Quantity:</label>
                <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={this.handleQuantityChange}
                />

                <label >Size:</label>
                <select id="size" value={selectedSize} onChange={this.handleSizeChange}>
                    <option value="">Select Size</option>
                    {tshirt.sizes.map((size, index) => (
                        <option key={index} value={size}>{size}</option>
                    ))}
                </select>

                <button className="blue-button" onClick={this.addToCart}>Add to Cart</button>
                <button onClick={this.removeFromCart}>Remove</button>
            </div>
        );
    }
}
