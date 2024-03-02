const router = require('express').Router();
const tshirtsModel = require('../models/tshirts');
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const JWT_PRIVATE_KEY = fs.readFileSync(
  process.env.JWT_PRIVATE_KEY_FILENAME,
  'utf8'
);
const { isAuth, isAdmin } = require('../utils.js');

const verifyUsersJWTPassword = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ errorMessage: 'Unauthorized: Missing or invalid token' });
  }

  const tokenWithoutBearer = token.split(' ')[1];

  jwt.verify(
    tokenWithoutBearer,
    JWT_PRIVATE_KEY,
    { algorithm: 'HS256' },
    (err, decodedToken) => {
      if (err) {
        return res
          .status(401)
          .json({ errorMessage: 'Unauthorized: Invalid token' });
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

// Update one T-shirt record
// Update one T-shirt record
const updateTshirtDocument = (req, res) => {
  // Extract updated t-shirt details from the request body
  const updatedDetails = {
    brand: req.body.brand,
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    type: req.body.type,
    color: req.body.color,
    sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
    price: req.body.price,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    photos: [], // You may handle photos update separately if needed
  };

  // Update the t-shirt document in the database
  tshirtsModel.findByIdAndUpdate(req.params.id, updatedDetails, { new: true }, (error, updatedTshirt) => {
    if (error) {
      console.error('Error updating T-shirt document:', error);
      return res.status(500).json({ errorMessage: 'Internal server error' });
    } else {
      if (updatedTshirt) {
        console.log('T-shirt document updated successfully');
        // Send the updated T-shirt data in the response
        return res.json(updatedTshirt);
      } else {
        return res.status(404).json({ errorMessage: 'T-shirt not found' });
      }
    }
  });
};

// Delete one T-shirt record
router.delete(
  '/tshirts/:id',
  verifyUsersJWTPassword,
  deleteTshirtDocument,
  isAdmin
);

// Update one T-shirt record route
router.put('/tshirts/:id', verifyUsersJWTPassword, updateTshirtDocument);

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

router.put('/tshirts/:id', (req, res) => {
  const { brand, name, color, category, type, price, countInStock } = req.body;

  try {
    if (!/^[\w\s'-]*$/.test(brand)) {
      throw new Error('Brand must be a string');
    } else if (!/^[\w\s'-]*$/.test(name)) {
      throw new Error('Name must be a string');
    } else if (!/^[\w\s'-]*$/.test(color)) {
      throw new Error('Color must be a string');
    } else if (!/^[\w\s'-]*$/.test(category)) {
      throw new Error('Category must be a string');
    } else if (!/^[\w\s'-]*$/.test(type)) {
      throw new Error('Type must be a string');
    } else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
      throw new Error('Price must be a number greater than or equal to 1');
    } else if (parseInt(countInStock) < 0) {
      throw new Error('CountInStock must be a non-negative integer');
    } else {
      tshirtsModel.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        (error, data) => {
          if (error) {
            console.error('Error updating T-shirt document:', error);
            return res
              .status(500)
              .json({ errorMessage: 'Internal server error' });
          } else {
            console.log('T-shirt document updated successfully');
            return res.status(200).json(data);
          }
        }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(400).json({ errorMessage: 'Bad request' });
  }
};

router.post('/tshirts', createNewTshirtDocument);

module.exports = router;

