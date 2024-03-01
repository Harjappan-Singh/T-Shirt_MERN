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
            isRegistered: false,
            errors: {
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                selectedFile: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                county: "",
                eircode: ""
            }
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleFileChange = (e) => {
        console.log("File selected:", e.target.files[0]);
        this.setState({ selectedFile: e.target.files[0] });
    };
    validateName() {
        return this.state.name.trim() !== "";
    }

    
    handleSubmit = (e) => {
        e.preventDefault();
    
        if (!this.state.selectedFile) {
            console.error("No file was selected to be uploaded");
            return; // Abort the registration process
        }
    
        // Create FormData object to send file data
        const formData = new FormData();
        formData.append('profilePhoto', this.state.selectedFile);
    
        // First, register the user
        axios.post(`${SERVER_HOST}/users/register/${this.state.name}/${this.state.email}/${this.state.password}`, formData)
            .then((userRes) => {
                if (userRes.data && !userRes.data.errorMessage) {
                    // If user registration is successful, add address
                    const userData = userRes.data;
                    const addressData = {
                        name: this.state.name,
                        email: this.state.email,
                        addressLine1: this.state.addressLine1,
                        addressLine2: this.state.addressLine2,
                        city: this.state.city,
                        county: this.state.county,
                        eircode: this.state.eircode,
                        
                    };
                    axios.post('http://localhost:4000/addresses/add', addressData)
                    .then((addressRes) => {
                        if (addressRes.data && !addressRes.data.errorMessage) {
                            console.log("Address added successfully");
                            this.setState({ isRegistered: true });
                            localStorage.name = userData.name;
                            localStorage.accessLevel = userData.accessLevel;
                            localStorage.profilePhoto = userData.profilePhoto;
                            localStorage.token = userData.token;
                            localStorage.email = userData.email;
                        } else {
                            console.log("Address addition failed:", addressRes.data.errorMessage);
                        }
                    })
                    .catch((addressError) => {
                        console.error("Error adding address:", addressError);
                    });
            } else {
                console.log("User registration failed:", userRes.data.errorMessage);
            }
        })
        .catch((userError) => {
            console.error("Error registering user:", userError);
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

                <input
                    name="eircode"
                    type="text"
                    placeholder="Eircode"
                    autoComplete="eircode"
                    value={this.state.eircode}
                    onChange={this.handleChange}
                />
                <br />
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
