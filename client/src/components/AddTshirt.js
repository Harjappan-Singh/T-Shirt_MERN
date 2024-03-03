import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import LinkInClass from "../components/LinkInClass";
import { ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../config/global_constants";
import '../css/DisplayTshirts.css';


export default class AddTshirt extends Component {
    constructor(props) {
        super(props)

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
      sizesOptions: {
        XXS: "XXS",
        XS: "XS",
        S: "S",
        M: "M",
        L: "L",
        XL: "XL",
        XXL: "XXL",
        XXXL: "XXXL",
      },
      redirectToDisplayAllTshirts:
        localStorage.accessLevel < ACCESS_LEVEL_ADMIN,
    };
  }

  componentDidMount() {
    this.inputToFocus.focus();
  }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };

    handleFileChange = (e) => {
        this.setState({ selectedFiles: e.target.files })
    };

    handleCheckboxChange = (e) => {
      const { value } = e.target;
      const { sizes } = this.state;
    
      if (sizes.includes(value)) {
        // If the size is already in the array, remove it
        this.setState({
          sizes: sizes.filter((size) => size !== value),
        });
      } else {
        // If the size is not in the array, add it
        this.setState({
          sizes: [...sizes, value],
        });
      }
    };
    

    validate() {
        const errors = {
            brand: this.state.brand.trim() !== "" ? "" : "Brand is required",
            name: this.state.name.trim() !== "" ? "" : "Name is required",
            description: this.state.description.trim() !== "" ? "" : "Description is required",
            category: this.state.category.trim() !== "" ? "" : "Category is required",
            type: this.state.type.trim() !== "" ? "" : "Type is required",
            color: this.state.color.trim() !== "" ? "" : "Color is required",
            price: this.state.price.trim() !== "" ? "" : "Price is required"
        };

        return {
            isValid: Object.values(errors).every(error => error === ""),
            errors
        };
    }


  // handleSubmit = (e) => {
  //   e.preventDefault();

  //       this.setState({ wasSubmittedAtLeastOnce: true });

  //       const validationResult = this.validate();

  //       if (validationResult.isValid) {
  //           const tshirtObject = {
  //               brand: this.state.brand,
  //               name: this.state.name,
  //               description: this.state.description,
  //               category: this.state.category,
  //               type: this.state.type,
  //               color: this.state.color,
  //               product_image: this.state.product_image,
  //               sizes: this.state.sizes,
  //               price: this.state.price,
  //               countInStock: this.state.countInStock
  //           };
       
  //             console.log("GET request URL:", `${SERVER_HOST}/tshirts/${this.props.match.params.id}`);
      
  //             axios.get(`${SERVER_HOST}/tshirts/${this.props.match.params.id}`, { headers: { "authorization": localStorage.token } })
  //                .then(res => {
  //                   if (res.data) {
  //                       if (res.data.errorMessage) {
  //                           this.setState({ errorMessage: res.data.errorMessage });
  //                       } else {
  //                           console.log(`Record added`);
  //                           this.setState({ redirectToDisplayAllTshirts: true });
  //                       }
  //                   } else {
  //                       console.log(`Record not added`);
  //                   }
  //               });
  //       } else {
  //           this.setState({ errors: validationResult.errors });
  //       }
  //   }
  handleSubmit = (e) => {
    e.preventDefault();
  
    const tshirtObject = {
      brand: this.state.brand,
      name: this.state.name,
      description: this.state.description,
      category: this.state.category,
      type: this.state.type,
      color: this.state.color,
      sizes: this.state.sizes,
      price: this.state.price,
      countInStock: this.state.countInStock,
      rating: this.state.rating,
      numReviews: this.state.numReviews,
    };
  
    axios.post(`${SERVER_HOST}/tshirts`, tshirtObject)
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
        console.error('Error creating T-shirt document:', error);
        this.setState({ errorMessage: 'Internal server error' });
      });
  };

  
  render() {
    return (
      <div className="form-container">
        {this.state.redirectToDisplayAllTshirts ? (
          <Redirect to="/DisplayAllTshirts" />
        ) : null}

                <div>
                <label htmlFor="brand">Brand</label>
                        <input ref={(input) => { this.inputToFocus = input; }} type="text" name="brand" value={this.state.brand} onChange={this.handleChange} />
                        </div>
    

                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
                    </div>

                    <div>
                        <label htmlFor="description">Description</label>
                        <input type="text" name="description" value={this.state.description} onChange={this.handleChange} />
                    </div>

                    <div>
                        <label htmlFor="category">Category</label>
                        <input type="text" name="category" value={this.state.category} onChange={this.handleChange} />
                    </div>

                    <div>
                        <label htmlFor="type">Type</label>
                        <input type="text" name="type" value={this.state.type} onChange={this.handleChange} />
                    </div>

                    <div>
                        <label htmlFor="color">Color</label>
                        <input type="text" name="color" value={this.state.color} onChange={this.handleChange} />
                    </div>

                    {/* <div>
                        <label htmlFor="sizes">Sizes</label><br />
                        <input type="checkbox" name="sizes" value="XXS" checked={this.state.sizes.includes("XXS")} onChange={this.handleCheckboxChange} /> XXS<br />
                        <input type="checkbox" name="sizes" value="XS" checked={this.state.sizes.includes("XS")} onChange={this.handleCheckboxChange} /> XS<br />
                        <input type="checkbox" name="sizes" value="S" checked={this.state.sizes.includes("S")} onChange={this.handleCheckboxChange} /> S<br />
                        <input type="checkbox" name="sizes" value="M" checked={this.state.sizes.includes("M")} onChange={this.handleCheckboxChange} /> M<br />
                        <input type="checkbox" name="sizes" value="L" checked={this.state.sizes.includes("L")} onChange={this.handleCheckboxChange} /> L<br />
                        <input type="checkbox" name="sizes" value="XL" checked={this.state.sizes.includes("XL")} onChange={this.handleCheckboxChange} /> XL<br />
                        <input type="checkbox" name="sizes" value="XXL" checked={this.state.sizes.includes("XXL")} onChange={this.handleCheckboxChange} /> XXL<br />
                        <input type="checkbox" name="sizes" value="XXXL" checked={this.state.sizes.includes("XXXL")} onChange={this.handleCheckboxChange} /> XXXL<br />
                    </div> */}
                 <div>
  <label htmlFor="sizes">Sizes</label><br />
  {Object.keys(this.state.sizesOptions).map((size) => (
    <div key={size}>
      <input
        type="checkbox"
        name="sizes"
        value={size}
        checked={this.state.sizes.includes(size)}
        onChange={this.handleCheckboxChange}
      /> {size}<br />
    </div>
  ))}
</div>


                    <div>
                        <label htmlFor="price">Price</label>
                        <input type="text" name="price" value={this.state.price} onChange={this.handleChange} />
                    </div>


                    <div>
                        <label htmlFor="photos">Photos</label>
                        <input type="file" multiple onChange={this.handleFileChange} />
                    </div> <br /><br />

                    <LinkInClass value="Add" className="green-button" onClick={this.handleSubmit} />

                    <Link className="red-button" to={"/DisplayTshirts"}>Cancel</Link>
            </div>
        );
    }
}
