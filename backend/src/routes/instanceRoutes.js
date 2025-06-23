const express = require('express');
const { body, param, validationResult } = require('express-validator');
const CourseInstance = require('../models/CourseInstance');
const Course = require('../models/Course');

const router = express.Router();

// Validation middleware
const validateInstance = [
  body('course').notEmpty().withMessage('Course ID is required'),
  body('year').isInt({ min: 2000, max: 2100 }).withMessage('Valid year is required'),
  body('semester').isInt({ min: 1, max: 2 }).withMessage('Semester must be 1 or 2')
];

// POST /api/instances - Create a new course instance
router.post('/', validateInstance, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { course, year, semester } = req.body;

    // Check if the course exists
    const existingCourse = await Course.findOne({ id: course });
    if (!existingCourse) {
      return res.status(400).json({ message: 'Course does not exist' });
    }

    // Check if the instance already exists
    const existingInstance = await CourseInstance.findOne({ 
      course, 
      year, 
      semester 
    });
    
    if (existingInstance) {
      return res.status(400).json({ 
        message: 'Course instance already exists for this course, year, and semester' 
      });
    }

    const newInstance = new CourseInstance({
      course,
      year,
      semester
    });

    const savedInstance = await newInstance.save();
    res.status(201).json(savedInstance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/instances/:year/:semester - Get all instances for a semester
router.get('/:year/:semester', async (req, res) => {
  try {
    const { year, semester } = req.params;
    
    // Validate params
    if (isNaN(year) || isNaN(semester) || semester < 1 || semester > 2) {
      return res.status(400).json({ message: 'Invalid year or semester' });
    }

    const instances = await CourseInstance.find({ 
      year: parseInt(year), 
      semester: parseInt(semester) 
    });

    // Get course details for each instance
    const instancesWithDetails = await Promise.all(
      instances.map(async (instance) => {
        const course = await Course.findOne({ id: instance.course });
        return {
          ...instance.toObject(),
          courseDetails: course
        };
      })
    );

    res.json(instancesWithDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/instances/:year/:semester/:courseId - Get specific instance
router.get('/:year/:semester/:courseId', async (req, res) => {
  try {
    const { year, semester, courseId } = req.params;
    
    // Validate params
    if (isNaN(year) || isNaN(semester) || semester < 1 || semester > 2) {
      return res.status(400).json({ message: 'Invalid year or semester' });
    }

    const instance = await CourseInstance.findOne({ 
      course: courseId,
      year: parseInt(year), 
      semester: parseInt(semester) 
    });

    if (!instance) {
      return res.status(404).json({ message: 'Course instance not found' });
    }

    // Get course details
    const course = await Course.findOne({ id: instance.course });
    
    res.json({
      ...instance.toObject(),
      courseDetails: course
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/instances/:year/:semester/:courseId - Delete specific instance
router.delete('/:year/:semester/:courseId', async (req, res) => {
  try {
    const { year, semester, courseId } = req.params;
    
    // Validate params
    if (isNaN(year) || isNaN(semester) || semester < 1 || semester > 2) {
      return res.status(400).json({ message: 'Invalid year or semester' });
    }

    const deletedInstance = await CourseInstance.findOneAndDelete({ 
      course: courseId,
      year: parseInt(year), 
      semester: parseInt(semester) 
    });

    if (!deletedInstance) {
      return res.status(404).json({ message: 'Course instance not found' });
    }

    res.json({ message: 'Course instance deleted successfully', instance: deletedInstance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
