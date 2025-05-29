const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');
const EnrollmentRequest = require('../models/EnrollmentRequest');
const Course = require('../models/Course'); 
const requireAuth = require('../middleware/auth');
const isStudent = require('../middleware/isStudent');


router.use(requireAuth);
router.use(isStudent);


router.get('/info', async (req, res) => {
    try {

        const student = await User.findById(req.user.id)
                                  .select('username name email major courses')
                                  .populate({
                                      path: 'courses',
                                      select: 'name description instructor', 
                                      populate: {
                                          path: 'instructor',
                                          select: 'username' 
                                      }
                                  });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        
        res.json({
            _id: student._id,
            username: student.username,
            name: student.name,
            email: student.email,
            major: student.major,
            enrolledCourses: student.courses.map(course => ({
                id: course._id,
                name: course.name,
                description: course.description, 
                instructor: course.instructor ? course.instructor.username : 'N/A' // Include instructor username
            }))
        });

    } catch (error) {
        console.error('Error fetching student info:', error);
        res.status(500).json({ message: 'Failed to fetch student info' });
    }
});


router.get('/course-requests', async (req, res) => {
    try {
        const requests = await EnrollmentRequest.find({ student: req.user.id })
            .populate('course', 'name _id') 
            .select('course status');
        res.json(requests);
    } catch (error) {
        console.error('Error fetching course requests:', error);
        res.status(500).json({ message: 'Failed to fetch course requests' });
    }
});

router.get('/assignments', async (req, res) => {
    try {
        const student = await User.findById(req.user.id).select('courses');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const courseIds = student.courses.map(course => course._id);
        const assignments = await Assignment.find({ course: { $in: courseIds } }).populate('course', 'name');
        res.json(assignments);
    } catch (error) {
        console.error('Error fetching student assignments:', error);
        res.status(500).json({ message: 'Failed to fetch assignments' });
    }
});


router.get('/assignments/:assignmentId', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.assignmentId).populate('course', 'name');
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        
        const student = await User.findById(req.user.id).select('courses');
        if (!student || !student.courses.includes(assignment.course._id)) {
            return res.status(403).json({ message: 'Unauthorized to access this assignment' });
        }
        res.json(assignment);
    } catch (error) {
        console.error('Error fetching assignment details:', error);
        res.status(500).json({ message: 'Failed to fetch assignment details' });
    }
});


router.post('/assignments/:assignmentId/submit', async (req, res) => {
    try {
        const { submissionText, submissionFileUrl } = req.body; // Adjust based on your submission requirements
        const assignment = await Assignment.findById(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        
        const student = await User.findById(req.user.id).select('courses');
        if (!student || !student.courses.includes(assignment.course._id)) {
            return res.status(403).json({ message: 'You are not enrolled in the course for this assignment' });
        }

        const existingSubmission = await Submission.findOne({ student: req.user.id, assignment: req.params.assignmentId });
        if (existingSubmission) {
            return res.status(400).json({ message: 'You have already submitted this assignment' });
        }

        const newSubmission = new Submission({
            student: req.user.id,
            assignment: req.params.assignmentId,
            submissionText,
            submissionFileUrl,
            submittedAt: new Date(),
        });
        const savedSubmission = await newSubmission.save();
        res.status(201).json({ message: 'Assignment submitted successfully', submission: savedSubmission });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ message: 'Failed to submit assignment' });
    }
});


router.get('/submissions/:assignmentId', async (req, res) => {
    try {
        const submission = await Submission.findOne({ student: req.user.id, assignment: req.params.assignmentId }).populate('assignment', 'title');
        res.json(submission);
    } catch (error) {
        console.error('Error fetching submission:', error);
        res.status(500).json({ message: 'Failed to fetch submission' });
    }
});

router.get('/assignments/:assignmentId/feedback', async (req, res) => {
    try {
        const submission = await Submission.findOne({ student: req.user.id, assignment: req.params.assignmentId }).populate('assignment', 'title');
        if (!submission) {
            return res.status(404).json({ message: 'No submission found for this assignment' });
        }
        res.json({ feedback: submission.feedback, grade: submission.grade });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ message: 'Failed to fetch feedback' });
    }
});

module.exports = router;
