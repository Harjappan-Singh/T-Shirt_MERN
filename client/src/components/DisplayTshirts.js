import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Table from "./TshirtTable";
import { ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../config/global_constants";
import Logout from "./Logout"
export default class DisplayTshirts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tshirts: [],
            sortByRating: false,
            sortByPrice: false,
             
            genderFilter: "All",
            colorFilter: "All",
            brandFilter: "All", 
            sizesFilter: "All"
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

   

    handleGenderFilter = (event) => {
        this.setState({ genderFilter: event.target.value });
    };

    handleColorFilter = (event) => {
        this.setState({ colorFilter: event.target.value }); 
    };
    handleSizesFilter = (event) => {
        this.setState({ sizesFilter: event.target.value }); 
    };

    handleBrandFilter = (event) => {
        this.setState({ brandFilter: event.target.value }); 
    };

    render() {
        const { tshirts, genderFilter, colorFilter, sortByBrand, brandFilter, sizesFilter } = this.state;
       
        let filteredTshirts = tshirts.filter(tshirt => {
            const matchesGender = genderFilter === "All" || tshirt.category === genderFilter;
            const matchesColor = colorFilter === "All" || tshirt.color === colorFilter;
            const matchesBrand = brandFilter === "All" || tshirt.brand === brandFilter;
            const matchesSizes = sizesFilter === "All" || tshirt.sizes.includes(sizesFilter);
    
            // Return true if all filters match
            return matchesGender && matchesColor && matchesBrand && matchesSizes;
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
               {
                    localStorage.accessLevel > ACCESS_LEVEL_GUEST 
                    ? <div className="logout">
                        {
                            localStorage.profilePhoto !== "null" 
                            ? <img id="profilePhoto" src={`data:;base64,${localStorage.profilePhoto}`} alt=""/>
                            : null
                        }                        
                        <Logout/>
                      </div> : (
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

                <select value={sizesFilter} onChange={this.handleSizesFilter}>
                        <option value="All">Sizes</option>
                        <option value="XXS">XXS</option>
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                        <option value="XXXL">XXXL</option>
                    </select>
                    
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
                   
                <div className="table-container">
                    <div className="sort-by-rating">
                        <button onClick={this.handleSortByRating}>
                            Sort by Rating {this.state.sortByRating ?  "(Low to High)" : "(High to Low)"}
                        </button>
                    </div>
                    <div className="sort-by-price">
                        <button onClick={this.handleSortByPrice}>
                            Sort by Price {this.state.sortByPrice ? "(Low to High)" : "(High to Low)"}
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
