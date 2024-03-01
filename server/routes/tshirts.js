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

// Delete one T-shirt record
router.delete(
  '/tshirts/:id',
  verifyUsersJWTPassword,
  deleteTshirtDocument,
  isAdmin
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

router.put('/tshirts/:id', (req, res) => {
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
});

// Add a new T-shirt record
const createNewTshirtDocument = (req, res) => {
  try {
    // Use the new T-shirt details to create a new T-shirt document
    console.log(req.body.brand);
    let tshirtDetails = {
      brand: req.body.brand,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      color: req.body.color,
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [], // Ensure sizes is an array
      price: req.body.price,
      countInStock: req.body.countInStock,
      photos: [
        // add the static URL for the T-shirt's photo
        {
          filename: 'mens-t-shirt-front.jpg',
          url: 'https://image.spreadshirtmedia.net/image-server/v1/mp/productTypes/6/views/1/appearances/2,width=550,height=550,backgroundColor=e5e5e5/mens-t-shirt-front.jpg',
        },
      ],
    };

    tshirtsModel.create(tshirtDetails, (error, data) => {
      if (error) {
        console.error('Error creating new T-shirt document:', error);
        return res.status(500).json({ errorMessage: 'Internal server error' });
      } else {
        console.log('New T-shirt document created successfully');
        return res.status(201).json(data);
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(400).json({ errorMessage: 'Bad request' });
  }
};

// Add route for creating a new T-shirt record
router.post(
  '/tshirts',
  verifyUsersJWTPassword,
  isAdmin,
  createNewTshirtDocument
);

module.exports = router;
