const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User'); 
const Enrollment = require('../models/Enrollment'); 
const EnrollmentRequest = require('../models/EnrollmentRequest'); 

router.get('/info', async (req, res) => {
    try {
        const student = await User.findById(req.user.id).select('username name major'); // Adjust fields as needed
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error('Error fetching student info:', error);
        res.status(500).json({ message: 'Failed to fetch student info' });
    }
});


router.get('/enrolled-courses', async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id }).populate('course', 'name _id'); // Assuming 'Enrollment' model links student and course
        const enrolledCourses = enrollments.map(enrollment => enrollment.course);
        res.json(enrolledCourses);
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ message: 'Failed to fetch enrolled courses' });
    }
});


router.get('/course-requests', async (req, res) => {
    try {
        const requests = await EnrollmentRequest.find({ student: req.user.id }).populate('course', 'name _id status');
        res.json(requests);
    } catch (error) {
        console.error('Error fetching course requests:', error);
        res.status(500).json({ message: 'Failed to fetch course requests' });
    }
});


router.get('/assignments', async (req, res) => {
    try {
        // Find enrollments for the student
        const enrollments = await Enrollment.find({ student: req.user.id }).select('course');
        const courseIds = enrollments.map(enrollment => enrollment.course);

        // Find assignments for those courses
        const assignments = await Assignment.find({ course: { $in: courseIds } });
        res.json(assignments);
    } catch (error) {
        console.error('Error fetching student assignments:', error);
        res.status(500).json({ message: 'Failed to fetch assignments' });
    }
});


router.get('/:studentId/assignments', async (req, res) => { /* ... */ });
router.post('/submissions', async (req, res) => { /* ... */ });
router.get('/:studentId/results', async (req, res) => { /* ... */ });

module.exports = router;