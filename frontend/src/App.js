import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard'; // Student Dashboard
import TeacherDashboard from './components/Dashboard/TeacherDashboard/TeacherDashboard'; // Main Teacher Dashboard
import CreateAssignmentForm from './components/Dashboard/TeacherDashboard/CreateAssignmentForm';
import SubmitAssignment from './components/Dashboard/SubmitAssignment';
import GradeSubmissionView from './components/Dashboard/TeacherDashboard/GradeSubmissionView';
import Notification from './components/Notification/Notification';
import ClassList from './components/Dashboard/TeacherDashboard/ClassList';
import AssignmentList from './components/Dashboard/TeacherDashboard/AssignmentList';
import SubmissionList from './components/Dashboard/TeacherDashboard/SubmissionList';
import AssignmentResults from './components/Dashboard/TeacherDashboard/AssignmentResults';
import LoginPage from './components/Auth/Login';      
import RegistrationPage from './components/Auth/Register'; 


const isAuthenticated = () => {
  return localStorage.getItem('token') !== null; 
};

const PrivateRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? (
    element 
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} /> {/* Redirect root to /login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />

          {/* Protected routes - only accessible if authenticated */}
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/teacher" element={<PrivateRoute element={<TeacherDashboard />} />} >
            <Route path="classes" element={<PrivateRoute element={<ClassList />} />} />
            <Route path="classes/:classId/assignments" element={<PrivateRoute element={<AssignmentList />} />} />
            <Route path="assignments/:assignmentId/submissions" element={<PrivateRoute element={<SubmissionList />} />} />
            <Route path="assignments/:assignmentId/results" element={<PrivateRoute element={<AssignmentResults />} />} />
            <Route path="new-assignment" element={<PrivateRoute element={<CreateAssignmentForm />} />} />
            <Route path="submissions/:submissionId/:assignmentId/grade" element={<PrivateRoute element={<GradeSubmissionView />} />} />
          </Route>
          <Route path="/student/assignments/:assignmentId/submit" element={<PrivateRoute element={<SubmitAssignment />} />} />

          {/* You might not need a direct route for Notification */}
          {/* <Route path="/notification" element={<Notification message="Example Notification" type="info" />} /> */}

          {/* Add other public routes if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;