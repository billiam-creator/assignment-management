import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import RegistrationPage from './components/Auth/RegistrationPage';
import LoginPage from './components/Auth/LoginPage';
import ClassList from './components/Dashboard/Teacher/ClassList';
import AssignmentList from './components/Dashboard/Teacher/AssignmentList';
import SubmissionList from './components/Dashboard/Teacher/SubmissionList';
import AssignmentResults from './components/Dashboard/Teacher/AssignmentResults';
import StudentList from './components/Dashboard/Admin/StudentList';
import TeacherList from './components/Dashboard/Admin/TeacherList';
import Notification from './components/Notification/Notification';
import SubmitAssignment from './components/Dashboard/SubmitAssignment';
import AdminDashboard from './components/Dashboard/Admin/AdminDashboard';
import StudentDashboard from './components/Dashboard/Student/StudentDashboard';
import TeacherDashboard from './components/Dashboard/Teacher/TeacherDashboard';
import CourseList from './components/Dashboard/Admin/CourseList';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
