import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const CourseInstanceDetails = () => {
  const [instance, setInstance] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { year, semester, courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstanceDetails();
  }, [year, semester, courseId]);

  const fetchInstanceDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/instances/${year}/${semester}/${courseId}`);
      setInstance(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch course instance details. Please try again later.');
      console.error('Error fetching instance details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this course instance?`)) {
      try {
        await axios.delete(`${API_URL}/instances/${year}/${semester}/${courseId}`);
        navigate('/instances');
      } catch (err) {
        setError('Error deleting course instance. Please try again.');
        console.error('Error deleting instance:', err);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading course instance details...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!instance) {
    return <Alert variant="warning">Course instance not found.</Alert>;
  }

  return (
    <div>
      <h2>Course Instance Details</h2>
      
      <Card className="mb-4">
        <Card.Header as="h5">
          {instance.courseDetails?.id} - {instance.courseDetails?.title}
        </Card.Header>
        <Card.Body>
          <Card.Title>Year: {instance.year}, Semester: {instance.semester}</Card.Title>
          <Card.Text>{instance.courseDetails?.description}</Card.Text>
          
          <h6>Prerequisites:</h6>
          {instance.courseDetails?.prerequisites && instance.courseDetails.prerequisites.length > 0 ? (
            <div className="mb-3">
              {instance.courseDetails.prerequisites.map(prereq => (
                <Badge bg="secondary" className="me-1" key={prereq}>
                  {prereq}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted">No prerequisites</p>
          )}
          
          <Button variant="primary" onClick={() => navigate('/instances')}>
            Back to Instances
          </Button>
          <Button variant="danger" className="ms-2" onClick={handleDelete}>
            Delete Instance
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CourseInstanceDetails;
