import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";

export default class DeleteTshirt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToDisplayTshirts: false,
            error: null
        };
    }

    componentDidMount() {
        axios.delete(`${SERVER_HOST}/tshirts/${this.props.match.params.id}`, { headers: { "authorization": localStorage.token } })
            .then(res => {
                if (res.data.errorMessage) {
                    this.setState({ error: res.data.errorMessage });
                } else {
                    console.log("Record deleted");
                    this.setState({ redirectToDisplayTshirts: true });
                }
            })
            .catch(error => {
                console.error("Error deleting record:", error);
                this.setState({ error: "Error deleting record" });
            });
    }

    render() {
        const { redirectToDisplayTshirts, error } = this.state;
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
