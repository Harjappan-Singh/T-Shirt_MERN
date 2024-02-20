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
            res.json({ errorMessage: "Internal server error" });
        } else {
            res.json(data);
        }
    });
});

router.put(`/tshirts/:id`, (req, res) => {
    const { brand, name, color, category, type, price, countInStock } = req.body;

    if (!/^[\w\s'-]*$/.test(brand)) {
        res.json({ errorMessage: `Brand must be a string` }); 
    }else if (!/^[\w\s'-]*$/.test(name)) {
        res.json({ errorMessage: `name must be a string` });         
    } 
    else if (!/^[\w\s'-]*$/.test(color)) {
        res.json({ errorMessage: `Color must be a string` });         
    }  
    else if (!/^[\w\s'-]*$/.test(category)) {
        res.json({ errorMessage: `Category must be a string` });         
    } else if (!/^[\w\s'-]*$/.test(type)) {
        res.json({ errorMessage: `Type must be a string` });         
    } else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
        res.json({ errorMessage: `Price must be a number greater than or equal to 1` });         
    } else if ( parseInt(countInStock) < 0) {
        res.json({ errorMessage: `CountInStock must be a non-negative integer` });         
    }
     
    else {
        tshirtsModel.findByIdAndUpdate(req.params.id, {$set: req.body}, (error, data) => {
           
                res.json(data);
            
        });
    }
});



// Delete a T-shirt record
router.delete('/tshirts/:_id', (req, res) => {
    tshirtsModel.findByIdAndRemove(req.params.id, (error, data) => {
      
            res.json(data);
        
    });
});

module.exports = router;
