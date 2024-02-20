import React, {Component} from "react"
import TshirtTableRow from "./TshirtTableRow"


export default class TshirtTable extends Component 
{
    render() 
    {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Colour</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Rating</th>
                        <th> </th>
                        <th> </th>
                        
                    </tr>
                </thead>
                  
                <tbody>
                    {this.props.tshirts.map((tshirt) => <TshirtTableRow key={tshirt._id} tshirt={tshirt}/>)}
                </tbody>
            </table>      
        )
    }
}