import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Table from "./TshirtTable";
import { ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../config/global_constants";

export default class DisplayTshirts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tshirts: []
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

    render() {
        return (
            <div className="form-container">
                {
                    localStorage.accessLevel > ACCESS_LEVEL_GUEST
                        ? <div className="logout">
                            {
                                localStorage.profilePhoto !== "null"
                                    ? <img id="profilePhoto" src={`data:;base64,${localStorage.profilePhoto}`} alt="" />
                                    : null
                            }
                        </div>
                        : <div>
                            <Link className="green-button" to={"/Login"}>Login</Link>
                            <Link className="blue-button" to={"/Register"}>Register</Link>
                            <Link className="red-button" to={"/ResetDatabase"}>Reset Database</Link><br /><br /><br /></div>
                }
<div className="table-container">
                    <Table tshirts={this.state.tshirts} /> 
               

                    {
                        localStorage.accessLevel >= ACCESS_LEVEL_ADMIN
                            ? <div className="add-new-tshirt">
                                <Link className="blue-button" to={"/AddTshirt"}>Add New T-shirt</Link>
                            </div>
                            
                            : null
                            
                    }
                </div>
            </div>
        );
    }
}
