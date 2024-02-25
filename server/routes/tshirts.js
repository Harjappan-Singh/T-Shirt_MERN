const router = require('express').Router();
const tshirtsModel = require('../models/tshirts');
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const JWT_PRIVATE_KEY = fs.readFileSync(
  process.env.JWT_PRIVATE_KEY_FILENAME,
  'utf8'
);

// Middleware to verify user's JWT password and check if user is an administrator
const verifyUsersJWTPassword = (req, res, next) => {
  jwt.verify(
       req.headers.authorization,
        JWT_PRIVATE_KEY,
       { algorithm: 'HS256' },
        (err, decodedToken) => {
          if (err) {
            res.status(401).json({ errorMessage: 'User is not logged in' });
           } else {
             req.decodedToken = decodedToken;
             next();
           }
     }
 );
};
const deleteTshirtDocument = (req, res) => {
  tshirtsModel.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      res.status(500).json({ errorMessage: 'Error deleting T-shirt document' });
    } else {
      if (data) {
        res.json({ message: 'T-shirt document deleted successfully' });
      } else {
        res.status(404).json({ errorMessage: 'T-shirt not found' });
      }
    }
  });
};

// Delete one T-shirt record
router.delete(
  '/tshirts/:id',
  verifyUsersJWTPassword,
  deleteTshirtDocument
);


// Read all records
router.get('/tshirts', (req, res) => {
  tshirtsModel.find({}, (error, data) => {
    if (error) {
      res.status(500).json({ errorMessage: 'Internal server error' });
    } else {
      res.json(data);
    }
  });
});

// Read one record
router.get('/tshirts/:id', (req, res) => {
  tshirtsModel.findById(req.params.id, (error, data) => {
    if (error) {
      res.status(500).json({ errorMessage: 'Internal server error' });
    } else {
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ message: 'T-shirt Not Found' });
      }
    }
  });
});

// Add a new T-shirt record
// const createNewTshirtDocument = (req, res) => {
//   try {
//     // Use the new T-shirt details to create a new T-shirt document
//     let tshirtDetails = {
//       brand: req.body.brand,
//       name: req.body.name,
//       description: req.body.description,
//       category: req.body.category,
//       type: req.body.type,
//       color: req.body.color,
//       sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [], // Ensure sizes is an array
//       price: req.body.price,
//       countInStock: req.body.countInStock,
//       photos: [], // add the T-shirt's photos to the tshirtDetails object
//     };

//     req.files.forEach((file, index) => {
//       tshirtDetails.photos[index] = { filename: file.filename };
//     });

//     tshirtsModel.create(tshirtDetails, (error, data) => {
//       if (error) {
//         console.error('Error creating new T-shirt document:', error);
//         return res.status(500).json({ errorMessage: 'Internal server error' });
//       } else {
//         console.log('New T-shirt document created successfully');
//         return res.status(201).json(data);
//       }
//     });
//   } catch (error) {
//     console.error('Error processing request:', error);
//     return res.status(400).json({ errorMessage: 'Bad request' });
//   }
// };

 router.put(`/tshirts/:id`, (req, res) => {
   const { brand, name, color, category, type, price, countInStock } = req.body;

   if (!/^[\w\s'-]*$/.test(brand)) {
     res.json({ errorMessage: `Brand must be a string` });
   } else if (!/^[\w\s'-]*$/.test(name)) {
     res.json({ errorMessage: `Name must be a string` });
   } else if (!/^[\w\s'-]*$/.test(color)) {
     res.json({ errorMessage: `Color must be a string` });
   } else if (!/^[\w\s'-]*$/.test(category)) {
     res.json({ errorMessage: `Category must be a string` });
   } else if (!/^[\w\s'-]*$/.test(type)) {
     res.json({ errorMessage: `Type must be a string` });
   } else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
     res.json({
       errorMessage: `Price must be a number greater than or equal to 1`,
     });
   } else if (parseInt(countInStock) < 0) {
     res.json({ errorMessage: `CountInStock must be a non-negative integer` });
   } else {
     tshirtsModel.findByIdAndUpdate(
       req.params.id,
       { $set: req.body },
       (error, data) => {
         res.json(data);
       }
     );
   }
 });

// router.post('/tshirts', createNewTshirtDocument);

module.exports = router;