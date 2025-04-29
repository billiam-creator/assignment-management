import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import Notification from './components/Notification/Notification';
import CreateAssignment from './components/Assignment/CreateAssignment';
import SubmitAssignment from './components/Assignment/SubmitAssignment';
import GradeAssignment from './components/Assignment/GradeAssignment';
import FeedbackDisplay from './components/Assignment/FeedbackDisplay';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, useAuth } from './hooks/useAuth';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <div className="container mt-4">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <Routes>
        <Route
          path="/login"
          element={<Login showNotification={showNotification} />}
        />
        <Route
          path="/register"
          element={<Register showNotification={showNotification} />}
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              user?.role === 'student' ? (
                <StudentDashboard />
              ) : (
                <TeacherDashboard />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {isAuthenticated && user?.role === 'teacher' && (
          <>
            <Route path="/create-assignment" element={<CreateAssignment />} />
            <Route path="/grade-assignment/:assignmentId" element={<GradeAssignment />} />
          </>
        )}
        {isAuthenticated && user?.role === 'student' && (
          <>
            <Route path="/submit-assignment/:assignmentId" element={<SubmitAssignment />} />
            <Route path="/view-feedback/:assignmentId" element={<FeedbackDisplay />} />
          </>
        )}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;