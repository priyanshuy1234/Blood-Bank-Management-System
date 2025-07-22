const mongoose = require('mongoose');

const BloodBankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    // GeoJSON for location-based queries
    location: {
      type: {
        type: String,
        enum: ['Point'], // GeoJSON Point type
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0], // Default to [0,0] if not provided
      },
    },
  },
  // Reference to the supervisor/admin managing this blood bank (optional)
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the 'User' model
  },
  // Charges per unit for each blood group (optional, can be a sub-document or separate model)
  charges: {
    'A+': { type: Number, default: 0 },
    'A-': { type: Number, default: 0 },
    'B+': { type: Number, default: 0 },
    'B-': { type: Number, default: 0 },
    'AB+': { type: Number, default: 0 },
    'AB-': { type: Number, default: 0 },
    'O+': { type: Number, default: 0 },
    'O-': { type: Number, default: 0 },
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create a 2dsphere index for geospatial queries
// This index is crucial for performing efficient proximity searches
BloodBankSchema.index({ 'address.location': '2dsphere' });

// Create the BloodBank Model
const BloodBank = mongoose.model('BloodBank', BloodBankSchema);

module.exports = BloodBank;
