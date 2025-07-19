// Load environment variables from .env file
require('dotenv').config();

// Import necessary packages
const express = require('express'); // For creating the server
const mongoose = require('mongoose'); // For interacting with MongoDB
const cors = require('cors'); // For handling Cross-Origin Resource Sharing
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For creating JSON Web Tokens

// Import models
const User = require('./models/User');
const BloodUnit = require('./models/BloodUnit');
const BloodBank = require('./models/BloodBank');

// Import middleware
const auth = require('./middleware/auth'); // Authentication middleware

// Initialize the Express application
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(cors()); // Enable CORS for all origins (for development)

// MongoDB Connection URI from .env file
const mongoURI = process.env.MONGO_URI;

// JWT Secret from environment variables
const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey'; // Fallback for development (use a strong key in .env)

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
// This middleware checks if the authenticated user has one of the allowed roles
const authorizeRole = (roles) => {
  return (req, res, next) => {
    // req.user is populated by the 'auth' middleware
    if (!req.user || !req.user.role) {
      return res.status(401).json({ msg: 'Authorization denied, no user role found' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Forbidden: You do not have permission to perform this action' });
    }
    next(); // User has the required role, proceed to the next middleware/route handler
  };
};

// --- API Routes ---

// Basic Route for testing the server
app.get('/', (req, res) => {
  res.send('Blood Bank Backend API is running!');
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
app.post('/api/auth/register', async (req, res) => {
  const { email, password, role, firstName, lastName, contactNumber, address } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt (random string)
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

    // 3. Create a new user instance
    user = new User({
      email,
      password: hashedPassword, // Store the hashed password
      role: role || 'donor', // Default to 'donor' if not provided
      firstName,
      lastName,
      contactNumber,
      address
    });

    // 4. Save the user to the database
    await user.save();

    // 5. Generate JWT for the registered user (auto-login)
    const payload = {
      user: {
        id: user.id, // MongoDB's unique ID for the user
        role: user.role
      }
    };

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ msg: 'User registered successfully', token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during registration');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (Login)
// @access  Public
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' }); // Generic message for security
    }

    // 2. Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Generate JWT for the logged-in user
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ msg: 'Logged in successfully', token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during login');
  }
});

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private (requires authentication token)
app.get('/api/profile/me', auth, async (req, res) => {
  try {
    // req.user is populated by the auth middleware with user id and role
    const user = await User.findById(req.user.id).select('-password'); // Find user by ID, exclude password field
    if (!user) {
      return res.status(404).json({ msg: 'User profile not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching profile');
  }
});

// @route   PUT /api/profile/me
// @desc    Update current user's profile
// @access  Private (requires authentication token)
app.put('/api/profile/me', auth, async (req, res) => {
  const { firstName, lastName, contactNumber, address } = req.body;

  // Build profile object
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
      // Update existing user profile
      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: profileFields }, // $set updates only the provided fields
        { new: true } // Return the updated document
      ).select('-password'); // Exclude password from response

      return res.json({ msg: 'Profile updated successfully', user });
    }

    res.status(404).json({ msg: 'User not found' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error updating profile');
  }
});


// --- Blood Bank Routes ---

// @route   POST /api/blood-banks
// @desc    Create a new blood bank
// @access  Private (Admin only)
app.post('/api/blood-banks', auth, authorizeRole(['admin']), async (req, res) => {
  const { name, contactEmail, contactPhone, address } = req.body;

  try {
    // Check if a blood bank with the same name or email already exists
    let bloodBank = await BloodBank.findOne({ $or: [{ name }, { contactEmail }] });
    if (bloodBank) {
      return res.status(400).json({ msg: 'Blood bank with this name or email already exists' });
    }

    bloodBank = new BloodBank({
      name,
      contactEmail,
      contactPhone,
      address,
      managedBy: req.user.id // Assign the admin who created it as manager
    });

    await bloodBank.save();
    res.status(201).json({ msg: 'Blood bank created successfully', bloodBank });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error creating blood bank');
  }
});

// @route   GET /api/blood-banks
// @desc    Get all blood banks
// @access  Public (or All Authenticated Users)
app.get('/api/blood-banks', async (req, res) => {
  try {
    const bloodBanks = await BloodBank.find();
    res.json(bloodBanks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching blood banks');
  }
});


// --- Blood Unit Routes ---

// @route   POST /api/blood-units
// @desc    Add a new blood unit
// @access  Private (Blood Bank Staff, Admin)
app.post('/api/blood-units', auth, authorizeRole(['bloodbank_staff', 'admin']), async (req, res) => {
  const { unitId, bloodGroup, componentType, collectionDate, expiryDate, bloodBankId, donorId } = req.body;

  try {
    // Check if unitId already exists
    let bloodUnit = await BloodUnit.findOne({ unitId });
    if (bloodUnit) {
      return res.status(400).json({ msg: 'Blood unit with this ID already exists' });
    }

    // Check if the bloodBankId provided is valid
    const bloodBankExists = await BloodBank.findById(bloodBankId);
    if (!bloodBankExists) {
      return res.status(404).json({ msg: 'Associated Blood Bank not found' });
    }

    // Optional: Check if donorId is valid if provided
    if (donorId) {
      const donorExists = await User.findById(donorId);
      if (!donorExists || donorExists.role !== 'donor') {
        return res.status(404).json({ msg: 'Associated Donor not found or is not a donor' });
      }
    }

    bloodUnit = new BloodUnit({
      unitId,
      bloodGroup,
      componentType,
      collectionDate,
      expiryDate,
      bloodBank: bloodBankId, // Store the ObjectId of the blood bank
      donor: donorId // Store the ObjectId of the donor
    });

    await bloodUnit.save();
    res.status(201).json({ msg: 'Blood unit added successfully', bloodUnit });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error adding blood unit');
  }
});

// @route   GET /api/blood-units
// @desc    Get all blood units (for inventory management)
// @access  Private (Blood Bank Staff, Admin, Supervisor)
app.get('/api/blood-units', auth, authorizeRole(['bloodbank_staff', 'admin', 'supervisor']), async (req, res) => {
  try {
    // Populate bloodBank and donor fields to get their details, not just IDs
    const bloodUnits = await BloodUnit.find().populate('bloodBank', 'name').populate('donor', 'firstName lastName email');
    res.json(bloodUnits);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error fetching blood units');
  }
});

// @route   GET /api/blood-units/inventory-summary
// @desc    Get a summary of available blood groups
// @access  Public (or All Authenticated Users) - useful for public display or hospital dashboards
app.get('/api/blood-units/inventory-summary', async (req, res) => {
  try {
    const summary = await BloodUnit.aggregate([
      { $match: { status: 'Available' } }, // Only count available units
      {
        $group: {
          _id: '$bloodGroup', // Group by bloodGroup
          count: { $sum: 1 } // Count units in each group
        }
      },
      {
        $project: {
          _id: 0, // Exclude _id from the final output
          bloodGroup: '$_id', // Rename _id to bloodGroup
          count: 1
        }
      },
      { $sort: { bloodGroup: 1 } } // Sort by blood group
    ]);

    // Initialize all blood groups to 0 if not present in summary
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


// @route   PUT /api/blood-units/:id
// @desc    Update a blood unit's status or details
// @access  Private (Blood Bank Staff, Admin)
app.put('/api/blood-units/:id', auth, authorizeRole(['bloodbank_staff', 'admin']), async (req, res) => {
  const { status, recipient, request } = req.body; // Can update status, assign recipient/request
  const unitId = req.params.id;

  try {
    let bloodUnit = await BloodUnit.findById(unitId); // Find by Mongoose _id

    if (!bloodUnit) {
      // Also try finding by custom unitId if _id doesn't work (e.g., if user sends unitId string)
      bloodUnit = await BloodUnit.findOne({ unitId: unitId });
      if (!bloodUnit) {
        return res.status(404).json({ msg: 'Blood unit not found' });
      }
    }

    // Build update object
    const updateFields = {};
    if (status) updateFields.status = status;
    if (recipient) updateFields.recipient = recipient;
    if (request) updateFields.request = request;

    // Perform the update
    bloodUnit = await BloodUnit.findOneAndUpdate(
      { _id: bloodUnit._id }, // Use the actual _id found
      { $set: updateFields },
      { new: true }
    );

    res.json({ msg: 'Blood unit updated successfully', bloodUnit });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error updating blood unit');
  }
});


// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
