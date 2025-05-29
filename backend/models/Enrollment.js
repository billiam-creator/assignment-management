// backend/models/Enrollment.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course', 
        required: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    }
  
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);