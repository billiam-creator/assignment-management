// src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import Assignments from './Assignments';
import AssignmentView from './AssignmentView';
import Results from './Results';
import './Dashboard.css';

function Dashboard() {
  const [username, setUsername] = useState(''); 
  const [assignments, setAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchAssignmentsData = async () => {
      try {
        const response = await fetch(`/api/students/${userId}/assignments`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      }
    };

    const fetchResultsData = async () => {
      try {
        const response = await fetch(`/api/students/${userId}/results`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubmittedAssignments(data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      }
    };

    if (userId) {
      fetchAssignmentsData();
      fetchResultsData();
    }
  }, [userId]);

  const handleStartAssignment = (assignmentId) => {
    const assignmentToView = assignments.find(assignment => assignment._id === assignmentId);
    setSelectedAssignment(assignmentToView);
  };

  const handleAssignmentSubmit = async (submissionData) => {
    // ... (rest of your submission logic)
  };

  const handleGoBack = () => {
    setSelectedAssignment(null);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <p>Welcome, {username}!</p> {/* Use the username from state */}
      </header>

      <main className="dashboard-content">
  {!selectedAssignment && (
    <section className="dashboard-section">
      <h2>New Assignments</h2>
      {assignments.length > 0 ? (
        <Assignments
          assignments={assignments.filter(
            (assignment) =>
              !submittedAssignments.some(
                (submitted) => submitted.assignmentId === assignment._id
              )
          )}
          onStartAssignment={handleStartAssignment}
        />
      ) : (
        <p>No new assignments at the moment.</p>
      )}
    </section>
  )}

  {selectedAssignment && (
    <section className="dashboard-section">
      <h2>Assignment Details</h2>
      <AssignmentView
        assignment={selectedAssignment}
        onSubmit={handleAssignmentSubmit}
        onGoBack={handleGoBack}
      />
    </section>
  )}

  <section className="dashboard-section">
    <h2>Your Results & Feedback</h2>
    {submittedAssignments.length > 0 ? (
      <Results
        submittedAssignments={submittedAssignments}
        assignments={assignments.reduce((acc, curr) => {
          acc[curr._id] = curr;
          return acc;
        }, {})}
      />
    ) : (
      <p>No submitted assignments yet.</p>
    )}
  </section>
</main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Student Portal</p>
      </footer>
    </div>
  );
}

export default Dashboard;