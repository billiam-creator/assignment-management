const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Course = require('../models/Course'); 
const EnrollmentRequest = require('../models/EnrollmentRequest'); 


router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
        check('role', 'Role is required').isIn(['student', 'teacher', 'admin']),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, role, courses } = req.body;

        try {
            let user = await User.findOne({ $or: [{ email }, { username }] });
            if (user) {
                return res.status(400).json({ message: 'User with this email or username already exists' });
            }

            user = new User({
                username,
                email,
                password,
                role,
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

       
            if (role === 'student' && courses && Array.isArray(courses) && courses.length > 0) {
                for (const courseId of courses) {
                    const courseExists = await Course.findById(courseId);
                    if (courseExists) {
                        const newRequest = new EnrollmentRequest({
                            student: user._id,
                            course: courseId,
                            status: 'pending',
                        });
                        await newRequest.save();
                    } else {
                        console.warn(`Course with ID ${courseId} not found for enrollment request.`);
                    }
                }
            }

            res.status(201).json({ message: 'User registered successfully!', role: user.role, name: user.username });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);


router.post(
    '/login',
    [
        check('identifier', 'Please include a valid email or username').not().isEmpty(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { identifier, password } = req.body;

        try {
            let user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
            if (!user) {
                return res.status(400).json({ message: 'Invalid Credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid Credentials' });
            }

            const payload = {
                user: {
                    id: user.id,
                    role: user.role,
                    name: user.username 
                },
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, role: payload.user.role, name: payload.user.name, message: 'Login successful!' });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;