const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student',
    },
    major: { // Optional field for students
        type: String,
    },
    courses: [{ // Courses the student is enrolled in (populated by admin approval)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
    registrationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);