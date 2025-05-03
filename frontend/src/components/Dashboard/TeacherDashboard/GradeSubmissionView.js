import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GradeSubmissionView.css';

function GradeSubmissionView() {
  const { submissionId, assignmentId } = useParams();
  const [studentDetails, setStudentDetails] = useState(null); 
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

 
  useEffect(() => {
    
    const fetchStudentDetails = async () => {
      try {
    
        const response = await fetch(`/api/users/${submissionId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudentDetails(data);
      } catch (error) {
        console.error('Failed to fetch student details:', error);
      }
    };

    // fetchStudentDetails();
  }, [submissionId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/assignments/submissions/${submissionId}/${assignmentId}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grade, feedback }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Grade submitted:', result);
      alert('Grade and feedback submitted!');
      navigate(`/teacher/assignments/${assignmentId}/submissions`);
    } catch (error) {
      console.error('Failed to submit grade:', error);
      alert('Failed to submit grade and feedback.');
    }
  };

  if (!studentDetails && false) { // Adjust condition based on your data fetching
    return <div>Loading student details...</div>;
  }

  return (
    <div className="grade-submission-view-container">
      <h2>Grading Submission for Student: {studentDetails?.name || submissionId}</h2> {/* Adjust display */}
      {/* You might want to display the actual submission content here */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="grade">Grade:</label>
          <input
            type="text"
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="feedback">Feedback:</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="5"
          />
        </div>
        <button type="submit" className="grade-button">Submit Grade & Feedback</button>
        <Link to={`/teacher/assignments/${assignmentId}/submissions`} className="cancel-button">Cancel</Link>
      </form>
    </div>
  );
}

export default GradeSubmissionView;