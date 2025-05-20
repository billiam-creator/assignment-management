// src/components/AdminDashboard/AdminDashboard.js
import React, { useEffect, useRef, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const dashboardRef = useRef(null);
  const usersRef = useRef(null);
  const coursesRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

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

  useEffect(() => {
    fetchUsers();
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchUsers = () => {
    // Fetch users from the API
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  };

  const fetchCourses = () => {
    // Fetch courses from the API
    fetch('/api/courses')
      .then(response => response.json())
      .then(data => setCourses(data))
      .catch(error => console.error('Error fetching courses:', error));
  };

  const fetchTeachers = () => {
    // Fetch teachers from the API
    fetch('/api/teachers')
      .then(response => response.json())
      .then(data => setTeachers(data))
      .catch(error => console.error('Error fetching teachers:', error));
  };

  const assignCourseToTeacher = (courseId, teacherId) => {
    // Assign a course to a teacher
    // Make an API call to update the course-teacher assignment
    fetch(`/api/courses/${courseId}/assign-teacher/${teacherId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        // Update the courses or teachers state based on the response
        console.log('Course assigned to teacher:', data);
      })
      .catch(error => console.error('Error assigning course to teacher:', error));
  };

  const deleteUser = (userId) => {
    // Delete a user
    // Make an API call to delete the user
    fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        // Update the users state based on the response
        console.log('User deleted:', data);
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <div className="sidebar-nav">
          <a href="#dashboard">Dashboard</a>
          <a href="#users">Users</a>
          <a href="#courses">Courses</a>
        </div>
        <a href="/Login" className="logout-button">
          Logout
        </a>
      </div>
      <div className="dashboard-content">
        <div id="dashboard" ref={dashboardRef} className="dashboard-section">
          <h2>Dashboard</h2>
          <div className="dashboard-stats">
            <div className="stat">
              <h3>Total Users</h3>
              <p>{users.length}</p>
            </div>
            <div className="stat">
              <h3>Total Courses</h3>
              <p>{courses.length}</p>
            </div>
            <div className="stat">
              <h3>Total Teachers</h3>
              <p>{teachers.length}</p>
            </div>
          </div>
        </div>
        <div id="users" ref={usersRef} className="dashboard-section">
          <h2>Users</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div id="courses" ref={coursesRef} className="dashboard-section">
          <h2>Courses</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Teacher</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.description}</td>
                  <td>{course.teacher ? course.teacher.name : 'Unassigned'}</td>
                  <td>
                    <select
                      onChange={(e) => assignCourseToTeacher(course.id, e.target.value)}
                    >
                      <option value="">Assign Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
