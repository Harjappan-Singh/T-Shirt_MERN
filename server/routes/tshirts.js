// tshirtsRoutes.js

const router = require('express').Router();
const tshirtsModel = require('../models/tshirts');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const JWT_PRIVATE_KEY = fs.readFileSync(
  process.env.JWT_PRIVATE_KEY_FILENAME,
  'utf8'
);

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

// Handler to delete a T-shirt document
const deleteTshirtDocument = (req, res) => {
  // Using Mongoose's findByIdAndRemove method to delete the T-shirt document
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

// DELETE endpoint to delete a T-shirt document
router.delete('/tshirts/:id', deleteTshirtDocument);

const updateTshirtDocument = (req, res) => {
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
    photos: [],
  };

  tshirtsModel.findByIdAndUpdate(
    req.params.id,
    updatedDetails,
    { new: true },
    (error, updatedTshirt) => {
      if (error) {
        console.error('Error updating T-shirt document:', error);
        return res.status(500).json({ errorMessage: 'Internal server error' });
      } else {
        if (updatedTshirt) {
          console.log('T-shirt document updated successfully');
          return res.json(updatedTshirt);
        } else {
          return res.status(404).json({ errorMessage: 'T-shirt not found' });
        }
      }
    }
  );
};

router.put('/tshirts/:id', updateTshirtDocument);

router.get('/tshirts', (req, res) => {
  tshirtsModel.find({}, (error, data) => {
    if (error) {
      res.status(500).json({ errorMessage: 'Internal server error' });
    } else {
      res.json(data);
    }
  });
});

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

const createNewTshirtDocument = (req, res) => {
  // Use the new t-shirt details to create a new t-shirt document
  let tshirtDetails = {
    brand: req.body.brand,
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    type: req.body.type,
    color: req.body.color,
    product_image: req.body.product_image,
    price: req.body.price,
    countInStock: req.body.countInStock,
    // Add other t-shirt details as needed
  };

  // Add the t-shirt's photos to the tshirtDetails object
  tshirtDetails.photos = [];

  // req.files.map((file, index) => {
  //   tshirtDetails.photos[index] = { filename: `${file.filename}` };
  // });

  // Assuming you have a Tshirt model
  tshirtsModel.create(tshirtDetails, (error, data) => {
    if (error) {
      console.error('Error creating new t-shirt:', error);
      return res.status(500).json({ errorMessage: 'Internal Server Error' });
    }
    res.json(data);
  });
};

router.post(`/tshirts`, createNewTshirtDocument);

module.exports = router;