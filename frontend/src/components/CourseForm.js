import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const CourseForm = () => {
  const [courseData, setCourseData] = useState({
    id: '',
    title: '',
    description: '',
    prerequisites: []
  });
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all courses for prerequisites dropdown
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses`);
        setCourses(response.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handlePrerequisitesChange = (selectedOptions) => {
    const prerequisites = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setCourseData({ ...courseData, prerequisites });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await axios.post(`${API_URL}/courses`, courseData);
      setSuccess('Course created successfully!');
      
      // Reset form
      setCourseData({
        id: '',
        title: '',
        description: '',
        prerequisites: []
      });
      
      // Navigate to course list after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error creating course');
      } else {
        setError('Error creating course. Please try again.');
      }
      console.error('Error creating course:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format courses for react-select
  const prerequisiteOptions = courses
    .filter(course => course.id !== courseData.id) // Filter out current course
    .map(course => ({
      value: course.id,
      label: `${course.id} - ${course.title}`
    }));

  return (
    <div>
      <h2>Create New Course</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Course ID</Form.Label>
          <Form.Control
            type="text"
            name="id"
            value={courseData.id}
            onChange={handleChange}
            placeholder="e.g., CS101"
            required
          />
          <Form.Text className="text-muted">
            Enter a unique identifier for the course (e.g., CS101)
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleChange}
            placeholder="Course Title"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={courseData.description}
            onChange={handleChange}
            placeholder="Course Description"
            required
            rows={3}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Prerequisites</Form.Label>
          <Select
            isMulti
            name="prerequisites"
            options={prerequisiteOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            value={prerequisiteOptions.filter(option => 
              courseData.prerequisites.includes(option.value)
            )}
            onChange={handlePrerequisitesChange}
            placeholder="Select prerequisites..."
          />
          <Form.Text className="text-muted">
            Select any courses that are prerequisites for this course
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Course'}
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/')} 
          className="ms-2"
          disabled={loading}
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default CourseForm;
