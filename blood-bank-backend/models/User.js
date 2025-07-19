const mongoose = require('mongoose'); // Import Mongoose

// Define the User Schema
// This schema defines the structure of a user document in MongoDB
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email addresses are unique across users
    lowercase: true, // Stores emails in lowercase
    trim: true, // Removes whitespace from both ends of a string
    match: [/.+@.+\..+/, 'Please enter a valid email address'] // Basic email format validation
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'] // Minimum password length
  },
  role: {
    type: String,
    enum: ['donor', 'hospital', 'doctor', 'bloodbank_staff', 'supervisor', 'admin'], // Predefined roles
    default: 'donor', // Default role for new registrations
    required: true
  },
  // Common profile fields (can be expanded later in separate profile models)
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  contactNumber: {
    type: String,
    trim: true,
    // Optional: Add regex for phone number validation if needed
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  // Timestamps for creation and last update
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Create the User Model from the schema
// Mongoose will automatically create a collection named 'users' (lowercase, plural) in MongoDB
const User = mongoose.model('User', userSchema);

// Export the User model so it can be used in other parts of the application
module.exports = User;