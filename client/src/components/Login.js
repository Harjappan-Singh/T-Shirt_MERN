import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom"
import axios from "axios";
import '../css/Login.css';

import LinkInClass from "../components/LinkInClass"
import {SERVER_HOST} from "../config/global_constants"


export default class Login extends Component
{
    constructor(props)
    {
        super(props)
        
        this.state = {
            email:"",
            password:"",
            isLoggedIn:false
        }
    }
        
    
    handleChange = (e) => 
    {
        this.setState({[e.target.name]: e.target.value})
    }
    
    
    handleSubmit = (e) => 
    {
        e.preventDefault();

        axios.post(`${SERVER_HOST}/users/login/${this.state.email}/${this.state.password}`)
        .then(res => 
        {     
            if(res.data)
            {
                if (res.data.errorMessage)
                {
                    console.log(res.data.errorMessage)    
                }
                else // user successfully logged in
                { 
                    console.log("User logged in")
                    
                    localStorage.name = res.data.name
                    localStorage.accessLevel = res.data.accessLevel
                    localStorage.profilePhoto = res.data.profilePhoto                        
                    localStorage.token = res.data.token
                    localStorage.email = res.data.email
                    
                    this.setState({isLoggedIn:true})
                }        
            }
            else
            {
                console.log("Login failed")
            }
        })                
    }


    render()
    {            
        return (
            <div className="page-content">
            <div className="bodylogin">
       <form className="form-container" onSubmit={this.handleSubmit}>
                <h2>Login</h2>
                
                {this.state.isLoggedIn ? <Redirect to="/DisplayTshirts"/> : null} 
                
                <input 
                    type = "email" 
                    name = "email" 
                    placeholder = "Email"
                    autoComplete="email"
                    value={this.state.email} 
                    onChange={this.handleChange}
                /><br/>
                    
                <input 
                    type = "password" 
                    name = "password" 
                    placeholder = "Password"
                    autoComplete="password"
                    value={this.state.password} 
                    onChange={this.handleChange}
                /><br/><br/>
                
                {/* <div className="Buttons">
                <LinkInClass value="Login" className="loginbutton" onClick={this.handleSubmit}/> 
                <Link className="cancelbutton" to={"/DisplayTshirts"}>Cancel</Link>    
                </div>                                   */}
                 <div className="Buttons">
            <button type="submit" className="loginbutton">Login</button>
            <Link to="/DisplayTshirts" className="cancelbutton">Cancel</Link>
          </div>
            </form>
            </div>
            </div>

        )
    }
}
