import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);

  useEffect(() => {
    // Fetch teacher data from the database
    axios.get('/api/teachers/current')
      .then(response => {
        setTeacher(response.data);
      })
      .catch(error => {
        console.error('Error fetching teacher data:', error);
      });

    // Fetch course list from the database
    axios.get('/api/courses')
      .then(response => {
        setCourses(response.data);
      })
      .catch(error => {
        console.error('Error fetching course list:', error);
      });

    // Fetch upcoming assignments from the database
    axios.get('/api/assignments/upcoming')
      .then(response => {
        setUpcomingAssignments(response.data);
      })
      .catch(error => {
        console.error('Error fetching upcoming assignments:', error);
      });
  }, []);

  return (
    <div className="teacher-dashboard-container">
      <div className="sidebar">
        <h2>Navigation</h2>
        <div className="sidebar-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/my-courses">My Courses</Link>
          <Link to="/my-assignments">My Assignments</Link>
          <Link to="/Login" className="logout-button">
            Logout
          </Link>
        </div>
      </div>
      <div className="dashboard-content">
        {teacher && (
          <div className="welcome-message">
            <h2>Welcome, {teacher.name}!</h2>
            <div className="dashboard-stats">
              <div className="course-count">{courses.length} courses</div>
              <div className="assignment-count">{upcomingAssignments.length} assignments</div>
            </div>
          </div>
        )}
        <div className="my-courses">
          <h2>My Courses</h2>
          <div className="course-list">
            {courses.map(course => (
              <div key={course.id} className="course-item">
                <h3>{course.name}</h3>
                <div className="course-actions">
                  <Link to={`/courses/${course.id}/assignments`}>View Students</Link>
                  <Link to={`/courses/${course.id}/assignments/new`}>Add Assignment</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="upcoming-assignments">
          <h2>Upcoming Assignments</h2>
          {upcomingAssignments.length > 0 ? (
            <div className="assignment-list">
              {upcomingAssignments.map(assignment => (
                <div key={assignment.id} className="assignment-item">
                  <h3>{assignment.name}</h3>
                  <div className="assignment-actions">
                    <Link to={`/assignments/${assignment.id}/submissions`}>View Submissions</Link>
                    <Link to={`/assignments/${assignment.id}/grade`}>Grade Submissions</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-assignments">No upcoming assignments found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
