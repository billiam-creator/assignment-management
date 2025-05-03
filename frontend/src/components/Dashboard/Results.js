import React from 'react';
import './Results.css';

function Results({ submittedAssignments, assignments }) {
  return (
    <div className="results-table">
      {submittedAssignments.length === 0 ? (
        <p>No submitted assignments yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Submitted On</th>
              <th>Grade</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {submittedAssignments.map(submission => {
              const assignment = assignments.find(a => a.id === submission.assignmentId);
              return (
                <tr key={submission.id}>
                  <td>{assignment ? assignment.title : 'N/A'}</td>
                  <td>{submission.submissionDate}</td>
                  <td>{submission.grade || 'Not Graded'}</td>
                  <td className="feedback-cell">{submission.feedback || 'No feedback yet.'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Results;