const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseInstanceSchema = new Schema({
  course: {
    type: String,
    ref: 'Course',
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100
  },
  semester: {
    type: Number,
    required: true,
    enum: [1, 2]
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate instances
CourseInstanceSchema.index({ course: 1, year: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('CourseInstance', CourseInstanceSchema);
