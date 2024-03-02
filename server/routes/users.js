const router = require(`express`).Router();

const usersModel = require(`../models/users`);

const bcrypt = require('bcryptjs'); //for password encryption

const jwt = require('jsonwebtoken');
const fs = require('fs');
const JWT_PRIVATE_KEY = fs.readFileSync(
  process.env.JWT_PRIVATE_KEY_FILENAME,
  'utf8'
);

const multer = require('multer');
const upload = multer({ dest: `${process.env.UPLOADED_FILES_FOLDER}` });

const emptyFolder = require('empty-folder');

const checkThatUserExistsInUsersCollection = (req, res, next) => {
  usersModel.findOne({ email: req.params.email }, (error, data) => {
    if (!data) {
      res.json({ errorMessage: `User is not logged in` });
    } else {
      req.data = data;

      next();
    }
  });
};

const checkThatUserIsNotAlreadyInUsersCollection = (req, res, next) => {
  usersModel.findOne({ email: req.params.email }, (error, data) => {
    if (data) {
      res.json({ errorMessage: `User is not logged in` });
    } else {
      req.data = data;

      next();
    }
  });
};

const checkThatJWTPasswordIsValid = (req, res, next) => {
  bcrypt.compare(req.params.password, req.data.password, (err, result) => {
    if (!result) {
      res.json({ errorMessage: `User is not logged in` });
    }

    next();
  });
};

const checkThatFileIsUploaded = (req, res, next) => {
  if (!req.file) {
    res.json({ errorMessage: `No file was selected to be uploaded` });
  }

  next();
};

const checkThatFileIsAnImageFile = (req, res, next) => {
  if (
    req.file.mimetype !== 'image/png' &&
    req.file.mimetype !== 'image/jpg' &&
    req.file.mimetype !== 'image/jpeg'
  ) {
    fs.unlink(
      `${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`,
      (error) => {
        res.json({ errorMessage: `Only .png, .jpg and .jpeg format accepted` });
      }
    );
  }

  next();
};

const isNewUser = (req, res, next) => {
  // If a user with this email does not already exist, then create new user
  usersModel.findOne({ email: req.params.email }, (uniqueError, uniqueData) => {
    if (uniqueData) {
      res.json({ errorMessage: `User already exists` });
    }
  });

  next();
};

const addNewUserToUsersCollection = (req, res) => {
  bcrypt.hash(
    req.body.password, // Updated to req.body.password instead of req.params.password
    parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS),
    (err, hash) => {
      if (err) {
        return res.status(500).json({ errorMessage: 'Error hashing password' });
      }

      // Create a new user object including additional fields
      const newUser = {
        fullName: req.body.name,
        email: req.body.email,
        password: hash,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        phoneNumber: req.body.phoneNumber,
        address: {
          addressLine1: req.body.addressLine1,
          addressLine2: req.body.addressLine2,
          city: req.body.city,
          county: req.body.county,
          eircode: req.body.eircode,
        },
        profilePhotoFilename: req.file.filename,
      };

      // Save the new user to the database
      usersModel.create(newUser, (error, data) => {
        if (error) {
          console.error('Error registering user:', error);
          return res
            .status(500)
            .json({ errorMessage: 'Error registering user' });
        }

        if (data) {
          // Generate JWT token
          const token = jwt.sign(
            { email: data.email, accessLevel: data.accessLevel },
            JWT_PRIVATE_KEY,
            { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY }
          );

          // Read profile photo as base64
          fs.readFile(
            `${process.env.UPLOADED_FILES_FOLDER}/${req.file.filename}`,
            'base64',
            (err, fileData) => {
              if (err) {
                console.error('Error reading profile photo:', err);
                return res
                  .status(500)
                  .json({ errorMessage: 'Error reading profile photo' });
              }

              // Send response with user details and token
              res.json({
                fullName: data.fullName,
                accessLevel: data.accessLevel,
                email: data.email,
                profilePhoto: fileData,
                token: token,
              });
            }
          );
        } else {
          res.json({ errorMessage: `User was not registered` });
        }
      });
    }
  );
};

const emptyUsersCollection = (req, res, next) => {
  usersModel.deleteMany({}, (error, data) => {
    if (error || !data) {
      res.json({ errorMessage: `User is not logged in` });
    }
  });

  next();
};

const addAdminUserToUsersCollection = (req, res) => {
  const adminPassword = `123!"£qweQWE`;
  bcrypt.hash(
    adminPassword,
    parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS),
    (err, hash) => {
      usersModel.create(
        {
          name: 'Administrator',
          email: 'admin@admin.com',
          password: hash,
          accessLevel: parseInt(process.env.ACCESS_LEVEL_ADMIN),
        },
        (createError, createData) => {
          if (createData) {
            emptyFolder(process.env.UPLOADED_FILES_FOLDER, false, (result) => {
              res.json(createData);
            });
          } else {
            res.json({
              errorMessage: `Failed to create Admin user for testing purposes`,
            });
          }
        }
      );
    }
  );
};

const returnUsersDetailsAsJSON = (req, res) => {
  const token = jwt.sign(
    { email: req.data.email, accessLevel: req.data.accessLevel },
    JWT_PRIVATE_KEY,
    { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRY }
  );

  console.log(req.data);

  fs.readFile(
    `${process.env.UPLOADED_FILES_FOLDER}/${req.data.profilePhotoFilename}`,
    'base64',
    (err, fileData) => {
      if (fileData) {
        res.json({

          name: req.data.name,
          email: req.data.email, 

          userId: req.data._id,
          accessLevel: req.data.accessLevel,
          profilePhotoFilename: req.data.profilePhotoFilename,
          fullName: req.data.fullName,
          dateOfBirth: req.data.dateOfBirth,
          gender: req.data.gender,
          phoneNumber: req.data.phoneNumber,
          address: req.data.address,
          accountCreationDate: req.data.accountCreationDate,
          token: token,
        });
      } else {
        res.json({
          name: req.data.fullName,
          email: req.data.email,
          userId: req.data._id,
          accessLevel: req.data.accessLevel,
          fullName: req.data.fullName,
          dateOfBirth: req.data.dateOfBirth,
          gender: req.data.gender,
          phoneNumber: req.data.phoneNumber,
          address: req.data.address,
          accountCreationDate: req.data.accountCreationDate,
          profilePhoto: null,
          token: token,
        });
      }
    }
  );
};

router.delete('/users/:userId', (req, res) => {
  const userId = req.params.userId;

  // Check if the userId is provided
  if (!userId) {
    return res.status(400).json({ errorMessage: 'User ID is required' });
  }

  usersModel.findByIdAndDelete(userId, (error, deletedUser) => {
    if (error) {
      return res.status(500).json({ errorMessage: 'Internal Server Error' });
    }

    if (!deletedUser) {
      return res.status(404).json({ errorMessage: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  });
});

const logout = (req, res) => {
  res.json({});
};
router.get('/users', (req, res) => {
  usersModel.find({}, (error, users) => {
    if (error) {
      return res.status(500).json({ errorMessage: 'Internal Server Error' });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ errorMessage: 'No users found' });
    }

    // Return user details
    res.json(users);
  });
});

router.post(
  `/users/reset_user_collection`,
  emptyUsersCollection,
  addAdminUserToUsersCollection
);
router.post(
  `/users/register`,
  upload.single('profilePhoto'), // Multer middleware to handle file upload
  checkThatFileIsUploaded, // Custom middleware to check if file is uploaded
  checkThatFileIsAnImageFile, // Custom middleware to check if file is an image
  isNewUser, // Custom middleware to check if user is new
  addNewUserToUsersCollection // Custom middleware to add new user to users collection
);

router.post(
  `/users/register/:name/:email/:password`,
  upload.single('profilePhoto'),
  checkThatFileIsUploaded,
  checkThatFileIsAnImageFile,
  checkThatUserIsNotAlreadyInUsersCollection,
  addNewUserToUsersCollection
);

router.post(
  `/users/login/:email/:password`,
  checkThatUserExistsInUsersCollection,
  checkThatJWTPasswordIsValid,
  returnUsersDetailsAsJSON
);
// Route to fetch user details based on email
router.get(
  '/users/:email',
  checkThatUserExistsInUsersCollection,
  returnUsersDetailsAsJSON
);
router.post(`/users/logout`, logout);

module.exports = router;
