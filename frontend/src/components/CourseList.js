import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../config';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch courses. Please try again later.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm(`Are you sure you want to delete course ${courseId}?`)) {
      try {
        await axios.delete(`${API_URL}/courses/${courseId}`);
        fetchCourses(); // Refresh the list
        setDeleteError(null);
      } catch (err) {
        if (err.response && err.response.status === 409) {
          setDeleteError(`Cannot delete course ${courseId}: It is a prerequisite for other courses or has active instances.`);
        } else {
          setDeleteError('Error deleting course. Please try again.');
        }
        console.error('Error deleting course:', err);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading courses...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Course List</h2>
      {deleteError && <Alert variant="danger">{deleteError}</Alert>}
      
      {courses.length === 0 ? (
        <Alert variant="info">No courses found. Add your first course!</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Prerequisites</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>
                  {course.prerequisites && course.prerequisites.length > 0 ? (
                    course.prerequisites.map((prereq) => (
                      <Badge bg="secondary" className="me-1" key={prereq}>
                        {prereq}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">None</span>
                  )}
                </td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default CourseList;
