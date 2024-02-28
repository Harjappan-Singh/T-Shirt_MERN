const jwt = require('jsonwebtoken');
const usersModel = require('../models/addresses');
const router = require('express').Router();

const addAddress = (req, res) => {
    usersModel.create({
        name: req.body.name,
        email: req.body.email,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        city: req.body.city,
        county: req.body.county,
        country: req.body.country,
        eircode: req.body.eircode
    }, (error, data) => {
        if (error) {
            return res.status(500).json({ errorMessage: 'Error creating address' });
        }

        const token = jwt.sign({ email: data.email }, process.env.JWT_PRIVATE_KEY, { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY });
        
        // Assuming you need to return some user data along with token
        res.json({ name: data.name, email: data.email, token: token });
    });
};

router.post('/users/register', addAddress);

module.exports = {
    router,
    addAddress // Export the addAddress function
};
