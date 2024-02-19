const mongoose = require(`mongoose`)

let carPhotosSchema = new mongoose.Schema(
    {
       filename:{type:String}
    })


let carsSchema = new mongoose.Schema(
    {
        model: {type: String},
        colour: {type: String},
        year: {type: Number},
        price: {type: Number},
        photos:[carPhotosSchema]
    },
    {
       collection: `cars`
    })

module.exports = mongoose.model(`cars`, carsSchema)