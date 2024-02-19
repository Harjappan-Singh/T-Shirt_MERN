// backend/routes/tshirts.js

const router = require('express').Router();
const tshirtsModel = require('../models/tshirts');

// Read all records
router.get('/tshirts', (req, res) => {   
    tshirtsModel.find((error, data) => {
        if (error) {
            res.status(500).json({ errorMessage: "Internal server error" });
        } else {
            res.json(data);
        }
    });
});

// Read one record
router.get('/tshirts/:id', (req, res) => {
    tshirtsModel.findById(req.params.id, (error, data) => {
        if (error) {
            res.status(500).json({ errorMessage: "Internal server error" });
        } else {
            res.json(data);
        }
    });
});

router.put(`/tshirts/:id`, (req, res) => {
    tshirtsModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, data) => {
       
            res.json(data);
        
    });
});


// Delete a T-shirt record
router.delete('/tshirts/:_id', (req, res) => {
    tshirtsModel.findByIdAndRemove(req.params.id, (error, data) => {
      
            res.json(data);
        
    });
});

module.exports = router;
