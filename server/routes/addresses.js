const express = require('express');
const router = express.Router();
const addressesModel = require('../models/addresses');

// Route to add addresses
router.post('/addresses/add', (req, res) => {
    // Validate input
    if (!req.body.name || typeof req.body.name !== 'string') {
        return res.status(400).json({ errorMessage: 'Name is required and must be a string' });
    }
    if (!req.body.email || typeof req.body.email !== 'string') {
        return res.status(400).json({ errorMessage: 'Email is required and must be a string' });
    }
    if (!isValidEmail(req.body.email)) {
        return res.status(400).json({ errorMessage: 'Email must be a valid email address' });
    }
    if (!req.body.addressLine1 || typeof req.body.addressLine1 !== 'string') {
        return res.status(400).json({ errorMessage: 'Address Line 1 is required and must be a string' });
    }
    if (!req.body.city || typeof req.body.city !== 'string') {
        return res.status(400).json({ errorMessage: 'City is required and must be a string' });
    }
    if (!req.body.county || typeof req.body.county !== 'string') {
        return res.status(400).json({ errorMessage: 'County is required and must be a string' });
    }
    if (!req.body.eircode || typeof req.body.eircode !== 'string') {
        return res.status(400).json({ errorMessage: 'Eircode is required and must be a string' });
    }

    // Input is valid, proceed with creating the address
    addressesModel.create(req.body, (error, data) => {
        if (error) {
            return res.status(500).json({ errorMessage: 'Error creating address' });
        }
        res.json(data);
    });
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = router;
