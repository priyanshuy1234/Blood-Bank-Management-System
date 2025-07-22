const mongoose = require('mongoose');

const BloodUnitSchema = new mongoose.Schema({
  // Unique identifier for the blood unit (e.g., barcode ID)
  unitId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // All standard blood groups
  },
  componentType: {
    type: String,
    required: true,
    enum: ['Whole Blood', 'Red Blood Cells', 'Plasma', 'Platelets', 'Cryoprecipitate'], // Common blood components
  },
  collectionDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Reserved', 'Used', 'Discarded', 'Expired'], // Status of the blood unit
    default: 'Available',
  },
  // Reference to the BloodBank where this unit is stored
  bloodBank: {
    type: mongoose.Schema.Types.ObjectId, // This will store the ObjectId of a BloodBank document
    ref: 'BloodBank', // Refers to the 'BloodBank' model
    required: true,
  },
  // Reference to the Donor who donated this unit (optional, but good for traceability)
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the 'User' model (assuming Donor is a User role)
    default: null, // <-- THIS IS THE CRUCIAL ADDITION: Allows null if no donorId is provided
    // required: false, // Explicitly false, or just omit 'required' if 'default: null' is present
  },
  // Reference to the recipient/request if used/reserved
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the 'User' model
    default: null, // Also set default to null for recipient
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodRequest', // Will refer to a BloodRequest model (to be created later)
    default: null, // Also set default to null for request
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create the BloodUnit Model
const BloodUnit = mongoose.model('BloodUnit', BloodUnitSchema);

module.exports = BloodUnit;
