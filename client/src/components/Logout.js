import React, {Component} from "react"
import {Redirect} from "react-router-dom"
import axios from "axios"
import '../css/Nav.css';
import exit from '../css/images/logout.png';
import LinkInClass from "../components/LinkInClass"
import {SERVER_HOST} from "../config/global_constants"


export default class Logout extends Component
{
    constructor(props)
    {
        super(props)
        
        this.state = {
            isLoggedIn:true
        }
    }
    
    
    handleSubmit = (e) => 
    {
        e.preventDefault()
        
        axios.post(`${SERVER_HOST}/users/logout`)
        .then(res => 
        {     
            if(res.data)
            {
                if (res.data.errorMessage)
                {
                    console.log(res.data.errorMessage)    
                }
                else
                { 
                    console.log("User logged out")
                    localStorage.clear() 
                    
                    this.setState({isLoggedIn:false}) 
                }
            }
            else
            {
                console.log("Logout failed")
            }
        }) 
    }


    render()
    {
        return (
             <>         
              {localStorage.profilePhoto !== 'null' ? (
                <img
                  id="profilePhoto"
                  src={`data:;base64,${localStorage.profilePhoto}`}
                  alt=""
                />
              ) : null}
              <img
                src={exit}
                alt="Exit"
                style={{ width: '20px', height: '20px' }}
                onClick={this.handleSubmit}
              />
              {!this.state.isLoggedIn && <Redirect to="/DisplayTshirts" />}
            </>
        )
    }
}