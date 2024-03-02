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
      userInfo: {},
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `${SERVER_HOST}/users/login/${this.state.email}/${this.state.password}`
      )
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            // user successfully logged in
            console.log('User logged in');
            const userInfo = {
              name: res.data.name,
              accessLevel: res.data.accessLevel,
              profilePhoto: res.data.profilePhoto,
              token: res.data.token,
              email: res.data.email,
            };
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            this.setState({
              isLoggedIn: true,
              userInfo: userInfo,
            });
          }
        } else {
          console.log('Login failed');
        }
      });
  };

  componentDidUpdate(prevProps, prevState) {
    // Check if user has logged in successfully
    if (!prevState.isLoggedIn && this.state.isLoggedIn) {
      // Update userInfo in Nav component if it exists
      if (this.props.updateUserInfo) {
        this.props.updateUserInfo(this.state.userInfo);
      }
    }
  }

  render() {
    return (
      <>
        <form
          className="form-container"
          noValidate={true}
          id="loginOrRegistrationForm"
        >
          <h2>Login</h2>
          {this.state.isLoggedIn ? <Redirect to="/DisplayTshirts" /> : null}
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <br />

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <br />
          <br />

          <LinkInClass
            value="Login"
            className="green-button"
            onClick={this.handleSubmit}
          />
          <Link className="red-button" to={'/DisplayTshirts'}>
            Cancel
          </Link>
        </form>
        Don't Have an account{' '}
        <Link to={'/Register'}>
          <span style={{ color: 'red' }}>Register</span>
        </Link>
      </>
    );
  }
}
