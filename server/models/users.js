const mongoose = require(`mongoose`);

let usersSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    phoneNumber: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    accessLevel: {
      type: Number,
      default: parseInt(process.env.ACCESS_LEVEL_NORMAL_USER),
    },
    profilePhotoFilename: { type: String, default: '' },
    accountCreationDate: { type: Date, default: Date.now },
    lastLoginDate: { type: Date },
  },
  {
    collection: `users`,
  }
);

module.exports = mongoose.model(`User`, usersSchema);
