const router = require('express').Router();
const addressesModel = require('../models/addresses');


const addAddress = (req, res) => {
    const addressData = req.body;
    addressesModel.create(addressData, (error, data) => {
        if (error) {
            res.status(500).json({ errorMessage: 'Error creating address' });
        } else {
            res.json(data);
        }
    });
};


router.post('/addresses/add', addAddress);

module.exports = router;
