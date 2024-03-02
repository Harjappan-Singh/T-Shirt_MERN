import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

export default class DeleteTshirt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToDisplayTshirts: false,
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params; 

        axios.delete(`${SERVER_HOST}/tshirts/${id}`, { 
            headers: { "authorization": localStorage.token } 
        })
        .then(res => {
            console.log("Response:", res.data);
            console.log("Record deleted");
            this.setState({ redirectToDisplayTshirts: true, loading: false });
        })
        .catch(error => {
            console.error("Error deleting record:", error.response.data);
            this.setState({ error: "Error deleting record", loading: false });
        });
    }

    render() {
        const { redirectToDisplayTshirts, error, loading } = this.state;
        if (loading) {
            return <p>Loading...</p>; 
        }
        if (redirectToDisplayTshirts) {
            return <Redirect to="/DisplayTshirts" />;
        }
        return (
            <div>
                {error && <p>Error: {error}</p>}
            </div>
        );
    }
}
