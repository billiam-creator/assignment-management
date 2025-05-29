const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true,
    },
    submissionText: {
        type: String,
        required: false, // Can be text or file
    },
    submissionFileUrl: { // For file uploads (e.g., S3 URL)
        type: String,
        required: false,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    grade: {
        type: Number,
        min: 0,
        max: 100,
        required: false,
    },
    feedback: {
        type: String,
        required: false,
    },
    gradedAt: {
        type: Date,
        required: false,
    },
});

module.exports = mongoose.model('Submission', SubmissionSchema);