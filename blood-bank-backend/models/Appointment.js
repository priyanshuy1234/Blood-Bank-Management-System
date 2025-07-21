const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  // Reference to the donor who booked the appointment
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the 'User' model (role 'donor')
    required: true,
  },
  // Reference to the blood bank where the appointment is scheduled
  bloodBank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloodBank', // Refers to the 'BloodBank' model
    required: true,
  },
  // Date and time of the appointment
  appointmentDate: {
    type: Date,
    required: true,
  },
  // Requested blood group (optional, can be confirmed at donation)
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
    default: null,
  },
  // Status of the appointment
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show'],
    default: 'Scheduled',
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create the Appointment Model
const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;