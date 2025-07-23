// Load environment variables from .env file
require('dotenv').config();

// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import models
const User = require('./models/User');
const BloodUnit = require('./models/BloodUnit');
const BloodBank = require('./models/BloodBank');
const BloodRequest = require('./models/BloodRequest');
const Appointment = require('./models/Appointment');

// Import middleware
const auth = require('./middleware/auth');

// Initialize the Express application
const app = express();

// Middleware
app.use(express.json());

// CORS: Allow all origins for development, restrict in production if needed
app.use(cors({
  origin: '*', // Change to your frontend URL in production for security
}));

// MongoDB Connection URI from .env file
const mongoURI = process.env.MONGO_URI;

// JWT Secret from environment variables
const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB Atlas connected successfully!');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// --- Custom Middleware for Role-Based Authorization ---
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ msg: 'Authorization denied, no user role found' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Forbidden: You do not have permission to perform this action' });
    }
    next();
  };
};

// --- API Routes ---

// Health check route
app.get('/', (req, res) => {
  res.send('Blood Bank Backend API is running!');
});

// AUTHENTICATION ROUTES
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role, firstName, lastName, contactNumber, address } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ email, password: hashedPassword, role: role || 'donor', firstName, lastName, contactNumber, address });
    await user.save();
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ msg: 'User registered successfully', token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during registration');
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ msg: 'Logged in successfully', token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during login');
  }
});

// PROFILE MANAGEMENT ROUTES
app.get('/api/profile/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User profile not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching profile');
  }
});

app.put('/api/profile/me', auth, async (req, res) => {
  const { firstName, lastName, contactNumber, address } = req.body;
  const profileFields = {};
  if (firstName) profileFields.firstName = firstName;
  if (lastName) profileFields.lastName = lastName;
  if (contactNumber) profileFields.contactNumber = contactNumber;
  if (address) {
    profileFields.address = {};
    if (address.street) profileFields.address.street = address.street;
    if (address.city) profileFields.address.city = address.city;
    if (address.state) profileFields.address.state = address.state;
    if (address.zipCode) profileFields.address.zipCode = address.zipCode;
    if (address.country) profileFields.address.country = address.country;
  }
  try {
    let user = await User.findById(req.user.id);
    if (user) {
      user = await User.findOneAndUpdate({ _id: req.user.id }, { $set: profileFields }, { new: true }).select('-password');
      return res.json({ msg: 'Profile updated successfully', user });
    }
    res.status(404).json({ msg: 'User not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error updating profile');
  }
});

// DONOR ELIGIBILITY ROUTES
app.put('/api/profile/eligibility', auth, authorizeRole(['donor']), async (req, res) => {
  const { bloodType, lastDonationDate, medicalHistory } = req.body;
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Donor profile not found' });
    }
    if (user.role !== 'donor') {
      return res.status(403).json({ msg: 'Forbidden: Only donor accounts can submit eligibility.' });
    }
    if (bloodType) user.bloodType = bloodType;
    if (lastDonationDate) user.lastDonationDate = new Date(lastDonationDate);
    if (medicalHistory) {
      user.medicalHistory = {
        hasChronicIllness: medicalHistory.hasChronicIllness || false,
        recentTravelToRiskArea: medicalHistory.recentTravelToRiskArea || false,
        recentSurgery: medicalHistory.recentSurgery || false,
        onMedication: medicalHistory.onMedication || false,
        notes: medicalHistory.notes || ''
      };
      if (user.medicalHistory.hasChronicIllness || user.medicalHistory.recentTravelToRiskArea || user.medicalHistory.recentSurgery) {
        user.eligibilityStatus = 'Deferred';
      } else {
        if (user.lastDonationDate) {
          const minDaysBetweenDonations = 56;
          const lastDonationMillis = user.lastDonationDate.getTime();
          const nowMillis = Date.now();
          const diffDays = Math.floor((nowMillis - lastDonationMillis) / (1000 * 60 * 60 * 24));
          if (diffDays < minDaysBetweenDonations) {
            user.eligibilityStatus = 'Deferred';
          } else {
            user.eligibilityStatus = 'Eligible';
          }
        } else {
          user.eligibilityStatus = 'Eligible';
        }
      }
    } else {
      user.eligibilityStatus = 'Unknown';
    }
    await user.save();
    res.json({ msg: 'Eligibility updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error updating eligibility', error: err.message });
  }
});

// USER MANAGEMENT (FOR ADMIN/STAFF)
app.get('/api/users', auth, authorizeRole(['admin', 'supervisor', 'bloodbank_staff']), async (req, res) => {
  try {
    const { role } = req.query;
    let users;
    if (role) {
      users = await User.find({ role: role }).select('-password');
    } else {
      users = await User.find().select('-password');
    }
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching users');
  }
});

// BLOOD BANK ROUTES
app.post('/api/blood-banks', auth, authorizeRole(['admin']), async (req, res) => {
  const { name, contactEmail, contactPhone, address, location } = req.body;
  try {
    let bloodBank = await BloodBank.findOne({ $or: [{ name }, { contactEmail }] });
    if (bloodBank) {
      return res.status(400).json({ msg: 'Blood bank with this name or email already exists' });
    }
    bloodBank = new BloodBank({ name, contactEmail, contactPhone, address, location, managedBy: req.user.id });
    await bloodBank.save();
    res.status(201).json({ msg: 'Blood bank created successfully', bloodBank });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error creating blood bank');
  }
});

app.get('/api/blood-banks', async (req, res) => {
  try {
    const bloodBanks = await BloodBank.find();
    res.json(bloodBanks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching blood banks');
  }
});

// BLOOD UNIT ROUTES
app.post('/api/blood-units', auth, authorizeRole(['bloodbank_staff', 'admin']), async (req, res) => {
  const { unitId, bloodGroup, componentType, collectionDate, expiryDate, bloodBankId, donorId } = req.body;
  try {
    let bloodUnit = await BloodUnit.findOne({ unitId });
    if (bloodUnit) {
      return res.status(400).json({ msg: 'Blood unit with this ID already exists' });
    }
    const bloodBankExists = await BloodBank.findById(bloodBankId);
    if (!bloodBankExists) {
      return res.status(404).json({ msg: 'Associated Blood Bank not found' });
    }
    let donorObjectId = null;
    if (donorId) {
      if (!mongoose.Types.ObjectId.isValid(donorId)) {
        return res.status(400).json({ msg: 'Invalid Donor User ID format' });
      }
      const donorExists = await User.findById(donorId);
      if (!donorExists || donorExists.role !== 'donor') {
        return res.status(404).json({ msg: 'Associated Donor not found or is not a donor role' });
      }
      donorObjectId = donorExists._id;
    }
    bloodUnit = new BloodUnit({ unitId, bloodGroup, componentType, collectionDate, expiryDate, bloodBank: bloodBankId, donor: donorObjectId });
    await bloodUnit.save();
    res.status(201).json({ msg: 'Blood unit added successfully', bloodUnit });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error adding blood unit', error: err.message });
  }
});

app.get('/api/blood-units', auth, authorizeRole(['bloodbank_staff', 'admin', 'supervisor']), async (req, res) => {
  try {
    const bloodUnits = await BloodUnit.find().populate('bloodBank', 'name').populate('donor', 'firstName lastName email');
    res.json(bloodUnits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching blood units');
  }
});

app.get('/api/blood-units/inventory-summary', async (req, res) => {
  try {
    const summary = await BloodUnit.aggregate([
      { $match: { status: 'Available' } },
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
      { $project: { _id: 0, bloodGroup: '$_id', count: 1 } },
      { $sort: { bloodGroup: 1 } }
    ]);
    const allBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const finalSummary = allBloodGroups.map(group => {
      const found = summary.find(item => item.bloodGroup === group);
      return { bloodGroup: group, count: found ? found.count : 0 };
    });
    res.json(finalSummary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching inventory summary');
  }
});

app.put('/api/blood-units/:id', auth, authorizeRole(['bloodbank_staff', 'admin']), async (req, res) => {
  const { status, recipient, request } = req.body;
  const unitId = req.params.id;
  try {
    let bloodUnit = await BloodUnit.findById(unitId);
    if (!bloodUnit) {
      bloodUnit = await BloodUnit.findOne({ unitId: unitId });
      if (!bloodUnit) {
        return res.status(404).json({ msg: 'Blood unit not found' });
      }
    }
    const updateFields = {};
    if (status) updateFields.status = status;
    if (recipient) {
      if (!mongoose.Types.ObjectId.isValid(recipient)) {
        return res.status(400).json({ msg: 'Invalid Recipient User ID format' });
      }
      updateFields.recipient = recipient;
    }
    if (request) {
      if (!mongoose.Types.ObjectId.isValid(request)) {
        return res.status(400).json({ msg: 'Invalid Blood Request ID format' });
      }
      updateFields.request = request;
    }
    bloodUnit = await BloodUnit.findOneAndUpdate({ _id: bloodUnit._id }, { $set: updateFields }, { new: true });
    res.json({ msg: 'Blood unit updated successfully', bloodUnit });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error updating blood unit');
  }
});

// BLOOD REQUEST ROUTES
app.post('/api/blood-requests', auth, authorizeRole(['hospital', 'doctor']), async (req, res) => {
  const { bloodGroup, componentType, quantity, urgency, notes, doctorId } = req.body;
  try {
    const hospitalId = req.user.role === 'hospital' ? req.user.id : null;
    let doctorObjectId = null;
    if (req.user.role === 'doctor') {
      doctorObjectId = req.user.id;
    } else if (doctorId) {
      if (!mongoose.Types.ObjectId.isValid(doctorId)) {
        return res.status(400).json({ msg: 'Invalid Doctor User ID format' });
      }
      const doctorExists = await User.findById(doctorId);
      if (!doctorExists || doctorExists.role !== 'doctor') {
        return res.status(404).json({ msg: 'Associated Doctor not found or is not a doctor role.' });
      }
      doctorObjectId = doctorExists._id;
    }
    const generatedRequestId = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newRequest = new BloodRequest({
      requestId: generatedRequestId,
      hospital: hospitalId,
      doctor: doctorObjectId,
      bloodGroup,
      componentType,
      quantity,
      urgency,
      notes,
      requestDate: Date.now()
    });
    await newRequest.save();
    res.status(201).json({ msg: 'Blood request created successfully', request: newRequest });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error creating blood request', error: err.message });
  }
});

app.get('/api/blood-requests', auth, authorizeRole(['bloodbank_staff', 'supervisor', 'admin']), async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate('hospital', 'firstName lastName email')
      .populate('doctor', 'firstName lastName email')
      .populate('assignedUnits', 'unitId bloodGroup componentType');
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching blood requests');
  }
});

app.get('/api/blood-requests/my', auth, authorizeRole(['hospital', 'doctor']), async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'hospital') {
      requests = await BloodRequest.find({ hospital: req.user.id })
        .populate('doctor', 'firstName lastName email')
        .populate('assignedUnits', 'unitId bloodGroup componentType');
    } else if (req.user.role === 'doctor') {
      requests = await BloodRequest.find({ doctor: req.user.id })
        .populate('hospital', 'firstName lastName email')
        .populate('assignedUnits', 'unitId bloodGroup componentType');
    } else {
      return res.status(403).json({ msg: 'Forbidden: Only hospitals or doctors can view their own requests.' });
    }
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching my blood requests');
  }
});

app.put('/api/blood-requests/:id/status', auth, authorizeRole(['bloodbank_staff', 'supervisor', 'admin']), async (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;
  try {
    let request = await BloodRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ msg: 'Blood request not found' });
    }
    if (!['Approved', 'Rejected', 'Fulfilled', 'Cancelled'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status provided' });
    }
    request.status = status;
    if (status === 'Fulfilled') {
      request.fulfillmentDate = Date.now();
    }
    await request.save();
    res.json({ msg: `Request status updated to ${status}`, request });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error updating request status');
  }
});

app.put('/api/blood-requests/:id/fulfill', auth, authorizeRole(['bloodbank_staff', 'admin']), async (req, res) => {
  const requestId = req.params.id;
  const { assignedUnitIds } = req.body;
  if (!Array.isArray(assignedUnitIds) || assignedUnitIds.length === 0) {
    return res.status(400).json({ msg: 'Please provide an array of assignedUnitIds' });
  }
  try {
    let request = await BloodRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ msg: 'Blood request not found' });
    }
    if (request.status === 'Fulfilled' || request.status === 'Cancelled') {
      return res.status(400).json({ msg: `Request is already ${request.status}. Cannot fulfill again.` });
    }
    const validUnitObjectIds = assignedUnitIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validUnitObjectIds.length !== assignedUnitIds.length) {
      return res.status(400).json({ msg: 'One or more assignedUnitIds are invalid format.' });
    }
    const unitsToAssign = await BloodUnit.find({ _id: { $in: validUnitObjectIds }, status: 'Available' });
    if (unitsToAssign.length < assignedUnitIds.length) {
      return res.status(400).json({ msg: 'One or more assigned units are not found or not available.' });
    }
    if (unitsToAssign.length < request.quantity) {
      return res.status(400).json({ msg: `Not enough available units provided. Requested: ${request.quantity}, Provided: ${unitsToAssign.length}` });
    }
    for (const unit of unitsToAssign) {
      if (unit.bloodGroup !== request.bloodGroup || unit.componentType !== request.componentType) {
        return res.status(400).json({ msg: `Assigned unit ${unit.unitId} does not match requested blood group/component type.` });
      }
    }
    const unitUpdatePromises = unitsToAssign.map(unit =>
      BloodUnit.findByIdAndUpdate(unit._id, { status: 'Used', recipient: request.hospital, request: request._id }, { new: true })
    );
    await Promise.all(unitUpdatePromises);
    request.status = 'Fulfilled';
    request.fulfillmentDate = Date.now();
    request.assignedUnits = unitsToAssign.map(unit => unit._id);
    await request.save();
    res.json({ msg: 'Blood request fulfilled successfully', request });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error fulfilling blood request', error: err.message });
  }
});

// APPOINTMENT ROUTES
app.post('/api/appointments', auth, authorizeRole(['donor']), async (req, res) => {
  const { bloodBank, appointmentDate, bloodGroup, notes } = req.body;
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ msg: 'Forbidden: Only donors can book appointments.' });
    }
    if (!mongoose.Types.ObjectId.isValid(bloodBank)) {
      return res.status(400).json({ msg: 'Invalid Blood Bank ID format.' });
    }
    const bloodBankExists = await BloodBank.findById(bloodBank);
    if (!bloodBankExists) {
      return res.status(404).json({ msg: 'Blood Bank not found.' });
    }
    const newAppointment = new Appointment({ donor: req.user.id, bloodBank, appointmentDate: new Date(appointmentDate), bloodGroup, notes });
    await newAppointment.save();
    res.status(201).json({ msg: 'Appointment booked successfully', appointment: newAppointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error booking appointment', error: err.message });
  }
});

app.get('/api/appointments/my', auth, authorizeRole(['donor']), async (req, res) => {
  try {
    const appointments = await Appointment.find({ donor: req.user.id })
      .populate('bloodBank', 'name contactEmail address');
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching donor appointments');
  }
});

app.get('/api/appointments', auth, authorizeRole(['bloodbank_staff', 'supervisor', 'admin']), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('donor', 'firstName lastName email contactNumber')
      .populate('bloodBank', 'name contactEmail address');
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching all appointments');
  }
});

app.put('/api/appointments/:id/status', auth, authorizeRole(['bloodbank_staff', 'supervisor', 'admin']), async (req, res) => {
  const appointmentId = req.params.id;
  const { status } = req.body;
  try {
    let appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    if (!['Scheduled', 'Completed', 'Cancelled', 'No-Show'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status provided' });
    }
    appointment.status = status;
    await appointment.save();
    res.json({ msg: `Appointment status updated to ${status}`, appointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error updating appointment status');
  }
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});