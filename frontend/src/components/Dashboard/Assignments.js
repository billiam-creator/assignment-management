import React from 'react';
import './Assignments.css';

function Assignments({ assignments, onStartAssignment }) {
  return (
    <div className="assignments-list">
      {assignments.length === 0 ? (
        <p>No new assignments at the moment.</p>
      ) : (
        <ul>
          {assignments.map(assignment => (
            <li key={assignment.id} className="assignment-item">
              <div className="assignment-details">
                <strong>{assignment.title}</strong>
                <p>Due: {assignment.dueDate}</p>
                <p>{assignment.description.substring(0, 50)}...</p>
              </div>
              <button onClick={() => onStartAssignment(assignment.id)} className="start-button">Start</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Assignments;