const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  prerequisites: [{
    type: String,
    ref: 'Course'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', CourseSchema);
