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
    if (!req.body.eircode || !validateEircode(req.body.eircode)) {
            return res.status(400).json({ errorMessage: 'Valid Eircode is required' });
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


function validateEircode(eircode) {
    const pattern = /\b(?:([a](4[125s]|6[37]|7[5s]|[8b][1-6s]|9[12468b])|[c](1[5s])|[d]([0o][1-9sb]|1[0-8osb]|2[024o]|6w)|[e](2[15s]|3[24]|4[15s]|[5s]3|91)|[f](12|2[368b]|3[15s]|4[25s]|[5s][26]|9[1-4])|[h](1[2468b]|23|[5s][34]|6[25s]|[79]1)|[k](3[246]|4[5s]|[5s]6|67|7[8b])|[n](3[79]|[49]1)|[p](1[247]|2[45s]|3[126]|4[37]|[5s][16]|6[17]|7[25s]|[8b][15s])|[r](14|21|3[25s]|4[25s]|[5s][16]|9[35s])|[t](12|23|34|4[5s]|[5s]6)|[v](1[45s]|23|3[15s]|42|9[2-5s])|[w](12|23|34|91)|[x](3[5s]|42|91)|[y](14|2[15s]|3[45s]))\s?[abcdefhknoprtsvwxy\d]{4})\b/;
    return pattern.test(eircode);
}

module.exports = router;
