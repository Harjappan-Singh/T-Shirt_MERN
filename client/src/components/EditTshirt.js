import React, { Component } from "react";
import Form from "react-bootstrap/Form";
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
                <Form onSubmit={this.handleSubmit}>
                    {errorMessage}
                    <Form.Group controlId="brand">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control ref={(input) => { this.inputToFocus = input; }} type="text" name="brand" value={this.state.brand} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" name="description" value={this.state.description} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control type="text" name="category" value={this.state.category} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="type">
                        <Form.Label>Type</Form.Label>
                        <Form.Control type="text" name="type" value={this.state.type} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="color">
                        <Form.Label>Color</Form.Label>
                        <Form.Control type="text" name="color" value={this.state.color} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="sizes">
                    <Form.Label>Sizes</Form.Label>
                        <Form.Check type="checkbox" label="XXS" name="sizes" value="XXS" checked={this.state.sizes.includes("XXS")} onChange={this.handleSizeChange} />
                        <Form.Check type="checkbox" label="XS" name="sizes" value="XS" checked={this.state.sizes.includes("XS")} onChange={this.handleSizeChange} />
                        <Form.Check type="checkbox" label="S" name="sizes" value="S" checked={this.state.sizes.includes("S")} onChange={this.handleSizeChange} />
                        <Form.Check type="checkbox" label="M" name="sizes" value="M" checked={this.state.sizes.includes("M")} onChange={this.handleSizeChange} />
                        <Form.Check type="checkbox" label="L" name="sizes" value="L" checked={this.state.sizes.includes("L")} onChange={this.handleSizeChange} />
                        <Form.Check type="checkbox" label="XL" name="sizes" value="XL" checked={this.state.sizes.includes("XL")} onChange={this.handleSizeChange} />
                        <Form.Check type="checkbox" label="XXL" name="sizes" value="XXL" checked={this.state.sizes.includes("XXL")} onChange={this.handleSizeChange} />
                        <Form.Check type="checkbox" label="XXXL" name="sizes" value="XXXL" checked={this.state.sizes.includes("XXXL")} onChange={this.handleSizeChange} />
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" name="price" value={this.state.price} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group controlId="countInStock">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control type="text" name="countInStock" value={this.state.countInStock} onChange={this.handleChange} />
                    </Form.Group>

                    <LinkInClass value="Update" className="green-button" onClick={this.handleSubmit}/>  
                    
                    <Link className="red-button" to={"/DisplayTshirts"}>Cancel</Link>
                </Form>
            </div>
        );
    }
}
