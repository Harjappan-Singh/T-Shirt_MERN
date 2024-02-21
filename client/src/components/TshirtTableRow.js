import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ACCESS_LEVEL_ADMIN, SERVER_HOST } from "../config/global_constants";


export default class TshirtTableRow extends Component {
    componentDidMount() {
        
    }

    render() {
        return (
          
            <Link
            to={{
                pathname: `/tshirt/${this.props.tshirt._id}`,
                state: { tshirt: this.props.tshirt }
            }}
            style={{ textDecoration: 'none', color: 'inherit' }} // Optionally, style the link to remove default text decoration and inherit color
        >
            <tr>
                <td>{this.props.tshirt.brand}</td>
                <td>{this.props.tshirt.name}</td>
                <td>{this.props.tshirt.description}</td>
                <td>{this.props.tshirt.category}</td>
                <td>{this.props.tshirt.color}</td>
                <td>{this.props.tshirt.sizes}</td>
                <td>{this.props.tshirt.price}</td>
                <td>{this.props.tshirt.rating}</td>
                <td>{localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? <Link className="red-button" to={"/DeleteTshirt/" + this.props.tshirt._id}>Delete</Link> : null}</td>
                <td>{localStorage.accessLevel >= ACCESS_LEVEL_ADMIN  ? <Link className="green-button" to={"/EditTshirt/" + this.props.tshirt._id}>Edit</Link> : null}</td>
                
            </tr>
        </Link>
        );
    }
}
