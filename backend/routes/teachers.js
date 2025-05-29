const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const requireAuth = require('../middleware/auth');
const isTeacher = require('../middleware/isTeacher');


router.use(requireAuth);
router.use(isTeacher);


router.get('/info', async (req, res) => {
    try {
        const teacher = await User.findById(req.user.id).select('username name email');
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (error) {
        console.error('Error fetching teacher info:', error);
        res.status(500).json({ message: 'Failed to fetch teacher info' });
    }
});


router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id }).populate('students', 'username email');
        res.json(courses.map(course => ({
            _id: course._id,
            name: course.name,
            enrolledStudents: course.students ? course.students.map(student => ({ _id: student._id, username: student.username, email: student.email })) : [],
        })));
    } catch (error) {
        console.error('Error fetching teacher\'s courses with students:', error);
        res.status(500).json({ message: 'Failed to fetch teacher\'s courses with students' });
    }
});


router.post('/courses/:courseId/assignments', async (req, res) => {
    const { title, description, dueDate } = req.body;
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Course not found or not taught by you' });
        }
        const newAssignment = new Assignment({
            title,
            description,
            dueDate,
            course: req.params.courseId,
            instructor: req.user.id,
        });
        const savedAssignment = await newAssignment.save();
        res.status(201).json({ message: 'Assignment created successfully', assignment: savedAssignment });
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ message: 'Failed to create assignment' });
    }
});


router.get('/courses/:courseId/assignments', async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Course not found or not taught by you' });
        }
        const assignments = await Assignment.find({ course: req.params.courseId, instructor: req.user.id }).populate('course', 'name');
        res.json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Failed to fetch assignments' });
    }
});


router.get('/assignments/:assignmentId/submissions', async (req, res) => {
    try {
      
        const assignment = await Assignment.findById(req.params.assignmentId).populate('course', 'instructor');

    
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        
        if (assignment.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to view submissions for this assignment' });
        }

        
        const submissions = await Submission.find({ assignment: req.params.assignmentId }).populate('student', 'username email');
        res.json(submissions);

    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Failed to fetch submissions' });
    }
});


router.put('/submissions/:submissionId/grade', async (req, res) => {
    const { grade, feedback } = req.body;
    try {
        const submission = await Submission.findById(req.params.submissionId).populate('assignment', 'course');
        if (!submission || submission.assignment.course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Submission not found or not related to your course' });
        }
        submission.grade = grade;
        submission.feedback = feedback;
        submission.gradedAt = new Date(); 
        await submission.save();
        res.json({ message: 'Submission graded and feedback sent successfully', submission });
    } catch (error) {
        console.error('Error grading submission:', error);
        res.status(500).json({ message: 'Failed to grade submission' });
    }
});

module.exports = router;