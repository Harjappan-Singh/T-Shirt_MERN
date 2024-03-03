import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

import LinkInClass from '../components/LinkInClass';
import { SERVER_HOST } from '../config/global_constants';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      isLoggedIn: false,
      errors: {
        email: '',
        password: '',
      },
      loginError: '', // New state variable for login error message
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.validateForm()) {
      axios
        .post(`${SERVER_HOST}/users/login/${this.state.email}/${this.state.password}`)
        .then((res) => {
          if (res.data && !res.data.errorMessage) {
            const userInfo = {
              name: res.data.name,
              email: res.data.email,
              accessLevel: res.data.accessLevel,
              profilePhoto: res.data.profilePhoto,
              token: res.data.token,
            };
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            this.setState({
              isLoggedIn: true,
              userInfo: userInfo,
            });
          } else {
            this.setState({ loginError: res.data.errorMessage || 'Login failed' });
          }
        })
        .catch((error) => {
          console.error('Error logging in:', error);
          this.setState({ loginError: 'An error occurred while logging in' });
        });
    }
  };

  validateForm = () => {
    let isValid = true;
    const { email, password } = this.state;
    const errors = {};

    if (!email || !email.includes('@') || !email.includes('.')) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    this.setState({ errors });
    return isValid;
  };

  render() {
    const { isLoggedIn, errors, loginError } = this.state;

    if (isLoggedIn) {
      return <Redirect to="/DisplayTshirts" />;
    }

    return (
      <>
        <form
          className="form-container"
          noValidate={true}
          id="loginOrRegistrationForm"
        >
          <h2>Login</h2>

          {loginError && <div className="error-message">{loginError}</div>}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="email"
              value={this.state.email}
              onChange={this.handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="password"
              value={this.state.password}
              onChange={this.handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          <div className="form-group">
            <button
              className="green-button"
              onClick={this.handleSubmit}
            >
              Login
            </button>
            <Link className="red-button" to={'/DisplayTshirts'}>
              Cancel
            </Link>
          </div>
        </form>
        Don't Have an account{' '}
        <Link to={'/Register'}>
          <span style={{ color: 'red' }}>Register</span>
        </Link>
      </>
    );
  }
}
