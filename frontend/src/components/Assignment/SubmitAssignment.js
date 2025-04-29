import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function SubmitAssignment() {
  const [submissionLink, setSubmissionLink] = useState('');
  const [assignment, setAssignment] = useState(null);
  const { token } = useAuth();
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const backendUrl = 'http://localhost:5000/api/assignments'; 

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/${assignmentId}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        setAssignment(response.data);
      } catch (error) {
        console.error('Error fetching assignment details:', error);
        
      }
    };

    if (token && assignmentId) {
      fetchAssignmentDetails();
    }
  }, [token, assignmentId, backendUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(
        `${backendUrl}/${assignmentId}/submit`,
        { submissionLink },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Error submitting assignment:', error);
      
    }
  };

  if (!assignment) {
    return <div>Loading assignment details...</div>;
  }

  return (
    <div>
      <h2>Submit Assignment: "{assignment.title}"</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicSubmissionLink">
          <Form.Label>Submission Link</Form.Label>
          <Form.Control
            type="url"
            placeholder="Enter the link to your submission (e.g., GitHub, Google Drive)"
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            required
          />
          <Form.Text className="text-muted">
            Please provide a valid URL to your assignment submission.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit Assignment
        </Button>
      </Form>
      <Button variant="secondary" className="mt-3" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </Button>
    </div>
  );
}

export default SubmitAssignment;