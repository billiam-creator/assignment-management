import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ClassList from './ClassList';
import AssignmentList from './AssignmentList';
import CreateAssignmentForm from './CreateAssignmentForm';
import SubmissionList from './SubmissionList';
import GradeSubmissionView from './GradeSubmissionView';
import AssignmentResults from './AssignmentResults';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const teacherClasses = [
    { id: 'math101', name: 'Mathematics 101' },
    { id: 'eng201', name: 'English Literature 201' },
  ];

  return (
    <div className="teacher-dashboard-container">
      <div className="sidebar">
        <h2>Navigation</h2>
        <div className="sidebar-nav">
          <Link to="/">Classes</Link>
          <Link to="/new-assignment">New Assignment</Link>
        </div>
        <Link to="/components/Auth/Login.js" className="logout-button">
          Logout
        </Link>
      </div>
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<ClassList classes={teacherClasses} />} />
          <Route path="/classes/:classId/assignments" element={<AssignmentList />} />
          <Route path="/new-assignment" element={<CreateAssignmentForm />} />
          <Route path="/assignments/:assignmentId/submissions" element={<SubmissionList />} />
          <Route path="/submissions/:submissionId/grade" element={<GradeSubmissionView />} />
          <Route path="/assignments/:assignmentId/results" element={<AssignmentResults />} />
        </Routes>
      </div>
    </div>
  );
}

export default TeacherDashboard;
