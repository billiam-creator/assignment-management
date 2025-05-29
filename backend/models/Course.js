const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the Teacher User
  // ... other fields
});

module.exports = mongoose.model('Course', CourseSchema);