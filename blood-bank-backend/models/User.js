const mongoose = require('mongoose');

// Define the User Schema
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
  // Common profile fields
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
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  // --- New Fields for Donor Eligibility ---
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null], // Allow null if not yet set
    default: null,
  },
  lastDonationDate: {
    type: Date,
    default: null,
  },
  // Status based on eligibility screening
  eligibilityStatus: {
    type: String,
    enum: ['Unknown', 'Eligible', 'Deferred', 'Needs Review'],
    default: 'Unknown',
  },
  // Medical history for eligibility screening
  medicalHistory: {
    hasChronicIllness: { type: Boolean, default: false },
    recentTravelToRiskArea: { type: Boolean, default: false },
    recentSurgery: { type: Boolean, default: false },
    onMedication: { type: Boolean, default: false },
    // Add more specific questions as needed for a real system
    notes: { type: String, trim: true }
  },
  // --- End New Fields ---

}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Create the User Model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
