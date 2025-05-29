const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming your User model is in '../models/User'
const EnrollmentRequest = require('../models/EnrollmentRequest'); // Import EnrollmentRequest model

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password, role, courses } = req.body; // Destructure 'courses'

    console.log('Registration Request Body:', req.body); // Log the incoming data

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    try {
        // Check if user exists by username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword); // Log the hashed password

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'student', // Default to 'student' if role is not provided
        });

        const savedUser = await newUser.save();
        console.log('Saved User:', savedUser); // Log the saved user object

        // If the registered user is a student and selected courses, create enrollment requests
        if (savedUser.role === 'student' && courses && Array.isArray(courses) && courses.length > 0) {
            for (const courseId of courses) {
                // Check if courseId is a valid ObjectId (optional but good practice)
                // if (mongoose.Types.ObjectId.isValid(courseId)) {
                    const newRequest = new EnrollmentRequest({
                        student: savedUser._id,
                        course: courseId,
                        status: 'pending' // Set initial status to pending
                    });
                    await newRequest.save();
                    console.log(`Created enrollment request for student ${savedUser._id} in course ${courseId}`);
                // } else {
                //     console.warn(`Invalid course ID received during registration: ${courseId}`);
                // }
            }
        }

        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Failed to register user.' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body; // Using 'identifier' for username or email

    try {
        const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key', // Use environment variable for secret
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, userId: user._id, role: user.role, message: 'Login successful!' });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Failed to login.' });
    }
});

module.exports = router;