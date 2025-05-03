const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission'); // Ensure path is correct

// GET assignments for a specific student
router.get('/:studentId/assignments', async (req, res) => {
  const { studentId } = req.params;
  try {
    const assignments = await Assignment.find({ student: studentId }); // Adjust query as needed
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
});

// POST a submission for an assignment
router.post('/submissions', async (req, res) => {
  const { studentId, assignmentId, submissionText } = req.body;
  try {
    const newSubmission = new Submission({
      student: studentId,
      assignment: assignmentId,
      submissionText: submissionText,
    });
    const savedSubmission = await newSubmission.save();
    res.status(201).json(savedSubmission); // Send back the created submission
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ message: 'Failed to submit assignment' });
  }
});

// GET results for a student (assuming results are part of submissions)
router.get('/:studentId/results', async (req, res) => {
  const { studentId } = req.params;
  try {
    const submissions = await Submission.find({ student: studentId })
      .populate('assignment', 'title'); // Populate assignment title
    const results = submissions.map(sub => ({
      assignmentId: sub.assignment._id,
      assignmentTitle: sub.assignment.title,
      grade: sub.grade,
      feedback: sub.feedback,
      submissionDate: sub.submissionDate,
    }));
    res.json(results);
  } catch (error) {
    console.error('Error fetching student results:', error);
    res.status(500).json({ message: 'Failed to fetch results' });
  }
});

module.exports = router;