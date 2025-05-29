const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const moment = require('moment');


const isTeacher = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        next();
    } else {
        return res.status(403).json({ message: 'Unauthorized: Teacher role required' });
    }
};

router.use(isTeacher);


router.get('/info', async (req, res) => {
    try {
        const teacher = await User.findById(req.user.id).select('username name email'); // Include email
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (error) {
        console.error('Error fetching teacher info:', error);
        res.status(500).json({ message: 'Failed to fetch teacher info' });
    }
});


router.get('/dashboard-data', async (req, res) => {
    try {
        const myCoursesCount = await Course.countDocuments({ instructor: req.user.id });
        const upcomingAssignmentsCount = await Assignment.countDocuments({
            instructor: req.user.id,
            dueDate: { $gte: new Date() }
        });
        res.json({ myCoursesCount, upcomingAssignmentsCount });
    } catch (error) {
        console.error('Error fetching teacher dashboard data:', error);
        res.status(500).json({ message: 'Failed to fetch teacher dashboard data' });
    }
});


router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });
        res.json(courses);
    } catch (error) {
        console.error('Error fetching teacher\'s courses:', error);
        res.status(500).json({ message: 'Failed to fetch teacher\'s courses' });
    }
});


router.get('/courses/:courseId/students', async (req, res) => {
    const { courseId } = req.params;
    try {
        
        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Course not found or not taught by you' });
        }
       
        const enrolledStudents = await User.find({ courses: courseId, role: 'student' }).select('username email');
        res.json(enrolledStudents);
    } catch (error) {
        console.error('Error fetching students for course:', error);
        res.status(500).json({ message: 'Failed to fetch students for this course' });
    }
});


router.get('/courses/:courseId/assignments', async (req, res) => {
    const { courseId } = req.params;
    try {
        
        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Course not found or not taught by you' });
        }
        const assignments = await Assignment.find({ course: courseId, instructor: req.user.id });
        res.json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Failed to fetch assignments' });
    }
});


router.post('/courses/:courseId/assignments', async (req, res) => {
    const { courseId } = req.params;
    const { title, description, dueDate } = req.body;
    try {
        
        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Course not found or not taught by you' });
        }
        const newAssignment = new Assignment({
            title,
            description,
            dueDate,
            course: courseId,
            instructor: req.user.id,
        });
        await newAssignment.save();
        res.status(201).json({ message: 'Assignment created successfully', assignment: newAssignment });
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ message: 'Failed to create assignment' });
    }
});


module.exports= router;