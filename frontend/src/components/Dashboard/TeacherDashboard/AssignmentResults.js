import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './AssignmentResults.css';

function AssignmentResults() {
  const { assignmentId } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/assignments/${assignmentId}/results`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch assignment results:', error);
      }
    };

    fetchResults();
  }, [assignmentId]);

  return (
    <div className="assignment-results-container">
      <h2>Results for Assignment: {assignmentId}</h2>
      {results.length === 0 ? (
        <p>No results available yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Grade</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result.studentName}>
                <td>{result.studentName}</td>
                <td>{result.grade || 'Not Graded'}</td>
                <td>{result.feedback || 'No feedback'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to={`/teacher/assignments/${assignmentId}/submissions`} className="back-to-submissions">Back to Submissions</Link>
    </div>
  );
}

export default AssignmentResults;