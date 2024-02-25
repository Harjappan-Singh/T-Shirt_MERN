import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import LinkInClass from "../components/LinkInClass";
import { SERVER_HOST } from "../config/global_constants";

export default class EditTshirt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            brand: "",
            name: "",
            description: "",
            category: "",
            type: "",
            color: "",
            product_image: "",
            sizes: [],
            price: "",
            countInStock:"", 
            rating: "",
            redirectToDisplayAllTshirts: false,
            wasSubmittedAtLeastOnce: false,
            errorMessage: ""
        };
    }

    componentDidMount() {
        this.inputToFocus.focus();

        axios.get(`${SERVER_HOST}/tshirts/${this.props.match.params.id}`)
            .then(res => {
                if (res.data) {
                    if (res.data.errorMessage) {
                        console.log(res.data.errorMessage);
                    } else {
                        this.setState({
                            brand: res.data.brand,
                            name: res.data.name,
                            description: res.data.description,
                            category: res.data.category,
                            type: res.data.type,
                            color: res.data.color,
                            product_image: res.data.product_image,
                            sizes: res.data.sizes,
                            price: res.data.price,
                            countInStock: res.data.countInStock,
                        });
                    }
                } else {
                    console.log(`Record not found`);
                }
            });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    handleSizeChange = (e) => {
        const { value } = e.target;
        const { sizes } = this.state;

        // Toggle the selected size
        if (sizes.includes(value)) {
            this.setState(prevState => ({
                sizes: prevState.sizes.filter(size => size !== value)
            }));
        } else {
            this.setState(prevState => ({
                sizes: [...prevState.sizes, value]
            }));
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({ wasSubmittedAtLeastOnce: true });

        const formInputsState = this.validate();

        if (Object.keys(formInputsState).every(index => formInputsState[index])) {
            const tshirtObject = {
                brand: this.state.brand,
                name: this.state.name,
                description: this.state.description,
                category: this.state.category,
                type: this.state.type,
                color: this.state.color,
                product_image: this.state.product_image,
                sizes: this.state.sizes,
                price: this.state.price,
                countInStock: this.state.countInStock
            };

            axios.put(`${SERVER_HOST}/tshirts/${this.props.match.params.id}`, tshirtObject)
                .then(res => {
                    if (res.data) {
                        if (res.data.errorMessage) {
                            console.log(res.data.errorMessage);
                        } else {
                            console.log(`Record updated`);
                            this.setState({ redirectToDisplayAllTshirts: true });
                        }
                    } else {
                        console.log(`Record not updated`);
                    }
                });
        }
    }

    validateBrand() {
        return this.state.brand.trim() !== "";
    }

    validateName() {
        return this.state.name.trim() !== "";
    }

    validateDescription() {
        return this.state.description.trim() !== "";
    }

    validateCategory() {
        return this.state.category.trim() !== "";
    }

    validateType() {
        return this.state.type.trim() !== "";
    }

    validateColor() {
        return this.state.color.trim() !== "";
    }

    validatePrice() {
        const price = parseFloat(this.state.price);
        return !isNaN(price) && price >= 0; 
    }

    validateCountInStock() {
        const countInStock = parseInt(this.state.countInStock);
        return countInStock >= 0 && Number.isInteger(countInStock);
    }

    validate() {
        return {
            brand: this.validateBrand(),
            name: this.validateName(),
            description: this.validateDescription(),
            category: this.validateCategory(),
            type: this.validateType(),
            color: this.validateColor(),
            price: this.validatePrice(),
            countInStock: this.validateCountInStock()
        };
    }

    render() {
        let errorMessage = "";
        if (this.state.wasSubmittedAtLeastOnce) {
            errorMessage = <div className="error">T-shirt details are incorrect<br /></div>;
        }
        return (
            <div className="form-container">
                {this.state.redirectToDisplayAllTshirts ? <Redirect to="/DisplayTshirts"/> : null}  
                <form onSubmit={this.handleSubmit}>
                    {errorMessage}
                    <div>
                        <label>Brand</label>
                        <input ref={(input) => { this.inputToFocus = input; }} type="text" name="brand" value={this.state.brand} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Name</label>
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Description</label>
                        <input type="text" name="description" value={this.state.description} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Category</label>
                        <input type="text" name="category" value={this.state.category} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Type</label>
                        <input type="text" name="type" value={this.state.type} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Color</label>
                        <input type="text" name="color" value={this.state.color} onChange={this.handleChange} />
                    </div>
                    <div>
    <label>Sizes</label>
    <label> <input type="checkbox" name="sizes" value="XXS" checked={this.state.sizes.includes("XXS")} onChange={this.handleSizeChange} />   XXS </label>
    <label> <input type="checkbox" name="sizes" value="XS" checked={this.state.sizes.includes("XS")} onChange={this.handleSizeChange} /> XS </label>
    <label> <input type="checkbox" name="sizes" value="S" checked={this.state.sizes.includes("S")} onChange={this.handleSizeChange} /> S </label>
    <label> <input type="checkbox" name="sizes" value="M" checked={this.state.sizes.includes("M")} onChange={this.handleSizeChange} /> M </label>
    <label> <input type="checkbox" name="sizes" value="L" checked={this.state.sizes.includes("L")} onChange={this.handleSizeChange} /> L </label>
    <label><input type="checkbox" name="sizes" value="XL" checked={this.state.sizes.includes("XL")} onChange={this.handleSizeChange} /> XL </label>
    <label><input type="checkbox" name="sizes" value="XXL" checked={this.state.sizes.includes("XXL")} onChange={this.handleSizeChange} /> XXL </label>
    <label><input type="checkbox" name="sizes" value="XXXL" checked={this.state.sizes.includes("XXXL")} onChange={this.handleSizeChange} /> XXXL </label>
</div>
                    <div>
                        <label>Price</label>
                        <input type="text" name="price" value={this.state.price} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label>Stock</label>
                        <input type="text" name="countInStock" value={this.state.countInStock} onChange={this.handleChange} />
                    </div>

                    <LinkInClass value="Update" className="green-button" onClick={this.handleSubmit}/>  
                    
                    <Link className="red-button" to={"/DisplayTshirts"}>Cancel</Link>
                </form>
            </div>
        );
    }
}
