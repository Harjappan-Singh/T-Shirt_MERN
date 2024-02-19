import React, {Component} from "react"
import {Link} from "react-router-dom"

import axios from "axios"

import {ACCESS_LEVEL_GUEST, ACCESS_LEVEL_ADMIN, SERVER_HOST} from "../config/global_constants"


export default class CarTableRow extends Component 
{    
    componentDidMount() 
    {
        this.props.car.photos.map(photo => 
        {
            return axios.get(`${SERVER_HOST}/cars/photo/${photo.filename}`)
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
                        document.getElementById(photo._id).src = `data:;base64,${res.data.image}`                                                         
                    }   
                }
                else
                {
                    console.log("Record not found")
                }
            })
        })
    }
    
    
    render() 
    {
        return (
            <tr>
                <td>{this.props.car.model}</td>
                <td>{this.props.car.colour}</td>
                <td>{this.props.car.year}</td>
                <td>{this.props.car.price}</td>
                <td className="carPhotos">
                    {this.props.car.photos.map(photo => <img key={photo._id} id={photo._id} alt=""/>)}
                </td>           
                <td>
                    {localStorage.accessLevel > ACCESS_LEVEL_GUEST ? <Link className="green-button" to={"/EditCar/" + this.props.car._id}>Edit</Link> : null}
                    
                    {localStorage.accessLevel >= ACCESS_LEVEL_ADMIN ? <Link className="red-button" to={"/DeleteCar/" + this.props.car._id}>Delete</Link> : null}   
                </td>  
                
            </tr>
        )
    }
}