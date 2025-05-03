const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Class = require('../models/Class'); // Ensure path is correct

// GET classes for a specific teacher
router.get('/:teacherId/classes', async (req, res) => {
  const { teacherId } = req.params;
  try {
    // Assuming your User model (for teachers) has a 'classes' field
    // that is an array of ObjectIds referencing the Class model.
    const teacher = await User.findById(teacherId).populate('classes', 'name description');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher.classes);
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    res.status(500).json({ message: 'Failed to fetch classes' });
  }
});

// GET assignments for a specific class
router.get('/classes/:classId/assignments', async (req, res) => {
  const { classId } = req.params;
  try {
    const assignments = await Assignment.find({ class: classId }); // Assuming 'class' field in Assignment model
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching class assignments:', error);
    res.status(500).json({ message: 'Failed to fetch assignments for this class' });
  }
});

module.exports = router;