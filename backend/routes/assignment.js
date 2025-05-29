const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission'); 


router.post('/', async (req, res) => {
  const { classId, title, description, dueDate } = req.body;
  try {
    const newAssignment = new Assignment({ class: classId, title, description, dueDate });
    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Failed to create assignment' });
  }
});


router.get('/:assignmentId/submissions', async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const submissions = await Submission.find({ assignment: assignmentId })
      .populate('student', 'name'); 
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
});


router.post('/submissions/:submissionId/grade', async (req, res) => {
  const { submissionId } = req.params;
  const { grade, feedback } = req.body;
  try {
    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      { grade: grade, feedback: feedback },
      { new: true } 
    ).populate('student', 'name').populate('assignment', 'title'); 
    if (!updatedSubmission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json(updatedSubmission); 
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ message: 'Failed to submit grade and feedback' });
  }
});

// GET results for a specific assignment
router.get('/:assignmentId/results', async (req, res) => {
  const { assignmentId } = req.params;
  try {
    const submissions = await Submission.find({ assignment: assignmentId })
      .populate('student', 'name')
      .select('student grade feedback'); 
    const results = submissions.map(sub => ({
      studentName: sub.student.name,
      grade: sub.grade,
      feedback: sub.feedback,
    }));
    res.json(results);
  } catch (error) {
    console.error('Error fetching assignment results:', error);
    res.status(500).json({ message: 'Failed to fetch assignment results' });
  }
});

module.exports = router;