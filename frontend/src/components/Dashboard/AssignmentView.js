import React, { useState } from 'react';
import './AssignmentView.css';

function AssignmentView({ assignment, onSubmit, onGoBack }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ answer });
    setAnswer('');
  };

  return (
    <div className="assignment-view">
      <h3>{assignment.title}</h3>
      <p className="due-date">Due Date: {assignment.dueDate}</p>
      <p className="description">{assignment.description}</p>

      <form onSubmit={handleSubmit} className="submission-form">
        <div className="form-group">
          <label htmlFor="answer">Your Answer:</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows="8"
            cols="60"
            className="answer-textarea"
            placeholder="Type your answer here..."
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">Submit Assignment</button>
          <button type="button" onClick={onGoBack} className="back-button">Go Back</button>
        </div>
      </form>
    </div>
  );
}

export default AssignmentView;