const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model (teacher)
        required: true,
    },
    students: [{ // Array of student IDs enrolled in this course
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    creationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Course', CourseSchema);