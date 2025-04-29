import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 

function AssignmentList() {
  const [assignments, setAssignments] = useState([]); 
  const { user, token } = useAuth(); 
  const backendUrl = 'http://localhost:5000/api/assignments'; 

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(backendUrl, {
          headers: {
            'x-auth-token': token, 
          },
        });
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        
        setAssignments([]); 
      }
    };

    if (token) {
      fetchAssignments();
    }
  }, [token, backendUrl]);

  return (
    <div>
      <h2>Assignments</h2>
      {assignments.length === 0 ? (
        <p>No assignments available.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Due Date</th>
              <th>Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment._id}>
                <td>{assignment.title}</td>
                <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                <td>{assignment.teacher ? assignment.teacher.username : 'N/A'}</td>
                <td>
                  {user?.role === 'student' ? (
                    <Link to={`/submit-assignment/${assignment._id}`}>Submit</Link>
                  ) : (
                    <>
                      <Link to={`/grade-assignment/${assignment._id}`}>Grade</Link>
                      {/* Add other teacher actions like edit/delete later */}
                    </>
                  )}
                  <Link to={`/view-feedback/${assignment._id}`}>Feedback</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {user?.role === 'teacher' && (
        <Link to="/create-assignment" className="btn btn-primary">
          Create New Assignment
        </Link>
      )}
    </div>
  );
}

export default AssignmentList;