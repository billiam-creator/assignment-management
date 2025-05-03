const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  assignment: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment', 
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  submissionText: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
  },
  feedback: {
    type: String,
  },
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;