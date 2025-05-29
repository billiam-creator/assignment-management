const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const EnrollmentRequest = require('../models/EnrollmentRequest');
const requireAuth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');


router.use(requireAuth);
router.use(isAdmin);

router.get('/dashboard-data', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCourses = await Course.countDocuments(); 
        res.json({ totalUsers, totalTeachers, totalStudents, totalCourses }); 
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
});

router.get('/teachers', async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('_id username email'); 
        res.json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ message: 'Failed to fetch teachers' });
    }
});

router.get('/students', async (req, res) => { 
    try {
        const students = await User.find({ role: 'student' }).select('_id username email'); 
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Failed to fetch students' });
    }
});

router.get('/users', async (req, res) => { // Route for UserManagement component (all users)
    try {
        const users = await User.find().select('-password'); // Fetch all users, exclude password
        res.json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'username');
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Failed to fetch courses' });
    }
});

router.post('/courses', async (req, res) => {
    const { name, instructorId } = req.body;
    if (!name || !instructorId) { // Ensure instructorId is also checked
        return res.status(400).json({ message: 'Course name and instructor are required' });
    }
    try {
        const newCourse = new Course({ name, instructor: instructorId });
        await newCourse.save();
        res.status(201).json({ message: 'Course added successfully', course: newCourse });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ message: 'Failed to add course' });
    }
});

router.get('/enrollment-requests', async (req, res) => {
    try {
        const requests = await EnrollmentRequest.find({ status: 'pending' })
            .populate('student', 'username')
            .populate('course', 'name');
        res.json(requests);
    } catch (error) {
        console.error('Error fetching enrollment requests:', error);
        res.status(500).json({ message: 'Failed to fetch enrollment requests' });
    }
});

router.put('/enrollment-requests/:requestId/approve', async (req, res) => {
    const { requestId } = req.params;
    try {
        const request = await EnrollmentRequest.findByIdAndUpdate(
            requestId,
            { status: 'approved' },
            { new: true }
        );
        if (!request) {
            return res.status(404).json({ message: 'Enrollment request not found' });
        }
        res.json({ message: 'Enrollment request approved' });
    } catch (error) {
        console.error('Error approving enrollment request:', error);
        res.status(500).json({ message: 'Failed to approve enrollment request' });
    }
});

module.exports = router;

