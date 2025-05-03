import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './AssignmentList.css';

function AssignmentList() {
  const { classId } = useParams();
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`/api/teachers/classes/${classId}/assignments`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      }
    };

    fetchAssignments();
  }, [classId]);

  return (
    <div className="assignment-list-container">
      <h2>Assignments for Class: {classId}</h2>
      {assignments.length === 0 ? (
        <p>No assignments created for this class yet.</p>
      ) : (
        <ul>
          {assignments.map(assignment => (
            <li key={assignment._id} className="assignment-item">
              <Link to={`/teacher/assignments/${assignment._id}/submissions`}>{assignment.title}</Link>
              <p>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>
            </li>
          ))}
          <li><Link to="/teacher/new-assignment" className="create-new-link">+ Create New Assignment</Link></li>
        </ul>
      )}
      <Link to="/teacher" className="back-to-classes">Back to Classes</Link>
    </div>
  );
}

export default AssignmentList;