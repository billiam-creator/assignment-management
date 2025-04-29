const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Assignment = require('../models/Assignment');

// checking if the user is a teacher
const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    next();
  } else {
    return res.status(403).json({ msg: 'Unauthorized' });
  }
};

// @route   POST /api/assignments
// @desc    Create a new assignment (Teacher only)
// @access  Private
router.post('/', auth, isTeacher, async (req, res) => {

  res.json({ msg: 'Create assignment route' });
});

// @route   GET /api/assignments
// @desc    Get all assignments (Admin/Teacher can see all, Students see their own)
// @access  Private
router.get('/', auth, async (req, res) => {

  res.json({ msg: 'Get assignments route' });
});

// @route   GET /api/assignments/:id
// @desc    Get assignment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {

  res.json({ msg: 'Get assignment by ID route' });
});

// @route   PUT /api/assignments/:id/submit
// @desc    Student submits an assignment
// @access  Private
router.put('/:id/submit', auth, async (req, res) => {
  // Implementation will go here
  res.json({ msg: 'Submit assignment route' });
});

// @route   PUT /api/assignments/:assignmentId/grade/:submissionId
// @desc    Teacher grades a student\'s submission
// @access  Private
router.put('/:assignmentId/grade/:submissionId', auth, isTeacher, async (req, res) => {
  
  res.json({ msg: 'Grade assignment route' });
});

module.exports = router;