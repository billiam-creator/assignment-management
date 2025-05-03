const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'User', 
  }],
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
  },
 
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;