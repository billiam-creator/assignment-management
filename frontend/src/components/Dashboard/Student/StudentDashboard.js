import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';

function StudentDashboard() {
  const [studentInfo, setStudentInfo] = useState({ name: '', major: '' });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseRequests, setCourseRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const API_BASE_URL = 'http://localhost:5000/api/students'; // Adjust as needed
  const getAuthToken = () => localStorage.getItem('token'); // Placeholder

  useEffect(() => {
    fetchStudentData();
    fetchEnrolledCourses();
    fetchCourseRequests();
    fetchAssignments();
  }, []);

  const fetchStudentData = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/info`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStudentInfo(data);
      } else {
        console.error('Failed to fetch student info');
      }
    } catch (error) {
      console.error('Error fetching student info:', error);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/enrolled-courses`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEnrolledCourses(data);
      } else {
        console.error('Failed to fetch enrolled courses');
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const fetchCourseRequests = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/course-requests`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCourseRequests(data);
      } else {
        console.error('Failed to fetch course requests');
      }
    } catch (error) {
      console.error('Error fetching course requests:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/assignments`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        console.error('Failed to fetch assignments');
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  return (
    <div className="student-dashboard">
      <div className="sidebar">
        <h2>Student Portal</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li>My Information</li>
          <li>Enrolled Courses</li>
          <li>My Course Requests</li>
          <li>Assignments</li>
          <li>Logout</li>
        </ul>
      </div>
      <div className="content">
        <div className="header">
          <h1>Dashboard</h1>
          <p>Welcome, {studentInfo.name || 'Student'}</p>
        </div>

        <div className="dashboard-grid">
          <div className="info-card">
            <h3>My Information</h3>
            <p>Name: {studentInfo.name || 'N/A'}</p>
            <p>Major: {studentInfo.major || 'N/A'}</p>
          </div>

          <div className="courses-card">
            <h3>Enrolled Courses</h3>
            {enrolledCourses.length > 0 ? (
              <ul>
                {enrolledCourses.map((course) => (
                  <li key={course._id}>{course.name}</li>
                ))}
              </ul>
            ) : (
              <p>You are not enrolled in any courses yet.</p>
            )}
          </div>

          <div className="requests-card">
            <h3>My Course Requests</h3>
            {courseRequests.length > 0 ? (
              <ul>
                {courseRequests.map((request) => (
                  <li key={request._id}>Course: {request.course ? request.course.name : 'N/A'} - Status: {request.status}</li>
                ))}
              </ul>
            ) : (
              <p>You have no pending or processed course requests.</p>
            )}
          </div>

          <div className="assignments-card">
            <h3>Assignments</h3>
            {assignments.length > 0 ? (
              <ul>
                {assignments.map((assignment) => (
                  <li key={assignment._id}>{assignment.title} - Due: {new Date(assignment.dueDate).toLocaleDateString()}</li>
                ))}
              </ul>
            ) : (
              <p>No assignments available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;