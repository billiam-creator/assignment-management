import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AssignmentList() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('/api/assignments');
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div>
      <h2>Assignments</h2>
      {assignments.length === 0 ? (
        <p>No assignments available.</p>
      ) : (
        <ul>
          {assignments.map(assignment => (
            <li key={assignment.id}>
              <h3>{assignment.title}</h3>
              <p>{assignment.description}</p>
              <p>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</p>
              <a href={`/student/assignments/${assignment.id}/submit`}>Submit</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AssignmentList;
