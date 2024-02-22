import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Form from "react-bootstrap/Form";

import axios from "axios";

import LinkInClass from "../components/LinkInClass";

import { ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../config/global_constants";

export default class AddTshirt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            brand: "",
            name: "",
            description: "",
            category: "",
            type: "",
            color: "",
            sizes: "",
            price: "",
            selectedFiles: null,
            redirectToDisplayAllTshirts: localStorage.accessLevel < ACCESS_LEVEL_ADMIN
        };
    }

    componentDidMount() {
        this.inputToFocus.focus();
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleFileChange = (e) => {
        this.setState({ selectedFiles: e.target.files });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("brand", this.state.brand);
        formData.append("name", this.state.name);
        formData.append("description", this.state.description);
        formData.append("category", this.state.category);
        formData.append("type", this.state.type);
        formData.append("color", this.state.color);
        formData.append("sizes", this.state.sizes);
        formData.append("price", this.state.price);

        if (this.state.selectedFiles) {
            for (let i = 0; i < this.state.selectedFiles.length; i++) {
                formData.append("tshirtPhotos", this.state.selectedFiles[i]);
            }
        }

        axios.post(`${SERVER_HOST}/tshirts`, formData, { headers: { "authorization": localStorage.token, "Content-type": "multipart/form-data" } })
            .then(res => {
                if (res.data) {
                    if (res.data.errorMessage) {
                        console.log(res.data.errorMessage);
                    } else {
                        console.log("Record added");
                        this.setState({ redirectToDisplayAllTshirts: true });
                    }
                } else {
                    console.log("Record not added");
                }
            });
    };

    render() {
        return (
            <div className="form-container">
                {this.state.redirectToDisplayAllTshirts ? <Redirect to="/DisplayAllTshirts" /> : null}

                <Form>
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
                        <Form.Control type="text" name="sizes" value={this.state.sizes} onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="text" name="price" value={this.state.price} onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="photos">
                        <Form.Label>Photos</Form.Label>
                        <Form.Control type="file" multiple onChange={this.handleFileChange} />
                    </Form.Group> <br /><br />

                    <LinkInClass value="Add" className="green-button" onClick={this.handleSubmit} />

                    <Link className="red-button" to={"/DisplayTshirts"}>Cancel</Link>
                </Form>
            </div>
        );
    }
}
