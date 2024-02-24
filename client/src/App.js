import React, {Component} from "react"
import {BrowserRouter, Switch, Route} from "react-router-dom"

import "bootstrap/dist/css/bootstrap.css"
import "./css/App.css"

import Register from "./components/Register"
import ResetDatabase from "./components/ResetDatabase"
import Login from "./components/Login"
import Logout from "./components/Logout"
import LoggedInRoute from "./components/LoggedInRoute"
import DisplayTshirts from "./components/DisplayTshirts"
import EditTshirt from "./components/EditTshirt"
import AddTshirt from "./components/AddTshirt"
import TshirtDetails from "./components/tshirtDetails"
import DeleteTshirt from "./components/DeleteTshirt"
import ShoppingCart from './components/ShoppingCart';
import PayPalMessage from "./components/PayPalMessage"


import {ACCESS_LEVEL_GUEST} from "./config/global_constants"


if (typeof localStorage.accessLevel === "undefined")
{
    localStorage.name = "GUEST"
    localStorage.accessLevel = ACCESS_LEVEL_GUEST
    localStorage.token = null
    localStorage.profilePhoto = null
}

    
export default class App extends Component 
{
    render() 
    {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/Register" component={Register} />
                    <Route exact path="/ResetDatabase" component={ResetDatabase} />                    
                    <Route exact path="/" component={DisplayTshirts} />
                    <Route exact path="/Login" component={Login} />
                    <LoggedInRoute exact path="/Logout" component={Logout} />
                  
                    <Route exact path="/EditTshirt/:id" component={EditTshirt} />
                    <Route exact path="/AddTshirt" component={AddTshirt} />
                    <LoggedInRoute exact path="/DeleteTshirt/:id" component={DeleteTshirt} />
                    <Route exact path="/DisplayTshirts" component={DisplayTshirts}/> 
                    <Route exact path="/TshirtDetails/:id" component={TshirtDetails} /> 
                    <Route path="/ShoppingCart" component={ShoppingCart} /> 
                    <Route exact path="/PayPalMessage/:messageType/:payPalPaymentID" component={PayPalMessage}/>  
                  
              
                </Switch>
            </BrowserRouter> 
        )
    }
}