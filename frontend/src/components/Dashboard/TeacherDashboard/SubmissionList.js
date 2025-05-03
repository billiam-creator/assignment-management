import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SubmissionList.css';

function SubmissionList() {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`/api/assignments/${assignmentId}/submissions`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  return (
    <div className="submission-list-container">
      <h2>Submissions for Assignment: {assignmentId}</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet for this assignment.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(submission => (
              <tr key={submission.id}>
                <td>{submission.studentName}</td>
                <td>
                  <Link to={`/teacher/submissions/${submission.id}/${assignmentId}/grade`}>Grade</Link>
                  <Link to={`/teacher/assignments/${assignmentId}/results`}>Results</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to={`/teacher/classes/${/* You'll need to dynamically get classId */ 'dummy'}/assignments`} className="back-to-assignments">Back to Assignments</Link>
    </div>
  );
}

export default SubmissionList;