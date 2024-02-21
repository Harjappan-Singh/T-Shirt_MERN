import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Table from "./TshirtTable";
import { ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../config/global_constants";

export default class DisplayTshirts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tshirts: [],
            sortByRating: false,
            sortByPrice: false,
            sortByBrand: "", 
            genderFilter: "All",
            colorFilter: "All",
            brandFilter: "All" 
        };
    }

    componentDidMount() {
        axios.get(`${SERVER_HOST}/tshirts`)
            .then(res => {
                if (res.data) {
                    if (res.data.errorMessage) {
                        console.log(res.data.errorMessage);
                    } else {
                        console.log("Records read");
                        this.setState({ tshirts: res.data });
                    }
                } else {
                    console.log("Record not found");
                }
            });
    }

    handleSortByRating = () => {
        const { tshirts, sortByRating } = this.state;
        const sortedTshirts = [...tshirts];

        sortedTshirts.sort((a, b) => {
            return sortByRating ? b.rating - a.rating : a.rating - b.rating;
        });

        this.setState({
            tshirts: sortedTshirts,
            sortByRating: !sortByRating
        });
    };

    handleSortByPrice = () => {
        const { tshirts, sortByPrice } = this.state;
        const sortedTshirts = [...tshirts];

        sortedTshirts.sort((a, b) => {
            return sortByPrice ? b.price - a.price : a.price - b.price;
        });

        this.setState({
            tshirts: sortedTshirts,
            sortByPrice: !sortByPrice
        });
    };

    handleSortByBrand = (event) => {
        this.setState({ sortByBrand: event.target.value });
    };

    handleGenderFilter = (event) => {
        this.setState({ genderFilter: event.target.value });
    };

    handleColorFilter = (event) => {
        this.setState({ colorFilter: event.target.value }); 
    };

    handleBrandFilter = (event) => {
        this.setState({ brandFilter: event.target.value }); // Add handleBrandFilter method
    };

    render() {
        const { tshirts, genderFilter, colorFilter, sortByBrand, brandFilter } = this.state;
       
        let filteredTshirts = tshirts.filter(tshirt => {
            if (genderFilter !== "All" && colorFilter !== "All" && brandFilter !== "All") {
                return tshirt.category === genderFilter && tshirt.color === colorFilter && tshirt.brand === brandFilter;
            } else if (genderFilter !== "All" && colorFilter !== "All") {
                return tshirt.category === genderFilter && tshirt.color === colorFilter;
            } else if (genderFilter !== "All" && brandFilter !== "All") {
                return tshirt.category === genderFilter && tshirt.brand === brandFilter;
            } else if (colorFilter !== "All" && brandFilter !== "All") {
                return tshirt.color === colorFilter && tshirt.brand === brandFilter;
            } else if (genderFilter !== "All") {
                return tshirt.category === genderFilter;
            } else if (colorFilter !== "All") {
                return tshirt.color === colorFilter;
            } else if (brandFilter !== "All") {
                return tshirt.brand === brandFilter;
            } else {
                return true;
            }
        });

        if (sortByBrand) {
            filteredTshirts.sort((a, b) => {
                const brandA = a.brand.toUpperCase();
                const brandB = b.brand.toUpperCase();
                return brandA.localeCompare(brandB);
            });
        }

        return (
            <div className="form-container">
                {localStorage.accessLevel > ACCESS_LEVEL_GUEST ? (
                    <div className="logout">
                        {localStorage.profilePhoto !== "null" ? (
                            <img
                                id="profilePhoto"
                                src={`data:;base64,${localStorage.profilePhoto}`}
                                alt=""
                            />
                        ) : null}
                    </div>
                ) : (
                    <div>
                        <Link className="green-button" to={"/Login"}>
                            Login
                        </Link>
                        <Link className="blue-button" to={"/Register"}>
                            Register
                        </Link>
                        <Link className="red-button" to={"/ResetDatabase"}>
                            Reset Database
                        </Link>
                        <br />
                        <br />
                        <br />
                    </div>
                )}
                <div className="filter-container">
                    <select value={genderFilter} onChange={this.handleGenderFilter}>
                        <option value="All">All</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                    <select value={colorFilter} onChange={this.handleColorFilter}>
                        <option value="All">All Colors</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Blue">Blue</option>
                        <option value="Red">Red</option>
                    </select>
                    <select value={brandFilter} onChange={this.handleBrandFilter}>
                        <option value="All">All Brands</option>
                        <option value="Nike">Nike</option>
                        <option value="Mango">Mango</option>
                        <option value="H&M">H&M</option>
                    </select>
                    </div>
                    <div>
                    <select value={sortByBrand} onChange={this.handleSortByBrand}>
                        <option value="">Sort by Brand</option>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <div className="table-container">
                    <div className="sort-by-rating">
                        <button onClick={this.handleSortByRating}>
                            Sort by Rating {this.state.sortByRating ? "(Descending)" : "(Ascending)"}
                        </button>
                    </div>
                    <div className="sort-by-price">
                        <button onClick={this.handleSortByPrice}>
                            Sort by Price {this.state.sortByPrice ? "(Descending)" : "(Ascending)"}
                        </button>
                    </div>

                    <Table tshirts={filteredTshirts} />

                    {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? (
                        <div className="add-new-tshirt">
                            <Link className="blue-button" to={"/AddTshirt"}>
                                Add New T-shirt
                            </Link>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}
