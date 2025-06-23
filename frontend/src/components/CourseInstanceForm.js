import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const CourseInstanceForm = () => {
  const [instanceData, setInstanceData] = useState({
    course: '',
    year: new Date().getFullYear(),
    semester: 1
  });
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all courses for the dropdown
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
    setInstanceData({ ...instanceData, [name]: value });
  };

  const handleCourseChange = (selectedOption) => {
    setInstanceData({ ...instanceData, course: selectedOption ? selectedOption.value : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await axios.post(`${API_URL}/instances`, instanceData);
      setSuccess('Course instance created successfully!');
      
      // Navigate to instance list after 2 seconds
      setTimeout(() => {
        navigate('/instances');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error creating course instance');
      } else {
        setError('Error creating course instance. Please try again.');
      }
      console.error('Error creating course instance:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format courses for react-select
  const courseOptions = courses.map(course => ({
    value: course.id,
    label: `${course.id} - ${course.title}`
  }));

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    yearOptions.push(y);
  }

  return (
    <div>
      <h2>Create New Course Instance</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Course</Form.Label>
          <Select
            name="course"
            options={courseOptions}
            className="basic-select"
            classNamePrefix="select"
            value={courseOptions.find(option => option.value === instanceData.course) || null}
            onChange={handleCourseChange}
            placeholder="Select a course..."
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Year</Form.Label>
          <Form.Select
            name="year"
            value={instanceData.year}
            onChange={handleChange}
            required
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Semester</Form.Label>
          <Form.Select
            name="semester"
            value={instanceData.semester}
            onChange={handleChange}
            required
          >
            <option value={1}>Semester 1</option>
            <option value={2}>Semester 2</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Course Instance'}
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/instances')} 
          className="ms-2"
          disabled={loading}
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default CourseInstanceForm;
