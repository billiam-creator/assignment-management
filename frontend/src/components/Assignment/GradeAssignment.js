import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function GradeAssignment() {
  const [assignment, setAssignment] = useState(null);
  const [grades, setGrades] = useState({});
  const [feedback, setFeedback] = useState({});
  const { token } = useAuth();
  const { assignmentId } = useParams();
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
        
        const initialGrades = {};
        const initialFeedback = {};
        response.data.submissions.forEach((submission) => {
          initialGrades[submission._id] = submission.grade || '';
          initialFeedback[submission._id] = submission.feedback || '';
        });
        setGrades(initialGrades);
        setFeedback(initialFeedback);
      } catch (error) {
        console.error('Error fetching assignment details:', error);
        
      }
    };

    if (token && assignmentId) {
      fetchAssignmentDetails();
    }
  }, [token, assignmentId, backendUrl]);

  const handleGradeChange = (submissionId, grade) => {
    setGrades({ ...grades, [submissionId]: grade });
  };

  const handleFeedbackChange = (submissionId, feedbackText) => {
    setFeedback({ ...feedback, [submissionId]: feedbackText });
  };

  const handleGradeSubmit = async (submissionId) => {
    try {
      await axios.put(
        `${backendUrl}/${assignmentId}/grade/${submissionId}`,
        { grade: grades[submissionId], feedback: feedback[submissionId] },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
    
      setAssignment((prevAssignment) => ({
        ...prevAssignment,
        submissions: prevAssignment.submissions.map((sub) =>
          sub._id === submissionId ? { ...sub, grade: grades[submissionId], feedback: feedback[submissionId] } : sub
        ),
      }));
    } catch (error) {
      console.error('Error grading submission:', error);
      
    }
  };

  if (!assignment) {
    return <div>Loading assignment details...</div>;
  }

  return (
    <div>
      <h2>Grade Submissions for "{assignment.title}"</h2>
      {assignment.submissions.length === 0 ? (
        <p>No submissions yet for this assignment.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Student</th>
              <th>Submitted At</th>
              <th>Submission Link</th>
              <th>Grade</th>
              <th>Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignment.submissions.map((submission) => (
              <tr key={submission._id}>
                <td>{submission.student} {/* Replace with actual student name */}</td>
                <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
                <td>
                  <a href={submission.submissionLink} target="_blank" rel="noopener noreferrer">
                    View Submission
                  </a>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={grades[submission._id] || ''}
                    onChange={(e) => handleGradeChange(submission._id, e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={feedback[submission._id] || ''}
                    onChange={(e) => handleFeedbackChange(submission._id, e.target.value)}
                  />
                </td>
                <td>
                  <Button variant="primary" onClick={() => handleGradeSubmit(submission._id)}>
                    Submit Grade
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default GradeAssignment;