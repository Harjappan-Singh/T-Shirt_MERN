import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import LinkInClass from "../components/LinkInClass";
import { SERVER_HOST } from "../config/global_constants";

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            selectedFile: null,
            addressLine1: "",
            addressLine2: "",
            city: "",
            county: "",
            eircode: "",
            country: "",
            isRegistered: false
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleFileChange = (e) => {
        this.setState({ selectedFile: e.target.files[0] });
    };

    handleSubmit = (e) => {
        e.preventDefault();
    
        let formData = new FormData();
        if (this.state.selectedFile) {
            formData.append(
                "profilePhoto",
                this.state.selectedFile,
                this.state.selectedFile.name
            );
        }
    
        // Prepare data to send to the server
        const userData = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            addressLine1: this.state.addressLine1,
            addressLine2: this.state.addressLine2,
            city: this.state.city,
            county: this.state.county,
            eircode: this.state.eircode,
            country: this.state.country
        };
    
        axios.post(
            `${SERVER_HOST}/users/register`,
            userData,
            { headers: { "Content-type": "application/json" } } // Set headers to specify JSON content type
        ).then((res) => {
            if (res.data) {
                if (res.data.errorMessage) {
                    console.log(res.data.errorMessage);
                } else {
                    console.log("User registered and logged in");
    
                    localStorage.name = res.data.name;
                    localStorage.accessLevel = res.data.accessLevel; // You may need to adjust this based on your server response
                    localStorage.profilePhoto = res.data.profilePhoto; // You may need to adjust this based on your server response
                    localStorage.token = res.data.token;
                    localStorage.email = res.data.email;
    
                    this.setState({ isRegistered: true });
                }
            } else {
                console.log("Registration failed");
            }
        }).catch((error) => {
            console.error("Error registering user:", error);
        });
    };
    

    render() {
        return (
            <form
                className="form-container"
                noValidate={true}
                id="loginOrRegistrationForm"
            >
                {this.state.isRegistered ? (
                    <Redirect to="/DisplayTshirts" />
                ) : null}

                <h2>New User Registration</h2>

                <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    autoComplete="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    ref={(input) => {
                        this.inputToFocus = input;
                    }}
                />
                <br />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                />
                <br />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    autoComplete="password"
                    title="Password must be at least ten-digits long and contains at least one lowercase letter, one uppercase letter, one digit and one of the following characters (£!#€$%^&*)"
                    value={this.state.password}
                    onChange={this.handleChange}
                />
                <br />

                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    autoComplete="confirmPassword"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                />
                <br />

                <input
                    name="profilePhoto"
                    type="file"
                    onChange={this.handleFileChange}
                />
                <br />
                <br />

                <h2>Enter Address Details</h2>

                <input
                    name="addressLine1"
                    type="text"
                    placeholder="Address Line 1"
                    autoComplete="addressLine1"
                    value={this.state.addressLine1}
                    onChange={this.handleChange}
                />
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
                    {/* Add other county options here */}
                </select>
                <br />

                <input
                    name="eircode"
                    type="text"
                    placeholder="Eircode"
                    autoComplete="eircode"
                    value={this.state.eircode}
                    onChange={this.handleChange}
                />
                <br />

                <input
                    name="country"
                    type="text"
                    placeholder="Country"
                    autoComplete="country"
                    value={this.state.country}
                    onChange={this.handleChange}
                />
                <br />

                <LinkInClass
                    value="Register New User"
                    className="green-button"
                    onClick={this.handleSubmit}
                />
                <Link className="red-button" to={"/DisplayTshirts"}>
                    Cancel
                </Link>
            </form>
        );
    }
}
