import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegistrationPage from './components/Auth/RegistrationPage';
import LoginPage from './components/Auth/LoginPage';
import AdminDashboard from './components/Dashboard/Admin/AdminDashboard';
import StudentDashboard from './components/Dashboard/Student/StudentDashboard';
import TeacherDashboard from './components/Dashboard/Teacher/TeacherDashboard';

// Placeholder components for Admin Dashboard sections
import UserManagement from './components/Dashboard/Admin/UserManagement';
import EnrollmentRequests from './components/Dashboard/Admin/EnrollmentRequests';
import CourseManagement from './components/Dashboard/Admin/CourseManagement';

// Placeholder components for Student/Teacher specific pages
import ViewAssignment from './components/Dashboard/Student/ViewAssignment'; // For students to view/submit assignments
import SubmitAssignment from './components/Dashboard/Student/SubmitAssignment'; // For students to submit assignments
import ViewSubmissions from './components/Dashboard/Teacher/ViewSubmissions'; // For teachers to view submissions

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />

                    {/* Admin Dashboard Routes */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/user-management" element={<UserManagement />} />
                    <Route path="/admin/enrollment-requests" element={<EnrollmentRequests />} />
                    <Route path="/admin/course-management" element={<CourseManagement />} />

                    {/* Student Dashboard Routes */}
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/assignment/:assignmentId" element={<ViewAssignment />} />
                    <Route path="/student/assignment/:assignmentId/submit" element={<SubmitAssignment />} />


                    {/* Teacher Dashboard Routes */}
                    <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                    {/* Teacher can view assignments for a course */}
                    <Route path="/teacher/course/:courseId/assignments" element={<TeacherDashboard />} />
                    {/* Teacher can view submissions for a specific assignment */}
                    <Route path="/teacher/assignment/:assignmentId/submissions" element={<ViewSubmissions />} />


                    {/* Fallback for unmatched routes - redirects to login */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;