import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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
            sizes: [],
            price: "",
            countInStock: "",
            wasSubmittedAtLeastOnce: false,
            errorMessage: "",
            errors: {
                brand: "",
                name: "",
                description: "",
                category: "",
                type: "",
                color: "",
                price: "",
                countInStock: ""
            }
        };
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/tshirts/${this.props.match.params.id}`, { headers: { "authorization": localStorage.token } })
        .then(res => {
            if (res.data) {
                if (res.data.errorMessage) {
                    this.setState({ errorMessage: res.data.errorMessage });
                } else {
                    this.setState({ 
                        brand: res.data.brand,
                        name: res.data.name,
                        description: res.data.description,
                        category: res.data.category,
                        type: res.data.type,
                        color: res.data.color,
                        sizes: res.data.sizes,
                        price: res.data.price,
                        countInStock: res.data.countInStock
                    });
                }
            } else {
                console.log(`Record not retrieved`);
            }
        })
        .catch(error => {
            console.error("Error retrieving record:", error);
        });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSizeChange = (e) => {
        const { value } = e.target;
        const { sizes } = this.state;

        if (sizes.includes(value)) {
            this.setState((prevState) => ({
                sizes: prevState.sizes.filter((size) => size !== value),
            }));
        } else {
            this.setState((prevState) => ({
                sizes: [...prevState.sizes, value],
            }));
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        
        this.setState({ wasSubmittedAtLeastOnce: true });
        
        const validationResult = this.validate();
        
        if (validationResult.isValid) {
            const tshirtObject = {
                brand: this.state.brand,
                name: this.state.name,
                description: this.state.description,
                category: this.state.category,
                type: this.state.type,
                color: this.state.color,
                sizes: this.state.sizes,
                price: this.state.price,
                countInStock: this.state.countInStock
            };
          
            axios.put(`${SERVER_HOST}/tshirts/${this.props.match.params.id}`, tshirtObject, { headers: { "authorization": localStorage.token } })
            .then(res => {
                if (res.data) {
                    if (res.data.errorMessage) {
                        this.setState({ errorMessage: res.data.errorMessage });
                    } else {
                        console.log(`Record updated`);
                        this.props.history.push("/DisplayTshirts");
                    }
                } else {
                    console.log(`Record not updated`);
                }
            })
            .catch(error => {
                console.error("Error updating record:", error);
            });
        } else {
            this.setState({ errors: validationResult.errors });
        }
    }

    validateBrand() {
        return this.state.brand.trim() !== "";
    }

    validateName() {
        return this.state.name.trim() !== '';
    }

    validateDescription() {
        return this.state.description.trim() !== '';
    }

    validateCategory() {
        return this.state.category.trim() !== '';
    }

    validateType() {
        return this.state.type.trim() !== '';
    }

    validateColor() {
        return this.state.color.trim() !== '';
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
        const errors = {
            brand: this.validateBrand() ? '' : 'Brand is required',
            name: this.validateName() ? '' : 'Name is required',
            description: this.validateDescription() ? '' : 'Description is required',
            category: this.validateCategory() ? '' : 'Category is required',
            type: this.validateType() ? '' : 'Type is required',
            color: this.validateColor() ? '' : 'Color is required',
            price: this.validatePrice() ? '' : 'Price must be a positive number',
            countInStock: this.validateCountInStock()
                ? ''
                : 'Stock must be a non-negative integer',
        };

        return {
            isValid: Object.values(errors).every((error) => error === ''),
            errors,
        };
    }

    render() {
        const { wasSubmittedAtLeastOnce, errorMessage, errors } = this.state;

        return (
            <div className="form-container">
                <form onSubmit={this.handleSubmit}>
                    {errorMessage && <div className="error">{errorMessage}</div>}
                    <div>
                        <label>Brand</label>
                        <input ref={(input) => { this.inputToFocus = input; }} type="text" name="brand" value={this.state.brand} onChange={this.handleChange} />
                        {wasSubmittedAtLeastOnce && errors.brand && <span className="error-message">{errors.brand}</span>}
                    </div>
                    <div>
                        <label>Name</label>
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                        {wasSubmittedAtLeastOnce && errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                    <div>
                        <label>Description</label>
                        <input type="text" name="description" value={this.state.description} onChange={this.handleChange} />
                        {wasSubmittedAtLeastOnce && errors.description && <span className="error-message">{errors.description}</span>}
                    </div>
                    <div>
                        <label>Category</label>
                        <input type="text" name="category" value={this.state.category} onChange={this.handleChange} />
                        {wasSubmittedAtLeastOnce && errors.category && <span className="error-message">{errors.category}</span>}
                    </div>
                    <div>
                        <label>Type</label>
                        <input type="text" name="type" value={this.state.type} onChange={this.handleChange} />
                        {wasSubmittedAtLeastOnce && errors.type && <span className="error-message">{errors.type}</span>}
                    </div>
                    <div>
                        <label>Color</label>
                        <input type="text" name="color" value={this.state.color} onChange={this.handleChange} />
                        {wasSubmittedAtLeastOnce && errors.color && <span className="error-message">{errors.color}</span>}
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
                        {wasSubmittedAtLeastOnce && errors.price && <span className="error-message">{errors.price}</span>}
                    </div>
                    <div>
                        <label>Stock</label>
                        <input type="text" name="countInStock" value={this.state.countInStock} onChange={this.handleChange} />
                        {wasSubmittedAtLeastOnce && errors.countInStock && <span className="error-message">{errors.countInStock}</span>}
                    </div>

                    <button type="submit" className="green-button">Update</button>

                    <Link className="red-button" to={"/DisplayTshirts"}>Cancel</Link>
                </form>
            </div>
        );
    }
}
