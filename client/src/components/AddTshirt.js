import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import LinkInClass from '../components/LinkInClass';
import { ACCESS_LEVEL_ADMIN, SERVER_HOST } from '../config/global_constants';

export default class AddTshirt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      brand: '',
      name: '',
      description: '',
      category: '',
      type: '',
      color: '',
      sizes: [],
      price: '',
      selectedFiles: null,
      redirectToDisplayAllTshirts:
        localStorage.accessLevel < ACCESS_LEVEL_ADMIN,
    };
  }

  componentDidMount() {
    this.inputToFocus.focus();
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (e) => {
    this.setState({ selectedFiles: e.target.files });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    // Construct form data
    let formData = new FormData();
    formData.append('brand', this.state.brand);
    formData.append('name', this.state.name);
    formData.append('description', this.state.description);
    formData.append('category', this.state.category);
    formData.append('type', this.state.type);
    formData.append('color', this.state.color);

    // Append sizes as an array
    this.state.sizes.forEach((size) => {
      formData.append('sizes[]', size);
    });

    formData.append('price', this.state.price);

    // Append selected files
    if (this.state.selectedFiles) {
      for (let i = 0; i < this.state.selectedFiles.length; i++) {
        formData.append('tshirtPhotos', this.state.selectedFiles[i]);
      }
    }

    // Log FormData entries
    for (const pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    // Send POST request
    axios
      .post(`${SERVER_HOST}/tshirts`, formData, {
        headers: {
          authorization: `Bearer ${localStorage.token}`,
          'Content-type': 'multipart/form-data',
        },
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            console.log('Record added');
            this.setState({ redirectToDisplayAllTshirts: true });
          }
        } else {
          console.log('Record not added');
        }
      })
      .catch((error) => {
        console.error('Error adding record:', error);
      });
  };

  render() {
    return (
      <div className="form-container">
        {this.state.redirectToDisplayAllTshirts ? (
          <Redirect to="/DisplayAllTshirts" />
        ) : null}

        <form>
          <div>
            <label htmlFor="brand">Brand</label>
            <input
              ref={(input) => {
                this.inputToFocus = input;
              }}
              type="text"
              name="brand"
              value={this.state.brand}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <input
              type="text"
              name="category"
              value={this.state.category}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="type">Type</label>
            <input
              type="text"
              name="type"
              value={this.state.type}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="color">Color</label>
            <input
              type="text"
              name="color"
              value={this.state.color}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="sizes">Sizes</label>
            <br />
            <input
              type="checkbox"
              name="sizes"
              value="XXS"
              onChange={this.handleChange}
            />{' '}
            XXS
            <br />
            <input
              type="checkbox"
              name="sizes"
              value="XS"
              onChange={this.handleChange}
            />{' '}
            XS
            <br />
            <input
              type="checkbox"
              name="sizes"
              value="S"
              onChange={this.handleChange}
            />{' '}
            S<br />
            <input
              type="checkbox"
              name="sizes"
              value="M"
              onChange={this.handleChange}
            />{' '}
            M<br />
            <input
              type="checkbox"
              name="sizes"
              value="L"
              onChange={this.handleChange}
            />{' '}
            L<br />
            <input
              type="checkbox"
              name="sizes"
              value="XL"
              onChange={this.handleChange}
            />{' '}
            XL
            <br />
            <input
              type="checkbox"
              name="sizes"
              value="XXL"
              onChange={this.handleChange}
            />{' '}
            XXL
            <br />
            <input
              type="checkbox"
              name="sizes"
              value="XXXL"
              onChange={this.handleChange}
            />{' '}
            XXXL
            <br />
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <input
              type="text"
              name="price"
              value={this.state.price}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="photos">Photos</label>
            <input type="file" multiple onChange={this.handleFileChange} />
          </div>{' '}
          <br />
          <br />
          <LinkInClass
            value="Add"
            className="green-button"
            onClick={this.handleSubmit}
          />
          <Link className="red-button" to={'/DisplayTshirts'}>
            Cancel
          </Link>
        </form>
      </div>
    );
  }
}
