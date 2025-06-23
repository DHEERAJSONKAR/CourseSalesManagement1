import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const CourseInstanceList = () => {
  const [instances, setInstances] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [semester, setSemester] = useState(1);

  useEffect(() => {
    fetchInstances();
  }, [year, semester]);

  const fetchInstances = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/instances/${year}/${semester}`);
      setInstances(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch course instances. Please try again later.');
      console.error('Error fetching instances:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm(`Are you sure you want to delete this course instance?`)) {
      try {
        await axios.delete(`${API_URL}/instances/${year}/${semester}/${courseId}`);
        fetchInstances(); // Refresh the list
      } catch (err) {
        setError('Error deleting course instance. Please try again.');
        console.error('Error deleting instance:', err);
      }
    }
  };

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    yearOptions.push(y);
  }

  if (loading) {
    return <div className="text-center mt-5">Loading course instances...</div>;
  }

  return (
    <div>
      <h2>Course Instances</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Select 
              value={year} 
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Semester</Form.Label>
            <Form.Select 
              value={semester} 
              onChange={(e) => setSemester(Number(e.target.value))}
            >
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      
      {instances.length === 0 ? (
        <Alert variant="info">
          No course instances found for {year}, Semester {semester}.
          <Link to="/instances/new" className="ms-2">Add a new instance</Link>
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Title</th>
              <th>Year</th>
              <th>Semester</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instances.map((instance) => (
              <tr key={`${instance.course}-${instance.year}-${instance.semester}`}>
                <td>{instance.course}</td>
                <td>{instance.courseDetails?.title || 'Unknown Course'}</td>
                <td>{instance.year}</td>
                <td>{instance.semester}</td>
                <td>
                  <Link 
                    to={`/instances/${instance.year}/${instance.semester}/${instance.course}`}
                    className="btn btn-info btn-sm me-2"
                  >
                    View
                  </Link>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(instance.course)}
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

export default CourseInstanceList;
