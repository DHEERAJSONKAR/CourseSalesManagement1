const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Course = require('../models/Course');
const CourseInstance = require('../models/CourseInstance');

const router = express.Router();

// Validation middleware
const validateCourse = [
  body('id').notEmpty().withMessage('Course ID is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('prerequisites').isArray().withMessage('Prerequisites should be an array')
];

// POST /api/courses - Create a new course
router.post('/', validateCourse, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id, title, description, prerequisites } = req.body;

    // Check if course with same ID already exists
    const existingCourse = await Course.findOne({ id });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this ID already exists' });
    }

    // Validate that all prerequisites exist
    if (prerequisites && prerequisites.length > 0) {
      const prereqCourses = await Course.find({ id: { $in: prerequisites } });
      if (prereqCourses.length !== prerequisites.length) {
        return res.status(400).json({ message: 'One or more prerequisites do not exist' });
      }
    }

    const newCourse = new Course({
      id,
      title,
      description,
      prerequisites
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/courses/:id - Get a specific course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ id: req.params.id });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/courses/:id - Delete a course
router.delete('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;

    // Check if course is a prerequisite for other courses
    const dependentCourses = await Course.find({ prerequisites: courseId });
    if (dependentCourses.length > 0) {
      return res.status(409).json({ 
        message: 'Cannot delete course as it is a prerequisite for other courses',
        dependentCourses: dependentCourses.map(c => c.id)
      });
    }

    // Check if course has instances
    const instances = await CourseInstance.find({ course: courseId });
    if (instances.length > 0) {
      return res.status(409).json({ 
        message: 'Cannot delete course as it has instances',
        instances: instances
      });
    }

    // Delete the course
    const deletedCourse = await Course.findOneAndDelete({ id: courseId });
    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully', course: deletedCourse });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
