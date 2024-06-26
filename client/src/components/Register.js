import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import LinkInClass from '../components/LinkInClass';
import { SERVER_HOST } from '../config/global_constants';
import '../css/login_registration.css';

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      selectedFile: null,
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      county: '',
      eircode: '',
      isRegistered: false,
      errors: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        selectedFile: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        county: '',
        eircode: '',
      },
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFileChange = (e) => {
    console.log('File selected:', e.target.files[0]);
    this.setState({ selectedFile: e.target.files[0] });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.validateForm()) {
      return; // Abort the registration process if validation fails
    }

    // Validate password requirements
    if (!this.isPasswordValid(this.state.password)) {
      alert('Password must be at least 6 characters long and contain at least one special character and one capital letter.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', this.state.selectedFile);
    formData.append('name', this.state.name);
    formData.append('email', this.state.email);
    formData.append('password', this.state.password);
    formData.append('dateOfBirth', this.state.dateOfBirth);
    formData.append('gender', this.state.gender);
    formData.append('phoneNumber', this.state.phoneNumber);
    formData.append('addressLine1', this.state.addressLine1);
    formData.append('addressLine2', this.state.addressLine2);
    formData.append('city', this.state.city);
    formData.append('county', this.state.county);
    formData.append('eircode', this.state.eircode);

    axios
      .post(`${SERVER_HOST}/users/register`, formData)
      .then((res) => {
        if (res.data && !res.data.errorMessage) {
          console.log('User registered successfully');
          // Handle successful registration...
          this.setState({ isRegistered: true });
        } else {
          console.log('User registration failed:', res.data.errorMessage);
          alert('Registration failed. Please try again later.');
        }
      })
      .catch((error) => {
        console.error('Error registering user:', error);
        alert('Registration failed. Please try again later.');
      });
  };

  // Password validation function
  isPasswordValid = (password) => {
    // Password must be at least 6 characters long and contain at least one special character and one capital letter
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const capitalLetterRegex = /[A-Z]/;
    return password.length >= 6 && specialCharRegex.test(password) && capitalLetterRegex.test(password);
  };

  validateForm = () => {
    const { name, email, password, confirmPassword, addressLine1, city, eircode } = this.state;
    const errors = {};

    if (!name) {
      errors.name = 'Name is required';
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!addressLine1) {
      errors.addressLine1 = 'Address Line 1 is required';
    }

    if (!city) {
      errors.city = 'City is required';
    }

    if (!eircode) {
      errors.eircode = 'Eircode is required';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  render() {
    const { errors } = this.state;

    return (
      <form className="form-container" noValidate={true} id="loginOrRegistrationForm">
        {this.state.isRegistered ? <Redirect to="/DisplayTshirts" /> : null}

        <h2>New User Registration</h2>

        <input
          name="name"
          type="text"
          placeholder="Name"
          autoComplete="name"
          value={this.state.name}
          onChange={this.handleChange}
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
        <br />

        <input
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
        <br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          value={this.state.password}
          onChange={this.handleChange}
        />
        {errors.password && <div className="error-message">{errors.password}</div>}
        <br />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
          value={this.state.confirmPassword}
          onChange={this.handleChange}
        />
        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        <br />

        <input name="profilePhoto" type="file" onChange={this.handleFileChange} />
        <br />

        <h2>Personal Information</h2>

        <input
          name="dateOfBirth"
          type="date"
          placeholder="Date of Birth"
          value={this.state.dateOfBirth}
          onChange={this.handleChange}
        />
        <br />

        <select
          name="gender"
          value={this.state.gender}
          onChange={this.handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <br />

        <input
          name="phoneNumber"
          type="tel"
          placeholder="Phone Number"
          autoComplete="tel"
          value={this.state.phoneNumber}
          onChange={this.handleChange}
        />
        <br />

        <h2>Address</h2>

        <input
          name="addressLine1"
          type="text"
          placeholder="Address Line 1"
          value={this.state.addressLine1}
          onChange={this.handleChange}
        />
        {errors.addressLine1 && <div className="error-message">{errors.addressLine1}</div>}
        <br />

        <input
          name="addressLine2"
          type="text"
          placeholder="Address Line 2"
          value={this.state.addressLine2}
          onChange={this.handleChange}
        />
        <br />

        <input
          name="city"
          type="text"
          placeholder="City"
          value={this.state.city}
          onChange={this.handleChange}
        />
        {errors.city && <div className="error-message">{errors.city}</div>}
        <br />

        <select
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
          value={this.state.eircode}
          onChange={this.handleChange}
        />
        {errors.eircode && <div className="error-message">{errors.eircode}</div>}
        <br />

        <LinkInClass
          value="Register New User"
          className="green-button"
          onClick={this.handleSubmit}
        />
        <Link className="red-button" to={'/DisplayTshirts'}>
          Cancel
        </Link>
      </form>
    );
  }
}
