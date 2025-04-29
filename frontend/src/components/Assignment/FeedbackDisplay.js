import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function FeedbackDisplay() {
  const [submission, setSubmission] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const { token, user } = useAuth();
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
        
        const studentSubmission = response.data.submissions.find(
          (sub) => sub.student === user?.id
        );
        setSubmission(studentSubmission);
      } catch (error) {
        console.error('Error fetching assignment details:', error);
   
      }
    };

    if (token && assignmentId && user?.id) {
      fetchAssignmentDetails();
    }
  }, [token, assignmentId, user?.id, backendUrl]);

  if (!assignment) {
    return <div>Loading assignment details...</div>;
  }

  if (!submission) {
    return <p>No submission found for this assignment.</p>;
  }

  return (
    <div>
      <h2>Feedback for "{assignment.title}"</h2>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Your Submission Details</Card.Title>
          <Card.Text>
            Submitted At: {new Date(submission.submittedAt).toLocaleDateString()}
          </Card.Text>
          {submission.submissionLink && (
            <Card.Text>
              Submission Link: <a href={submission.submissionLink} target="_blank" rel="noopener noreferrer">View Submission</a>
            </Card.Text>
          )}
        </Card.Body>
      </Card>

      {submission.grade !== undefined && submission.feedback && (
        <Card>
          <Card.Body>
            <Card.Title>Teacher Feedback</Card.Title>
            <Card.Text>
              Grade: {submission.grade}
            </Card.Text>
            <Card.Text>
              Feedback: {submission.feedback}
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      {submission.grade === undefined && (
        <p>Your submission has not been graded yet.</p>
      )}

      <Button variant="secondary" className="mt-3" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </Button>
    </div>
  );
}

export default FeedbackDisplay;