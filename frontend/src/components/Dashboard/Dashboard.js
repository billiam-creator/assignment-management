import React, { useEffect, useRef } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const dashboardRef = useRef(null);
  const studentRecordsRef = useRef(null);
  const assignmentsRef = useRef(null);

  useEffect(() => {
    const handleSidebarLinkClick = (event) => {
      event.preventDefault();
      const targetId = event.target.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach((link) => {
      link.addEventListener('click', handleSidebarLinkClick);
    });

    return () => {
      sidebarLinks.forEach((link) => {
        link.removeEventListener('click', handleSidebarLinkClick);
      });
    };
  }, []);

  // Fetch user information
  function fetchUserInfo() {
    return new Promise((resolve, reject) => {
      // Make an API call to fetch user information
      fetch('/api/user-info')
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  // Fetch enrolled courses
  function fetchEnrolledCourses() {
    return new Promise((resolve, reject) => {
      // Make an API call to fetch enrolled courses
      fetch('/api/enrolled-courses')
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  // Fetch assignments
  function fetchAssignments() {
    return new Promise((resolve, reject) => {
      // Make an API call to fetch assignments
      fetch('/api/assignments')
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  }

  // Update the dashboard UI
  function updateDashboardUI(userInfo, enrolledCourses, assignments) {
    // Update the "My Information" section
    document.getElementById('name').textContent = userInfo.name;
    document.getElementById('major').textContent = userInfo.major;

    // Update the "Enrolled Courses" section
    const enrolledCoursesElement = document.getElementById('enrolled-courses');
    if (enrolledCourses.length > 0) {
      enrolledCoursesElement.innerHTML = '';
      enrolledCourses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.textContent = course.name;
        enrolledCoursesElement.appendChild(courseElement);
      });
    } else {
      enrolledCoursesElement.innerHTML = '<p>You are not enrolled in any courses yet.</p>';
    }

    // Update the "Assignments" section
    const assignmentsElement = document.getElementById('assignments');
    if (assignments.length > 0) {
      assignmentsElement.innerHTML = '';
      assignments.forEach(assignment => {
        const assignmentElement = document.createElement('div');
        assignmentElement.textContent = assignment.name;
        assignmentsElement.appendChild(assignmentElement);
      });
    } else {
      assignmentsElement.innerHTML = '<p>No assignments found for your enrolled courses.</p>';
    }
  }

  // Initialize the dashboard
  useEffect(() => {
    Promise.all([fetchUserInfo(), fetchEnrolledCourses(), fetchAssignments()])
      .then(([userInfo, enrolledCourses, assignments]) => {
        updateDashboardUI(userInfo, enrolledCourses, assignments);
      })
      .catch(error => {
        console.error('Error initializing dashboard:', error);
      });
  }, []);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Navigation</h2>
        <div className="sidebar-nav">
          <a href="#dashboard">Dashboard</a>
          <a href="#student-records">Student Records</a>
          <a href="#assignments">Assignments</a>
        </div>
        <a href="/login" className="logout-button">
          Logout
        </a>
      </div>
      <div className="dashboard-content">
        <div id="dashboard" ref={dashboardRef} className="student-records">
          <h2>Dashboard</h2>
          {/* Dashboard content goes here */}
          <p>This is the dashboard content.</p>
          <p id="name"></p>
          <p id="major"></p>
          <div id="enrolled-courses"></div>
        </div>
        <div id="student-records" ref={studentRecordsRef} className="student-records">
          <h2>Student Records</h2>
          {/* Student records content goes here */}
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Grade</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>A</td>
                <td>95%</td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>B+</td>
                <td>92%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div id="assignments" ref={assignmentsRef} className="assignments">
          <h2>Assignments</h2>
          {/* Assignments content goes here */}
          <div id="assignments"></div>
          <table>
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Math Homework</td>
                <td>May 20, 2025</td>
                <td>Completed</td>
              </tr>
              <tr>
                <td>English Essay</td>
                <td>June 1, 2025</td>
                <td>In Progress</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
