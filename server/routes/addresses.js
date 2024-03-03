const router = require('express').Router();
const addressesModel = require('../models/addresses');

// Function to validate address data
const validateAddressData = (addressData) => {
    const { addressLine1, city, eircode } = addressData;
    const errors = {};

    if (!addressLine1 || !addressLine1.trim()) {
        errors.addressLine1 = 'Address Line 1 is required';
    }

    if (!city || !city.trim()) {
        errors.city = 'City is required';
    }

    if (!eircode || !eircode.trim()) {
        errors.eircode = 'Eircode is required';
    }

    return { errors, isValid: Object.keys(errors).length === 0 };
};

// Route handler to create a new address document
const addAddress = (req, res) => {
    const addressData = req.body;
    const { errors, isValid } = validateAddressData(addressData);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    addressesModel.create(addressData, (error, data) => {
        if (error) {
            res.status(500).json({ errorMessage: 'Error creating address' });
        } else {
            res.json(data);
        }
    });
};

// Define route for adding a new address
router.post('/addresses/add', addAddress);

module.exports = router;
