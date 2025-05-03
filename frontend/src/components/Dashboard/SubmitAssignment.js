import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SubmitAssignment.css'; 

function SubmitAssignment({ assignment, onSubmit, onGoBack }) {
  const [answer, setAnswer] = useState('');
  const { assignmentId } = useParams(); 
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ answer }); 
  };

  const handleCancel = () => {
    if (onGoBack) {
      onGoBack(); 
    } else {
      navigate(-1); 
    }
  };

  if (!assignment) {
    return <p>Loading assignment details...</p>; // Or handle the case where assignment data isn't yet available
  }

  return (
    <div className="submit-assignment-container">
      <h2>Submit: {assignment.title}</h2>
      <p>{assignment.description}</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="answer">Your Answer:</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">Submit</button>
          <button type="button" onClick={handleCancel} className="cancel-button">Back</button>
        </div>
      </form>
    </div>
  );
}

export default SubmitAssignment;